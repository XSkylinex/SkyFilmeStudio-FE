# FE-00 — Toolchain & repository hardening

> **Depends on:** — · **Blocks:** everything · **Backend needs:** — · **Plan authority:** §4.1.1, §4.6
> **Status:** not started

## Goal

The repository type-checks, lints, tests and builds — for real — and its layout matches this project's
rules rather than the `create-vite` starter's. When this is done, `yarn typecheck`, `yarn lint`,
`yarn test` and `yarn build` all exist, all run, and all pass.

Nothing product-specific is built here. This is the phase that makes every later phase verifiable.

## Why it is first

Verified in this repository on **2026-08-14**. `package.json` ships exactly:

```json
"dev": "vite", "build": "tsc -b && vite build", "lint": "oxlint", "preview": "vite preview"
```

There is **no `typecheck` and no `test`**. `yarn build` is the only thing that type-checks, and there
is no test runner at all. `.oxlintrc.json` enables three plugins (`react`, `typescript`, `oxc`) and two
rules — so there is no accessibility net, no floating-promise check and no import-cycle check.

`src/` is the untouched starter: `function App()`, `export default App`, and
`document.getElementById('root')!` — a non-null assertion, a default export and a `function`
declaration, all three of which this project forbids.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Test runner | Vitest 4.x | **4.1.10** was `latest` on 2026-08-14 with `5.0.0` still `rc`. Install 4.x — a test runner is the worst place to run a release candidate. Re-check with the `newest` skill before adding. |
| 2 | DOM environment | `jsdom` vs `happy-dom` | Start with `jsdom`; switch only if measured faster on this suite. |
| 3 | Alias mechanism | (a) mirror `paths` in every config, (b) `resolve.tsconfigPaths: true` | **(b) if verified.** The option exists in Vite 8.2.1 (`@default false`, confirmed in the shipped `.d.ts`). It must be proven by running **both** a build and the test suite — the two resolvers have been observed to disagree. Until proven, (a), edited everywhere together. |
| 4 | HTTP mocking | MSW vs Vitest fetch mocking | **MSW.** Mock at the HTTP boundary, not by stubbing query hooks — stubbing hooks tests the mock. |
| 5 | Formatter | Prettier vs none | **Prettier**, sharing the backend's config, so the two repos read the same. |

## Steps

### 1. Widen oxlint

Add the plugins that map to failures this app will actually have:

- **`jsx-a11y`** — approve/reject controls need labels, and there is no other net;
- **`promise`** and `typescript/no-floating-promises` — a fire-and-forget mutation that silently drops;
- **`import`** with `no-cycle` — feature slices reaching sideways;
- **`unicorn`** — the general hygiene set;
- **`vitest`** once tests exist.

Keep `react/rules-of-hooks` and `react/only-export-components`, and add `react/exhaustive-deps` and
`react/react-compiler`. Enable type-aware mode:

```json
{ "options": { "typeAware": true } }
```

**`react-hooks` is not a valid plugin name** — those rules live under `react`. An unknown rule fails
config parsing outright, which reads as "the linter is broken".

### 2. Tighten TypeScript

`tsconfig.app.json` already has `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`,
`verbatimModuleSyntax` and `noFallthroughCasesInSwitch`. Add:

```text
strict: true
noUncheckedIndexedAccess: true
exactOptionalPropertyTypes: true
paths: { "@/*": ["src/*"] }
```

Keep `erasableSyntaxOnly` on — the frontend can, the backend cannot (NestJS needs decorators and
parameter properties). **Do not "align" the two tsconfigs.**

Never add `baseUrl` — removed in TS 7. Remember `types` defaults to `[]`: `tsconfig.app.json` lists
`["vite/client"]` today, and test globals go in a new `tsconfig.test.json`, not here.

Fix the resulting errors in **one pass**.

### 3. Replace the starter files

- `main.tsx` — `document.getElementById('root')!` becomes a real null check that throws a useful
  message. The non-null assertion is banned and this is the one instance of it in the repo.
- `App.tsx` — `function App()` + `export default` becomes `export const App = (): ReactElement =>`.
- Delete the starter's demo markup, `src/assets/react.svg`, `vite.svg`, `hero.png` and the styles that
  reference them. Keep `public/favicon.svg` and `public/icons.svg`.

### 4. Add Vitest and the test tree

```text
test/                      mirrors src/ — nothing under src/ is a test
  setup.ts                 RTL cleanup, MSW server lifecycle
tsconfig.test.json         extends the root; include ["test"]; types ["vitest/globals", "node"]
vitest.config.ts           jsdom, setupFiles, and the alias (see decision 3)
```

Write one real test immediately — a helper with an assertion that fails when the helper is broken —
and **prove it fails**. A suite that runs zero tests looks exactly like a passing suite.

### 5. Scripts

Add `typecheck` (`tsc -b --noEmit` or `tsc -b`), `test`, `test:watch`, `test:cov`, `lint:fix`,
`format`, `format:check`.

**No command text goes into any `.ts`/`.tsx` file**, including comments. Scripts, `.claude/skills/` and
`plan/` are where commands live.

### 6. Guard against external assets

The product's promise is that nothing leaves the machine, and the frontend is where that gets broken
quietly. Add a build-time assertion that **no absolute external URL survives into `dist/`** — scan the
emitted JS and CSS for `http://` / `https://` hosts that are not loopback, and fail the build.

This is cheap and it is the only automated defence against someone adding a Google Font.

### 7. Cross-platform hygiene

`.gitattributes` (`* text=auto eol=lf`), `.editorconfig` (UTF-8, LF, final newline). Repository scripts
in TypeScript/Node, never Bash — both workstations are first-class (§4.1.1).

### 8. `.gitignore`

Extend for: `.env*` (except `.env.example`), `coverage/`, `.vitest/`, and any local media fixtures.
**Private photographs, videos and voice references never enter Git** (§4.6).

### 9. Git init, identity and remote

**This repository is not a git repository yet.** Initialise it, then:

```text
remote origin  https://github.com/XSkylinex/SkyFilmeStudio-FE.git
author         Alex Moshinsky <alex1mosh@gmail.com>
```

**No `Co-Authored-By:` trailer for any assistant, and no generated-with footer** — Alex is the author
of every commit.

## Verification

```bash
yarn install
yarn typecheck        # must exist and pass
yarn lint             # oxlint; no output means clean — confirm with echo $?
yarn test             # must run at least one real test, and pass
yarn build
yarn preview          # then read the SERVED html, not the source
```

Paste the real output of each.

## Done when

- [ ] `yarn typecheck` and `yarn test` exist, run, and pass
- [ ] oxlint runs with `jsx-a11y`, `promise`, `import`, `unicorn` and type-aware mode, and **fails on a
      deliberately broken file** (prove it)
- [ ] `strict` + `noUncheckedIndexedAccess` on, with the fallout fixed
- [ ] no `export default`, no `function` declaration, and no `!` assertion in `src/`
- [ ] the starter demo and its assets are gone; `favicon.svg` and `icons.svg` still resolve
- [ ] `test/` exists, mirrors `src/`, and contains one test proven to have teeth
- [ ] `@/` resolves in `src`, in `test`, in a build, and in the test run
- [ ] the build fails if an external URL reaches `dist/` (prove it by adding one)
- [ ] `.gitattributes`, `.editorconfig`, extended `.gitignore` committed
- [ ] git initialised, remote set, author is Alex Moshinsky, first commit exists

## Traps

- **`yarn add` may refuse a package.** `npmMinimalAgeGate: 3d` is set in `.yarnrc.yml`. Pick the newest
  version older than three days; do not disable the gate.
- **Never run `npm` or `npx`.** `~/.npm/_cacache` is root-owned on this machine; both fail `EACCES`,
  which reads as "package not found".
- **Invoke oxlint as `yarn oxlint`.** Running the binary directly fails with
  `Cannot find module './oxlint.darwin-arm64.node'`.
- **`yarn install` warns `doesn't provide rolldown (p29b489), requested by @rolldown/plugin-babel`.**
  Known, observed 2026-08-14 — an unmet optional peer; Vite depends on `rolldown` itself and the build
  succeeds. Decide here whether to add the explicit peer, and record the decision.
- **Prove the linter and the suite have teeth.** A misconfigured oxlint matching no files, and a Vitest
  config matching no tests, both look exactly like success.
