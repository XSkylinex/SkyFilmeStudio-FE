---
name: gate
description: Run the full verification gate before claiming work is done — typecheck, lint, test, build — and interpret what each stage catches and what all four are blind to. Invoke when asked to "verify", "check", "run the gate", or before reporting a task complete.
allowed-tools: Read, Edit, Grep, Glob, Bash(yarn typecheck*), Bash(yarn lint*), Bash(yarn test*), Bash(yarn build*), Bash(yarn vitest*), Bash(yarn oxlint*), Bash(yarn tsc*), Bash(yarn vite*), Bash(yarn preview*), Bash(node .claude/skills/newest/scripts/*)
---

# gate — prove it before you claim it

Four stages, in this order. Each catches a class the others are blind to; none is redundant.

```bash
yarn typecheck   # tsc -b, TypeScript 7 native
yarn lint        # oxlint, type-aware through tsgolint
yarn test        # vitest run
yarn build       # tsc -b && vite build
```

Run them and **paste the real output**. "Should pass" is not a result.

## Two of those scripts do not exist yet

Verified in `package.json` on 2026-08-14. The scaffold ships only:

```json
"dev": "vite", "build": "tsc -b && vite build", "lint": "oxlint", "preview": "vite preview"
```

So today the working gate is:

```bash
yarn lint            # oxlint — 3 plugins, 2 rules. Thin.
yarn build           # this is what actually type-checks, via `tsc -b`
```

`plan/00-toolchain.md` adds `typecheck`, `test`, `lint:fix` and widens the oxlint plugin set. Until it
lands, **say that `yarn typecheck` does not exist** rather than reporting a stage you did not run.
Reporting four green stages when two scripts are missing is the exact failure this skill exists to
prevent.

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

For that layer the verification is `yarn build && yarn preview`, reading the **served** HTML rather
than the source, and looking at the page with real data in it. Never report "the gate passes" as if it
covered these — name what you looked at instead.

## Reading the output

- **No output from `yarn lint` means clean.** oxlint prints nothing on success, which looks like a
  crash if you expect a summary. Confirm with `echo $?` if unsure.
- `Failed to parse oxlint configuration file` is a **config** error, not a code error — usually an
  unknown rule or an invalid plugin name in `.oxlintrc.json`. The message names it. Do not "fix" the
  source. Remember `react-hooks` is not a valid plugin name; those rules live under `react`.
- **Always invoke oxlint as `yarn oxlint`.** Running the binary from `.yarn/unplugged/` directly fails
  with `Cannot find module './oxlint.darwin-arm64.node'` — the native binding only resolves through
  Yarn's loader. That error is about invocation, not about a broken install.
- A `react(react-compiler)` error is real: the compiler cannot safely memoise that component and will
  bail out on it. Fix the purity violation; do not suppress it.
- `Some chunks are larger than 500 kB` from `vite build` is a warning, not a failure — but in this app
  it is usually a genuine signal that a media/timeline route stopped being lazily loaded. The fix is a
  dynamic `import()`, not a raised threshold.
- **`yarn install` warns `doesn't provide rolldown (p29b489), requested by @rolldown/plugin-babel`.**
  Observed 2026-08-14. It is an unmet optional peer — Vite depends on `rolldown` itself, so the plugin
  resolves it in practice and the build succeeds. Known, not yours to fix mid-task; `plan/00` decides
  whether to add the explicit peer.
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
