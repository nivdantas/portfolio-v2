import { after, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { fetchPosts } from "@/lib/blog";
import {
  publicationConfig,
  publicationStore,
  publishingEnabled,
} from "@/lib/linkedin/config";
import {
  enqueuePost,
  publishArticle,
  syncPublications,
  validBearer,
  verifyWebhook,
} from "@/lib/linkedin/publisher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const unavailable = () =>
  NextResponse.json(
    { error: "Publishing needs configuration or service attention" },
    { status: 503, headers: { "Retry-After": "300" } },
  );

// A shared worker drains only durable reservations for currently visible posts.
async function runWorker() {
  const config = publicationConfig();
  const store = publicationStore(config);
  const owner = await store.acquireLock();
  if (!owner) return { status: "busy" as const };
  try {
    const now = new Date();
    const posts = await fetchPosts(true);
    return await syncPublications({
      posts,
      store,
      now,
      maxAgeHours: config.maxAgeHours,
      publish: (post) => publishArticle(post, config),
    });
  } finally {
    await store.releaseLock(owner).catch(() => {});
  }
}

// Scheduled fallback. First invocation establishes a baseline and shares nothing.
export async function GET(request: Request) {
  if (
    !validBearer(request.headers.get("authorization"), process.env.CRON_SECRET)
  )
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!publishingEnabled()) return NextResponse.json({ status: "disabled" });
  try {
    const result = await runWorker();
    const attention =
      "results" in result &&
      result.results.some((row) =>
        ["auth_required", "rejected", "needs_review", "sending"].includes(
          row.status,
        ),
      );
    if (attention)
      console.error("LinkedIn publication requires attention", result.results);
    return NextResponse.json(result, { status: attention ? 503 : 200 });
  } catch {
    console.error(
      "LinkedIn worker could not complete; inspect configuration and durable ledger",
    );
    return unavailable();
  }
}

// A signed event is persisted first; a post-response worker drains the queue.
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > 16384)
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 16384)
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  if (
    !verifyWebhook(
      raw,
      request.headers.get("x-blog-timestamp"),
      request.headers.get("x-blog-signature"),
      process.env.BLOG_WEBHOOK_SECRET,
    )
  )
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!publishingEnabled()) return NextResponse.json({ status: "disabled" });
  let payload: { type?: string; postId?: string | number; slug?: string };
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (
    !payload ||
    payload.type !== "post.published" ||
    typeof payload.slug !== "string" ||
    !payload.slug ||
    payload.slug.length > 250 ||
    !["string", "number"].includes(typeof payload.postId)
  )
    return NextResponse.json(
      { error: "Invalid publication event" },
      { status: 400 },
    );
  try {
    const config = publicationConfig();
    const store = publicationStore(config);
    if (!(await store.baseline()))
      return NextResponse.json(
        { error: "Initialize the worker before enabling blog webhooks" },
        { status: 409 },
      );
    const post = (await fetchPosts(true)).find(
      (post) =>
        post.slug === payload.slug &&
        String(post.id) === String(payload.postId),
    );
    if (!post)
      return NextResponse.json(
        { error: "Published post is not visible yet" },
        { status: 409 },
      );
    const status = await enqueuePost(
      post,
      store,
      new Date(),
      config.maxAgeHours,
    );
    revalidateTag("posts", { expire: 0 });
    after(async () => {
      try {
        const result = await runWorker();
        if (
          "results" in result &&
          result.results.some((row) =>
            ["auth_required", "rejected", "needs_review", "sending"].includes(
              row.status,
            ),
          )
        )
          console.error(
            "LinkedIn publication requires attention",
            result.results,
          );
      } catch {
        console.error(
          "LinkedIn post-response worker did not complete; scheduled fallback will inspect the ledger",
        );
      }
    });
    return NextResponse.json({ status }, { status: 202 });
  } catch {
    return unavailable();
  }
}
