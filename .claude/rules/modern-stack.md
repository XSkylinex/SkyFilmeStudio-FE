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
- **Never call `setState` synchronously in an effect body.** It cascades renders. Drive the change
  from the thing that caused it, or bump a nonce the effect depends on — and most often the value is
  derived, so derive it during render and let the compiler pay for it.
  **Corrected 2026-08-17: nothing enforces this.** An earlier version of this line claimed
  `react/react-compiler` flags it. Measured on `src/shell/production-shell/index.tsx`, which called
  two setters synchronously inside a `useEffect` body: the rule is enabled as `"error"` in
  `.oxlintrc.json` and `yarn oxlint <that file>` still exited **0**. Review is the only thing that
  catches this shape, so do not read a green lint as evidence that it is absent.
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
`node_modules/typescript/` (the Go binary lives under its `bin`/`lib`, not as `lib.*.d.ts` files).

- **Never add `baseUrl`** — removed in TS 7. Alias through `paths` alone.
- **`types` defaults to `[]`.** An ambient package (`vite/client`, `node`, `vitest/globals`) must be
  listed explicitly in the right tsconfig or its globals silently vanish. `tsconfig.app.json` lists
  `["vite/client"]` today; adding Vitest globals means adding to that array, not assuming.
- **`target` and `lib` are `ES2024` across both repos.** Measured 2026-08-15 with a probe compiled by
  this repo's own `tsc -b --force`: under `ES2024`, `Object.groupBy`, resizable `ArrayBuffer`
  (`new ArrayBuffer(8, { maxByteLength: 16 })`, `.resizable`), `String.prototype.isWellFormed` and
  `Promise.withResolvers` all type-check; under `es2023` the same file produced five `TS2550
  … Try changing the 'lib' compiler option to 'es2024' or later` errors. The negative control is what
  makes this a fact rather than a preference.
  **`DOM.Iterable` is deliberately absent.** It is a valid lib name in 7.0.2, but the probe showed
  `[...formData.keys()]` and `[...nodeList]` both type-check without it — `lib.dom` already carries
  those declarations. Add it only when a case that actually needs it appears.
- `module`/`moduleResolution` stay `esnext`/`bundler` for the app and `nodenext` for `vite.config.ts`;
  `node`, `node10` and `classic` were removed.
- `erasableSyntaxOnly` is on: **no enums, no parameter properties, no namespaces.** This is the one
  place the two repos diverge — the backend cannot enable it, because NestJS is built on decorator
  metadata and constructor parameter properties. Do not "align" them.
- Never import from `typescript`'s `./unstable/*` exports.
- Prefer `import type` / `export type` — `verbatimModuleSyntax` requires it.
- **`strict`, `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are all on** since
  `plan/00` (2026-08-15). `arr[i]` is `T | undefined`; bind and guard rather than asserting.
- **`paths` targets must be relative in TS 7** — `"@/*": ["./src/*"]`, with the leading `./`. Without
  it you get `TS5090: Non-relative paths are not allowed`, which is a confusing message for a missing
  two characters, and it fires in every config that `extends` the offending one.
- `tsconfig.test.json` extends `tsconfig.app.json`, overrides `include` to `["test"]`, and sets
  `types: ["vitest/globals", "node", "vite/client"]`. `vite/client` is not optional there — it is what
  declares `*.css` as a module, and a component test importing a component that imports a stylesheet
  fails without it.

## oxlint, not ESLint

**`typescript-eslint` is not an option on this stack, and this is measured rather than assumed.** Run
in the sibling backend repo on 2026-08-14 with `typescript-eslint@8.67.0` and `typescript@7.0.2`,
ESLint 10.8.1 aborted before linting a single file:

```text
Error: typescript-eslint does not support TS 7.0.
… see https://github.com/typescript-eslint/typescript-eslint/issues/10940
```

There is no ESLint config in this repo and adding one would not run.

- oxlint reads types through `tsgolint`. Its binding here is the unscoped
  `oxlint-tsgolint@7.0.2001`, **installed 2026-08-15**, and `"options": { "typeAware": true }` is set
  in `.oxlintrc.json`. So `typescript/no-floating-promises` and friends are real type-aware checks,
  not approximations — proven by a probe whose unawaited promise the rule caught. `typeAware` is a
  config key, not a CLI flag, and it sits alongside `typeCheck` in oxlint's own
  `configuration_schema.json` under `OxlintOptions`. Leave `typeCheck` off; `tsc` does that job.
- **Plugin names are a closed set.** `react-hooks` and `react-refresh` are **not** plugins: those
  rules live under `react` as `react/rules-of-hooks`, `react/exhaustive-deps` and
  `react/only-export-components`. A `react-hooks/*` rule *name* still resolves — oxlint normalises it
  — but listing `react-hooks` in `plugins` is a config error.
- Verify a rule exists before adding it. An unknown rule fails config parsing outright, which reads as
  "the linter is broken" rather than "that rule is misspelled".
- **Always invoke it as `yarn oxlint`.** Running the bin outside the package manager's resolution fails with
  `Cannot find module './oxlint.darwin-arm64.node'` — the binding only resolves through Yarn's loader.
- **Nine plugins and eleven rules** since `plan/00` (2026-08-15): `eslint`, `react`, `typescript`,
  `oxc`, `import`, `jsx-a11y`, `promise`, `unicorn`, `vitest`. Setting `plugins` *overwrites* the base
  set, so `eslint` is listed explicitly — drop it and the core rules go silent.
  Three of the rules exist to enforce `code-style.md` mechanically rather than by review:
  `import/no-default-export`, `func-style: ["error", "expression"]` and
  `typescript/no-non-null-assertion`. `vite.config.ts` and `vitest.config.ts` are the only files
  exempted from the first, via `overrides`.
- The full valid plugin list, read out of `LintPluginOptionsSchema` in oxlint 1.78.0's
  `configuration_schema.json`: `eslint`, `react`, `unicorn`, `typescript`, `oxc`, `import`, `jsdoc`,
  `jest`, `vitest`, `jsx-a11y`, `nextjs`, `react-perf`, `promise`, `node`, `vue`. Nothing else.

## Vite 8

Everything below was read out of `vite@8.2.1`'s shipped `index.d.ts` and `package.json` on
**2026-08-14**, read from `node_modules/vite/`. Re-read after an upgrade rather
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
- **`resolve.tsconfigPaths: true` is set, and it is verified.** It defaults to `false` (confirmed in
  the `.d.ts`, `@default false`); `plan/00` turned it on 2026-08-15 and proved it on *both* resolvers,
  which was the condition for choosing it: `@/App` resolves in `yarn build` and in `yarn test`. There
  is no `resolve.alias` anywhere and there must not be one — `paths` in `tsconfig.app.json` is the
  single source of truth, and `vitest.config.ts` inherits it by `mergeConfig`-ing `vite.config.ts`.
  `src/main.tsx` imports `@/App` deliberately rather than `./App.tsx`, so every build exercises the
  alias instead of leaving it proven once and then untested.

## Vitest

Installed 2026-08-15 by `plan/00`: **4.1.10** (registry `latest`, published 2026-07-06), with
`jsdom@30.0.1`, `@testing-library/react@16.3.2`, `@testing-library/user-event@14.6.3` and
`@testing-library/jest-dom@7.0.1`. `5.0.0` was still `rc` and was declined — a test runner is the
worst place to run a release candidate.

**`vitest.config.ts` does not re-declare anything.** It `mergeConfig`s `vite.config.ts` and adds only
the `test` block, so the React Compiler pass and the `@/` alias have exactly one definition. A second
copy is the drift that makes `typecheck` pass while `test` fails on the same import.

**MSW is not installed.** The decision to mock at the HTTP boundary stands, but it lands in FE-04
with the first real fetcher — until BE-01 publishes a contract there is nothing to mock and no way to
prove a handler works.

## Yarn 4

Yarn 4.18.0, Node 26.7.0, **`nodeLinker: node-modules`** — `node_modules/` exists and is how
resolution works. (This repo was briefly on PnP; if a doc tells you to `unzip` out of the Yarn cache,
it is stale — read `node_modules/` directly.)

- **`.yarnrc.yml` exists and `npmMinimalAgeGate: 3d` is ON** (corrected 2026-08-15 — an earlier
  version of this file said there was no `.yarnrc.yml`). `yarn add` refuses a version published
  inside the window; pick the newest that clears the gate rather than disabling it. Measured while
  installing the test stack: `@testing-library/user-event@14.6.4` and `rolldown@1.2.4` were both two
  days old and blocked, so `14.6.3` and `~1.2.1` were used. Note the gate applies to what `yarn add`
  *resolves*, not to a range already pinned in `yarn.lock` by a transitive dependency.
- `npx` and `npm view` fail on this machine (`~/.npm/_cacache` is root-owned, `EACCES`). Run tools
  through the repo's own `yarn`.
- `yarn dlx` in a directory with no `packageManager` field re-downloads Yarn through Corepack and
  waits on a prompt. Don't reach for it in scripts.
- To read a file inside a dependency, read it straight out of `node_modules/`.
