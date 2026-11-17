# Portfolio review against the Rauno + Kenji brief

> Pre-implementation audit. The refactor is now implemented; see [current implementation and validation notes](portfolio-implementation.md).

Reviewed 2026-11-09. This is a source-code and content review, consolidated from Luna and Gemini 3.8 Flash reviews and checked against the current working tree. No browser or runtime verification was performed in this pass. The application was not redesigned as part of this review.

The current implementation follows the earlier warm editorial direction in [design-direction.md](design-direction.md). The newer brief requests a different composition and scroll experience. The [project-specific prompt](portfolio-design-prompt.md) captures that newer direction; it does not claim those changes already exist.

## Main findings

### 1. The defining gallery experience is absent

The [portfolio page](../src/app/[locale]/portfolio/page.tsx#L22) renders the hero before the main sections. Selected projects use a [three-column CSS grid](../src/app/globals.css#L448). There is no shared intro-and-project track, desktop pinning, gallery zoom-out, progress ruler, or transition from that track into vertical content. The existing [ScrollReveal](../src/app/components/ui/ScrollReveal.tsx#L14) observes entry into the viewport; it does not continuously map scroll position to scene progress.

The new brief should specify four panels: introduction, Bolota, n-store, and TakoStreak. Native document scrolling should drive the desktop track, with stacked content as the baseline. An additional animation dependency is an implementation choice, not a prerequisite established by this review.

### 2. The art direction and leading copy still belong to the earlier design

The [color tokens](../src/app/globals.css#L4) use paper, charcoal, and burnt orange. The [layout](../src/app/[locale]/layout.tsx#L13) loads Archivo, Instrument Serif, and Geist Mono; the [hero](../src/app/components/layout/Header.tsx#L16) pairs a headline with an italic line. The newer prompt asks for near-black, cream, red and blue, and a bold condensed display face.

“Thoughtful code. A personal touch.” in [the English copy](../messages/en.json) describes a general attitude but says little about Niv's actual work. Lead with his name and the concrete connection between interfaces, APIs, and data. Keep the existing N as a recognizable starting point while changing the surrounding visual system.

### 3. Project evidence needs to lead the presentation

[Project content](../src/app/lib/projects.ts#L1) provides useful technical descriptions. However, [project actions](../src/app/components/portfolio/GitRepos.tsx#L22) point to GitHub and “Behind the build” opens a short technical paragraph. Full case-study routes, documented roles, measured outcomes, and approved product screenshots are not supplied by this structure.

The [visual studies](../src/app/components/portfolio/ProjectVisual.tsx#L1) already distinguish conversation, commerce, and daily habits. Extend those into larger, authored scenes. Keep their visual-study labels. n-store and TakoStreak must retain visible “In development” text, rather than relying on the current small status dot. Bolota's `inDevelopment: false` flag is not evidence of production adoption or commercial success.

Design a case-study template with explicit content gaps. Keep working source links until real case-study content and routes exist; do not manufacture outcomes to fill the layout.

### 4. Separate the curated showcase from live repository loading

[GitRepos](../src/app/components/portfolio/GitRepos.tsx#L12) awaits GitHub before rendering both the local projects and the repository index. A cache miss with a slow upstream can therefore delay the curated showcase; the [fetch timeout](../src/app/lib/repositories.ts#L14) is eight seconds.

The next implementation should render the locally authored gallery independently and stream the repository index in a separate boundary. A small client controller can measure and animate server-rendered panel children. Neither GitHub nor animation code needs to own the biography, project facts, or article fetching.

### 5. All sections exist in some form, but the new composition needs an explicit order

[MainContent](../src/app/components/layout/MainContent.tsx#L44) currently presents work → about → experience → education → writing, followed by contact in the footer. Skills are inside About, and repositories are inside Work.

The proposed order is intro + three selected projects in the opening track, then vertical About → Experience → Education → Capabilities → Experiments/repositories → Writing → Contact. Preserve all existing content. Keep the navigation compact; every section does not require a top-level nav item.

There are already `#experience` and `#education` targets. `#skills`, `#repositories`, and project-specific deep links would be new. Horizontal project targets need deliberate focus/scroll handling; vertical anchors should retain native behavior wherever it works. Sticky layout alone does not establish that every anchor needs custom JavaScript.

### 6. Existing accessibility controls need to govern the future scroll controller

[SiteControls](../src/app/components/ui/SiteControls.tsx#L11) stores the pause preference and sets `data-motion`. The [CSS](../src/app/globals.css#L2003) handles paused keyframes and reduced-motion transitions. These are useful foundations, but they do not yet govern a measured horizontal track because one does not exist.

For the future gallery, either paused motion or reduced motion should give a fully readable vertical layout. Specify what happens when the mode changes halfway through the gallery. Keyboard focus must reveal its target, skip links must bypass the sequence, and browser Back/deep links must not strand visitors offscreen. These are implementation acceptance requirements, not claims that the current site has a broken gallery.

### 7. The blog is more complete than the generic prompt suggests

The [listing](../src/app/components/portfolio/BlogPosts.tsx#L13) already handles real data, excerpts, dates, reading time, empty states, and errors. The [article route](../src/app/[locale]/blog/[slug]/page.tsx#L49) renders Markdown, metadata, a back link, and manual LinkedIn sharing. [Reading progress](../src/app/globals.css#L1444) already has a CSS scroll-timeline enhancement where supported.

The [blog model](../src/app/lib/content.ts#L1) has no topic/category field. The design should omit topic badges unless an explicit content-model extension supplies them. Refine the reader without introducing gallery movement into long-form reading.

The [LinkedIn worker](../src/app/api/automations/linkedin/route.ts), its ledger, and cron are separate from visitor interactions. Preserve them. This review did not inspect private credentials or verify production activation. Configuration and external blog-service webhook setup remain documented in [the automation guide](linkedin-automation.md).

## Recommended personal identity

Use **connections between interface, API, and data** as the organizing idea. This comes directly from Niv's biography and project descriptions; it does not require inventing hobbies or a new persona.

- Extend the geometric N into a restrained connector/progress motif. It can join the intro, project index, section markers, and closing composition.
- Bolota: show the relationship between conversation, context, and a local data source. Keep examples illustrative and avoid implying clinical advice or verified customer results.
- n-store: explore catalog, item, and receipt forms as a commerce visual study. Preserve the development label.
- TakoStreak: use a day sequence and completion feedback. Preserve its playful character and development label; do not invent usage history.
- Give career and education calmer layouts. Their factual content supplies credibility without institutional endorsement graphics or an “official approval” stamp.

A possible introduction, offered as new copy rather than an existing quotation:

> EN: “I'm Niv. I build the interface, the API, and the connections between them.”
>
> PT: “Sou o Niv. Desenvolvo a interface, a API e as conexões entre elas.”

## What the prompt must carry forward

- Nivaldo “Niv” Dantas; Brazil; existing GitHub, LinkedIn, and email destinations.
- IFAM software engineering degree, 2020–2025, and the existing **Major GPA 9.0** label. Do not infer a grading denominator or class rank.
- PAPE/Samsung research, 2021–2024; TCE-AM internship, 2024–2025; independent work from 2026. Keep the exact roles and scope in the translations.
- The three real projects, their stacks and statuses; English and Portuguese copy with Portuguese as the default locale and no URL locale prefix.
- `/portfolio`, `/blog`, `/blog/[slug]`, root redirect, `/uerj` and `/tako` proxy zones, theme/motion controls, metadata, and publishing behavior.
- Missing approved portrait, project captures, project-role details, decisions/tradeoffs, and measured outcomes must be named as content gaps. `public/Phos.gif` does not establish a personal interest or permission to make its character the site's identity.

## Handoff and validation

Use [portfolio-design-prompt.md](portfolio-design-prompt.md) as the copy-ready brief. Its opening block is self-contained for a design platform; the repository appendix supplies implementation constraints for an agent with checkout access.

The review checked source coverage and content consistency. Only review/brief documents were added. No UI, automation, dependency, or route changes were made; runtime tests and browser checks were not run for this documentation-only pass.
