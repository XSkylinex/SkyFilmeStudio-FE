# FE-02 — Design system & tokens

> **Depends on:** 01 · **Blocks:** 03 and every UI phase · **Backend needs:** — · **Plan authority:** §39
> **Status:** not started

## Goal

A token set and a small primitive layer built for what this app actually is: a **review console** for
dense media, long lists and continuously updating job state — not a document site.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Surface | follow the system vs a fixed dark surface | **Lean dark.** Every screen judges images and video against a background; a light surface shifts perceived colour and contrast. If both are supported, the media-viewing surfaces stay dark regardless. |
| 2 | Palette | keep the Vite starter's vs a purpose-built one | **Purpose-built.** The scaffold's `--accent: #aa3bff` and friends are a starter's identity, not this product's. |
| 3 | Colour space | hex vs `oklch()` | **`oklch()`**. Measured inside this repo's floor on 2026-08-14, and it makes a perceptually even state scale possible — which matters when eight job states need distinguishable colours. |
| 4 | Layering | ad-hoc vs `@layer` | **`@layer`**, measured to pass through the build unchanged. `reset → tokens → primitives → features → utilities`. |

**Answered 2026-08-15.** 1 — both surfaces, media always dark: chrome follows the system through
`light-dark()`, and every media-viewing surface is pinned dark regardless, so the same frame is never
judged against two different grounds. 2, 3 and 4 as recommended.

Primitives live in `src/lib/components/` with their interfaces in `src/lib/interfaces/`. `src/lib/`
is "earned, not anticipated" for a helper migrating out of a feature; these are commissioned by this
phase as the shared layer 03 and every UI phase build on, so the caveat does not apply.

## What the pipeline actually does to your CSS

**Measured** by building probe declarations through this repo's own Vite and reading
`dist/assets/*.css` (2026-08-14, `vite@8.2.1`):

| You write | You get |
| --------- | ------- |
| nesting `& .child` | flattened — **use it freely** |
| `color-mix(in oklab, …)` | resolved to `oklab(…)` at build |
| `oklch()` | unchanged, inside the floor |
| `light-dark(a, b)` | a `var()` pair **plus** the `:root` definitions, because `index.css` declares `color-scheme` |
| `@media (max-width: 1024px)` | **upgraded** to `@media (width<=1024px)` |
| `@container (min-width: 40rem)` | upgraded to range syntax; container queries are inside the floor |
| `backdrop-filter`, `user-select` | `-webkit-` prefixed automatically |
| `:has()`, `@layer`, `@starting-style` | shipped raw — check the floor first |

Settle anything new with `node .claude/skills/newest/scripts/floor-check.mjs <id>`, never from memory.
`.claude/rules/css.md` carries the full table and the `light-dark()` trap.

### Checked for this phase, 2026-08-15

`floor-check.mjs`, against `["chrome111","edge111","firefox114","safari16.4","ios16.4"]`:

| Inside — ship raw | Outside, lowered by the build | Outside — unusable here |
| ----------------- | ----------------------------- | ----------------------- |
| `cascade-layers` · `oklab`/`oklch` · `aspect-ratio` · `dialog` · `container-queries` · `color-mix` · `logical-properties` · `focus-visible` · `inert` · `grid` · `flexbox` · `media-query-range-syntax` · `custom-properties` | `nesting` (flattened) · `light-dark` (var pair + `:root` definitions) | `popover` · `starting-style` · `content-visibility` · `accent-color` · `text-wrap-balance` · `scrollbar-gutter` · `has` · `subgrid` · `relative-color` |

Two of those change the design rather than merely restricting it:

- **`popover` is out** (`safari_ios 18.3` > 16.4), so `Tooltip` cannot use the popover API and gets no
  top-layer promotion for free. It is positioned and dismissed by the component.
- **`relative-color` is out** (`safari 18` > 16.4), so `oklch(from var(--x) l c h)` cannot derive one
  token from another. Every state colour is written out literally, which is why the scale below is a
  table of measured values rather than a formula.

`content-visibility` being out also means the 200-cell contact sheet has no cheap render-skipping —
`aspect-ratio` reservation is doing the whole job, which raises the stakes on step 3's `MediaTile`.

## Steps

### 1. Split the stylesheets

```text
src/styles/reset.css        element-level reset + the color-scheme declaration
src/styles/tokens.css       every custom property on :root
src/styles/layers.css       @layer order, imported first
```

`src/App.css` disappears into feature stylesheets as phases add them. The `color-scheme: light dark`
declaration **must stay in a stylesheet** — a build-time transform never sees `index.html`, and
`light-dark()` silently resolves to nothing without it.

### 2. Tokens

Colour · elevation · radius · spacing scale · type scale · motion durations and easings · z-index
scale. Every value a component uses is a token first, the same way a magic number becomes a named
const.

**State colours are a real design problem here**, not decoration. The job state machine has twelve
states and the shot machine has fifteen. They need a palette where `RUNNING`, `VALIDATING` and
`POST_PROCESSING` are distinguishable at a glance in a list of two hundred rows — and where
`FAILED_RETRYABLE` and `FAILED_FINAL` do **not** look the same, because they mean different things to
the user. `oklch()` with even lightness steps is why decision 3 matters.

#### The states, from the authority

Not from this file's prose. `LOCAL_AI_STUDIO_PLAN.md` §10.1 (12 job states) and §24 (15 shot
states). Grouped into the families the palette is designed around:

| Family | Job states | Reads as |
| ------ | ---------- | -------- |
| Queued — nothing is burning GPU yet | `PENDING` `CLAIMED` `PREPARING` `SUBMITTED` | low chroma, calm; a queue at rest should not look busy |
| Active — work in flight | `RUNNING` `POST_PROCESSING` `VALIDATING` | the only saturated moving things on screen, and **distinguishable from each other** |
| Settled, good | `SUCCEEDED` | |
| Settled, bad, recoverable | `FAILED_RETRYABLE` | |
| Settled, bad, final | `FAILED_FINAL` | must not be confusable with the row above |
| Stopped by a person | `CANCELLED` | neutral — a choice, not a fault |
| Lost | `STALE` | lease expired; neither running nor deliberately stopped |

| Family | Shot states |
| ------ | ----------- |
| Not started | `PLANNED` |
| Storyboard track | `STORYBOARD_PENDING` `STORYBOARD_READY` `STORYBOARD_APPROVED` |
| Audio track | `AUDIO_PENDING` `AUDIO_READY` |
| Video track | `VIDEO_PENDING` `VIDEO_RENDERING` `VIDEO_READY` |
| Review | `AUTO_QC` `MANUAL_REVIEW` |
| Terminal | `APPROVED` `REJECTED` `RENDER_FAILED` `ASSEMBLED` |

#### Two constraints that are product rules, not taste

**`AUTO_QC` must not read as approval.** §27.2: *"Do not treat a VLM `PASS` as equivalent to human
approval for a hero shot."* So `AUTO_QC` never borrows the `APPROVED` hue and never carries the same
visual weight. An advisory machine verdict that looks like a human gate is the single most expensive
confusion this UI can create — it is what causes a wrong keyframe to spawn hundreds of renders.

**Colour is never the only channel.** The verification step requires the states to be distinguishable
"including for the most common colour-vision deficiencies", and under deuteranopia and protanopia
`SUCCEEDED` green, `FAILED_RETRYABLE` amber and `FAILED_FINAL` red collapse toward a common
yellow-grey — which is precisely the distinction that matters most. So every state indicator carries a
**second, non-colour channel**: a distinct dot form (solid · hollow ring · half · crossed · dashed)
plus an always-present text label. A colour-only status dot is a defect here, not a simplification.

#### Why the values are a table and not a formula

`relative-color` is outside the floor, so `oklch(from var(--state-active) …)` cannot derive one state
from another. Each value is written literally, with lightness held constant per role so the scale
stays readable on one surface and hue carrying the family distinction.

#### These are wire types, so no TypeScript union is written here

`code-style.md`: anything crossing the API boundary is inferred from the shared Zod contract and never
re-declared by hand. There is no `zod` in `package.json` and BE-01 has not been consumed, so
`type JobState = 'PENDING' | …` would be exactly the drift that rule exists to prevent. The state
colours therefore ship as **CSS tokens only**; primitives take a presentational tone
(`neutral · info · active · success · warning · danger`), and the state→tone mapping is written in
FE-04 against the real inferred contract.

### 3. Primitives

Only what every phase needs: `Button`, `IconButton`, `Field`, `Select`, `Dialog` (native
`<dialog>` — inside the floor), `Tooltip`, `Badge`, `StatusDot`, `ProgressBar`, `Skeleton`,
`EmptyState`, `ErrorState`, `Toast`.

Two that carry this product and deserve real design attention:

- **`MediaTile`** — a grid cell with `aspect-ratio` reserved **before** the image loads. On a
  200-cell contact sheet, unreserved boxes do not produce a CLS metric; they produce an unusable page.
  It also handles the proxy/thumbnail source, a loading skeleton, and a decode-failure state.
- **`ApprovalControls`** — approve / reject / retake / regenerate, with the **regeneration mode always
  explicit** (never a bare "Retry"), disabled on **server-acknowledged** state rather than a local
  flag, and with no optimistic update. This component is where the product's central gate lives.

### 4. Logical properties, from the first line

`margin-inline-start`, `padding-inline`, `inset-inline`, `border-inline` — never `margin-left`. Hebrew
is a first-class production language and this UI must survive `dir="rtl"`.

Retrofitting this later is a week of work and a permanent regression source. The scaffold already does
it in `#root` and `.hero`; keep it.

### 5. Density

This is a console. Default to a compact density: a queue row showing id, shot, state, elapsed time,
worker and progress must be readable at a glance, and thirty of them must fit on screen. Do not
inherit a marketing site's spacing scale.

### 6. Motion

Define durations and easings as tokens. **Honour `prefers-reduced-motion` in the tokens *and* commit
to honouring it in the React layer** — a media app that damps one keyframe while autoplaying every
shot preview has honoured half the query. Phase 16 audits it; the commitment starts here.

### 7. Do not add a CSS framework

No Tailwind, no CSS Modules, no styled-components. The pipeline already lowers nesting and prefixes;
plain CSS with tokens is sufficient and keeps the bundle honest.

## Verification

```bash
yarn build && yarn dev
```

- render every primitive on one internal page and look at it — at the narrow breakpoint, and with
  `dir="rtl"` set on `<html>`;
- put a `MediaTile` grid of ~200 cells on screen with slow-loading images and confirm **nothing
  shifts**;
- confirm the twelve job-state colours are distinguishable side by side, including for the most common
  colour-vision deficiencies;
- read `dist/assets/*.css` and confirm the build did what the table above says it does.

## Done when

- [ ] tokens live in `src/styles/tokens.css`; no component defines a raw colour or spacing value
- [ ] `@layer` order established
- [ ] `color-scheme` still declared in a stylesheet, not the HTML
- [ ] state colours cover all twelve job and fifteen shot states, and are distinguishable
- [ ] `MediaTile` reserves its box before load; a 200-cell grid does not shift
- [ ] `ApprovalControls` exposes explicit regeneration modes and gates on server state
- [ ] every primitive uses logical properties, verified under `dir="rtl"`
- [ ] `prefers-reduced-motion` reflected in the tokens
- [ ] no CSS framework added

## Traps

- **Designing on a light background** and discovering every thumbnail looks different in use.
- **Skipping `aspect-ratio` on the tile** because the images "load fast locally". Two hundred of them
  do not.
- **`margin-left`.** It compiles, it passes every check, and it breaks the day the UI flips.
- **A "Retry" button.** Five different operations behind one label, and the user cannot tell which ran.
- **Using `:has()` or `subgrid` because they are Baseline `widely`.** Both are **outside** this repo's
  floor. Run `floor-check.mjs`.
