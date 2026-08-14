# Snapshot — verified 2026-08-14

**This file expires.** It is orientation, not authority. Every number below came from a command run
on 2026-08-14; re-run the lookup before acting on any of it. The protocol that does not expire is
[../SKILL.md](../SKILL.md).

## Installed vs registry

`node .claude/skills/newest/scripts/pkg-check.mjs --all`, 2026-08-14. Every dependency in this repo
was at registry `latest` on that date — there was no drift to report.

| Package | In repo | Registry latest | Published | Age |
| ------- | ------- | --------------- | --------- | --- |
| `typescript` | `^7.0.2` | 7.0.2 | 2026-07-08 | 37d |
| `react` / `react-dom` | `^19.2.8` | 19.2.8 | 2026-07-21 | 24d |
| `@types/react` | `^19.2.18` | 19.2.18 | 2026-07-30 | 14d |
| `@types/react-dom` | `^19.2.4` | 19.2.4 | 2026-07-30 | 14d |
| `vite` | `^8.2.1` | 8.2.1 | 2026-08-06 | 8d |
| `@vitejs/plugin-react` | `^6.0.5` | 6.0.5 | 2026-07-30 | 15d |
| `@rolldown/plugin-babel` | `^0.2.3` | 0.2.3 | 2026-04-13 | 123d |
| `babel-plugin-react-compiler` | `^1.0.0` | 1.0.0 | 2025-10-07 | 311d |
| `@babel/core` | `^8.0.1` | 8.0.1 | 2026-06-17 | 58d |
| `oxlint` | `^1.78.0` | 1.78.0 | 2026-08-10 | 4d |
| `@types/node` | `^26.2.0` | 26.2.0 | 2026-08-07 | 7d |

`typescript`'s other tags on that date: `next=7.1.0-dev.20260813.1`, `rc=7.0.1-rc`, `beta=6.0.0-beta`.
**7.0.2 is the newest stable.** Do not reach for `next`.

`babel-plugin-react-compiler@1.0.0` is 311 days old and that is not staleness — 1.0.0 is the stable
compiler release. Its `experimental` tag moves daily; ignore it.

## Not yet installed, needed by the plan

Looked up 2026-08-14, none of these are in `package.json` yet. Re-check before adding — these are the
numbers to compare against, not numbers to paste in.

| Package | Registry latest | Published | Note |
| ------- | --------------- | --------- | ---- |
| `vitest` | 4.1.10 | 2026-07-06 | `beta=5.0.0-beta.7`, `rc=5.0.0-rc.1` — 5.0 is **not** stable yet |
| `@tanstack/react-query` | 5.101.4 | 2026-07-21 | server-state layer |
| `@reduxjs/toolkit` | 2.12.0 | 2026-05-15 | studio/editor state |
| `react-redux` | 9.3.0 | 2026-05-15 | |
| `react-router` | 8.3.0 | 2026-07-22 | v8 line; `version-7=7.18.2` still tagged |
| `zod` | 4.4.3 | 2026-05-04 | must match the backend's zod major |
| `modern-normalize` | 3.0.1 | 2024-09-05 | dormant by design, not abandoned |

**`vitest` 5 is in RC.** `latest` is 4.1.10. Install 4.x; revisit when 5.0.0 has a stable tag.

## The browser floor

Read out of the shipped constant, not the JSDoc, 2026-08-14 against `vite@8.2.1`:

```text
ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET
  = ["chrome111", "edge111", "firefox114", "safari16.4", "ios16.4"]
```

Read it straight out of `node_modules` (the linker is `node-modules`):

```bash
grep -A8 BASELINE_WIDELY_AVAILABLE node_modules/vite/dist/node/chunks/node.js
```

Five browsers. The `build.target` JSDoc names four — it omits `ios16.4`.

## Feature checks run on 2026-08-14

`node .claude/skills/newest/scripts/floor-check.mjs …`

| Feature | Baseline | This repo | Blocked by |
| ------- | -------- | --------- | ---------- |
| `color-mix` | widely | **INSIDE** | — |
| `container-queries` | widely | **INSIDE** | — |
| `has` | widely | OUTSIDE | firefox 121 > 114 |
| `subgrid` | widely | OUTSIDE | chrome/edge 117 > 111 |
| `nesting` | widely | OUTSIDE | chrome 120, firefox 117, safari 17.2 |
| `light-dark` | newly | OUTSIDE | chrome 123, firefox 120, safari 17.5 |
| `view-transitions` | newly | OUTSIDE | firefox 144, safari 18 |
| `anchor-positioning` | limited | OUTSIDE | shipped in no browser in range |

Two of those are still usable because the build lowers them — see `.claude/rules/css.md` for which,
and for the measurement that establishes it. "OUTSIDE the floor" and "cannot be used" are different
claims.

`anchor-positioning` is the cautionary one: two years of demos and blog posts, and
`{"status":"limited"}` with no core browser shipping it. Shipping it because it *felt* current would
have broken every user.

## Toolchain facts measured on this machine, 2026-08-14

- **Node 26.7.0, Yarn 4.18.0, `nodeLinker: node-modules`.** `node_modules/` exists and is the
  resolution mechanism. `.yarnrc.yml` is committed and sets `npmMinimalAgeGate: 3d`, so the
  quarantine is **ON** — `yarn add` refuses anything published in the last three days.
  (Corrected 2026-08-15: this repo was briefly on PnP; several docs described that state.)
- **`npx` and `npm view` are unusable.** `~/.npm/_cacache` is root-owned; both fail `EACCES`. Use
  `yarn`, `yarn dlx`, or the scripts in this skill.
- **`yarn dlx` re-downloads Yarn through Corepack** in a directory with no `packageManager` field,
  and stalls on a confirmation prompt. Both repos now declare `packageManager: yarn@4.18.0`, so this
  applies to scratch directories, not to the repos themselves.
- **Always run oxlint as `yarn oxlint`.** Its native binding is a separate optional dependency
  (`@oxlint/binding-darwin-arm64`); invoking the bin directly outside the package manager's
  resolution failed with `Cannot find module './oxlint.darwin-arm64.node'`.
- **oxlint's type-aware engine is the unscoped `oxlint-tsgolint@7.0.2001`, and it IS installed here**
  (frontend, since 2026-08-15) — nominally built against TypeScript 7.0.2. Type-aware linting and
  TS 7 are compatible; `"typeAware": true` is a real key in `configuration_schema.json`.
- **`typescript-eslint` is not an option on this stack.** Measured in the sibling backend repo at
  `typescript-eslint@8.67.0` + `typescript@7.0.2`, ESLint 10.8.1 aborts before linting anything:
  `Error: typescript-eslint does not support TS 7.0.` Tracking issue: typescript-eslint#10940. This
  is why both repos lint with oxlint.

## Correction, 2026-08-15 (morning)

**oxlint's type-aware mode is NOT active in either repo.** The engine is the unscoped package
`oxlint-tsgolint` (7.0.2001, published 2026-07-21) — **not** `@oxlint/tsgolint`, which 404s on the
registry. It is not a dependency of `oxlint` (oxlint's only optional deps are its platform bindings),
it is **not installed here**, and `"options": { "typeAware": true }` is absent from `.oxlintrc.json`.
Enabling type-aware linting means installing it explicitly and turning the flag on — and verifying it
works against TypeScript 7, which has not been done.

## Superseded, 2026-08-15 (same day, after `plan/00`)

**In THIS repo, type-aware mode is now active and verified against TypeScript 7.0.2.**
`oxlint-tsgolint@7.0.2001` is installed and `"options": { "typeAware": true }` is set. Verified by
probe rather than by reading config: a file with an unawaited `Promise` produced
`typescript(no-floating-promises)`, a rule that cannot be evaluated without type information.

The correction above still stands **for the backend repo**, which was not touched.

Also installed here on 2026-08-15, all registry `latest` at the time unless noted:

| Package | Version | Note |
| ------- | ------- | ---- |
| `vitest`, `@vitest/coverage-v8` | 4.1.10 | 5.0 still `rc`; declined |
| `jsdom` | 30.0.1 | `happy-dom` not measured — suite too small to mean anything |
| `@testing-library/react` | 16.3.2 | required peer `@testing-library/dom@^10` installed explicitly |
| `@testing-library/user-event` | 14.6.3 | **not** 14.6.4 — 2 days old, blocked by `npmMinimalAgeGate: 3d` |
| `@testing-library/jest-dom` | 7.0.1 | |
| `prettier` | 3.9.6 | backend's `.prettierrc` verbatim |
| `oxlint-tsgolint` | 7.0.2001 | |
| `rolldown` | `~1.2.1` → 1.2.4 | range copied from `vite@8.2.1`'s own dependency, **not** pinned |

**The `rolldown` entry is the one worth remembering.** Pinning it to `1.2.3` (the newest clearing the
age gate) silenced the `@rolldown/plugin-babel` peer warning but produced two rolldown copies on
different `@oxc-project/types` — `1.2.3` hoisted, `1.2.4` under `vite/node_modules/`. Declaring the
same *range* Vite declares collapses them to one. Check with
`find node_modules -path '*rolldown/package.json' -not -path '*/@rolldown/*'` after any Vite upgrade.
