---
description: The document shell — index.html and public/ — and what "SEO" honestly means for an application that only ever runs on 127.0.0.1.
paths:
  - "index.html"
  - "public/**"
---

# The document shell (`index.html`, `public/`)

`index.html` is the entire non-JavaScript surface of this app. Everything else arrives as a module
`<script>`. **No linter, type-check or test in the gate reads this file** — oxlint has no HTML plugin
— so a broken meta tag, a missing asset and a duplicated `<title>` all ship green.

## Read this before adding a single `og:` tag

**This UI is served from `127.0.0.1`. No crawler will ever see it.** Local AI Studio is a local-only
application: `LOCAL_ONLY=true`, the orchestrator binds to loopback, and the whole point of the product
is that nothing leaves the machine. Adding `og:image`, `twitter:card`, `canonical`, `robots.txt`,
`sitemap.xml` or JSON-LD to this document is **decoration that will never execute**. Do not do it, and
do not let a request for "SEO" turn into that work by reflex.

What "getting the document right" actually means here — every item below is real, and none of it is
about ranking:

| Concern | Why it matters *in this app* | Status today |
| ------- | ---------------------------- | ------------ |
| `<html lang>` / `dir` | Hebrew is a first-class production language. The shell must be able to flip to `dir="rtl"`. | `lang="en"`, no `dir`, no mechanism |
| `<title>` | It is the window/tab name the user reads while three Studio tabs are open. | `skyfilmestudio-fe` — a package name, not a title |
| `color-scheme` | Prevents the white flash before CSS loads. | declared in `index.css`, not in the head |
| `theme-color` | Titlebar tint if this is ever wrapped as a desktop/installed app. | absent |
| favicon / app icons | Tab identity across several open Studio views. | `/favicon.svg` **exists** in `public/` and resolves |
| `<noscript>` | The whole app is a blank `<div id="root">` without JS. A user with a broken bundle deserves a sentence, not a white page. | absent |
| viewport | Already correct. | present |
| `<link rel="preload">` for the first media | Shot Review loads video/contact sheets; the shell can hint the first ones. | not applicable yet |

`public/` is copied to the root of `dist/` verbatim — that is where `favicon.svg` and `icons.svg` live
and where any future icon set goes.

**If a public marketing or documentation site is ever built for this project, it is a different
surface with a different `index.html`,** and that is where crawler directives, structured data and
social cards belong. Say so plainly rather than implying meta tags on the Studio will produce search
results.

## Performance targets are measured, not asserted

Core Web Vitals thresholds, each at the **75th percentile**:

| Metric | Good |
| ------ | ---- |
| LCP | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.1 |

FID is retired — INP replaced it. The set has changed twice, so re-check `web.dev/articles/vitals`
through the `newest` skill before quoting a number rather than trusting this table.

These still matter on localhost, for a specific reason: **INP and CLS are the two the Studio will
actually fail.** A render queue that re-renders on every WebSocket frame blows INP; a storyboard strip
whose thumbnails arrive without reserved boxes blows CLS. LCP is the easy one here because the server
is on the same machine — which is exactly why nobody will notice the other two unless they are
measured. Use the DevTools performance panel with the queue running, not a Lighthouse score on an idle
page.

For this app specifically: **keep heavy route bundles behind `lazy` + `Suspense`.** Video players,
waveform rendering and any timeline canvas belong in a lazily-loaded route, not in the entry chunk.
The dashboard is what should paint first.

## Rules for editing this file

- **One `<title>`.** Make it name the application, not the package: `Local AI Studio`, and let the
  route append its own context.
- **The `lang`/`dir` pair is set from application state, not hard-coded**, once the interface language
  is selectable. Until then leave `lang="en"` and do not invent a mechanism.
- **A referenced asset must exist in `public/`.** Both current references resolve; keep it that way,
  because a 404 favicon fails silently forever.
- Keep the module `<script>` at the end of `<body>` and typed `module` — it is what Vite rewrites.
- **Never guess a meta tag's status.** Tags have been retired before (`keywords` does nothing). Check
  through the `newest` skill before adding one.

## Verifying

`yarn build && yarn preview`, then read the **served** HTML — not the source — because Vite rewrites
asset paths. Confirm every referenced file returns 200 before saying the shell is correct.
