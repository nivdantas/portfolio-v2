// Optional browser tooling stays separate from the application's dependencies.
const { chromium } = await import(process.argv[2] || "playwright");
import { spawn } from "node:child_process";
import http from "node:http";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";
const root = fileURLToPath(new URL("..", import.meta.url));
if (!existsSync(join(root, ".next/BUILD_ID")))
  throw new Error("Run the production build first");
const out = await mkdtemp(join(tmpdir(), "portfolio-browser-"));
const probe = http.createServer();
await new Promise((r) => probe.listen(0, "localhost", r));
const port = probe.address().port;
await new Promise((r) => probe.close(r));
const base = `http://localhost:${port}`;
const fixture = {
  id: "qa",
  slug: "connection-notes",
  title_en: "Connecting an interface to useful data",
  title_pt: "Conectando uma interface a dados úteis",
  content_en:
    "# Small connections\n\nReadable **Markdown** and a [source](https://example.org).\n\n```ts\nconst connected = true;\n```",
  content_pt: "# Pequenas conexões\n\nUma nota sobre interfaces e dados.",
  createdAt: "2026-11-09T12:00:00Z",
};
const backend = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/posts") res.end(JSON.stringify([fixture]));
  else if (req.url === "/posts/connection-notes")
    res.end(JSON.stringify(fixture));
  else {
    res.statusCode = 404;
    res.end("{}");
  }
});
await new Promise((r) => backend.listen(0, "127.0.0.1", r));
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "-p",
    String(port),
    "-H",
    "localhost",
  ],
  {
    cwd: root,
    env: {
      ...process.env,
      BLOG_API_URL: `http://127.0.0.1:${backend.address().port}`,
      LINKEDIN_PUBLISH_ENABLED: "false",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let serverLog = "";
server.stdout.on("data", (d) => (serverLog += d));
server.stderr.on("data", (d) => (serverLog += d));
let browser;
const checks = [];
const check = async (name, fn) => {
  await fn();
  checks.push(name);
  console.log("PASS", name);
};
try {
  for (let i = 0; i < 80; i++) {
    try {
      if (
        (
          await fetch(base + "/portfolio", {
            signal: AbortSignal.timeout(1000),
          })
        ).ok
      )
        break;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  browser = await chromium.launch({
    ...(process.env.CHROME_PATH
      ? { executablePath: process.env.CHROME_PATH }
      : { channel: "chrome" }),
    headless: true,
  });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await ctx.addCookies([
    { name: "NEXT_LOCALE", value: "en", domain: "localhost", path: "/" },
  ]);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const publishing = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/automations/linkedin")) publishing.push(r.url());
  });
  // A direct pointer click avoids the automation library scrolling a sticky header into view.
  const clickMotion = async (name) => {
    const b = await page
      .getByRole("button", { name, exact: true })
      .boundingBox();
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  };
  // Two frames, then until the eased gallery has caught up with the scroll.
  const frames = async () => {
    await page.evaluate(
      () =>
        new Promise((r) =>
          requestAnimationFrame(() => requestAnimationFrame(r)),
        ),
    );
    await page.waitForFunction(
      () => !document.querySelector("#projects")?.hasAttribute("data-moving"),
    );
  };
  const goto = async (path = "/portfolio") => {
    await page.goto(base + path);
    await page.evaluate(() => document.fonts.ready);
    await frames();
  };
  const info = () =>
    page.evaluate(() => ({
      width: innerWidth,
      body: document.documentElement.scrollWidth,
      enhanced: document
        .querySelector("#projects")
        ?.hasAttribute("data-enhanced"),
      panels: [...document.querySelectorAll("[data-gallery-panel]")].map(
        (p) => ({
          id: p.id,
          height: p.clientHeight,
          scroll: p.scrollHeight,
          x: p.getBoundingClientRect().x,
          y: p.getBoundingClientRect().y,
          width: p.getBoundingClientRect().width,
        }),
      ),
      y: scrollY,
      current: document
        .querySelector(".gallery-index [aria-current]")
        ?.getAttribute("href"),
    }));
  const settledPanel = (id) =>
    page.waitForFunction((id) => {
      const panel = document.getElementById(id);
      const rect = panel.getBoundingClientRect();
      const matrix = new DOMMatrixReadOnly(getComputedStyle(panel).transform);
      return (
        rect.top >= 80 &&
        rect.bottom <= innerHeight &&
        Math.abs(matrix.m42) < 1 &&
        Math.abs(matrix.m11 - 1) < 0.001
      );
    }, id);
  const sourceVisible = (id) =>
    page.evaluate((id) => {
      const source = document.querySelector("#" + id + " .project-source");
      const rect = source.getBoundingClientRect();
      const hit = document.elementFromPoint(
        rect.x + rect.width / 2,
        rect.y + rect.height / 2,
      );
      return (
        rect.top >= 80 && rect.bottom <= innerHeight && source.contains(hit)
      );
    }, id);
  await goto();
  await page.screenshot({ path: out + "/desktop-en.png" });
  await check(
    "Desktop enables four vertically layered scenes without horizontal overflow",
    async () => {
      const m = await info();
      assert.equal(m.enhanced, true);
      assert.equal(m.panels.length, 4);
      assert.ok(m.body <= m.width);
    },
  );
  await check(
    "Scrolling raises the next scene vertically while the outgoing card recedes",
    async () => {
      const before = await info();
      assert.ok(before.panels[1].y >= 900);
      const travel = await page.evaluate(() => {
        const gallery = document.querySelector("#projects");
        const stage = document.querySelector(".gallery-stage");
        return (gallery.offsetHeight - stage.offsetHeight) / 3;
      });
      await page.evaluate(
        (distance) => scrollTo({ top: distance * 0.6, behavior: "instant" }),
        travel,
      );
      await frames();
      const during = await info();
      assert.ok(during.panels[1].y < 900 && during.panels[1].y > 180);
      assert.ok(Math.abs(during.panels[1].x - before.panels[1].x) < 40);
      assert.ok(during.panels[0].width < before.panels[0].width);
      await page.screenshot({ path: out + "/vertical-transition.png" });
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await frames();
    },
  );
  await check(
    "Index navigation reveals the selected project and updates progress",
    async () => {
      await page.locator('.gallery-index a[href="#project-n-store"]').click();
      await page.waitForFunction(
        () =>
          document
            .querySelector(".gallery-index [aria-current]")
            ?.getAttribute("href") === "#project-n-store",
      );
      await frames();
      await settledPanel("project-n-store");
      const b = await page.locator("#project-n-store").boundingBox();
      assert.ok(
        b.x >= 0 && b.x + b.width <= 1440 && b.y >= 80 && b.y + b.height <= 900,
      );
      assert.equal(new URL(page.url()).hash, "#project-n-store");
      await page.screenshot({ path: out + "/desktop-n-store.png" });
    },
  );
  await check("Reverse scrolling restores the introduction scene", async () => {
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await frames();
    assert.equal((await info()).current, "#introduction");
  });
  await check("Offscreen keyboard focus reveals its project", async () => {
    await page.locator("#project-takostreak .project-source").focus();
    await frames();
    const b = await page
      .locator("#project-takostreak .project-source")
      .boundingBox();
    assert.ok(b.x >= 0 && b.x + b.width <= 1440);
    assert.equal((await info()).current, "#project-takostreak");
    assert.ok(await sourceVisible("project-takostreak"));
  });
  await check(
    "Shift+Tab reveals an earlier covered card instead of focusing behind the stack",
    async () => {
      await page.keyboard.press("Shift+Tab");
      await frames();
      assert.equal((await info()).current, "#project-n-store");
      assert.ok(await sourceVisible("project-n-store"));
      await page.locator("#project-takostreak .project-source").focus();
      await frames();
    },
  );
  await check(
    "Pause mid-gallery releases pinning and keeps the current project visible",
    async () => {
      await clickMotion("Pause animations");
      await page.waitForFunction(
        () =>
          !document.querySelector("#projects").hasAttribute("data-enhanced"),
      );
      const b = await page.locator("#project-takostreak").boundingBox();
      assert.ok(b.y < 900 && b.y + b.height > 80);
      assert.equal(await page.locator("[data-gallery-panel]").count(), 4);
      await frames();
    },
  );
  await check("Resume restores pinning at the same project", async () => {
    await clickMotion("Resume animations");
    await page.waitForFunction(() =>
      document.querySelector("#projects").hasAttribute("data-enhanced"),
    );
    await frames();
    assert.equal((await info()).current, "#project-takostreak");
  });
  await check(
    "The vertical seam releases the final panel and reaches About",
    async () => {
      await page.locator(".gallery-skip").click();
      await page.waitForFunction(() => {
        const b = document.querySelector("#about").getBoundingClientRect();
        const target = parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        );
        return Math.abs(b.y - target) < 2;
      });
      const b = await page.locator("#about").boundingBox();
      assert.ok(b.y < 200);
      await page.screenshot({ path: out + "/about-desktop.png" });
    },
  );
  await check(
    "Changing motion after the gallery preserves the downstream position",
    async () => {
      const before = await page.locator("#about").boundingBox();
      await clickMotion("Pause animations");
      await page.waitForFunction(
        () =>
          !document.querySelector("#projects").hasAttribute("data-enhanced"),
      );
      await frames();
      const paused = await page.locator("#about").boundingBox();
      assert.ok(Math.abs(paused.y - before.y) < 8);
      await clickMotion("Resume animations");
      await page.waitForFunction(() =>
        document.querySelector("#projects").hasAttribute("data-enhanced"),
      );
      await frames();
      const resumed = await page.locator("#about").boundingBox();
      assert.ok(Math.abs(resumed.y - before.y) < 8);
    },
  );
  await check(
    "The page ruler follows the section being read",
    async () => {
      assert.equal(
        await page
          .locator(".scroll-ruler [aria-current]")
          .getAttribute("href"),
        "#about",
      );
    },
  );
  await check(
    "The sound control is a remembered, labelled switch",
    async () => {
      await clickMotion("Mute interface sounds");
      const on = page.getByRole("button", {
        name: "Turn on interface sounds",
        exact: true,
      });
      assert.equal(await on.getAttribute("aria-pressed"), "true");
      assert.equal(
        await page.evaluate(() => localStorage.getItem("niv-sound")),
        "off",
      );
      await clickMotion("Turn on interface sounds");
      assert.equal(
        await page.evaluate(() => localStorage.getItem("niv-sound")),
        "on",
      );
    },
  );
  const background = (selector) =>
    page
      .locator(selector)
      .evaluate((el) => getComputedStyle(el).backgroundColor);
  await check("Paper is the default page and the page ends on ink", async () => {
    assert.equal(await background("body"), "rgb(251, 251, 251)");
    assert.equal(await background("#introduction"), "rgb(251, 251, 251)");
    assert.equal(await background("#contact"), "rgb(13, 13, 13)");
  });
  await check("Dark mode preserves layout and switches tokens", async () => {
    await clickMotion("Switch to dark theme");
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === "dark",
    );
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await frames();
    await page.waitForTimeout(900);
    await page.screenshot({ path: out + "/dark-desktop.png" });
    assert.ok((await info()).body <= 1440);
    assert.equal(await background("body"), "rgb(13, 13, 13)");
    assert.equal(await background("#contact"), "rgb(44, 44, 44)");
  });
  await check("Both locale copies fit the desktop gallery", async () => {
    await page.getByRole("button", { name: "PT", exact: true }).click();
    await frames();
    await page.waitForFunction(() => document.documentElement.lang === "pt");
    await frames();
    assert.equal((await info()).enhanced, true);
    assert.ok(
      await page
        .locator("#introduction")
        .innerText()
        .then((t) => t.includes("conexões")),
    );
    await page.screenshot({ path: out + "/desktop-pt.png" });
  });
  await check(
    "Direct project deep links and Back restore the appropriate panel",
    async () => {
      await goto("/portfolio#project-bolota");
      await page.waitForFunction(
        () =>
          document
            .querySelector(".gallery-index [aria-current]")
            ?.getAttribute("href") === "#project-bolota",
      );
      await page
        .locator('.gallery-index a[href="#project-takostreak"]')
        .click();
      await page.waitForFunction(
        () =>
          document
            .querySelector(".gallery-index [aria-current]")
            ?.getAttribute("href") === "#project-takostreak",
      );
      await page.goBack();
      await page.waitForFunction(
        () =>
          document
            .querySelector(".gallery-index [aria-current]")
            ?.getAttribute("href") === "#project-bolota",
      );
    },
  );
  await check("Reduced motion produces the full static document", async () => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(
      () => !document.querySelector("#projects").hasAttribute("data-enhanced"),
    );
    assert.equal((await info()).panels.length, 4);
    await page.screenshot({ path: out + "/reduced-motion.png" });
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });
  await check(
    "Short desktop viewports use a readable static layout",
    async () => {
      await page.setViewportSize({ width: 1440, height: 700 });
      await goto();
      assert.equal((await info()).enhanced, false);
      await page.setViewportSize({ width: 1440, height: 900 });
      await goto();
    },
  );
  await check(
    "Larger project text releases pinning instead of clipping copy",
    async () => {
      await page.addStyleTag({
        content:
          ".project-description {font-size:44px!important} .project-details {font-size:30px!important}",
      });
      await page.waitForFunction(
        () =>
          !document.querySelector("#projects").hasAttribute("data-enhanced"),
      );
      const box = await page
        .locator("#project-bolota .project-details")
        .boundingBox();
      assert.ok(box.height > 100);
      await goto();
    },
  );
  for (const width of [768, 390, 320])
    await check(
      `Stacked ${width}px layout has no horizontal overflow`,
      async () => {
        await page.setViewportSize({ width, height: 844 });
        await goto();
        const m = await info();
        assert.equal(m.enhanced, false);
        assert.ok(m.body <= width, JSON.stringify(m));
        for (let i = 1; i < m.panels.length; i++)
          assert.ok(m.panels[i].y > m.panels[i - 1].y);
        for (const id of [
          "about",
          "experience",
          "education",
          "skills",
          "contact",
        ]) {
          await page.locator("#" + id).scrollIntoViewIfNeeded();
          await page.waitForFunction((id) => {
            const p = document.querySelector("#" + id + " .reveal");
            return !p || p.dataset.reveal !== "pending";
          }, id);
        }
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await frames();
        await page.screenshot({
          path: out + `/mobile-${width}.png`,
          fullPage: true,
        });
        await page.screenshot({ path: out + `/mobile-top-${width}.png` });
      },
    );
  await check(
    "Article reader renders Markdown with a single h1 and manual sharing",
    async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await goto("/blog/connection-notes");
      assert.equal(await page.locator("h1").count(), 1);
      assert.ok(await page.locator(".article-prose").innerText());
      assert.ok(
        await page.locator('.article-end a[href*="linkedin.com"]').count(),
      );
      await page.screenshot({ path: out + "/article.png" });
    },
  );
  await check(
    "Five presses in a row on the wordmark open the snake game",
    async () => {
      await goto();
      const mark = await page.locator(".site-header .wordmark").boundingBox();
      for (let i = 0; i < 4; i++)
        await page.mouse.click(mark.x + mark.width / 2, mark.y + mark.height / 2);
      assert.equal(await page.locator(".snake-dialog").count(), 0);
      await page.mouse.click(mark.x + mark.width / 2, mark.y + mark.height / 2);
      await page.locator(".snake-dialog[open]").waitFor();
      assert.equal(await page.locator(".snake-dialog button").count(), 1);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: out + "/snake.png" });
      await page.keyboard.press("ArrowDown");
      await page.locator(".snake-over").waitFor();
      await page.screenshot({ path: out + "/snake-over.png" });
      await page.locator(".snake-close").click();
      await page.locator(".snake-dialog").waitFor({ state: "detached" });
    },
  );
  await check(
    "No visitor interaction invokes automatic LinkedIn publishing",
    async () => assert.deepEqual(publishing, []),
  );
  await check("No uncaught browser errors", async () =>
    assert.deepEqual(errors, []),
  );
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const staticPage = await nojs.newPage();
  await staticPage.goto(base + "/portfolio");
  await check(
    "No-JavaScript visitors can read all projects and navigate",
    async () => {
      assert.equal(await staticPage.locator("[data-gallery-panel]").count(), 4);
      assert.equal(
        await staticPage.locator("#projects[data-enhanced]").count(),
        0,
      );
      assert.equal(
        await staticPage.locator("#project-takostreak .project-source").count(),
        1,
      );
    },
  );
  console.log(
    JSON.stringify({ passed: checks.length, screenshots: out }, null, 2),
  );
} catch (error) {
  console.error(serverLog);
  throw error;
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  if (server.exitCode === null)
    await new Promise((r) => server.once("exit", r));
  backend.close();
}
