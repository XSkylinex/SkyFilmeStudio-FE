# SkyFilmeStudio-FE — Local AI Studio, web UI

The React front end of **Local AI Studio**: a 100% local AI media production studio that turns
user-owned source assets into long-form video (default acceptance target ~20 minutes) with no cloud
inference, no paid APIs, and no remote GPU.

The architecture authority is `../LOCAL_AI_STUDIO_PLAN.md`. The build order for **this repo** is
`plan/` — read `plan/README.md` before starting work.

Backend: <https://github.com/XSkylinex/sky-filme-studio-be> (`../sky-filme-studio-be`).
This repo: <https://github.com/XSkylinex/SkyFilmeStudio-FE>.

## Status, honestly

**`plan/00`–`plan/01` are done (2026-08-15), `plan/02`–`plan/03` (2026-08-17), `plan/04` and
`plan/15` on 2026-08-20, and `plan/06`, `plan/07` and `plan/16` are all **partly done**
(2026-08-21). `plan/05`, the realtime bridge, is **blocked on BE-23** — no gateway, no websocket
dependency, no realtime event schema. **BE-11 published its HTTP surface on 2026-08-21** —
`/projects`, `/projects/:projectId/assets` and `/capture-guide` — so the project list is now real
and `plan/07`'s asset half is real. What a screen can consume is decided by the backend's
`exports` map, not its route table: `Project` and
`Page<T>` are under `src/contracts/`, but the create/patch DTOs and `ProjectStorageUsage` are not,
so project **creation** and per-project storage remain blocked on a missing export rather than a
missing endpoint. The same line runs through `plan/07`: the asset library and the capture guide are
real, while both import transports have endpoints whose request shapes are not published.**

The starter demo is gone and the gate is real — `typecheck`, `lint`, `test` and `build` all exist,
all pass, and each was proven to fail on a deliberately broken file. `index.html` names the product
and has a `<noscript>`, and `src/shell/` owns `<html lang>` / `<html dir>` after boot.

FE-02 added the token system (`src/styles/`) and a primitive layer of seventeen components under
`src/lib/components/`, each a folder of `index.tsx` + `<name>.interface.ts` + a `<name>.css` unless
it contributes no styles of its own (`icon-button` composes `button` and so has none):
`badge`, `button`, `icon`, `icon-button`, `field`, `input`, `select`, `status-dot`, `progress-bar`,
`skeleton`, `dialog`, `tooltip`, `toast`, `empty-state`, `error-state`, `media-tile`,
`approval-controls`. `src/shell/design-system-preview/` renders all of them and is the only place
any of it can be looked at.

FE-03 added the app shell: `react-router-dom@7.18.2`, the full route tree in `src/shell/routes/`,
and shell chrome under `src/shell/` — `app-shell`, `production-shell`, `production-nav`,
`route-error-boundary`, `root-error-boundary`, `fatal-boundary`, `offline-indicator`,
`connection-indicator`, `keyboard`, `shell-state`, `route-title`. `src/features/` now holds eighteen
route-level page stubs; the preview gallery lives at `/design-system`.

FE-04 built the seam to the orchestrator. `package.json` depends on
`sky-filme-studio-be@portal:../sky-filme-studio-be`, every wire type is imported from
`sky-filme-studio-be/contracts`, and a one-word rename in the backend contract breaks `yarn typecheck`
here — that was demonstrated, not assumed. `src/lib/api/` holds the single `fetch` wrapper, the
`StudioError` taxonomy covering every `ERROR_CODE` the contract defines — **twenty-five as of
2026-08-22**, four of them added by BE-12 in a single day, each one breaking `yarn typecheck` here the
moment it landed, read from `../sky-filme-studio-be/src/contracts/enums/error-code.ts` — and the
loopback-only base URL;
`src/lib/query/` holds the `QueryClient`; `src/lib/status-tone/` maps seven contract enums onto
`StatusTone` — six from FE-04 and model file status from FE-06 — which is the mapping FE-02 deferred
to this phase. FE-06 moved the three installation-status queries out of `src/features/system/api/`
and into `src/shell/api/`.

FE-15 added the i18n mechanism: `src/lib/i18n/` holds a typed catalogue of **204 keys in English and
Hebrew** — 109 when FE-15 closed, FE-06 added the system screen's copy, and FE-16 paid off the
primitive layer FE-15's migration never reached. English is the source of
truth and Hebrew is `Record<TranslationKey, string>`, so a missing translation is a compile error.
The interface language lives in the shell slice, persists to
`localStorage`, and drives `<html lang>`/`<html dir>` with no reload. `ContentText` renders `<bdi>`
with `dir` from a record's own language field, which is how a Hebrew production reads correctly inside
an English UI. The error-taxonomy sentences moved into the catalogue; `StudioError` carries a
`messageKey` and resolves its own `message` in English so logs stay one language while the UI follows
the reader.

**Never use `:dir()` in this repo.** It is outside the browser floor, and Lightning CSS lowers it to a
`:lang()` list — which keys off language rather than direction and so breaks the exact case this
product needs. Use `[dir='rtl']`. `.claude/rules/css.md` carries the measurement.

FE-06 made three screens real. `src/shell/api/` now owns the installation-status queries — system
mode, preflight and the model setup report — and `src/shell/system-readiness/` renders the first
answer this app has ever fetched: ready, or *n* of eleven checks did not pass, with the disk
shortfall in bytes. `/system` composes seven panels from it, the project dashboard carries the same
strip, and the header's offline badge finally asks the orchestrator what mode it is in instead of
reading **"Not yet verified"** forever. `src/features/system/` holds the panels; `src/lib/format/`
holds the byte and date formatters.

**The offline badge takes `operatingMode` from the contract and never re-derives it.** The shell used
to compute its own answer from three of the same booleans with a different precedence, so the header
and the backend genuinely disagreed whenever LAN workers and strict offline were both on. One source
of truth, and a test that hands the component a contradictory payload.

**What is still not real, and why.** Superseded in part on 2026-08-21: the project list and the
asset library *are* real now, because BE-11 published. What remains unbuilt is project creation,
per-project storage, subjects, locations, productions and reusable libraries — creation and storage
on an unpublished request shape, the rest on **BE-12** and **BE-13**. Memory and pressure need the
socket. Model `compatibility`
lives on `ModelManifestEntry` and `/preflight/models` returns `ModelSetupReport`, which has no such
field, so `/system` says what "files present" does *not* mean rather than showing a classification it
cannot see. `POST /render-jobs` still validates against a DTO that is not exported through
`./contracts`, and there is no socket. **Do not report structure or capability that does not exist
yet** — the two panels with no data source say so on screen rather than rendering an empty value.

**The exception filter now exists, and FE-04's envelope was a guess that turned out wrong.** BE-11
landed a global `StudioErrorFilter`, so a typed failure finally reaches the browser as
`{ statusCode, code, message }`. This repo was reading `errorCode`/`errorDetail` — plausible, because
`PreflightCheck` really does carry a field called `errorCode`, just not on the HTTP envelope — so all
twenty-one codes fell through to the status-only sentence. `plan/04-data-layer.md` had predicted this
in writing, naming `{ code }` as a likely shape and noting the gate would stay green either way. It
did. The lesson is narrower than "verify assumptions": **a guessed wire shape needs a test that fails
when the guess is wrong, and a test written from the same guess is not that test.**

FE-07 made the asset library real — a project's source assets through **thumbnails only**, every box
reserved before its image arrives, with `EXPORTABLE` visually distinct from `PROJECT_PRIVATE`
because that field is what may leave the machine. `/capture-guide` is offered and never required:
the contract makes a mandatory guide unrepresentable, since `bypassable` is `z.literal(true)` and
every view's `optional` is too.

**The lesson it added to the bidi rule: passing a backend-authored message through untranslated is
not the same as dropping it into the paragraph.** Measured in Chrome with the interface in Hebrew,
`Diffuse, even lighting.` rendered as `.Diffuse, even lighting` — a sentence-final period is a
bidi-neutral and takes the paragraph's direction, not the run's. That is FE-06's `GB 8.0` one level
up, on a whole sentence rather than on notation. `ContentText` with no language gives each string a
`<bdi dir="auto">`; the gate was fully green while the defect was on screen.

FE-16 was taken out of order, because 07–14 are all backend-gated and it needs no backend. **The
lesson worth carrying is that `yarn lint` was green before it and after it.** `jsx-a11y` has been on
since FE-00 and reports nothing on `src/` even at `pedantic`; every defect FE-16 fixed was live in a
green tree and was found by loading the app. A navigation left focus on the link that was clicked;
`a`, `r`, `c`, space and `?` were bound on `window` with no modifier and no off switch, which is a
Level A failure of WCAG 2.2 SC 2.1.4; and `--color-border` was at **1.27:1** in light and 1.57:1 in
dark where SC 1.4.11 asks for 3:1, with the raised fill at 1.06:1 so the border was carrying the
whole job of showing where a control was.

Three things from it that later phases inherit rather than re-decide. **`ApprovalControls` requires
`contextLabel`** — not `subject`, which is a domain entity here — so a review screen cannot render
two hundred buttons all named "Approve". **A control's border is `--color-border-control` and a
panel's is `--color-border`**; only the first is held to 3:1, and `.claude/rules/css.md` carries the
measured table. And **single-key shortcuts have an off switch reachable without a shortcut**, since
turning `?` off would otherwise strand the control that turns it back on.

Everything else in `plan/16` needs a screen that does not exist — storyboard, shot review, the
render queue — and the phase file names which phase each unticked box waits for rather than leaving
them blank. In particular "media code is out of the entry chunk" is **vacuously** true today and
stays unticked: there is no `<video>`, `<audio>` or `<canvas>` anywhere in `src/`.

Two things FE-03 established that later phases inherit. **The router is v7, not v8** —
`react-router-dom` has never published an 8.x and is a re-export shim over `react-router@7.18.2`, so
v8 documentation is the wrong documentation here. And **`route.lazy` resolves before render**, so
`<Suspense>` never fires for a lazy route; loading state comes from `HydrateFallback` on a cold deep
link and `useNavigation()` on same-session navigation.

Two things FE-02 established that later phases inherit rather than re-decide: state colours ship as
**CSS tokens only** — components take a presentational `StatusTone`, and the state→tone mapping is
FE-04's job against the real inferred contract — and a tone's identity lives in its **border and
dot form, not its text colour**, which `plan/02-design-system.md` records with the measurements.

## The six rules that outrank everything else

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
6. **Source files carry code, not explanation.** No rationale, no plan citations (`§36`), no `GAP:`
   or `TODO:` prose, no predictions about later phases, no restating a signature. This is about the
   comment's content — rewriting a docblock as `//` lines is not a fix. Explanation goes in `plan/`;
   a fact that must not drift goes in a test. See `.claude/rules/code-style.md`.

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
| Vitest | 4.1.10 | jsdom 30.0.1, RTL 16.3.2, jest-dom 7.0.1, MSW 2.15.0 |
| Zod | 4.4.3 | pinned exactly, **identical to the backend's pin**; a major split makes two `z.infer`s |
| TanStack Query | 5.101.4 | server state only; Redux Toolkit 2.12.0 holds uncommitted edits |
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
src/                      the app (today: App, main.tsx, shell/, lib/, assets/, styles/)
src/shell/                app frame; writes <html lang>/<html dir> at boot; holds the preview gallery
src/shell/api/            the installation-status queries: system mode, preflight, model setup
src/lib/components/       the shared primitives, one folder per component
src/lib/interfaces/       types more than one component uses
src/lib/api/              the one fetch wrapper, the base URL, StudioError and the taxonomy
src/lib/query/            the QueryClient and its retry policy
src/lib/status-tone/      contract enums mapped onto StatusTone
src/lib/i18n/             the typed catalogue, the translate hook, direction from a language tag
src/lib/format/           byte counts and timestamps — notation stays notation, dates follow Intl
src/features/<f>/api/     one file per query for that feature's own project or production data
src/assets/               SVG artwork, mirroring src/; never inlined in JSX
src/styles/               layers.css, reset.css, tokens.css
test/                     tests, mirroring src/ — nothing under src/ is a test
build/                    build-time code: the external-URL guard that vite.config.ts installs
public/                   copied verbatim to dist/ root; favicon.svg and icons.svg exist and resolve
plan/                     the step-by-step build order for this repo
.claude/rules/            conventions; path-scoped except git.md, which loads every session
.claude/skills/           newest · gate · add-feature
.claude/agents/           studio-ui-engineer · studio-data-engineer · web-platform-engineer · fe-reviewer
.claude/README.md         how these four mechanisms differ and when each loads
```

## Git

The full rules are `.claude/rules/git.md`, which carries no `paths:` and loads every session.

- **Alex Moshinsky is the author of every commit.** Do not add a `Co-Authored-By:` trailer for Claude
  or any assistant, and do not add generated-with footers — the harness asks for both, and this repo
  overrides it. Commit as `Alex Moshinsky <alex1mosh@gmail.com>`.
- **A PR is several small commits, not one per phase.** One reviewable idea each, revertible on its
  own, and each with a body saying what changed, why, and how it was verified. The explanation goes
  in the commit message, never in the code — that is where rule 6 sends it.
- **Branch and open a PR**, including when the instruction was to work on master.
- Remote: `https://github.com/XSkylinex/SkyFilmeStudio-FE.git`.
- Never commit `.env*`, media, model weights, or anything under a project asset root.
- Commit and push only when asked.
