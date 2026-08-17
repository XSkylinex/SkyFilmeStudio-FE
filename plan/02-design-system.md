# FE-02 — Design system & tokens

> **Depends on:** 01 · **Blocks:** 03 and every UI phase · **Backend needs:** — · **Plan authority:** §39
> **Status:** done 2026-08-17

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

### What a review caught that this file had already claimed

The first version of the measurement below tested the three pairs this file
names and ticked the box. A review re-ran it across **all 45 tone pairs** and
found the failure was in a pair nobody had thought to measure. Recorded because
the lesson generalises: a partial measurement presented as a verdict is its own
kind of wrong, and the fix is to enumerate the space rather than the examples.

Four other things were true and untested at the same time — the Reject button's
label sat at **1.53:1** in dark mode, `:root { font-size: var(--font-size-md) }`
silently multiplied every rem token by 0.875, an indeterminate `ProgressBar`
under `prefers-reduced-motion` rendered as a **full** bar, and `Field` around a
`Select` dropped `aria-invalid` behind a CSS rule that could never match. Every
one passed `typecheck`, `lint`, `test` and `build`.

### Colour-vision deficiency, measured 2026-08-17 (all 45 pairs)

Not eyeballed. Protanopia and deuteranopia simulated with the Viénot 1999 matrices in linear RGB
against the rendered badges, ΔE reported in CIE Lab. Roughly, ΔE 2.3 is a just-noticeable
difference and 10 is "tells them apart at a glance in a list".

| Pair | normal | protanopia | deuteranopia |
| ---- | ------ | ---------- | ------------ |
| `SUCCEEDED` ↔ `FAILED_FINAL` | 80.9 | 37.1 | 25.6 |
| `SUCCEEDED` ↔ `FAILED_RETRYABLE` | 56.0 | 19.3 | 23.7 |
| `FAILED_RETRYABLE` ↔ `FAILED_FINAL` | 37.3 | 32.7 | 13.8 |

The trio this phase names as the expensive confusion survives both deficiencies.

**The pair that failed was the one not on that list.** `neutral` and `ready` had identical lightness
at every role — 32/88, 94/26, 74/44 — differing only in hue and chroma, which is exactly what
dichromacy destroys. They measured ΔE 1.1–4.6 across every channel and both schemes. `neutral` is
`PENDING · CLAIMED · PREPARING · SUBMITTED · CANCELLED · PLANNED · *_PENDING`; `ready` is
`STORYBOARD_READY · AUDIO_READY · VIDEO_READY`. *"Is this asset done?"* is the single question a
producer scans a 200-row shot list to answer.

`ready`, `processing` and `stale` now sit on their own lightness steps rather than sharing
`neutral`'s ladder, because **lightness survives dichromacy where hue does not**. After:

| Pair | protanopia | deuteranopia |
| ---- | ---------- | ------------ |
| `neutral` ↔ `ready` | 26.1 | 23.5 |
| `neutral` ↔ `processing` | fixed (was 4.4, and shared `neutral`'s ring form) | |
| `success` ↔ `stale` | fixed (was 6.1) | |

**The claim to make is the pairwise one, not the per-tone one.** Across all 45 pairs, two remain
under 10 — `checking` ↔ `active` (deut 5.4, protan 24) and `danger` ↔ `stale` (protan 5.8, deut
18.1). Each fails in only one deficiency while staying strong in the other, and both carry distinct
dot forms. **No pair is both under 10 and sharing a dot form**: colour or shape separates every one
of the 45. That is the honest form of "distinguishable".

**Where the identity lives is still the border and the dot, not the text.** Holding lightness even
per role is what keeps the palette readable on one surface, and the price is that two tones can share
almost exactly the same foreground colour. So a state rendered as **bare coloured text, with no
border and no dot, is not accessible.** Any surface showing state must carry the border or the dot.
FE-04 maps states to tones against the real contract and is where this constraint has to hold.

## Done when

- [x] tokens live in `src/styles/tokens.css`; no component defines a raw colour or spacing value
- [x] `@layer` order established
- [x] `color-scheme` still declared in a stylesheet, not the HTML
- [x] state colours cover all twelve job and fifteen shot states, and are distinguishable
- [x] `MediaTile` reserves its box before load; a 200-cell grid does not shift
- [x] `ApprovalControls` exposes explicit regeneration modes and gates on server state
- [x] every primitive uses logical properties, verified under `dir="rtl"`
- [x] `prefers-reduced-motion` reflected in the tokens
- [x] no CSS framework added

### What each tick actually rests on, 2026-08-16

Ticked against measurement, not reading. Where a box is only mostly true, it says so.

- **No raw values** — audited across every `src/**/*.css`: zero raw colours, zero raw spacing. Four
  literals remain, each a named custom property: `--select-indicator-size: 6px`, two
  `border-width: 2px` on status-dot forms, the `1px` diamond ring, and `--preview-column-min: 13rem`
  in a feature stylesheet. The first four are device-pixel glyph dimensions and the spacing scale is
  rem-based, so putting a hairline on it would make it scale with the type scale — exactly what a
  hairline must not do. The review also found `80rem`, `10rem` and a `1126px` that were **not**
  justified; those are now `--size-xl`, `--size-2xs`, and deleted respectively.
- **Logical properties** — audited the same way: zero physical properties anywhere. Two deliberate
  `html[dir='rtl']` escape hatches, both because no logical form exists: `background-position` for
  the select chevron, and `translate` for the tooltip's centring, which has no logical longhand
  (open spec issue `w3c/fxtf-drafts#311`). `:dir()` is outside the floor, hence the attribute
  selector.
- **RTL** — verified in Chrome, not inferred from the emitted CSS. The chevron and the toast
  dismiss both mirror; zero elements overflow at 380px or 320px; nothing is clipped.
- **200-cell grid** — measured. 200 tiles across all three ratios, boxes reserved with no image
  present, then 200 images loaded under a `PerformanceObserver`: cumulative layout shift **0**, zero
  shift entries, zero tiles resized, container height identical at 6125.2px. The images were 2×3, an
  intrinsic ratio disagreeing with every box, so the reservation decided the layout rather than the
  image happening to match.
- **Distinguishable states** — the CVD measurement above, with the constraint it exposed.
- **`prefers-reduced-motion`** — durations collapse to `0.01ms` in the tokens. `Skeleton` drops its
  moving gradient for a flat colour. The indeterminate `ProgressBar` gets a **static stripe**, not a
  flat fill: its fill is `inline-size: 100%` masked by a sweeping gradient, so removing the gradient
  left a full bar and `PREPARING` read as `SUCCEEDED`. A rendering artefact is confusing; a bar
  claiming a render finished is wrong.

### A limitation, stated rather than left to be discovered

`Tooltip` has no top layer — `popover` is outside the floor — so it cannot detect a viewport
collision without JS. A tooltip whose trigger sits within half a tip-width of the container edge
overflows by ~27px at 320px. Nothing clips and no information is lost (the tip is
`pointer-events: none` and its text is also the control's accessible description), but a dense
screen with edge-adjacent tooltips will need real positioning logic.

## Traps

- **Designing on a light background** and discovering every thumbnail looks different in use.
- **Skipping `aspect-ratio` on the tile** because the images "load fast locally". Two hundred of them
  do not.
- **`margin-left`.** It compiles, it passes every check, and it breaks the day the UI flips.
- **A "Retry" button.** Five different operations behind one label, and the user cannot tell which ran.
- **Using `:has()` or `subgrid` because they are Baseline `widely`.** Both are **outside** this repo's
  floor. Run `floor-check.mjs`.
