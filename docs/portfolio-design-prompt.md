# Project-specific portfolio design prompt

Copy the following block into your design platform. It includes the actual project context so the tool can work without repository access. The appendix after the block is for implementation in this checkout. [Review and evidence](portfolio-design-review.md).

```text
Design a distinctive interactive portfolio for Nivaldo “Niv” Dantas, a Brazilian software engineer. Produce a design prototype and implementation handoff for his existing site.

REFERENCE INTENT

Latest direction: center the interface on forest green #1E3B2F and use Kenji-inspired vertical sticky scenes for the opening projects. This supersedes the earlier horizontal-gallery idea.

Combine these two inspirations:
- https://rauno.me/: spatial navigation, a horizontal gallery, gentle zoom-out, an indexed progress ruler, precise feedback.
- https://www.kenjilambert.com/: expressive typography, strong personality, original visual objects, animated project storytelling.

Use these as interaction and composition references. Build an original identity around Niv's actual work. Do not reproduce either site's wording, art, badge, or personal identity. The descriptions above define the requested experience even if a reference changes.

PERSON AND FACTUAL CONTENT

Nivaldo Dantas uses “Niv.” He is based in Brazil. His biography describes connecting the interface someone uses, the API behind it, and the data that makes it useful.

Career, newest first:
- 2026–present: independent software engineering; web applications, stream metric overlays, APIs for continuous client feedback, Gemini integrations and automation, including Bolota.
- 2024–2025: software engineering internship at Tribunal de Contas do Amazonas / Amazonas State Court of Accounts. End-to-end applications, internal process automation, contribution to the annual LGPD assessment, and agile team tools.
- 2021–2024: software research engineering at PAPE / Samsung. React, React Native, SQL, REST APIs, and software testing for R&D projects. Preserve “PAPE / Samsung”; do not imply a different employment relationship or an endorsement.

Education: IFAM / Instituto Federal do Amazonas, Bachelor's in Software Engineering, 2020–2025. Existing metric: Major GPA 9.0 / Média nas disciplinas principais 9.0. Preserve that label without inferring a scale or rank. Subjects include algorithms, architecture, web/mobile development, and quality assurance.

Verified project descriptions supplied by the existing portfolio:
1. Bolota — a veterinary customer-service assistant connecting natural-language conversation to pet-shop prices, inventory, and medication data. Gemini, a React web chat, an Express API, local SQLite, TypeScript, Docker Compose. Source: https://github.com/nivdantas/bolota. No measured results, customer counts, or production adoption are supplied.
2. n-store — an e-commerce platform in development, built with Laravel 12, PHP, and Blade. Source: https://github.com/nivdantas/n-store. Keep an explicit “In development / Em desenvolvimento” label.
3. TakoStreak — a playful streak project in development about showing up one day at a time. React, TanStack, Express, TypeScript. Source: https://github.com/nivdantas/takostreak. Keep its development label.

Contact destinations:
- nivdantas@icloud.com
- https://github.com/NivDantas
- https://linkedin.com/in/nivaldo-dantas

Use accurate first-person copy. Do not invent clients, outcomes, personal hobbies, availability, testimonials, or current city. Missing approved portraits, screenshots, project roles, case-study decisions, and metrics belong in an asset/content checklist. Use clearly labeled visual studies while those assets are missing. Do not present a visual study as a shipped interface.

IDENTITY AND ART DIRECTION

Organize the identity around the connections between interface, API, and data. The existing geometric N can become a recurring connector: hero signature, gallery index, section detail, and closing mark. Explain the relationship between each visual choice and Niv's work.

Use forest green #1E3B2F as the dominant canvas and as the hero/contact background in both themes. Pair it with warm cream #F3F0E6, sage #C8DF98, and darker green #294B3D. Light mode uses pale sage #EAF0E8 and forest-green ink. Keep project artwork within the green/cream palette and use #2F654A for focus inside light project surfaces.

Pair a bold condensed display face with readable body typography and restrained monospace metadata. Support Portuguese diacritics. Use strong alignment, generous space, varied project compositions, and intentional cropping. Retain an equally considered light theme because the existing site has theme switching.

The original design used warm paper, burnt orange, Archivo and Instrument Serif. The current direction uses forest green and a condensed display face. Preserve factual content and useful controls while developing the new composition. Avoid generic slogans, repetitive card grids, skill percentage bars, and decorative effects unrelated to the work.

OPENING SCROLL EXPERIENCE

Desktop: one pinned vertical scene sequence containing FOUR panels, in order:
00 — Niv / introduction
01 — Bolota
02 — n-store
03 — TakoStreak

Start with a large, readable introductory panel. Show Niv's name prominently, what he builds, direct contact/social links, and the N signature. Suggested opening copy to refine in both languages:
EN: “I'm Niv. I build the interface, the API, and the connections between them.”
PT: “Sou o Niv. Desenvolvo a interface, a API e as conexões entre elas.”

As native vertical scrolling advances, the next project rises from below the pinned viewport and layers over the previous card. Let the outgoing card recede slightly in scale and opacity. A brief reading beat separates the scenes; the index and ruler stay outside the transformed cards and track progress. Use native scrolling and stable stops based on the measured stage height.

Movement must be reversible and tied to scroll position. Include accessible panel-index controls and a “Skip to about” action. When keyboard focus reaches a covered card, reveal its scene fully so the focused control cannot remain hidden under another project. After TakoStreak, release into normal vertical flow without a blank runway, abrupt jump, or duplicate content.

Each project panel needs its name, concise problem/purpose, source link, honest status, and a distinct visual composition:
- Bolota: conversation → context → data → response, shown as a labeled visual study.
- n-store: catalog/item/receipt forms exploring commerce structure, labeled as a study in development.
- TakoStreak: a day sequence with playful completion feedback, labeled as a study in development.

Design a detailed project-story template covering problem, role, architecture, decisions, tradeoffs, current status, and evidence. Mark missing content explicitly. Existing project links go to GitHub; do not imply full case-study pages already exist or deliver dead case-study buttons.

VERTICAL SECTIONS

Give every section a considered composition and one purposeful interaction at most:

About: first-person biography connecting research, public-sector applications, and independent work. Use a portrait only if supplied; otherwise create an authored diagram from the N/connection motif. Selective word reveals can enhance reading, with the complete accessible sentence preserved.

Experience: readable reverse-chronological timeline with the three roles and dates above. Describe concrete contributions. Use subtle progression and generous room for Portuguese text.

Education: distinct IFAM panel with degree, 2020–2025, the existing Major GPA 9.0 label, and relevant subjects. Keep it proportionate to the work and career sections.

Capabilities: concise groups backed by project or career evidence. Interface: React, React Native, TypeScript. APIs/data: Express, REST, SQL/SQLite; Laravel/PHP/Blade through n-store. AI integration: Gemini through Bolota. Link to relevant work; no proficiency meters or invented expertise levels.

Experiments and open source: a quieter searchable repository index, separate from the curated gallery. Preserve search by name, description, language, and topic, plus a GitHub fallback. Design loading, empty, no-results, and upstream-error states. Live data must not delay the opening gallery.

Writing: homepage preview of up to four real posts plus a full /blog listing. Use title, excerpt, date, and reading time. The current data has no topic/category field: omit topic badges unless the handoff explicitly proposes a model extension. Include honest empty and error states rather than invented published articles.

Article: /blog/[slug], comfortable vertical long-form reading, clear heading hierarchy, code blocks, links, optional cover, author/date/reading time, back navigation, optional reading progress, and manual LinkedIn sharing. Keep elaborate scroll scenes out of article reading. Design missing-article and temporary-error states.

Contact/footer: close with the N/connection motif, visible email, mail link, copy-email success/failure feedback, GitHub, LinkedIn, current year, and back to top. Do not invent a hiring-availability claim.

Navigation: compact name/mark, Work, About, Writing, Contact, plus language, theme, and motion controls. Keep existing #projects, #about, #blog, and #contact targets. Preserve #experience and #education; provide #skills and #repositories targets when separating those sections. Show focus and active feedback without requiring an oversized navigation menu.

MOTION, INPUT, AND RESPONSIVE DESIGN

Use spring-based feedback for discrete interactions, clipped title entrances, and restrained project image movement. Keep scroll-driven movement predictable. One visual controller should coordinate gallery progress. Continuous decorative movement needs a pause control. A lazy-loaded draggable 3D object is optional only if it strengthens the concept; a refined SVG/CSS object is a valid signature.

Mobile and narrow/short viewports: stack the intro and three projects in normal vertical flow. Show complete descriptions and source actions. Do not require a sideways gesture or desktop-style pinning to discover work. Use the same content once in the document.

Reduced motion OR the user's persistent pause setting: show the complete static vertical layout, with no gallery zoom or stacked scene scrubbing. Define switching modes halfway through the page so the current content remains in view. Without JavaScript, all essential content and links remain readable.

Keyboard and assistive technology: logical heading/DOM order, visible focus, focus targets brought into view, functional skip/index controls, no focus trap, and no content available only on hover. Keep decorative objects out of the accessibility tree and announce state changes only when useful. Avoid splitting accessible sentences into separately announced words.

Design 390px mobile, 768px tablet, and 1440px desktop versions, with checks at 320px, landscape/short screens, and 200% zoom. Allow Portuguese copy to grow naturally. Target readable body text around 16px and touch controls around 44px. Specify light/dark, keyboard, loading, error, empty, and reduced-motion variants.

EXISTING PRODUCT AND PUBLISHING CONSTRAINTS

The site uses Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, next-intl, and next-themes. Portuguese is the default; English is supported. Public routes have no language prefix: /portfolio, /blog, /blog/[slug]. The root redirects to /portfolio. Separate /uerj and /tako services use proxy routes that must remain intact.

Blog content comes from a separate API. Preserve real article data and Markdown support. Automatic LinkedIn publishing already has a separate authenticated server worker with a durable ledger, publication webhook receiver, and scheduled fallback. Preserve that boundary and the existing manual share link. Reading a page, changing language, or clicking a prototype interaction must never automatically publish a post. Production activation is not established by this design exercise.

DELIVERABLES AND ORIGINALITY CHECK

Deliver:
1. A complete interactive desktop prototype with the intro plus all three projects, the gallery-to-vertical seam, and every vertical section.
2. Complete mobile/tablet layouts and static reduced-motion behavior.
3. Blog listing, article reader, and an explicitly labeled case-study template with content gaps.
4. Color, type, spacing, panel geometry, and motion tokens, including focus and theme states.
5. A motion storyboard showing introduction, incoming vertical reveal, middle project, last project, vertical release, and reverse scrolling; include keyboard and paused-mode behavior.
6. A Next.js implementation handoff and an asset/content checklist.

If Niv's name were removed, at least three details should still connect the design to his actual work: the interface/API/data relationship, distinct Bolota/commerce/streak scenes, and the N connector system. Explain these choices. The portfolio's personality should survive with all motion disabled.
```

## Repository implementation appendix

These notes describe a future implementation, not work performed by this review.

- Read `src/app/[locale]/portfolio/page.tsx`, `components/layout/{Header,MainContent,Navigation,Footer}.tsx`, `components/portfolio/{GitRepos,ProjectVisual,RepoIndex,BlogPosts}.tsx`, and `components/ui/{PersonalMark,ScrollReveal,SiteControls}.tsx`, under `src/app/`.
- Treat `messages/en.json`, `messages/pt.json`, and `src/app/lib/projects.ts` as the existing content sources. New UI copy belongs in both locales. Use `src/app/i18n/navigation.ts` for localized internal navigation and preserve `localePrefix: "never"` in `routing.ts`.
- Split locally authored selected work from `GitRepos`' live repository request. Keep repository fetching server-side behind its own `Suspense` boundary; a GitHub error must not withhold the gallery.
- Add a bounded client gallery controller around server-rendered content. Keep biography, project data, blog fetching, and secrets on the server. Measure actual stage/viewport geometry and account for loaded fonts, locale changes, viewport changes, and content expansion. Avoid React state updates on every scroll frame.
- Native scroll, CSS sticky/transforms, and a measured controller can express the vertical scene sequence. If adding Motion, GSAP, Lenis, or 3D, justify the dependency, confirm React 19/Next 16 compatibility, and define cleanup/fallback behavior. A smooth-scrolling dependency is optional; preserve native input and browser history.
- Make the static, single-DOM vertical version the baseline. Enable pinning only when measurements and input/viewport conditions permit it. A `prefers-reduced-motion` match or `data-motion="paused"` must deactivate the controller and release reserved track space safely.
- Preserve current hashes and test deep links into project panels. Use native anchors and scroll margins for ordinary vertical targets where sufficient. Bring a focused covered scene into view without adding an inert/focus trap around content users need to navigate.
- Update CSS tokens in `src/app/globals.css` and fonts in `src/app/[locale]/layout.tsx`; the current fonts are Archivo, Instrument Serif, and Geist Mono. Tailwind v4 uses `@theme inline`; do not assume a Tailwind v3 config structure. Preserve light/dark control behavior and metadata.
- Keep `next.config.ts` rewrites and `src/proxy.ts` exclusions for `/uerj` and `/tako`. Preserve `/`, `/portfolio`, `/blog`, article slugs, public-post filtering, and article error/404 behavior.
- Preserve `src/app/api/automations/linkedin/route.ts`, `src/app/lib/linkedin/`, `vercel.json`, and the server-only credential boundary. Consult `docs/linkedin-automation.md` for setup; this design does not activate publishing or install the producer webhook in the separate blog backend.
- For implementation validation, use the existing lint, typecheck, build, publishing tests, and HTTP smoke checks as appropriate. Add only behavior tests that exercise new risks. Manually verify scrolling, panel focus/index navigation, Back/hash behavior, the vertical seam, EN/PT, both themes, no-JavaScript, reduced motion, pause toggling mid-gallery, slow/failed GitHub and blog requests, and mobile/zoom layouts. Existing tests do not establish visual quality or scroll correctness.
