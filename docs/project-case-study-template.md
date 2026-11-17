# Project case-study worksheet

Use this as an editorial template. Unanswered fields stay in this document; they should not become empty labels or fictitious claims on the live site. The current source links remain the public actions until a complete case study exists.

## Project identity

- Project name and source URL: use `src/app/lib/projects.ts`.
- One-sentence purpose: use the existing bilingual description.
- Status: retain n-store and TakoStreak as in development. For Bolota, confirm any stronger release/adoption claim before using it.
- Role, collaborators, dates: owner to supply.

## Problem and context

Who is the intended user? What task were they trying to complete? What constraints shaped the work? Distinguish intended use from evidence of actual use.

## Architecture

Start with the facts already documented:

- Bolota: React chat → Express API → Gemini and local SQLite; prices, inventory, medication data; Docker Compose.
- n-store: Laravel 12, PHP, Blade; commerce structure in development.
- TakoStreak: React, TanStack, Express, TypeScript; daily streak interactions in development.

Add a labeled architecture diagram and describe the real request/data flow. Do not infer features from an illustration.

## One decision worth explaining

Describe a real choice, the alternatives considered, the constraint that mattered, the tradeoff, and what changed after testing it. Owner input or source evidence is required.

## Evidence and outcome

Use approved captures or clearly labeled visual studies. Provide descriptive alt text for informational screenshots. Include measured results only with their source, date, and context; otherwise describe the present implementation and remaining work in plain terms.

## Reflection and next step

What would Niv keep, change, or investigate next? Use his own account, with a working repository link and a live URL only when verified.

## Publication checklist

Prepare EN/PT copy, approved assets, accurate status/role, supported statements, accessible headings/links, and a real destination before replacing source actions with a case-study link.
