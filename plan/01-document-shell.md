# FE-01 — Document shell & app identity

> **Depends on:** 00 · **Blocks:** 02 · **Backend needs:** — · **Plan authority:** §39
> **Status:** done 2026-08-15

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

- [x] `<title>` is `Local AI Studio`, not a package name — one `<title>` in the **served** output, and
      the browser tab reads `Local AI Studio`
- [x] `lang`/`dir` are set from one place the shell owns — `src/shell/document-language.constants.ts`
      holds the values, `src/shell/helpers/apply-document-language.ts` is the only writer,
      `src/main.tsx` calls it once at boot. `index.html` carries the same pair as its pre-JavaScript
      paint defaults; that is a real duplicate, and it is held in step by
      `test/shell/document-shell-defaults.test.ts` rather than by a comment. It is not a second owner
      because the shell overwrites both before any app content paints — **not** because nothing reads
      them back, which is false: CSS reads `<html dir>` continuously.
- [x] `<noscript>` present and verified with JS disabled — loaded the built page in a sandboxed frame
      with no `allow-scripts`, a real scripting-disabled render. The frame's opaque origin also
      blocked the `crossorigin` stylesheet, so this proved the **harder** case: legible with no CSS
      at all. See the boot-fallback note below — `<noscript>` alone did not satisfy the rule this
      step exists for.
- [x] `theme-color` present — two tags gated on `prefers-color-scheme`, values read out of
      `src/index.css` (`--bg: #fff` light, `#16171d` dark). See the note below: this is deliberate
      progressive enhancement, not a supported feature.
- [x] both `public/` assets return 200 from the **served** build — and `image/svg+xml`, checked
      against a deliberately-missing path that returns `text/html` from the SPA fallback. A 200 alone
      proves nothing here.
- [x] no `og:`, `twitter:`, `canonical`, `robots.txt`, `sitemap.xml` or JSON-LD was added — 0 matches
      in the served output, also checked for `keywords`, `rel="preload"` and `name="color-scheme"`
- [x] the module script is last and typed `module` — last in `<body>` in the source. Vite hoists it
      into `<head>` as a hashed `crossorigin` module in the build; that rewrite is Vite's, and it is
      exactly why this phase says to read the served file rather than the source.

## `theme-color` is outside the floor, and shipped anyway

Checked 2026-08-15, not recalled:

```text
node .claude/skills/newest/scripts/floor-check.mjs meta-theme-color
meta-theme-color   limited  OUTSIDE floor | blocked by: chrome none, edge none, firefox none, firefox_android none
```

`webstatus.dev` lists implementations only for `chrome_android`, `safari` and `safari_ios`; there is
no desktop Chrome/Edge/Firefox entry, and where Chromium honours it at all it is for **installed
PWAs, not a normal tab**. So it does nothing today.

It ships regardless, because the three-question test in the `newest` skill ends with *is the page
whole without it* — and it is. An unrecognised `<meta name>` is silently ignored with zero side
effects, and decision 3 above says a desktop/installed wrapper is a plausible future. **This is
progressive enhancement, not a supported feature.** Do not cite it as evidence the titlebar is
tinted.

The colour values are duplicated from `src/index.css`, and
`test/shell/document-shell-defaults.test.ts` fails if the two disagree. Phase 02 replaces that
palette; the test is what will remind it to move these tags too.

## `<noscript>` was not enough, so there is also a boot fallback

`.claude/rules/html-seo.md` states the purpose as *"a user with a **broken bundle** deserves a
sentence, not a white page."* `<noscript>` does not do that. It renders only when scripting is
**disabled**; a bundle that 404s, fails to parse, or throws leaves scripting enabled, so `<noscript>`
stays hidden and the user gets a blank page — the exact failure the rule names.

So `<div id="root">` ships with a `#boot-fallback` paragraph, and a `<noscript><style>` in the head
hides it when scripting is off, so exactly one message appears in each case. React clears the root on
its first render, so a healthy load removes it with no extra code.

Verified in a browser, all three states:

| State | Result |
| ----- | ------ |
| healthy load | React clears `#boot-fallback`; `.app-placeholder` mounts |
| bundle broken (renamed the emitted JS so the module request returned HTML) | fallback stays, message visible — previously a blank page |
| scripting disabled (sandboxed frame, no `allow-scripts`) | only the `<noscript>` message; fallback hidden, no duplicate |

The message is worded to be true in both of the states it can be seen in — it says the app *is
starting*, and that the message persisting means the bundle failed. A boot fallback that asserts an
error outright would flash a lie on every healthy load.

## Handoff to phase 15

Three things FE-01 deliberately did not solve, recorded so phase 15 does not rediscover them:

- **The boot call is fire-once, and `plan/15` requires flipping `dir` without a reload.**
  `src/main.tsx` calls `applyDocumentLanguage` once before `createRoot().render()`. That cannot
  service a language switcher rendered inside React. Phase 15 adds a shell-level subscriber and
  demotes or removes the boot call — the helper's signature is already right, the invocation model is
  not. `plan/15` §1 also expects phase **03** to have shaped this, so it is not purely FE-15's.
- **`applyDocumentLanguage(language, direction)` accepts an incoherent pair.** `('he', 'ltr')`
  type-checks. Deriving direction from language would have meant inventing the mechanism, which step
  2 forbids here — but a language picker is exactly where that pair gets mismatched.
- **"Do not touch `index.html`" means do not add a second literal `lang`/`dir` value.** It does not
  mean the file is frozen. Once the language comes from a stored preference, the standard fix for a
  flash of wrong direction is a tiny synchronous script in `<head>` that reads it before first paint,
  and that is legitimate. There is no such flash today, because the write lands before any app
  content paints.

## Traps

- **Adding social/crawler tags because the task said "SEO".** Nothing will ever crawl `127.0.0.1`.
- **Checking the source file instead of the served one.** Vite rewrites paths; only `dist/` is real.
- **Hard-coding `lang="en"` in three places.** Phase 15 then has to find them all.
- **A `<meta name="color-scheme">` instead of the CSS declaration.** A build-time CSS transform never
  sees the HTML — `light-dark()` resolves only because `index.css` declares `color-scheme`. Do not move
  that declaration into the head.
