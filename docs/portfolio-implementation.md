# Connections: implementation notes

The current portfolio implements the direction in [the project-specific brief](portfolio-design-prompt.md). The earlier [editorial direction](design-direction.md) is retained as research history.

## Visual system

Ink and paper. The palette is the nine neutral tones of the portfolio design kit, defined once in `globals.css` (`--neutral-050` Paper to `--neutral-900` Ink) and mapped to semantic tokens (`--background`, `--text`, `--text-secondary`, `--text-muted`, `--line`, `--action`, `--focus`). Light is the default theme; dark swaps the same tokens. The page ends on an ink contact section in both themes. There is no accent colour: states use underlines, fills, and shape changes.

- Geist carries structure, Instrument Serif italic is the personal voice inside headings, and Geist Mono marks metadata. Fonts are bundled by `next/font`.
- Project art is monochrome HTML, CSS, and inline SVG, labelled as visual studies.
- A static paper-grain tile sits over the page. The theme control spreads the new theme from the button with the View Transitions API where supported.

## Sound

`lib/sound.ts` synthesizes every sound with the Web Audio API; there are no audio files. Presets are data (noise bursts and tones with short envelopes): `tick` (hover), `tap` (click), `toggle` (switches), `page` (gallery scene change), `turn` (monogram), `ink` (theme), `hello`, `success`, and `error`.

`SoundEffects.tsx` adds one delegated hover listener (mouse only) and one click listener. `data-sound="name|none"` chooses a control's click sound and `data-sound-hover` its hover sound. Sound waits for the first user gesture, hover ticks are throttled, and the header control mutes everything and remembers the choice in `localStorage` (`niv-sound`). Every sound accompanies a visible state; nothing depends on hearing it.

## Scroll

- The pinned gallery keeps its measured stops (below). Each card now also receives `--scene-enter` (0 to 1), which settles the visual study and the copy at different rates as the card arrives. Layout is measured with those offsets disabled (`data-measuring`).
- `ScrollRuler.tsx` is a ruler in the right margin on wide screens: one mark per scene and section, the current one extended, with a spine that fills with page progress. Narrow screens show a progress hairline under the header instead.
- Sections reveal once, with a short stagger and a rule that draws across the label. Content stays in the server HTML.

## Gallery and content boundaries

`WorkGallery.tsx` progressively enhances the server-rendered introduction and three `SelectedWork.tsx` panels. Native scrolling drives a pinned, layered vertical sequence. The next project rises from below the viewport while the outgoing card scales to 0.955, moves upward 16px, and dims slightly. A brief reading beat precedes each reveal; smoothstep easing makes the scroll position mapping reversible. Transforms and opacity are updated in animation frames. The controller does not update React state on every scroll frame.

Each scene has an untransformed scroll stop, separated by 1.15 times the measured stage height. Focus on a covered card navigates to its fully revealed stop before the control can be obscured. The index has real fragment links. Direct project hashes, browser history, keyboard focus, and panel navigation use the same measured positions. After the last project, the sticky stage releases into the ordinary vertical document.

Pinning requires a viewport at least 1100px wide and 760px tall, enough room for all panel content, JavaScript, and no motion restriction. Smaller/shorter screens, reduced motion, and the persistent pause preference use the same panels stacked vertically. The controller observes layout/font/content changes and releases the pin when text no longer fits. Mode changes preserve the viewed panel or downstream content. No essential content is duplicated or requires animation to become readable.

Locally authored projects do not wait for GitHub. `GitRepos.tsx` independently fetches the repository index in its own server Suspense boundary. The index searches name, description, language, and topics and displays all matching entries supplied by the existing API. Writing has its own boundary and real empty/error states.

The vertical sequence is About, Experience, Education, Capabilities, Repositories, Writing, Contact. Existing public routes, proxy zones, article rendering, themes, and EN/PT support are preserved. Blog reading and UI controls have no connection to the automatic LinkedIn publication endpoint. Publishing configuration remains in [the existing guide](linkedin-automation.md).

## Motion storyboard

1. Introduction: full-size name composition on paper, with the interactive N monogram.
2. Initial scroll: a short reading beat, then Bolota rises from below the viewport. The outgoing introduction recedes and dims.
3. Project sequence: subsequent cards rise above the previous scene. The ruler/index tracks the closest scene stop; source actions remain ordinary links.
4. Final project: TakoStreak is fully revealed; further scrolling releases the stage into About.
5. Reverse: the same mapping lowers incoming cards and restores the previous scene.
6. Pause/reduced motion: release the reserved gallery space and restore a single readable vertical layout. Resume returns to the viewed panel when the viewport can support it; switches after the gallery preserve downstream position.

Discrete controls use transform feedback with a spring-shaped CSS easing. The Bolota connector is the only continuous decorative loop; the pause control stops it. Article reading uses ordinary vertical flow with a CSS reading-progress enhancement where supported.

## Content still needed

The site uses existing factual descriptions and clearly labeled visual studies. n-store and TakoStreak retain text labels identifying them as in development. No production outcomes or testimonials were added.

Approved screenshots, an optional portrait, precise project-role descriptions, and documented decisions/results would support fuller case studies. Use [the case-study worksheet](project-case-study-template.md) to collect them. Until then, project actions go to working source repositories.

## Validation and repeatable browser checks

Validated with the production build, lint, TypeScript, 18 unit tests, 12 HTTP smoke checks, and 26 headless Chrome checks. The browser suite covers vertical reveal order, outgoing-card scale, index navigation, reverse scrolling, focus visibility including Shift+Tab to covered cards, pause/resume continuity within and after the gallery, paper and ink surfaces in both themes, the page ruler, the sound switch, the vertical seam, both themes/locales, direct hashes and Back, reduced motion, short screens, enlarged text, 768/390/320px layouts, section reveals, article rendering, no-JavaScript content, and the absence of automatic publishing requests from visitor interactions. Mobile widths are browser emulations; Safari/Firefox and physical devices were not tested in this pass.

`tests/browser-smoke.mjs` starts and stops its own production server and fixture blog API, explicitly disables publishing, and saves screenshots in the temporary directory printed at completion. It uses an installed Chrome (or `CHROME_PATH`). Playwright is optional test tooling, kept outside the application dependency/lockfile:

```sh
npm run build
npm install --prefix /tmp/portfolio-browser-tools --no-save playwright@1.56.1
npm run test:browser -- /tmp/portfolio-browser-tools/node_modules/playwright/index.mjs
```

If Playwright is already available to Node's module resolver, `npm run test:browser` needs no module-path argument. Unit and HTTP tests remain available through `npm test` and `npm run test:http` without browser tooling.
