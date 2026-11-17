import http from "node:http";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
if (!existsSync(resolve(root, ".next/BUILD_ID")))
  throw new Error("Run the production build before the HTTP checks");
const probe = http.createServer();
await new Promise((resolve) => probe.listen(0, "localhost", resolve));
const appPort = probe.address().port;
await new Promise((resolve) => probe.close(resolve));
const fixture = {
  id: "fixture-public",
  slug: "a-note",
  title_en: "A public note",
  title_pt: "Uma nota pública",
  content_en:
    "# A useful idea\n\nReadable **Markdown** with a [link](https://example.org).\n\n```ts\nconst answer = 42;\n```",
  content_pt: "# Uma ideia útil\n\nMarkdown legível.",
  createdAt: "2026-11-06T10:00:00Z",
};
const draft = {
  ...fixture,
  id: "fixture-draft",
  slug: "draft-note",
  status: "DRAFT",
};
const backend = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/posts") res.end(JSON.stringify([fixture, draft]));
  else if (req.url === "/posts/a-note") res.end(JSON.stringify(fixture));
  else if (req.url === "/posts/draft-note") res.end(JSON.stringify(draft));
  else if (req.url === "/posts/service-error") {
    res.statusCode = 503;
    res.end(JSON.stringify({ error: "fixture backend unavailable" }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  }
});
await new Promise((resolve) => backend.listen(0, "127.0.0.1", resolve));
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "-p",
    String(appPort),
    "-H",
    "localhost",
  ],
  {
    cwd: root,
    env: {
      ...process.env,
      BLOG_API_URL: `http://127.0.0.1:${backend.address().port}`,
      CRON_SECRET: "fixture-cron-secret",
      BLOG_WEBHOOK_SECRET: "fixture-signing-secret",
      LINKEDIN_PUBLISH_ENABLED: "false",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let output = "";
child.stdout.on("data", (b) => (output += b));
child.stderr.on("data", (b) => (output += b));
const base = `http://localhost:${appPort}`;
const results = [];
async function check(name, fn) {
  await fn();
  results.push(name);
}
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    if (child.exitCode !== null) throw new Error(output);
    try {
      const r = await fetch(base + "/portfolio", {
        signal: AbortSignal.timeout(1000),
      });
      if (r.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.ok(ready, output);
  await check("Root redirects directly to /portfolio", async () => {
    const r = await fetch(base, { redirect: "manual" });
    assert.equal(r.status, 307);
    assert.equal(r.headers.get("location"), "/portfolio");
  });
  await check(
    "Portuguese portfolio renders all sections and real project identities",
    async () => {
      const r = await fetch(base + "/portfolio", {
        headers: { Cookie: "NEXT_LOCALE=pt" },
      });
      const html = await r.text();
      assert.equal(r.status, 200);
      assert.match(html, /<html[^>]*lang="pt"/);
      for (const text of [
        "NIVALDO",
        "Bolota",
        "n-store",
        "TakoStreak",
        'id="introduction"',
        'id="project-bolota"',
        'id="project-n-store"',
        'id="project-takostreak"',
        'id="skills"',
        'id="repositories"',
        'id="about"',
        'id="experience"',
        'id="education"',
        'id="blog"',
        'id="contact"',
      ])
        assert.ok(html.includes(text), text);
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    },
  );
  await check(
    "English portfolio renders without missing translations",
    async () => {
      const r = await fetch(base + "/portfolio", {
        headers: { Cookie: "NEXT_LOCALE=en" },
      });
      const html = await r.text();
      assert.match(html, /<html[^>]*lang="en"/);
      assert.ok(html.includes("the API, and the connections between them."));
      assert.ok(html.includes("Interfaces, APIs"));
      assert.ok(!html.includes("MISSING_MESSAGE"));
    },
  );
  await check("Writing index resolves", async () => {
    const r = await fetch(base + "/blog");
    assert.equal(r.status, 200);
  });
  await check(
    "Posts API validates actual bilingual data and excludes drafts",
    async () => {
      const r = await fetch(base + "/api/posts");
      assert.equal(r.status, 200);
      const data = await r.json();
      assert.equal(data.length, 1);
      assert.equal(data[0].id, fixture.id);
    },
  );
  await check(
    "Article renders Markdown, metadata, navigation and one main heading",
    async () => {
      const r = await fetch(base + "/blog/a-note", {
        headers: { Cookie: "NEXT_LOCALE=en" },
      });
      const html = await r.text();
      assert.equal(r.status, 200);
      assert.ok(html.includes("A public note"));
      assert.ok(html.includes("A useful idea"));
      assert.ok(html.includes("42"));
      assert.ok(html.includes("article-prose"));
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
      assert.ok(html.includes("https://nivdantas.com/blog/a-note"));
    },
  );
  await check("Missing articles return HTTP 404", async () => {
    const r = await fetch(base + "/blog/missing-note");
    assert.equal(r.status, 404);
  });
  await check("Draft article details return HTTP 404", async () => {
    const r = await fetch(base + "/blog/draft-note");
    assert.equal(r.status, 404);
  });
  await check("Worker rejects unauthenticated requests", async () => {
    const r = await fetch(base + "/api/automations/linkedin");
    assert.equal(r.status, 401);
  });
  await check("Configured but disabled worker cannot publish", async () => {
    const r = await fetch(base + "/api/automations/linkedin", {
      headers: { Authorization: "Bearer fixture-cron-secret" },
    });
    assert.deepEqual(await r.json(), { status: "disabled" });
  });
  await check("Webhook rejects forged requests", async () => {
    const r = await fetch(base + "/api/automations/linkedin", {
      method: "POST",
      body: "{}",
    });
    assert.equal(r.status, 401);
  });
  await check("Authentic webhook respects disabled publishing", async () => {
    const raw = JSON.stringify({
      type: "post.published",
      postId: fixture.id,
      slug: fixture.slug,
    });
    const ts = String(Math.floor(Date.now() / 1000));
    const signature = createHmac("sha256", "fixture-signing-secret")
      .update(`${ts}.${raw}`)
      .digest("hex");
    const r = await fetch(base + "/api/automations/linkedin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Blog-Timestamp": ts,
        "X-Blog-Signature": `sha256=${signature}`,
      },
      body: raw,
    });
    assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { status: "disabled" });
  });
  console.log(
    JSON.stringify({ passed: results.length, checks: results }, null, 2),
  );
} catch (error) {
  console.error(output);
  throw error;
} finally {
  child.kill("SIGTERM");
  await new Promise((resolve) => child.once("exit", resolve));
  backend.close();
}
