---
description: TypeScript 7 / React 19.2 / Vite 8 / oxlint idioms that are decisions in this stack rather than defaults.
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "vite.config.ts"
  - "vitest.config.ts"
---

# Modern stack idioms

Everything below is a choice this stack forces. Do not reach for a "newest feature" that is not
listed, and do not port a pattern from a React 18 / Vite 5 / TS 5 codebase without checking it here.

Every version-shaped fact carries the date it was measured. When your lookup disagrees with a number
here, **your lookup is right and this file is stale** — fix the file. The `newest` skill is the
protocol for that.

## React 19.2 with React Compiler

`vite.config.ts` runs the compiler through `@rolldown/plugin-babel` with `reactCompilerPreset()`,
which is a real export of `@vitejs/plugin-react@6.0.5` (verified in its `.d.ts`, 2026-08-14). That
means the compiler is **on for every component**, and the following are consequences, not preferences.

- **No `useMemo`, no `useCallback`, no `memo`.** The compiler inserts memoisation; hand-written memo
  hooks are dead weight and get in its way. oxlint's `react/react-compiler` rule enforces the purity
  the compiler assumes — a violation is a *bailout*, meaning that component silently stops being
  optimised. Fix it; never suppress it.
- **A value needed by an effect goes inside the effect**, not into a `useCallback` above it. If it
  genuinely cannot move — an event handler needs it too — reach for `useEffectEvent`.
- **`useEffectEvent` is available and typed in 19.2.** It is the correct way to let an effect call the
  newest closure without listing it as a dependency. The older `const ref = useRef(cb); ref.current = cb`
  trick assigns during render, which `react/react-compiler` rejects and which tears under concurrent
  rendering. This matters more here than in most apps: the render-queue and shot-progress streams are
  long-lived WebSocket subscriptions whose handlers must see fresh props.
- **`useEffectEvent` results may not be returned or passed down.** Rules-of-hooks fails on it. A
  function that leaves the component is a plain arrow const.
- **Never call `setState` synchronously in an effect body.** It cascades renders and
  `react/react-compiler` flags it. Drive the change from the thing that caused it, or bump a nonce the
  effect depends on.
- **Never mutate a ref during render.** Refs are read and written in effects and event handlers only.
- An effect that returns a cleanup on one path must return `undefined` explicitly on the others —
  oxlint's `consistent-return` flags the mixed form.
- **Never claim a React API from memory.** 19.2 added `useEffectEvent`, `<Activity />` and the DevTools
  performance tracks, and it is easy to reach for something Server-Components-only or still canary.
  Check `react.dev/reference/react/<api>` *and* the registry, then say which you checked.

`<Activity />` is worth knowing about here specifically: the Storyboard and Shot Review pages hold
expensive media state that should survive a tab switch. Confirm its status through the `newest` skill
before building on it.

## TypeScript 7

`typescript@7.0.2` (registry `latest`, published 2026-07-08, verified 2026-08-14). It is the native Go
compiler and it only type-checks here — Vite emits. Its Go binary lives in
`.yarn/unplugged/@typescript-typescript-darwin-arm64-npm-7.0.2/`.

- **Never add `baseUrl`** — removed in TS 7. Alias through `paths` alone.
- **`types` defaults to `[]`.** An ambient package (`vite/client`, `node`, `vitest/globals`) must be
  listed explicitly in the right tsconfig or its globals silently vanish. `tsconfig.app.json` lists
  `["vite/client"]` today; adding Vitest globals means adding to that array, not assuming.
- `module`/`moduleResolution` stay `esnext`/`bundler` for the app and `nodenext` for `vite.config.ts`;
  `node`, `node10` and `classic` were removed.
- `erasableSyntaxOnly` is on: **no enums, no parameter properties, no namespaces.** This is the one
  place the two repos diverge — the backend cannot enable it, because NestJS is built on decorator
  metadata and constructor parameter properties. Do not "align" them.
- Never import from `typescript`'s `./unstable/*` exports.
- Prefer `import type` / `export type` — `verbatimModuleSyntax` requires it.
- `noUncheckedIndexedAccess` is **not** on in the scaffold. Turn it on in the first hardening phase
  (`plan/00-toolchain.md`) and fix the fallout then, not gradually.

## oxlint, not ESLint

**`typescript-eslint` is not an option on this stack, and this is measured rather than assumed.** Run
in the sibling backend repo on 2026-08-14 with `typescript-eslint@8.67.0` and `typescript@7.0.2`,
ESLint 10.8.1 aborted before linting a single file:

```text
Error: typescript-eslint does not support TS 7.0.
… see https://github.com/typescript-eslint/typescript-eslint/issues/10940
```

There is no ESLint config in this repo and adding one would not run.

- oxlint reads types through `tsgolint`. Its binding here is
  `@oxlint/tsgolint-darwin-arm64@7.0.2001` — built against TypeScript **7.0.2**. So
  `typescript/no-floating-promises` and friends are real type-aware checks, not approximations.
  Type-aware mode is a config key (`"options": { "typeAware": true }` in `.oxlintrc.json`), not a CLI
  flag; `typeAware` is present in oxlint's own `configuration_schema.json`.
- **Plugin names are a closed set.** `react-hooks` and `react-refresh` are **not** plugins: those
  rules live under `react` as `react/rules-of-hooks`, `react/exhaustive-deps` and
  `react/only-export-components`. A `react-hooks/*` rule *name* still resolves — oxlint normalises it
  — but listing `react-hooks` in `plugins` is a config error.
- Verify a rule exists before adding it. An unknown rule fails config parsing outright, which reads as
  "the linter is broken" rather than "that rule is misspelled".
- **Always invoke it as `yarn oxlint`.** Under PnP, running the unplugged binary directly fails with
  `Cannot find module './oxlint.darwin-arm64.node'` — the binding only resolves through Yarn's loader.
- The scaffold enables three plugins (`react`, `typescript`, `oxc`) and two rules. That is thin for
  this project; `plan/00-toolchain.md` widens it to include `jsx-a11y`, `promise`, `import` and
  `unicorn`, which is where the accessibility and floating-promise coverage comes from.

## Vite 8

Everything below was read out of `vite@8.2.1`'s shipped `index.d.ts` and `package.json` on
**2026-08-14** — under PnP, via `unzip -p` from `~/.yarn/berry/cache`. Re-read after an upgrade rather
than trusting this list, and note that Vite's JSDoc lags its implementation, so a sentence in the
prose is weaker evidence than the type next to it.

- **The renamed options are deprecated aliases, not removals.** `build.rollupOptions` is
  `@deprecated Use rolldownOptions instead` and still typed; `worker.rollupOptions` likewise; the
  `esbuild` option is `@deprecated Use oxc option instead`. A config copied from a Vite 5 project
  therefore **works silently and rots** — nothing errors. Write `build.rolldownOptions` and `oxc`.
- `build.commonjsOptions` is `@deprecated This option is no-op and will be removed`.
- **Defaults, quoted from the `.d.ts`:** `build.minify` → `'oxc'` for client, `false` for SSR
  (`boolean | 'oxc' | 'terser' | 'esbuild'`); `build.cssMinify` → `'lightningcss'`, but `false` when
  `build.minify` is off for the client; `build.cssTarget` → follows `build.target`; `css.transformer`
  → `'postcss'`. **Lightning CSS minifies; it does not transform** unless you opt in.
- **esbuild is an *optional* peer dependency and is not installed.** `vite@8.2.1` declares
  `esbuild` under `peerDependenciesMeta` as `optional`, and its real `dependencies` are exactly
  `lightningcss, picomatch, postcss, rolldown, tinyglobby`. Oxc lowers JS through Rolldown; there is
  no esbuild pass. Only `build.minify: 'esbuild'`, `build.cssMinify: 'esbuild'` or a
  `transformWithEsbuild` call would force it to be installed. **Any advice that assumes an esbuild
  step is describing a different project.**
- **The default browser floor is five entries, not four.** `build.target` defaults to
  `'baseline-widely-available'` and `build.cssTarget` follows it. The resolved constant is
  `["chrome111","edge111","firefox114","safari16.4","ios16.4"]`; the JSDoc omits `ios16.4`. Do not set
  `build.target` to match the TS `target` — they answer different questions, and pinning it usually
  *narrows* support. `.claude/rules/css.md` covers what the floor means for stylesheets.
- React Compiler runs via `@rolldown/plugin-babel` with `reactCompilerPreset()`. The preset carries its
  own rolldown filter and the plugin already skips `node_modules`, so it needs no `include`.
- **`resolve.tsconfigPaths` exists and defaults to `false`** (confirmed in the `.d.ts`,
  `@default false`). Setting it `true` in both `vite.config.ts` and `vitest.config.ts` collapses the
  alias into one source of truth — `paths` in `tsconfig.app.json`. Until that is done and *verified by
  running both a build and the test suite*, `resolve.alias` must mirror `paths` everywhere it appears.
  Change one, change all; nothing checks it for you, and the failure is asymmetric: `typecheck` passes
  on a drifted alias while `build` or `vitest` fails, and the two errors look unrelated.

## Vitest

Not installed yet. When it is added: registry `latest` was **4.1.10** on 2026-08-14, with
`beta=5.0.0-beta.7` and `rc=5.0.0-rc.1`. **Install 4.x.** Vitest 5 is not stable, and a test runner is
the worst place to run an RC.

## Yarn 4 / PnP

Yarn 4.18.0, Node 26.7.0, PnP linker, **no `node_modules`**.

- There is no `.yarnrc.yml`, so every Yarn setting is at its default — including `npmMinimalAgeGate`,
  which is therefore **off**. If it is ever switched on, `yarn add` will refuse a package published
  inside the window; pick the newest version that clears the gate rather than disabling it.
- `npx` and `npm view` fail on this machine (`~/.npm/_cacache` is root-owned, `EACCES`). Run tools
  through the repo's own `yarn`.
- `yarn dlx` in a directory with no `packageManager` field re-downloads Yarn through Corepack and
  waits on a prompt. Don't reach for it in scripts.
- To read a file inside a dependency, `unzip -p` it out of `~/.yarn/berry/cache`. `.yarn/unplugged/`
  holds only the packages with native binaries.
