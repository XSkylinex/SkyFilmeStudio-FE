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

FE-02 split the single `index.css` into three, and the import order in `src/main.tsx` is
load-bearing:

```ts
import "./styles/layers.css"   // the @layer order, first
import "./styles/reset.css"    // color-scheme + element-level reset
import "./styles/tokens.css"   // every custom property on :root
// App.css is imported by App.tsx
```

- **`src/styles/layers.css`** — one statement, `@layer reset, tokens, primitives, features,
  utilities;`, and nothing else. It is imported first so the order exists before anything fills a
  layer.
- **`src/styles/reset.css`** — the element-level reset, and the `color-scheme: light dark`
  declaration, which is not cosmetic — see the `light-dark()` row below. Only rules that apply to
  bare tags.
- **`src/styles/tokens.css`** — the design tokens on `:root`.
- **`src/lib/components/<kebab-name>/<kebab-name>.css`** — one stylesheet per component, living in
  that component's folder and imported by its `index.tsx`. Wrap the whole file in
  `@layer primitives { … }`; a surface rather than a primitive uses `@layer features { … }`.

`src/index.css` and `src/App.css` no longer exist. Every rule `index.css` held moved into
`reset.css` or `tokens.css`; `App.css` died with the placeholder it styled. Do not recreate either.

**A component's styles live with the component**, never in a shared sheet keyed by class name. The
layer order is declared once in `layers.css`, so a rule landing in `@layer primitives` from a file
imported deep in the tree still cascades correctly — verified in the built CSS.

**Design tokens are custom properties on `:root`,** named `--<family>[-<role>]`. A new colour or
spacing value becomes a token before it is used, exactly as a magic number becomes a named const in
TypeScript. The families are `--color-surface-*`, `--color-text*`, `--color-border*`,
`--color-accent*`, `--color-media-*`, `--elevation-*`, `--radius-*`, `--space-*`, `--font-*`,
`--line-height-*`, `--font-weight-*`, `--duration-*`, `--ease-*`, `--z-*`.

**Two colour families, and the split is a decision.** `--color-surface-*` and friends follow the
system through `light-dark()`. `--color-media-*` does **not** — it is pinned dark at near-zero chroma
in both schemes, because every media surface is a ground someone judges a render against, and the
same frame must not look different on a light desktop. A media surface that reaches for
`--color-surface-canvas` has broken that.

**Motion tokens already honour `prefers-reduced-motion`.** `--duration-*` collapse to `0.01ms` under
the query, so a transition written against a token is correct for free. Hard-coding `200ms` opts out
of that silently — and per the section below, the React layer has to honour the query too.

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
| `mask-image`, `mask-size`, `mask-repeat` | `-webkit-` copy emitted first | **this is what makes icons work here** — see below |
| `#11223344` | `#1234` | minified, not lowered |

Two things follow that are easy to get wrong:

**`light-dark()` only works because `reset.css` declares `color-scheme: light dark` on `:root`.** A
build-time CSS transform never sees `index.html`, so a `<meta name="color-scheme">` tag would not be
enough. Lightning CSS emits the `var()` pair regardless; without a `color-scheme` declaration **in a
stylesheet** it does not emit the `:root` definitions that resolve them, and the colour silently comes
out empty. If you ever move the reset, that declaration moves with it.

**The declaration and the `light-dark()` calls may live in different files** — verified 2026-08-15
after the FE-02 split, with `color-scheme` in `reset.css` and every `light-dark()` in `tokens.css`.
The emitted bundle still carries `--lightningcss-light:initial;--lightningcss-dark: ;` on `:root` plus
the `@media (prefers-color-scheme:dark)` flip, because Vite bundles both into one stylesheet before
Lightning CSS runs. Do not assume this survives a future change that emits them as separate files.

**`light-dark()` also lowers correctly inside a composite value**, not just as a whole colour —
measured on `--elevation-sm`, which emits
`0 1px 2px var(--lightningcss-light,oklch(0% 0 0/.1))var(--lightningcss-dark,oklch(0% 0 0/.36))`. One
of the two custom properties is `initial` and the other is empty, so exactly one contributes.

**Lightning CSS rewrites the `@layer` statement and that is not a bug.** `layers.css` declares five
names; the built CSS declares `@layer reset{…}`, `@layer tokens{…}`, then a trailing bare
`@layer primitives,features,utilities;`. First-appearance order is unchanged, so the cascade is the
one you asked for. Check the *order names first appear*, not whether the statement survived intact.

**Lightning CSS rewriting media queries into range syntax is a floor-derived decision.** It emits
`(width<=1024px)` because Safari 16.4 supports it. Pinning `build.cssTarget` lower would change the
emitted syntax, not just the prefixes. Don't pin it casually.

Safe here today and worth reaching for: `@layer`, container queries, `color-mix()`, `oklch()`,
`aspect-ratio`, `inert`, `<dialog>`, logical properties, `dvh`/`svh` (already used by `#root`).

## Icons are masks, not markup

SVG source lives in `src/assets/`, mirroring `src/` — never as `<svg>` inside a `.tsx` file. See
`.claude/rules/code-style.md`. The stylesheet is what puts it on screen:

```css
.icon {
  background-color: currentColor;
  mask-image: url('../../../assets/lib/components/icon/close.svg');
  mask-size: contain;
  mask-repeat: no-repeat;
}
```

`currentColor` under the mask is the whole point: one asset serves every button variant and every
tone, so a new tone never needs a recoloured copy of the artwork.

**This ships only because of the prefix.** `floor-check.mjs` reports `masks` as **OUTSIDE** the floor
— blocked by `chrome 120`, `chrome_android 120`, `edge 120` against our 111 — and unprefixed
`mask-image` genuinely is. Measured 2026-08-16 by transforming a probe through this repo's own
`lightningcss` at the floor's targets: it emits `-webkit-mask-image` **and** `mask-image`, the same
pattern as `backdrop-filter`. The `-webkit-` form is old enough to cover the floor everywhere.

So do not "fix" this by hand-writing the prefix, and do not read the `floor-check` line as a ban —
it is the reason the build's prefixing is load-bearing here rather than cosmetic.

Two traps that produce an invisible icon with a fully green gate:

- **A mask reads the alpha channel, not the colour.** Artwork that draws with `stroke` and no fill,
  or that relies on `fill="currentColor"`, masks to nothing. Author icons as opaque filled paths.
- **A `url()` that fails to resolve is silent.** Confirm in `dist/assets/*.css` that the reference
  resolved — either to a hashed file under `dist/assets/`, or, below Vite's `build.assetsInlineLimit`
  (`4096` bytes by default, read from `vite`'s own shipped `.d.ts`), inlined as a
  `data:image/svg+xml,…` URI directly in the CSS. Measured 2026-08-16: `close.svg` (273 B) and
  `circle.svg` (113 B) both inline — `dist/assets/` has no third file, only the JS and CSS bundles.
  Check the same way regardless: a resolved reference, of either shape, is fine; a broken path is
  silent.

## Never `:dir()` — the build turns it into a language test

Measured 2026-08-20 by building a two-line stylesheet and reading `dist/assets/*.css`. Lightning CSS
lowers `:dir(rtl)` rather than passing it through, and what it lowers to is not equivalent:

```css
/* written */   .x:dir(rtl) { … }
/* emitted */   .x:is(:lang(ae),:lang(ar),…,:lang(he),…,:lang(yi)) { … }
```

That selector matches on **language**, not direction. In this product those are deliberately
different things: a Hebrew dialogue line marked `dir="rtl"` inside an English UI would not match it,
and an element tagged `lang="he"` that renders LTR would. `:dir()` therefore compiles into exactly
the "Hebrew mode" conflation `plan/15` names as its first trap.

`:dir()` is also outside the floor on its own account —
`dir-pseudo  widely  OUTSIDE floor | blocked by: chrome 120, chrome_android 120, edge 120` — but the
lowering is the reason to avoid it, not the support. **Use `[dir='rtl']`**, which is emitted
untouched and keys off the attribute that actually carries direction.

The corollary: direction-dependent styling belongs on the attribute, and everything else belongs in
logical properties, which need no direction selector at all. `src/**/*.css` currently contains **zero**
physical `margin-left`/`padding-right`/bare `left:`/`right:` declarations and no `scaleX(`; keep it
that way, because retrofitting them across a finished UI is the week `plan/15` exists to avoid.

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

## A control's boundary is held to 3:1, a panel's is not

WCAG 2.2 SC 1.4.11 (AA) asks for 3:1 on *the visual information required to identify a user
interface component*. A card edge is grouping; the outline of an input is the only thing saying
where the input is. The two are not the same token any more.

- **`--color-border-control`** is the resting boundary of `Button`, `Input` and `Select`, and it is
  the one that has to clear 3:1.
- **`--color-border`** stays where it was and keeps drawing panels, cards, dialogs and dividers.
- **`--color-border-strong`** is the hover step and was moved further out so hover is still visibly
  stronger than rest — in light mode that means *darker*, in dark mode *lighter*, which is why the
  two ends of the `light-dark()` pair move in opposite directions.

Measured 2026-08-21 in Chrome on the running app, by resolving each token to sRGB through a canvas
and computing the WCAG relative-luminance ratio — not by converting `oklch()` by hand:

| pairing | light | dark |
| ------- | ----- | ---- |
| old `--color-border` vs canvas | 1.27 | 1.57 |
| old `--color-border-strong` vs canvas | 1.84 | 2.57 |
| `--color-surface-raised` vs canvas | 1.06 | 1.10 |
| new `--color-border-control` vs raised | 3.55 | 3.29 |
| new `--color-border-strong` vs raised | 6.34 | 5.80 |

The middle row is why the first row mattered: the raised fill is 1.06 against the page, so the
border was carrying the entire job of showing where a control was, at a quarter of the required
contrast.

Two things this deliberately does **not** claim. A `ghost` button still has a transparent border and
is identified by its text, which is outside 1.4.11. And a disabled control keeps
`--color-border-subtle`, because the criterion exempts inactive components.

Read the ratio out of the browser, never off a swatch. `oklch()` lightness is not luminance, and two
tokens one percent apart in `L` are not one percent apart in contrast.

## Before claiming a CSS change works

`yarn build` proves it compiles, not that it renders. Run `yarn dev`, look at the component with real
data in it, and check both the narrow breakpoint and `dir="rtl"`. If the change touched a feature near
the floor, say which browser is the binding constraint and how you know.

`vite preview` binds `[::1]`, not `127.0.0.1` — measured 2026-08-15. A curl at the IPv4 loopback
fails with a connection refused that reads exactly like a build that produced nothing.
