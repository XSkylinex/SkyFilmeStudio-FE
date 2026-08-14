# SkyFilmeStudio-FE — Local AI Studio, web UI

The React front end of **Local AI Studio**: a 100% local AI media production studio that turns
user-owned source assets into long-form video (default acceptance target ~20 minutes) with no cloud
inference, no paid APIs, and no remote GPU.

The architecture authority is `../LOCAL_AI_STUDIO_PLAN.md`. The build order for **this repo** is
`plan/` — read `plan/README.md` before starting work.

Backend: <https://github.com/XSkylinex/sky-filme-studio-be> (`../sky-filme-studio-be`).
This repo: <https://github.com/XSkylinex/SkyFilmeStudio-FE>.

## Status, honestly

**`plan/00-toolchain.md` is done (2026-08-15). Nothing after it has started.**

The starter demo is gone and the gate is real — `typecheck`, `lint`, `test` and `build` all exist,
all pass, and each was proven to fail on a deliberately broken file. But `src/` is still only
`App.tsx` (a placeholder naming the product), `main.tsx` and two stylesheets: **no features, no
router, no data layer**. Anything in `.claude/rules/` describing `src/features/**` is describing the
target, not the present. Do not report structure that does not exist yet.

## The five rules that outrank everything else

1. **One backend, no exceptions.** The UI talks to the NestJS orchestrator and nothing else. Never
   ComfyUI (`:8188`), never LM Studio (`:1234`), never a database, never a Python runtime — not
   temporarily, not through a dev proxy. If a screen needs something the orchestrator doesn't expose,
   that's a backend task; say so and stop.
2. **Nothing external reaches the bundle.** No CDN font, no analytics, no error-reporting SDK, no
   remote image, no hosted iframe. Every byte comes from `dist/`. The product's whole promise is that
   nothing leaves the machine, and this is where it gets quietly broken.
3. **Never state a version or browser-support fact from memory.** Use the `newest` skill. Every claim
   carries a number, a source, and the date you checked.
4. **Tests mirror `src/` from `test/`.** Nothing under `src/` is a test — no `__tests__/`, no
   `*.test.tsx` beside a component.
5. **No shell commands in `.ts`/`.tsx` files, including in comments.** Commands live in
   `package.json`, `.claude/skills/`, and `plan/`. A command in a comment is documentation nothing
   verifies.

## Commands

```bash
yarn install
yarn dev          # vite
yarn typecheck    # tsc -b, across app + node + test projects
yarn lint         # oxlint, type-aware
yarn test         # vitest run          (test:watch, test:cov)
yarn build        # tsc -b && vite build
yarn preview      # serve dist/
yarn format       # prettier --write .  (format:check)
```

Run all four gate stages, not a subset — the `gate` skill says what each one is blind to.

Use `yarn`, never `npm` or `npx`: `~/.npm/_cacache` on this machine is root-owned and both fail with
`EACCES`, which reads as "package not found".

## Toolchain — verified 2026-08-14

| Piece | Version | Note |
| ----- | ------- | ---- |
| Node | 26.7.0 | |
| Yarn | 4.18.0 | pinned via `.yarn/releases/`, `nodeLinker: node-modules`, `npmMinimalAgeGate: 3d` |
| TypeScript | 7.0.2 | native Go compiler; type-checks only, Vite emits |
| React | 19.2.8 | React Compiler **on** via `@rolldown/plugin-babel` + `reactCompilerPreset()` |
| Vite | 8.2.1 | Rolldown + Oxc; esbuild is an *optional* peer and is **not installed** |
| oxlint | 1.78.0 | 9 plugins, 11 rules. **Type-aware mode is ON** — `oxlint-tsgolint@7.0.2001` installed |
| Vitest | 4.1.10 | jsdom 30.0.1, RTL 16.3.2, jest-dom 7.0.1. **MSW is deferred to FE-04** |
| Prettier | 3.9.6 | backend's config verbatim; `*.md` and `.claude/` are ignored |

**ESLint is not an option on this stack.** Measured in the backend repo on 2026-08-14 with
`typescript-eslint@8.67.0` + `typescript@7.0.2`: ESLint 10.8.1 aborts with
`Error: typescript-eslint does not support TS 7.0.` Both repos lint with oxlint. Do not add an ESLint
config; it would not run.

The browser floor is not a preference — it is what Vite's default `build.target` resolves to:
`["chrome111","edge111","firefox114","safari16.4","ios16.4"]`. Settle any feature question with
`node .claude/skills/newest/scripts/floor-check.mjs <feature-id>`, never from memory.

## Product constraints that shape the UI

- **Renders take minutes to hours.** A mutation returns a `renderJobId`, never a result. Progress
  arrives over a WebSocket; the job row is the source of truth and the socket is an accelerator. A
  reload must lose nothing.
- **Approvals are the product.** Approve / reject / retake / cancel / export get **no optimistic
  update** — they are the gates that stop hundreds of expensive renders from running on a wrong
  keyframe.
- **Automated QC is advisory.** A VLM `PASS` is not human approval and must not be styled like one.
- **Hebrew is a first-class production language.** The UI must survive `dir="rtl"`: logical CSS
  properties everywhere, `dir` resolved from each text's own `language` field, and no language-named
  props or fields. `margin-left` compiles fine and breaks the day someone switches language.
- **Media is dense.** Contact sheets, storyboard strips and shot grids. Use the backend's proxies and
  thumbnails, and reserve every box with `aspect-ratio` — CLS here isn't a metric, it makes the page
  unusable.
- **Capabilities are advertised, not assumed.** `maxTestedDurationSeconds` means *measured on that
  hardware/backend/model*. Build pickers from the capability payload, never from a model's marketing.

## Where things live

```
src/                      the app (today: a placeholder App, main.tsx, two stylesheets)
test/                     tests, mirroring src/ — nothing under src/ is a test
build/                    build-time code: the external-URL guard that vite.config.ts installs
public/                   copied verbatim to dist/ root; favicon.svg and icons.svg exist and resolve
plan/                     the step-by-step build order for this repo
.claude/rules/            conventions, path-scoped
.claude/skills/           newest · gate · add-feature
.claude/agents/           studio-ui-engineer · studio-data-engineer · web-platform-engineer · fe-reviewer
.claude/README.md         how these four mechanisms differ and when each loads
```

## Git

- **Alex Moshinsky is the author of every commit.** Do not add a `Co-Authored-By:` trailer for Claude
  or any assistant, and do not add generated-with footers. Commit as
  `Alex Moshinsky <alex1mosh@gmail.com>`.
- Remote: `https://github.com/XSkylinex/SkyFilmeStudio-FE.git`.
- Never commit `.env*`, media, model weights, or anything under a project asset root.
- Commit and push only when asked.
