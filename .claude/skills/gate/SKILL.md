---
name: gate
description: Run the full verification gate before claiming work is done — typecheck, lint, test, build — and interpret what each stage catches and what all four are blind to. Invoke when asked to "verify", "check", "run the gate", or before reporting a task complete.
allowed-tools: Read, Edit, Grep, Glob, Bash(yarn typecheck*), Bash(yarn lint*), Bash(yarn test*), Bash(yarn build*), Bash(yarn vitest*), Bash(yarn oxlint*), Bash(yarn tsc*), Bash(yarn vite*), Bash(yarn preview*), Bash(node .claude/skills/newest/scripts/*)
---

# gate — prove it before you claim it

Four stages, in this order. Each catches a class the others are blind to; none is redundant.

```bash
yarn typecheck   # tsc -b, TypeScript 7 native
yarn lint        # oxlint, type-aware — see below
yarn test        # vitest run
yarn build       # tsc -b && vite build
```

Run them and **paste the real output**. "Should pass" is not a result.

## All four scripts exist — corrected 2026-08-15

`plan/00-toolchain.md` landed. `package.json` now ships `typecheck`, `lint`, `lint:fix`, `test`,
`test:watch`, `test:cov`, `build`, `preview`, `format` and `format:check`, and all four gate stages
pass. The previous version of this section said `typecheck` and `test` did not exist; that is no
longer true, and reporting it would be the same failure in the opposite direction.

`yarn typecheck` is `tsc -b` across three projects — `tsconfig.app.json` (`src`),
`tsconfig.node.json` (`vite.config.ts`, `vitest.config.ts`, `build/`) and `tsconfig.test.json`
(`test`). All three write a `.tsbuildinfo` under `node_modules/.tmp/`, which is how you confirm a
project actually ran rather than being skipped.

## What each stage actually catches

| Stage | Catches | Blind to |
| ----- | ------- | ------- |
| `typecheck` | type errors, `noUncheckedIndexedAccess` violations, missing `import type`, contract drift against the backend Zod schemas | every rule below |
| `lint` | React Compiler purity, Rules of Hooks, floating promises, unused vars, Fast Refresh breakage, a11y attributes | type errors |
| `test` | behaviour — a duration formatter that compiles and returns the wrong minutes | anything rendered |
| `build` | Vite resolution, alias drift, real bundling, chunk size | runtime behaviour |

A green `tsc` says nothing about a hook called conditionally or a ref written during render. A green
oxlint says nothing about a type error. Neither notices that the approve button is wired to the reject
mutation. **All four, every time.**

## What all four stages are blind to

oxlint has **no CSS plugin and no HTML plugin**, `tsc` never opens either file type, and the test
runner never imports one. So a fully green gate says nothing at all about:

- `src/index.css`, `src/App.css` — a dead selector, a typo'd custom property, or a feature no browser
  in range supports. `.claude/rules/css.md` has the measured pipeline behaviour.
- `index.html` — a malformed meta tag or an asset that 404s. `.claude/rules/html-seo.md`.
- **RTL.** Hebrew is a first-class production language and nothing automated checks that the layout
  survives `dir="rtl"`. A `margin-left` compiles perfectly.
- Anything visual or temporal: whether a video plays, whether a 200-cell contact sheet is usable,
  whether the render queue re-renders sixty times a second.
- **Every rule in `.claude/rules/studio-domain.md`.** `yarn typecheck` will happily compile a `fetch`
  straight to ComfyUI.

One exception, added in `plan/00`: **`yarn build` now fails if any absolute non-loopback URL reaches
`dist/`.** `build/external-url-guard.ts` scans the written output — including `index.html` and
everything copied verbatim from `public/`, neither of which passes through the chunk graph. Two
prefixes are allowlisted because they are names rather than addresses and are never fetched:
`http://www.w3.org/` (XML namespaces) and `https://react.dev/errors/` (React's error decoder link).
Widen that list only with evidence that the URL cannot cause a request.

For that layer the verification is `yarn build && yarn preview`, reading the **served** HTML rather
than the source, and looking at the page with real data in it. Never report "the gate passes" as if it
covered these — name what you looked at instead.

## Reading the output

- **No output from `yarn lint` means clean.** oxlint prints nothing on success, which looks like a
  crash if you expect a summary. Confirm with `echo $?` if unsure.
- `Failed to parse oxlint configuration file` is a **config** error, not a code error — usually an
  unknown rule or an invalid plugin name in `.oxlintrc.json`. The message names it. Do not "fix" the
  source. Remember `react-hooks` is not a valid plugin name; those rules live under `react`.
- **Always invoke oxlint as `yarn oxlint`.** Running the bin outside the package manager's resolution
  fails with `Cannot find module './oxlint.darwin-arm64.node'` — the binding is a separate optional
  dependency. That error is about invocation, not a broken install.
- **`lint` IS type-aware.** Corrected again 2026-08-15, later the same day, after `plan/00` landed:
  `oxlint-tsgolint@7.0.2001` is installed and `"options": { "typeAware": true }` is set in
  `.oxlintrc.json`. Proven, not assumed — a probe with an unawaited promise produced
  `typescript(no-floating-promises)`, a rule that cannot exist without type information. The `lint`
  row in the table above is now real rather than aspirational.
- A `react(react-compiler)` error is real: the compiler cannot safely memoise that component and will
  bail out on it. Fix the purity violation; do not suppress it.
- `Some chunks are larger than 500 kB` from `vite build` is a warning, not a failure — but in this app
  it is usually a genuine signal that a media/timeline route stopped being lazily loaded. The fix is a
  dynamic `import()`, not a raised threshold.
- **The `doesn't provide rolldown … requested by @rolldown/plugin-babel` warning is gone.** Fixed in
  `plan/00`, 2026-08-15, by declaring `rolldown` in `devDependencies` at **`~1.2.1`** — deliberately
  the same range `vite@8.2.1` declares, not a pin. If you ever pin it to an exact version you will get
  two rolldown copies on different `@oxc-project/types`, one hoisted and one under `vite/`, which is
  worse than the warning. If the warning returns, that range has drifted from Vite's.
- **A failing test is not automatically broken code.** Before changing an implementation to satisfy a
  test, check that the assertion is right.

## Scoping while you iterate

`yarn oxlint src/features/<name>` lints one directory in well under a second. Use it in the inner
loop, then the full gate before reporting.

`yarn vitest <path>` runs one file. `yarn typecheck` has no useful scoping — it is a project build,
and it is fast (native Go); just run it.

## Before reporting

State which commands you ran and what they printed. If a stage fails, fix it and re-run rather than
reporting partial success. If you changed `tsconfig.app.json`'s `paths`, confirm the alias still
matches in `vite.config.ts` **and** `vitest.config.ts` — `typecheck` passes on a drifted alias while
`build` or `vitest` fails, and the two errors look unrelated.
