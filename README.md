# Niv's portfolio

A personal, bilingual portfolio for Nivaldo Dantas, built with Next.js 16, React 19, TypeScript, next-intl, and Tailwind CSS 4.

The design centers on forest green (`#1E3B2F`), cream typography, sage accents, and original project scenes. On larger screens, native scrolling reveals the introduction and projects as a layered vertical sequence; mobile, reduced-motion, paused, and no-JavaScript layouts use a single vertical document. It includes selected projects, a searchable public GitHub index, a personal introduction, experience, education, writing, an article reader, and contact. Light/dark themes, Portuguese/English, keyboard controls, reduced motion, and a persistent animation pause are supported.

## Development

Use Node.js 22.18+ and Bun. Install from the checked-in lockfile:

```sh
bun install --frozen-lockfile
cp .env.example .env.local
bun run dev
```

Open `/portfolio`. `/` redirects there; `/blog` lists writing. Existing `/uerj` and `/tako` proxy routes remain configured in `next.config.ts`.

`BLOG_API_URL` connects the external bilingual blog service. Without it, the writing section shows an intentional empty state. Public GitHub repositories can load without a token; `MY_TOKEN` is optional for authenticated limits. Featured project content remains available independently of GitHub.

```sh
bun run typecheck
bun run lint
bun run test
bun run build
bun run test:http
```

## Design and content

[Implementation notes and motion storyboard](docs/portfolio-implementation.md) describe the current design. [The project-specific prompt](docs/portfolio-design-prompt.md) records the brief, and [the review](docs/portfolio-design-review.md) captures the pre-implementation findings. The earlier [design research](docs/design-direction.md) is retained as history. English and Portuguese copy live in `messages/`; curated project facts live in `src/app/lib/projects.ts`; shared design tokens and responsive layouts live in `src/app/globals.css`.

The optional [browser smoke suite](docs/portfolio-implementation.md#validation-and-repeatable-browser-checks) checks the gallery, navigation, languages, motion modes, and mobile layouts against a local production server.

Projects and articles render on the server. Only local interactions, search, and controls use client components. Project illustrations are conceptual visual studies, not screenshots or invented results.

## Automatic LinkedIn shares

The integration supports an authenticated scheduled worker and optional signed publication webhooks, using a persistent Redis ledger to prevent duplicates and historical backfills. It posts one article link per new public blog post, with a chosen language and explicit article metadata.

It is **disabled by default** and requires the owner's LinkedIn token/member URN, a persistent Upstash Redis database, and production environment configuration. [Setup, cadence, webhook contract, credential renewal, and failure recovery](docs/linkedin-automation.md) are documented. Tests use mocked APIs; no LinkedIn post is created during development. `test:http` starts and stops its own localhost production server and fixture API.
