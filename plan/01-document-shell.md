# FE-01 — Document shell & app identity

> **Depends on:** 00 · **Blocks:** 02 · **Backend needs:** — · **Plan authority:** §39
> **Status:** not started

## Goal

`index.html` names and boots this application honestly, works without JavaScript long enough to say
so, and is ready to flip to `dir="rtl"`.

Small phase. It exists because nothing in the gate reads this file, so it never gets done otherwise.

## Read this before adding a meta tag

**This UI is served from `127.0.0.1`. No crawler will ever see it.** Do **not** add `og:`, `twitter:`,
`canonical`, `robots.txt`, `sitemap.xml` or JSON-LD. That is decoration that will never execute, and
"add SEO" must not become that work by reflex. If a public marketing or documentation site is ever
built, it is a different surface with a different `index.html`.

`.claude/rules/html-seo.md` has the full reasoning.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | App name in the title | — | **`Local AI Studio`**. It currently says `skyfilmestudio-fe`, a package name. Routes append their own context. |
| 2 | Theme | system-following vs an explicit toggle | **System-following now** (`color-scheme: light dark` is already declared in `index.css`), toggle later if wanted. A media review tool arguably wants a fixed dark surface — decide in phase 02, not here. |
| 3 | Installable / desktop wrapper | now vs later | **Later.** A manifest and `theme-color` cost nothing now, but do not build an install flow. |

## Steps

### 1. Title and identity

One `<title>`: `Local AI Studio`. The route layer appends context (`Shot Review · Local AI Studio`).
This is the tab label a user reads with three Studio views open — make it distinguishable.

### 2. `lang` and `dir`

Keep `lang="en"` for now, but **route both attributes through a single place** in the shell so phase 15
can set them from application state without touching `index.html`. Do not invent the mechanism here;
just do not hard-code them in a way that fights it.

### 3. `<noscript>`

The entire app is `<div id="root">` without JavaScript. Add one sentence explaining that, so a user
with a broken bundle sees something rather than a white page.

### 4. `theme-color`

Add it, matching the resolved background. It tints the titlebar if this is ever wrapped as a desktop or
installed app — which, for a local-only studio tool, is a plausible future.

### 5. Icons

`/favicon.svg` and `/icons.svg` exist in `public/` and resolve — **verified 2026-08-14**. Keep them
that way; a 404 favicon fails silently forever. `public/` copies verbatim to the root of `dist/`.

### 6. Keep the module script last

At the end of `<body>`, `type="module"`. That is what Vite rewrites.

### 7. Do not preload anything yet

There is nothing to preload. Once Shot Review exists (phase 12), revisit whether the shell should hint
the first media — but a `preload` for an asset that does not exist is a wasted request and a warning.

## Verification

```bash
yarn build && yarn preview
```

Then **read the served HTML, not the source** — Vite rewrites asset paths, so the source file is not
what shipped. Confirm:

- every referenced asset returns **200** (check the favicon specifically);
- exactly one `<title>`;
- `<noscript>` renders when JavaScript is disabled — actually disable it and look;
- setting `dir="rtl"` on `<html>` in devtools does not break the shell.

## Done when

- [ ] `<title>` is `Local AI Studio`, not a package name
- [ ] `lang`/`dir` are set from one place the shell owns
- [ ] `<noscript>` present and verified with JS disabled
- [ ] `theme-color` present
- [ ] both `public/` assets return 200 from the **served** build
- [ ] no `og:`, `twitter:`, `canonical`, `robots.txt`, `sitemap.xml` or JSON-LD was added
- [ ] the module script is last and typed `module`

## Traps

- **Adding social/crawler tags because the task said "SEO".** Nothing will ever crawl `127.0.0.1`.
- **Checking the source file instead of the served one.** Vite rewrites paths; only `dist/` is real.
- **Hard-coding `lang="en"` in three places.** Phase 15 then has to find them all.
- **A `<meta name="color-scheme">` instead of the CSS declaration.** A build-time CSS transform never
  sees the HTML — `light-dark()` resolves only because `index.css` declares `color-scheme`. Do not move
  that declaration into the head.
