import { createHmac, timingSafeEqual } from "node:crypto";
import {
  localizedPost,
  plainText,
  isPublicPost,
  publicationDate,
  type BlogPost,
} from "../content.ts";

export interface PublisherConfig {
  siteUrl: string;
  author: string;
  token: string;
  version: string;
  locale: "pt" | "en";
  maxAgeHours: number;
}
export type PublicationStatus =
  | "pending"
  | "sending"
  | "published"
  | "retry"
  | "auth_required"
  | "rejected"
  | "needs_review"
  | "skipped";
export interface Publication {
  status: PublicationStatus;
  attempts: number;
  updatedAt: string;
  nextAttemptAt?: string;
  linkedinId?: string;
  httpStatus?: number;
}
export interface PublicationStore {
  baseline(): Promise<string | null>;
  initialize(at: string): Promise<boolean>;
  get(id: string): Promise<Publication | null>;
  insert(id: string, value: Publication): Promise<boolean>;
  compareAndSet(
    id: string,
    previous: Publication,
    value: Publication,
  ): Promise<boolean>;
}
export interface PublishResult {
  status: PublicationStatus;
  linkedinId?: string;
  httpStatus?: number;
  retryAfterSeconds?: number;
}

export function validBearer(actual: string | null, secret: string | undefined) {
  if (!actual || !secret) return false;
  const supplied = Buffer.from(actual);
  const expected = Buffer.from(`Bearer ${secret}`);
  return (
    supplied.length === expected.length && timingSafeEqual(supplied, expected)
  );
}

export function verifyWebhook(
  raw: string,
  timestamp: string | null,
  signature: string | null,
  secret: string | undefined,
  now = Date.now(),
) {
  if (
    !secret ||
    !timestamp ||
    !signature ||
    !/^\d{10}$/.test(timestamp) ||
    !/^sha256=[a-f0-9]{64}$/.test(signature)
  )
    return false;
  if (Math.abs(now - Number(timestamp) * 1000) > 300_000) return false;
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${raw}`)
    .digest();
  return timingSafeEqual(Buffer.from(signature.slice(7), "hex"), expected);
}

function escapeLinkedIn(value: string) {
  return value.replace(/[\\*_~#@[\]()<>{}|"]/g, "\\$&");
}

export function articlePayload(post: BlogPost, config: PublisherConfig) {
  const { title, content } = localizedPost(post, config.locale);
  const source = new URL(
    `/blog/${encodeURIComponent(post.slug)}`,
    config.siteUrl,
  ).toString();
  const description = plainText(content).slice(0, 280);
  const intro =
    config.locale === "pt"
      ? "Uma nova nota no meu site:"
      : "A new note on my site:";
  return {
    author: config.author,
    commentary: `${intro}\n\n${escapeLinkedIn(title.slice(0, 200))}\n\n${escapeLinkedIn(description)}\n\n${source}`,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    content: { article: { source, title: title.slice(0, 200), description } },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };
}

export async function publishArticle(
  post: BlogPost,
  config: PublisherConfig,
  send: typeof fetch = fetch,
): Promise<PublishResult> {
  try {
    const response = await send("https://api.linkedin.com/rest/posts", {
      method: "POST",
      redirect: "error",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
        "Linkedin-Version": config.version,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(articlePayload(post, config)),
      signal: AbortSignal.timeout(10_000),
    });
    const httpStatus = response.status;
    if (httpStatus === 201)
      return {
        status: "published",
        httpStatus,
        ...(response.headers.get("x-restli-id")
          ? { linkedinId: response.headers.get("x-restli-id")! }
          : {}),
      };
    if (httpStatus === 429 || httpStatus === 409) {
      const value = response.headers.get("retry-after");
      const seconds = value
        ? /^\d+$/.test(value)
          ? Number(value)
          : Math.ceil((Date.parse(value) - Date.now()) / 1000)
        : 3600;
      return {
        status: "retry",
        httpStatus,
        retryAfterSeconds: Number.isFinite(seconds)
          ? Math.max(60, Math.min(seconds, 86400))
          : 3600,
      };
    }
    if (httpStatus === 401) return { status: "auth_required", httpStatus };
    if ([400, 403, 404, 422].includes(httpStatus))
      return { status: "rejected", httpStatus };
    // An unexpected success, server error, or transport timeout can follow creation.
    return { status: "needs_review", httpStatus };
  } catch {
    return { status: "needs_review" };
  }
}

export async function enqueuePost(
  post: BlogPost,
  store: PublicationStore,
  now: Date,
  maxAgeHours: number,
) {
  const baseline = await store.baseline();
  if (!baseline)
    throw new Error(
      "Initialize the publication baseline before accepting events",
    );
  if (!Number.isFinite(Date.parse(baseline)))
    throw new Error("Invalid publication baseline");
  if (!isPublicPost(post)) return "ignored" as const;
  const created = Date.parse(publicationDate(post));
  if (created <= Date.parse(baseline) || created > now.getTime())
    return "ignored" as const;
  const value: Publication = {
    status:
      now.getTime() - created > maxAgeHours * 3600_000 ? "skipped" : "pending",
    attempts: 0,
    updatedAt: now.toISOString(),
  };
  return (await store.insert(String(post.id), value))
    ? value.status
    : ("duplicate" as const);
}

export async function syncPublications({
  posts,
  store,
  publish,
  now = new Date(),
  maxAgeHours = 48,
  limit = 2,
}: {
  posts: BlogPost[];
  store: PublicationStore;
  publish: (post: BlogPost) => Promise<PublishResult>;
  now?: Date;
  maxAgeHours?: number;
  limit?: number;
}) {
  const baseline = await store.baseline();
  if (!baseline) {
    const initialized = await store.initialize(now.toISOString());
    return {
      initialized,
      published: 0,
      results: [] as { id: string; status: string }[],
    };
  }
  if (!Number.isFinite(Date.parse(baseline)))
    throw new Error("Invalid publication baseline");
  const results: { id: string; status: string }[] = [];
  let published = 0;
  let attempted = 0;
  for (const post of [...posts].sort(
    (a, b) => Date.parse(publicationDate(a)) - Date.parse(publicationDate(b)),
  )) {
    if (
      Date.parse(publicationDate(post)) <= Date.parse(baseline) ||
      Date.parse(publicationDate(post)) > now.getTime()
    )
      continue;
    if (!isPublicPost(post)) continue;
    const id = String(post.id);
    await enqueuePost(post, store, now, maxAgeHours);
    const record = await store.get(id);
    if (!record) continue;
    if (!["pending", "retry"].includes(record.status)) {
      if (
        ["sending", "needs_review", "rejected", "auth_required"].includes(
          record.status,
        )
      )
        results.push({ id, status: record.status });
      if (record.status === "auth_required") break;
      continue;
    }
    if (
      record.nextAttemptAt &&
      Date.parse(record.nextAttemptAt) > now.getTime()
    )
      continue;
    if (
      now.getTime() - Date.parse(publicationDate(post)) >
      maxAgeHours * 3600_000
    ) {
      await store.compareAndSet(id, record, {
        ...record,
        status: "skipped",
        updatedAt: now.toISOString(),
      });
      continue;
    }
    if (attempted >= limit) continue;
    const sending: Publication = {
      status: "sending",
      attempts: record.attempts + 1,
      updatedAt: now.toISOString(),
    };
    if (!(await store.compareAndSet(id, record, sending))) continue;
    attempted++;
    const outcome = await publish(post);
    const status =
      outcome.status === "retry" && sending.attempts >= 5
        ? "rejected"
        : outcome.status;
    const completed: Publication = {
      ...sending,
      status,
      ...(outcome.linkedinId ? { linkedinId: outcome.linkedinId } : {}),
      ...(outcome.httpStatus ? { httpStatus: outcome.httpStatus } : {}),
      ...(status === "retry"
        ? {
            nextAttemptAt: new Date(
              now.getTime() + (outcome.retryAfterSeconds || 3600) * 1000,
            ).toISOString(),
          }
        : {}),
    };
    // If this write fails, the permanent 'sending' reservation prevents a resend.
    await store.compareAndSet(id, sending, completed);
    results.push({ id, status });
    if (status === "published") published++;
    if (["retry", "auth_required", "needs_review"].includes(status)) break;
  }
  return { initialized: false, published, results };
}
