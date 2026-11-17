# A personal, editorial portfolio

> Historical direction. The current implementation follows [the Connections brief](portfolio-design-prompt.md); see [implementation notes](portfolio-implementation.md) for the visual system and gallery behavior.

The chosen direction is **editorial and personal**: warm paper, strong type, a burnt-orange accent, and playful details that reward interaction. It should feel like Niv's own working notebook, with clear evidence of what he builds.

Eight read-only research agents informed this work: three Gemini 3.8 Flash, one Gemini 4 Argon, two Luna, and two DeepSeek V4.1 Flash. Their findings were checked against this repository, official integration documentation, and Niv's public project sources. Suggestions that invented performance numbers, availability, current location, clinical diagnoses, or project outcomes were excluded.

## References and what to borrow

- [Brittany Chiang](https://brittanychiang.com/): a legible career history and descriptions that explain the work. Borrow the clarity, not the page layout or biography.
- [Rauno Freiberg](https://rauno.me/): deliberate interactions and an unmistakable personal point of view. Borrow the attention to feedback and continuity.
- [Paco Coursey](https://paco.me/): economical navigation and typography. Keep controls quiet and content easy to reach.
- [Emil Kowalski](https://emilkowal.ski/): small interactive details as evidence of craft. Prefer immediate feedback over long sequences.
- [Lee Robinson](https://leerob.com/): an integrated personal site and writing practice. Give articles a comfortable reading measure and easy return navigation.
- [Anthony Fu](https://antfu.me/): personality through real experiments and open source. Make the repository index useful without letting it replace curated work.

These are directional references, not claims that every current site uses a particular animation library or layout. Their implementations change over time.

## The visual system

- Canvas: `#f5f2eb`; ink: `#292823`; secondary text: `#68665e`; accent: `#bd4328`.
- Dark mode uses warm charcoal and a lighter orange, with the same information hierarchy.
- Archivo provides structure; Instrument Serif adds a human voice; Geist Mono marks dates, indices, and technical metadata.
- The desktop content width caps at 1248px. Mobile uses balanced 20px gutters and readable body copy.
- Section numbers, thin rules, asymmetrical layouts, and authored visual studies connect the whole site.
- The geometric N is an interactive signature. Project diagrams use native HTML/CSS, avoiding large illustration or WebGL dependencies.

## Every section has a purpose

| Area             | New experience                                                                      | Interaction                                                     |
| ---------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Navigation       | Compact wordmark, useful section links, integrated language and theme controls      | Underline feedback, clear keyboard focus, persistent theme      |
| Hero             | Niv's name, visible introduction, oversized editorial headline, direct social links | Short title entrance; a clickable rotating monogram             |
| Selected work    | Three curated bilingual project narratives, each with an authored visual study      | Illustrated hover details; expandable build notes; source links |
| Repository index | Live public GitHub data supplements the selected work                               | Search by name, description, language, or topic                 |
| About            | A first-person story grounded in the existing biography                             | Subtle section entrance and a personal typographic stamp        |
| Experience       | Reverse chronological roles with distinct organizations, dates, and descriptions    | A quiet timeline and reveal as it enters view                   |
| Education        | IFAM, degree, dates, coursework context, and the original major GPA                 | A distinct full-width academic panel                            |
| Writing          | Real articles only, with excerpts, dates, and reading time                          | Responsive link rows and useful empty/error states              |
| Article          | Persistent navigation, back link, readable Markdown, dates, reading time            | Reading progress where supported; manual sharing link           |
| Contact/footer   | A large invitation, email, source and social links, current-year colophon           | Copy feedback, clipboard failure fallback, back-to-top link     |

`/portfolio` remains the portfolio URL, preserving existing routes and the `/uerj` and `/tako` zones. The root uses a server redirect instead of an HTML refresh.

The featured projects are grounded in their source repositories: [Bolota](https://github.com/nivdantas/bolota), [n-store](https://github.com/nivdantas/n-store), and [TakoStreak](https://github.com/nivdantas/takostreak). Bolota is a veterinary customer-service assistant. n-store and TakoStreak remain labeled as in development. The visuals are labeled **visual studies**, not presented as screenshots of shipped interfaces.

## Motion principles

- Use transforms and opacity for movement; avoid continuously animated blurs.
- Keep hover/press feedback quick and reveal content in small distances.
- Content is visible in the server HTML and remains usable without JavaScript.
- Respect `prefers-reduced-motion`. Offer a persistent pause control for the orbit animation.
- Keep all navigation and project actions available with keyboard and touch. Essential content never depends on hover.
- Render projects and posts on the server. Only interactive controls and search need client components.

## Prompts for further exploration

Use [Figma](https://www.figma.com/) to explore composition and type hierarchy, [v0](https://v0.app/) for bounded React component iterations, or [Framer](https://www.framer.com/) for motion prototyping. Keep this repository as the source of truth for routing, bilingual copy, and publishing logic. Do not send account credentials to a design-generation prompt.

### Full visual exploration

> Design an editorial personal portfolio for Nivaldo “Niv” Dantas, a Brazilian software engineer. Use warm paper (#f5f2eb), charcoal ink (#292823), one burnt-orange accent (#bd4328), Archivo, Instrument Serif, and Geist Mono. Make it feel like an authored working notebook: oversized expressive type, asymmetric composition, thin rules, numbered sections, and generous whitespace. Design every section: navigation, personal hero, curated projects, searchable open source index, about, career timeline, education, writing, article reader, contact, and footer. Include 390px and 1440px layouts and allow Portuguese copy to expand. Use genuine facts only: IFAM software engineering graduate; PAPE/Samsung research (2021–2024); TCE-AM internship (2024–2025); independent work from 2026. Avoid invented metrics, endorsements, availability, and stock portraits. Selected projects: Bolota veterinary assistant, n-store (in development), TakoStreak (in development). Label conceptual project illustrations as visual studies. Show focus, loading, error, empty, light/dark, and reduced-motion states.

### Component implementation

> Using this existing Next.js 16 / React 19 / next-intl project, refine only the selected-project component. Preserve its real bilingual content, links, and CSS variables. Build tactile HTML/CSS project illustrations, readable descriptions, honest development labels, and expandable technical notes. Keep source links keyboard-accessible; essential information must stay visible on touch. Use small transform/opacity transitions and disable movement under prefers-reduced-motion. Do not replace the framework, add a CMS, generate fictitious screenshots, or add an animation dependency for effects CSS can express.

### Motion storyboard

> Create a restrained motion storyboard for an editorial engineering portfolio. Include a 500–800ms title entrance, a slow orbit with a visible pause control, 150–250ms link feedback, small one-time section reveals, and responsive project art. Show desktop, touch, keyboard focus, and reduced-motion variants for each. Avoid scroll hijacking, cursor replacement, content gates, or loops without pause controls. Explain how each animation helps orientation or feedback.

## Useful next content work

The implementation is complete enough to use with existing content. Further personalization would benefit from an owner-written paragraph about interests, approved project screenshots, and short case studies describing a real decision or tradeoff. Add those from evidence rather than generating fictional outcomes.
