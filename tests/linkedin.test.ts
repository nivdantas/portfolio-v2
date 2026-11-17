import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import {
  articlePayload,
  publishArticle,
  syncPublications,
  verifyWebhook,
  validBearer,
  enqueuePost,
  type Publication,
  type PublicationStore,
  type PublisherConfig,
} from "../src/app/lib/linkedin/publisher.ts";
import { isBlogPost, type BlogPost } from "../src/app/lib/content.ts";

const baseline = "2026-11-06T10:00:00.000Z";
const now = new Date("2026-11-06T12:00:00.000Z");
const post: BlogPost = {
  id: "cm_post",
  slug: "hello-world",
  title_en: "Hello *world*",
  title_pt: "Olá mundo",
  content_en:
    "# An idea\n\nA [useful link](https://example.org).\n\n```ts\nsecretCode()\n```",
  content_pt: "Uma ideia sobre software.",
  createdAt: "2026-11-06T11:00:00.000Z",
};
const config: PublisherConfig = {
  siteUrl: "https://nivdantas.com",
  author: "urn:li:person:member",
  token: "test-only-token",
  version: "202610",
  locale: "en",
  maxAgeHours: 48,
};
class MemoryStore implements PublicationStore {
  at: string | null = baseline;
  records = new Map<string, Publication>();
  async baseline() {
    return this.at;
  }
  async initialize(at: string) {
    if (this.at) return false;
    this.at = at;
    return true;
  }
  async get(id: string) {
    return this.records.get(id) || null;
  }
  async insert(id: string, value: Publication) {
    if (this.records.has(id)) return false;
    this.records.set(id, value);
    return true;
  }
  async compareAndSet(id: string, previous: Publication, value: Publication) {
    if (JSON.stringify(this.records.get(id)) !== JSON.stringify(previous))
      return false;
    this.records.set(id, value);
    return true;
  }
}

test("validates the real bilingual blog contract, including string IDs", () => {
  assert.equal(isBlogPost(post), true);
  assert.equal(isBlogPost({ ...post, createdAt: "invalid" }), false);
  assert.equal(isBlogPost({ id: 1, title: "legacy contract" }), false);
});
test("initial activation establishes a baseline without sharing existing posts", async () => {
  const store = new MemoryStore();
  store.at = null;
  let calls = 0;
  const result = await syncPublications({
    posts: [post],
    store,
    now,
    publish: async () => {
      calls++;
      return { status: "published" };
    },
  });
  assert.equal(result.initialized, true);
  assert.equal(calls, 0);
  assert.equal(store.at, now.toISOString());
});
test("old posts and future dates are excluded; newest eligible post is shared once across edits", async () => {
  const store = new MemoryStore();
  let calls = 0;
  const publish = async () => {
    calls++;
    return { status: "published" as const, linkedinId: "urn:li:share:1" };
  };
  const posts = [
    { ...post, id: "old", createdAt: baseline },
    { ...post, id: "future", createdAt: "2026-11-08T00:00:00.000Z" },
    post,
  ];
  await syncPublications({ posts, store, now, publish });
  await syncPublications({
    posts: [{ ...post, slug: "edited-slug", title_en: "An edit" }],
    store,
    now,
    publish,
  });
  assert.equal(calls, 1);
  assert.equal(
    (await store.get(String(post.id)))?.linkedinId,
    "urn:li:share:1",
  );
});
test("concurrent poll and webhook delivery cannot create duplicate shares", async () => {
  const store = new MemoryStore();
  let calls = 0;
  const publish = async () => {
    calls++;
    await Promise.resolve();
    return { status: "published" as const };
  };
  await Promise.all([
    enqueuePost(post, store, now, 48),
    enqueuePost(post, store, now, 48),
  ]);
  await Promise.all([
    syncPublications({ posts: [post], store, now, publish }),
    syncPublications({ posts: [post], store, now, publish }),
  ]);
  assert.equal(calls, 1);
});
test("timeout ambiguity is durable and is not retried on later scans", async () => {
  const store = new MemoryStore();
  let calls = 0;
  const publish = async () => {
    calls++;
    return { status: "needs_review" as const };
  };
  await syncPublications({ posts: [post], store, now, publish });
  await syncPublications({ posts: [post], store, now, publish });
  assert.equal(calls, 1);
  assert.equal((await store.get(String(post.id)))?.status, "needs_review");
});
test("a killed worker leaves a permanent sending reservation", async () => {
  const store = new MemoryStore();
  await assert.rejects(
    syncPublications({
      posts: [post],
      store,
      now,
      publish: async () => {
        throw new Error("process died");
      },
    }),
  );
  let calls = 0;
  await syncPublications({
    posts: [post],
    store,
    now,
    publish: async () => {
      calls++;
      return { status: "published" };
    },
  });
  assert.equal(calls, 0);
  assert.equal((await store.get(String(post.id)))?.status, "sending");
});
test("a failed final storage write cannot cause a successful post to be sent twice", async () => {
  const store = new MemoryStore();
  const original = store.compareAndSet.bind(store);
  store.compareAndSet = async (id, previous, value) => {
    if (value.status === "published") throw new Error("storage offline");
    return original(id, previous, value);
  };
  await assert.rejects(
    syncPublications({
      posts: [post],
      store,
      now,
      publish: async () => ({ status: "published" }),
    }),
  );
  let calls = 0;
  await syncPublications({
    posts: [post],
    store,
    now,
    publish: async () => {
      calls++;
      return { status: "published" };
    },
  });
  assert.equal(calls, 0);
});
test("rate limits honor the retry window and bounded attempts", async () => {
  const store = new MemoryStore();
  let calls = 0;
  const publish = async () => {
    calls++;
    return { status: "retry" as const, retryAfterSeconds: 3600 };
  };
  await syncPublications({ posts: [post], store, now, publish });
  await syncPublications({
    posts: [post],
    store,
    now: new Date(now.getTime() + 30_000),
    publish,
  });
  assert.equal(calls, 1);
  for (let i = 1; i < 6; i++)
    await syncPublications({
      posts: [post],
      store,
      now: new Date(now.getTime() + i * 3600_000),
      publish,
    });
  assert.equal(calls, 5);
  assert.equal((await store.get(String(post.id)))?.status, "rejected");
});
test("stale new posts are skipped after a long outage", async () => {
  const store = new MemoryStore();
  let calls = 0;
  await syncPublications({
    posts: [post],
    store,
    now: new Date("2026-11-09T12:00:00.000Z"),
    publish: async () => {
      calls++;
      return { status: "published" };
    },
  });
  assert.equal(calls, 0);
  assert.equal((await store.get(String(post.id)))?.status, "skipped");
});
test("article payload uses a single locale, canonical unprefixed URL and plain-text excerpt", () => {
  const payload = articlePayload(post, config);
  assert.equal(
    payload.content.article.source,
    "https://nivdantas.com/blog/hello-world",
  );
  assert.equal(payload.content.article.description, "An idea A useful link.");
  assert.match(payload.commentary, /Hello \\\*world\\\*/);
  assert.doesNotMatch(payload.commentary, /secretCode/);
  assert.equal(
    articlePayload(post, { ...config, locale: "pt" }).content.article.title,
    "Olá mundo",
  );
});
test("auth requires a configured secret and webhook signatures require a fresh authentic body", () => {
  assert.equal(validBearer("Bearer ", undefined), false);
  assert.equal(validBearer("Bearer wrong", "right"), false);
  assert.equal(validBearer("Bearer right", "right"), true);
  const timestamp = String(Math.floor(now.getTime() / 1000));
  const raw = JSON.stringify({ type: "post.published", slug: post.slug });
  const signature = `sha256=${createHmac("sha256", "secret").update(`${timestamp}.${raw}`).digest("hex")}`;
  assert.equal(
    verifyWebhook(raw, timestamp, signature, "secret", now.getTime()),
    true,
  );
  assert.equal(
    verifyWebhook(raw + " ", timestamp, signature, "secret", now.getTime()),
    false,
  );
  assert.equal(
    verifyWebhook(raw, timestamp, signature, "secret", now.getTime() + 301_000),
    false,
  );
  assert.equal(
    verifyWebhook(raw, timestamp, "sha256=bad", "secret", now.getTime()),
    false,
  );
  assert.equal(
    verifyWebhook(raw, timestamp, signature, undefined, now.getTime()),
    false,
  );
});
test("LinkedIn client classifies actual response semantics without automatic HTTP retries", async () => {
  for (const [code, status] of [
    [201, "published"],
    [401, "auth_required"],
    [403, "rejected"],
    [422, "rejected"],
    [429, "retry"],
    [409, "retry"],
    [500, "needs_review"],
    [504, "needs_review"],
    [200, "needs_review"],
  ] as const) {
    let calls = 0;
    const result = await publishArticle(post, config, async (_url, init) => {
      calls++;
      assert.equal(
        new Headers(init?.headers).get("Linkedin-Version"),
        "202610",
      );
      return new Response(null, {
        status: code,
        headers: { "x-restli-id": "urn:li:share:one", "retry-after": "120" },
      });
    });
    assert.equal(result.status, status);
    assert.equal(calls, 1);
  }
  assert.equal(
    (
      await publishArticle(post, config, async () => {
        throw new Error("network timeout");
      })
    ).status,
    "needs_review",
  );
});

test("drafts are never queued and a delayed publication can use publishedAt", async () => {
  const store = new MemoryStore();
  let calls = 0;
  const publish = async () => {
    calls++;
    return { status: "published" as const };
  };
  await syncPublications({
    posts: [{ ...post, status: "DRAFT" }],
    store,
    now,
    publish,
  });
  assert.equal(calls, 0);
  assert.equal(await store.get(String(post.id)), null);
  await syncPublications({
    posts: [
      {
        ...post,
        status: "PUBLISHED",
        createdAt: "2026-01-01T00:00:00Z",
        publishedAt: post.createdAt,
      },
    ],
    store,
    now,
    publish,
  });
  assert.equal(calls, 1);
});
test("corrupt activation state fails closed", async () => {
  const store = new MemoryStore();
  store.at = "corrupt";
  await assert.rejects(
    syncPublications({
      posts: [post],
      store,
      now,
      publish: async () => {
        throw new Error("must never send");
      },
    }),
    /Invalid publication baseline/,
  );
});
