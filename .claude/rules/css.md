---
description: What CSS this project may actually ship — the browser floor the build declares, what the pipeline was measured rewriting, and where a style belongs.
paths:
  - "**/*.css"
---

# CSS (`src/**/*.css`)

**Nothing in the gate reads this file.** oxlint has no CSS plugin, `tsc` never opens a stylesheet,
and the test runner never imports one. A broken selector, a dead custom property, and a feature no
browser in range supports all pass a fully green gate. The only verification is `yarn dev` / `yarn
preview` and your eyes, so look before you claim.

## Where a style goes

Two stylesheets today, and the import order in `src/main.tsx` is load-bearing:

```ts
import "./index.css"   // tokens + element-level reset, imported by main.tsx
// App.css is imported by App.tsx
```

- **`src/index.css`** — the design tokens on `:root` and the element-level reset. Only rules that
  apply to bare tags belong here. It also declares `color-scheme: light dark`, which is not cosmetic
  — see the `light-dark()` row below.
- **`src/App.css`** — component styles.

As the Studio grows past one page this splits into `src/styles/tokens.css`, `src/styles/reset.css`
and per-feature stylesheets; `plan/02-design-system.md` owns that move. Until then, do not scatter
new stylesheets.

**Design tokens are custom properties on `:root`.** A new colour or spacing value becomes a token
before it is used, exactly as a magic number becomes a named const in TypeScript. The scaffold ships
`--text`, `--text-h`, `--bg`, `--border`, `--code-bg`, `--accent`, `--accent-bg`, `--accent-border`,
`--social-bg`, `--shadow`, `--sans`, `--heading`, `--mono`. That palette is a Vite starter's, not
this Studio's — replacing it is a planned step, not a drive-by edit.

Class names are kebab-case and match their component: `.shot-card`, `.render-queue`,
`.storyboard-strip`.

No CSS Modules, no styled-components, no Tailwind. Do not introduce one to style a single panel.

## The floor is declared, not chosen

`vite.config.ts` leaves `build.target` unset, so the default `'baseline-widely-available'` applies,
and `build.cssTarget` follows it. Read the resolved constant, not the JSDoc — the JSDoc omits iOS:

```text
["chrome111", "edge111", "firefox114", "safari16.4", "ios16.4"]
```

Verified 2026-08-14 against `vite@8.2.1`. Chrome/Edge 111+, Firefox 114+, Safari 16.4+, **iOS Safari
16.4+**.

**Baseline "widely available" is not the same test as "inside this floor", and they disagree
constantly.** `:has()` and `subgrid` are both `widely` and both outside it. Before using a feature you
have not used here before:

```bash
node .claude/skills/newest/scripts/floor-check.mjs :has-or-whatever-id
```

Never answer this from memory, and never from a blog post — the `newest` skill exists for it.

## What the build already handles

**Measured**, by writing each line into `src/App.css`, running this repo's own `yarn vite build`, and
reading `dist/assets/*.css`. Date: 2026-08-14, `vite@8.2.1`.

| Write this | You get | So |
| ---------- | ------- | -- |
| nesting — `.card { & .title {} }` | `.card .title{}` | **use it**, it is compiled away |
| `backdrop-filter`, `user-select` | `-webkit-` copy emitted first | **never hand-write a prefix** |
| `color-mix(in oklab, red 40%, blue)` | `oklab(52.239% .070471 -.136578)` | free, resolved at build |
| `oklch()` / `oklab()` | unchanged, and inside the floor | use for colour work |
| `light-dark(#111, #eee)` | `var(--lightningcss-light,#111)var(--lightningcss-dark,#eee)` **plus** the `:root` definitions and a `prefers-color-scheme` block | works here — see the trap below |
| `@media (max-width: 1024px)` | `@media (width<=1024px)` | Lightning CSS *upgrades* to range syntax |
| `@container (min-width: 40rem)` | `@container (width>=40rem)` | same upgrade; container queries are inside the floor |
| `:has()`, `@layer`, `@starting-style`, logical properties | unchanged | ships raw — check the floor first |
| `#11223344` | `#1234` | minified, not lowered |

Two things follow that are easy to get wrong:

**`light-dark()` only works because `index.css` declares `color-scheme: light dark` on `:root`.** A
build-time CSS transform never sees `index.html`, so a `<meta name="color-scheme">` tag would not be
enough. Lightning CSS emits the `var()` pair regardless; without a `color-scheme` declaration **in a
stylesheet** it does not emit the `:root` definitions that resolve them, and the colour silently comes
out empty. If you ever move the reset, that declaration moves with it.

**Lightning CSS rewriting media queries into range syntax is a floor-derived decision.** It emits
`(width<=1024px)` because Safari 16.4 supports it. Pinning `build.cssTarget` lower would change the
emitted syntax, not just the prefixes. Don't pin it casually.

Safe here today and worth reaching for: `@layer`, container queries, `color-mix()`, `oklch()`,
`aspect-ratio`, `inert`, `<dialog>`, logical properties, `dvh`/`svh` (already used by `#root`).

## `@supports` is not always a valid gate

Before assuming `@supports` makes a risky feature safe, ask what the failure mode actually is:

- **the declaration is not applied** — queryable, `@supports` works;
- **the element is not painted** — not queryable, `@supports` hands the broken path to exactly the
  browser that breaks on it.

The classic case is `backdrop-filter: url(#svg-filter)`, which is Chromium-only and makes the element
render *not at all* elsewhere — while Firefox still parses the declaration and reports support. If
this Studio ever grows a glass/refraction surface, gate on an engine capability, keep the optical
layer a **sibling** of the content rather than its parent, and never use `display: none` on the
filter's `<defs>` host (that invalidates the filter reference in Gecko) — `width: 0; height: 0`
instead.

## What this app is going to be

Not a document. A **review console**: long lists, dense media grids, contact sheets, waveforms, video
players, and a render queue that updates continuously. Layout consequences that are decisions, not
taste:

- **Media grids are `grid` with `aspect-ratio` on the cell**, so a slow-loading thumbnail cannot shift
  the page. CLS on a storyboard strip is a real defect, not a metric.
- **Panels over media need functional contrast**, not decorative. Keep the token pairing rather than
  inventing a new alpha per component.
- **Reduced motion must be honoured in the shell, not just in CSS.** A `@media
  (prefers-reduced-motion: reduce)` block that damps a keyframe while the app autoplays every shot
  preview is half a feature. If you touch motion, honour the query in the React layer too.
- **Hebrew is a first-class production language, so the UI must survive `dir="rtl"`.** Use logical
  properties (`margin-inline-start`, `padding-inline`, `inset-inline`) everywhere — `#root` uses
  `border-inline` and `.app-placeholder` uses `padding-inline` / `max-inline-size`. `margin-left` in a
  component is a bug the day someone switches the interface language. This is the single most common
  CSS mistake this project will make. `logical-properties` is `widely` **and inside this floor** —
  checked with `floor-check.mjs`, 2026-08-15, all seven browsers at or below it.
- One breakpoint set, defined once as tokens. Extend the existing `@media` blocks rather than
  scattering new widths.

## Before claiming a CSS change works

`yarn build` proves it compiles, not that it renders. Run `yarn dev`, look at the component with real
data in it, and check both the narrow breakpoint and `dir="rtl"`. If the change touched a feature near
the floor, say which browser is the binding constraint and how you know.
