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
`approval-controls`. **The layer is twenty today** — FE-15 added `content-text`, the `<bdi>` wrapper
that makes a Hebrew record read correctly inside an English UI, FE-09 added `textarea`, because a
production's brief is a paragraph and `Input` is the wrong element for one, and FE-16's third pass
added `validation-summary`, the `<output tabIndex={-1}>` a form renders when a submit fails the
contract, keyed on the attempt so it takes focus every time and not only the first.
`src/shell/design-system-preview/` renders all of them and is the only place
any of it can be looked at.

FE-03 added the app shell: `react-router-dom@7.18.2`, the full route tree in `src/shell/routes/`,
and shell chrome under `src/shell/` — `app-shell`, `production-shell`, `production-nav`,
`route-error-boundary`, `root-error-boundary`, `fatal-boundary`, `offline-indicator`,
`connection-indicator`, `keyboard`, `shell-state`, `route-title`. `src/features/` holds **twenty**
route-level pages — counted 2026-09-01 with `ls src/features/*/[A-Z]*.tsx`, the project bible being
the twentieth — eighteen stubs when FE-03 landed, plus asset detail from FE-07. Which of them are
no longer stubs is recorded in the FE-06 and FE-07 paragraphs above rather than counted here, because
"real" is a judgement and a number would go stale the way the others did. The preview gallery lives
at `/design-system`.

FE-04 built the seam to the orchestrator. `package.json` depends on
`sky-filme-studio-be@portal:../sky-filme-studio-be`, every wire type is imported from
`sky-filme-studio-be/contracts`, and a one-word rename in the backend contract breaks `yarn typecheck`
here — that was demonstrated, not assumed. `src/lib/api/` holds the single `fetch` wrapper, the
`StudioError` taxonomy covering every `ERROR_CODE` the contract defines — **seventy-eight as of
2026-09-02 afternoon, seventy-six that morning, seventy-four the evening before, sixty-seven that morning, thirty-five as of
2026-08-22**, fourteen of them added in one day: four by BE-12 and ten by BE-13, each one breaking
`yarn typecheck` here the moment it landed, read from
`../sky-filme-studio-be/src/contracts/enums/error-code.ts` — and the
loopback-only base URL. Ten of them were mapped while they existed **only on an unmerged backend
branch**, which the drift diagnostic could not tell you because `git show HEAD:` reads whatever is
checked out; BE-13 merged as `325d09d` the same evening and all thirty-five are on master now.
`.claude/rules/state-and-data.md` carries what to check instead, and why mapping a refusal from a
branch is fine while building a screen on one is not;
**There is no alias, and `types` and `import` come out of one compilation.**
`exports["./contracts"]` sends both into a tree-shakeable `dist-esm/` emitted by a single `tsc`, and
`require` to the CommonJS the orchestrator's own server loads. **That the two share a compilation is
the invariant, not an implementation detail** — for twenty minutes on 2026-08-22 they did not, and a
field renamed under `nest start --watch` would have moved the types while the bundle kept parsing the
old schema, with the gate green over it. `.claude/rules/state-and-data.md` carries the detail.

Until 2026-08-22 `types` pointed at the backend's *source* and a `vite.config.ts` alias dragged the
runtime back to match it — the two were literally one file, which is why that arrangement could not
produce this failure. It produced a different one: this repo compiled against a working tree and went
red six times in one day on files the backend had not typechecked itself.
`test/contract-source-matches-runtime.test.ts` pins the new arrangement, including that the alias does
not return — **no resolver reports that**, because `import.meta.resolve` is Node's and cannot see a
Vite alias.

**The ESM build is load-bearing, not tidiness.** Measured 2026-08-22 on one tree: the alias and the ESM
condition give a **byte-identical** bundle at 466.15 kB, and the CommonJS condition gives 778.43 kB.
Rolldown cannot tree-shake CJS.

`src/lib/query/` holds the `QueryClient`; `src/lib/status-tone/` maps seven contract enums onto
`StatusTone` — six from FE-04 and model file status from FE-06 — which is the mapping FE-02 deferred
to this phase. FE-06 moved the three installation-status queries out of `src/features/system/api/`
and into `src/shell/api/`.

FE-15 added the i18n mechanism: `src/lib/i18n/` holds a typed catalogue of **1,524 keys in English
and Hebrew**, counted 2026-09-02 after the continuity writes — 1,503 after the continuity screen,
1,469 after the production bible pin, 1,464 after the music candidates, 1,414 after the shot effects
editor, 1,389 after the score, 1,366 after the plate writes, 1,338 after the mix panels, 1,305 after
the music and opening-ending libraries, 1,261 after the music and opening-ending libraries, 1,222
after the SFX library, 1,179 after the pronunciation writes, 1,164 after two audio-mix refusals,
1,162 after the structure-profile form, 1,117 after the production edit form, 1,111 after the style
version diff, 1,104 after the prop owner's name, 1,103 after two more BE-21 refusals, 1,101 that
morning after the bible's subject-rules editor, 1,087 the night before, after the canonical
comparison, dialogue editing, FE-12's advisory half, FE-16's third pass and four BE-21 refusals
absorbed the same evening — 109 when FE-15 closed, then the system screen, the
primitive layer FE-15's migration never reached, the asset library, asset detail, subject review, the
four creative-library screens, FE-09's production list, create form and planner, the project bible
and its two write forms, the storyboard review, whose 120 keys include a label for every value of
six contract enums — sixteen shot types, fifteen shot states, nine generation strategies, five
regeneration modes, three keyframe requirements, two storyboard levels — and the dialogue audio
screen, whose 93 include both TTS passes, all four animation tiers and the four scene-timing
statuses.
This number has been wrong more than once; count it rather than increment it — it said 357 while the
tree held 371, so the warning had already failed once on the paragraph carrying it. It then failed a
second time on the same paragraph: it read 690 while the tree held 694, because absorbing four
upstream refusals adds four keys and the commit that added them updated no count. **An error code is
a catalogue key**, so every absorption moves this number, and none of them looks like a screen.
Count both catalogues and require them equal:
`grep -cE "^  '[^']+':" src/lib/i18n/catalogue/{en,he}.ts`. **Since 2026-09-02 the suite counts for
you**: `test/catalogue-count-in-claude-md.test.ts` fails when this paragraph's number is not the
catalogues' length, and `node .claude/skills/recount/scripts/recount.mjs "<what moved it>"` rewrites
the sentence — through the rebase conflict every PR hits on it, which happened eleven times that day. English is the source of
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

**`src/` never names a style mode or a language.** `test/style-and-language-agnostic.test.ts` scans
every `.ts`/`.tsx` under `src/` and fails on a style mode written **anywhere** — quoted either way, in
a template literal, as a bare object key, or buried inside a longer i18n key — on the word *anime*, on
a quoted language tag outside the three files that own the interface-language mechanism, and on a
language-named identifier. The suggestion list for a style picker is `SUGGESTED_STYLE_MODES` from the
contract; a mode spelled out here would be a second source of truth. Interface language is a closed set
of two, declared across those three files and nowhere else; **content** language is open data that
travels with each record. Proved by deliberate violation, not by watching it pass — including the eight
bypasses a review found in its first version, every one of which the pattern had missed because it
required a single quote on each side.

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

**FE-07's approval gate is the first mutation this app has ever made, and it sets the pattern.** The
*Open draft* section on Subject Review finds a subject's `PENDING` canonical set, shows what it
depicts, and offers one **Approve** named for its subject. Nothing is optimistic: the control disables
while the request is in flight, and only after the server answers are the collection and the
approved-head queries invalidated. **The guard that survives a reload is structural, not a prop**:
the refetched list contains no `PENDING` set, so the control is not rendered at all. That distinction
is the part a later phase must copy — on a shot, a reload may well still show a `PENDING` row, and
then a client-side `isPending` is worth exactly nothing and the disabled state has to come from the
row's own server-given state. `ApprovalControls` grew
an optional `onReject` for it, because the orchestrator has no reject route for a canonical set and
approval is one-way by database trigger; rendering a control that cannot work is the same defect as
reporting a capability that does not exist.

FE-16 was taken out of order, because 07–14 are all backend-gated and it needs no backend. **The
lesson worth carrying is that `yarn lint` was green before it and after it.** `jsx-a11y` has been on
since FE-00, and every defect FE-16 fixed was live in a green tree and was found by loading the app.
**Corrected 2026-09-01: the plugin no longer reports nothing on `src/`** — it emits five warnings,
and `yarn lint` still exits 0 because they are warnings. Not one is a defect. Four are FE-16's own
second pass, two rules on each of two elements: `no-noninteractive-tabindex` objecting to the
`tabIndex={0}` that makes a scrollable `role="region"` keyboard-reachable, which SC 2.1.1 requires
and without which the scroller is unusable, and `prefer-tag-over-role` preferring `<section>` where
`<div role="region">` maps to the same thing. The fifth is `media-has-caption` on FE-07's asset proxy
`<video>`, which has no caption track because nothing local generates one. So the sentence this replaces was true when
written and stopped being true the moment the fixes landed. **The point it was making survives
intact and is now sharper: the linter has opinions about three considered decisions and still
reports nothing about any defect this phase actually found.** A navigation left focus on the link that was clicked;
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

**FE-16 ran a second pass on 2026-09-01, for the same reason and with the same result.** The surface
had roughly doubled since August — four creative-library screens, eight create and edit forms, the
production list, the planner, the project bible — and `yarn lint` was green over all of it, again.
What that green tree was hiding: approving a style, voice, location or prop dropped focus to `<body>`
and announced nothing; saving a style or voice edit left the card with **no** Approve, Edit or Cancel
until a reload, so a version you had just edited could never be approved; opening those forms
unmounted the button that opened them; a location's features shared one `<bdi>`, so a mixed-direction
list put its separating comma on the wrong side; and the runtime budget's own stylesheet put
`display: flex` on a `<th scope="row">`, which is the one declaration that takes a cell out of its
table. None of it is reachable by `jsx-a11y`, and that is now the fourth time this has held.

**Two of the defects were sentences, not code, and they are the FE-08 class exactly.** The planner
said "There is no dialogue route at all" after BE-17 published five of them, and the create-production
form told the user to go to the orchestrator for a style profile hours after `/styles` grew an Add
control. `test/lib/i18n/catalogue/en.test.ts` now greps for both phrasings, alongside the sentences
that were wrong once before.

**Making seven route-level pages lazy took the entry chunk from 597.00 kB to 473.88 kB** (gzip 175.91
→ 144.93) and its CSS from 65.86 kB to 36.96 kB, which is smaller than the 516.30 kB measured before
four screens, eight forms and the bible existed. Vite's ">500 kB" warning stopped firing. The four
library screens and the production list had been statically imported while the *smaller* bible and
planner were lazy — `plan/16` had already named that inversion for the render queue.

Everything else in `plan/16` needs a screen that does not exist — storyboard, shot review, the
render queue — and the phase file names which phase each unticked box waits for rather than leaving
them blank. Two exceptions were named there rather than blamed on a missing screen — a failed
validation announced on one form out of nine, and nothing telling anyone which fields were required —
and **both closed on 2026-09-01 in a third pass.** The required count in the plan was wrong in an
instructive way: it counted keys the wire needs present, and every form sends every key, so a field
whose schema accepts `''` is not one a person has to fill. Asking `safeParse('')` gives thirteen, not
twelve, and an empty prop form reporting one invalid field rather than two is what exposed it.
**The announced count was wrong the other way until 2026-09-02**: it counted keys, and
`fieldErrorsFromIssues` keys every prefix of a path so a section can show a nested failure, so one bad
language tag on the bible form announced "Fields needing attention: 3" — measured, not inferred.
`invalidFieldCount` counts leaves, with a trailing list index folded into its box. "Media code is out of the entry chunk" is **no longer vacuous**: FE-07's asset detail page
is the first `<video>` in this codebase, its route is `lazy`, and it builds as its own chunk rather
than into the entry. `plan/16` carries the measurement and the one caveat — React DOM's own media
event plumbing is in the entry either way and is not ours to move.

Two things FE-03 established that later phases inherit. **The router is v7, not v8** —
`react-router-dom` has never published an 8.x and is a re-export shim over `react-router@7.18.2`, so
v8 documentation is the wrong documentation here. And **`route.lazy` resolves before render**, so
`<Suspense>` never fires for a lazy route; loading state comes from `HydrateFallback` on a cold deep
link and `useNavigation()` on same-session navigation.

Two things FE-02 established that later phases inherit rather than re-decide: state colours ship as
**CSS tokens only** — components take a presentational `StatusTone`, and the state→tone mapping is
FE-04's job against the real inferred contract — and a tone's identity lives in its **border and
dot form, not its text colour**, which `plan/02-design-system.md` records with the measurements.

FE-08 made the creative library read. `/styles`, `/voices`, `/locations` and `/props` were
`EmptyState` stubs whose descriptions said "Not connected to the orchestrator yet"; all four now read
the orchestrator, and each carries the fact its step exists for — a style **lineage** with its
approved head, a voice split on whether it belongs to a subject, plate coverage over the kinds a
location actually has, and a prop's continuity rules. `src/features/{styles,voices,locations,props}/`
hold the slices; `plan/08` records which Done-when boxes are ticked and which cannot be. **Step 1's box
ticked on 2026-09-02**: each style version after the first says what changed from the one below it,
field by field as removed and added lines, computed here from the versions page the card already
reads — no route was needed, which is why it had stayed unbuilt for two weeks.

**All four now create and edit, as of 2026-09-01.** `/styles`, `/voices`, `/locations` and `/props`
each offer an Add control and a per-record Edit, against the `POST` and `PATCH` every one of them
publishes. **The pronunciation dictionary writes too, as of 2026-09-02** — a dictionary per language, entries
added and removed — against routes that were published the whole time while the screen stayed
read-only and told the reader to delete and re-add an entry it gave no way to delete. An entry still
has no update DTO and no `PATCH`, so removing and re-adding is the change, and now it is offered.
**Hebrew is first-class in the typing, not only the reading**: the term field is wrapped in the
dictionary's own direction and the field itself stays `dir="auto"`, so a Latin term in a Hebrew
dictionary still reads correctly. **Canonical plates were the one deliberate omission until 2026-09-02**: a plate is anchored
to exactly one of a source asset or an artifact, checked against the stored row after a merge, so
switching anchors must be a single `PATCH` sending both fields and the obvious two-step flow fails on
its first step with no `ErrorCode`. **They are built now, with the design that argument asked for**:
the anchor is chosen as a kind rather than as two fields, and the patch carries the new anchor and an
explicit `null` for the old one together, so the failing sequence is unreachable from the screen
rather than merely discouraged. An artifact id is typed rather than chosen, because nothing lists
artifacts. `plan/08` carries both the argument and what answered it.

**Editing a style profile does not create a version, and that is the trap this phase was built
around.** `plan/08` step 1 says "changing a style creates a new version"; that is the product
requirement, not the API. `PATCH` mutates the row in place, leaving `version` and `lineageId`
untouched — a new version is a `POST` carrying `lineageId`. An editor wired to the plan's sentence
would have silently rewritten a version other productions are pinned to, which is step 1's own
definition of losing the user's trust. So an approved version offers **create the next version** and
no edit at all.

**What stops it is a database trigger, not this screen.** Each of the five tables carries a
`BEFORE UPDATE` trigger raising `P0001` when an approved row's content would change, surfaced as
`STYLE_PROFILE_IMMUTABLE`, `VOICE_PROFILE_IMMUTABLE`, `LOCATION_IMMUTABLE`, `PROP_IMMUTABLE` or
`LOCATION_PLATE_IMMUTABLE`. The guard cannot be bypassed, so the screen's only job is to show it
before a person meets it — the control is chosen from the record's own server-given `approved`, never
from a client flag, exactly as FE-07 established.

**Every update sends only the fields that changed.** Each update DTO is a `strictObject` with a
`.refine()` rejecting an empty body, so a no-op save is a `400`; sending every field would also
overwrite what the user never touched. A nullable field is cleared with an explicit `null` —
**omitting a key means "leave it alone", and only `null` erases** — which is pinned by a test that
fails with `expected {} to have property "realismLevel"` when the code omits instead.

**`Page<T>` carries `nextCursor`, and an absent one means the end** — so truncation is detectable, and
each of the four says "reads the first page only" when the server offers more. The asset library
predates that and still shows fifty silently. Do not add a fifth silent truncation.

**Two acceptance criteria in `plan/08` cannot be met and are not defects here.** No `NIGHT` plate kind
is *published* — `plate-kind.ts` names a lighting variant in prose as one of §29's five minimum kinds,
and `SUGGESTED_PLATE_KINDS` carries four, none of them it — so "flag a missing night plate" would mean
this repo inventing the constant; `test/style-and-language-agnostic.test.ts` now fails on `NIGHT`, `DAY` and `DAMAGED` in
`src/` for exactly that reason. And there is no synthesis preview route, so a voice is judged from its
engine, model and transcript rather than from sound.

FE-09 made the planner answer one question: **does this plan add up, and if not, which scenes is it
short by?** BE-15 merged upstream as `31b4713`, and `/projects/:id/productions` and
`/projects/:id/productions/:id/plan` both read the orchestrator now.
`src/features/productions/` lists a project's productions and **creates** one — the first create form
in this app, all eight kinds and six narrative modes off the contract's own `options`, with
`createProductionRequestSchema` as the only validator. `src/features/planner/` renders the runtime
budget, the stages the production needs, and the approval gate. **A production is edited as of
2026-09-02**, against the `PATCH` that had been published the whole time: only changed fields are
sent, and a set optional field cannot be emptied from here because the DTO carries no `null` — the
form says so on the field. A transitions control waits on one export, `PRODUCTION_TRANSITIONS`,
which lives outside the contracts barrel. **Structure profiles are created on
the productions page as of 2026-09-02**, against the `POST` BE-15 published; the form assumes no
frame or audio format, because a default here would be a capability asserted rather than advertised.

**"Which scenes are underweight" is measured against this plan's own mean, and the screen says so.**
The wire gives no per-scene target — a segment carries `shareOfTarget` and nothing else — so an even
split or a profile section mapped onto a scene would be a number this repo invented, which is what
`plan/08` refused when it declined to invent a `NIGHT` plate kind. The mean is over planned scenes
only, because a structure profile's reusable sections enter the budget too and a 45-second recap
would move it.

**The stage list comes from `GET /planning/stages`, never from
`REQUIRED_STAGES_BY_PLANNING_MODE`** — which the contract also publishes, and which would be a second
place for the answer to be true. A test hands the component a stage no mode produces and asserts it
renders it. That is why a music-driven production shows no screenplay stage: the wire has none.

**Plan approval is gated on server state twice over** — the production must be in the one state the
transition table allows the move from, and the server's own report must say `withinTolerance` — so a
reload cannot reopen either. It also announces itself: approving removes the button that was pressed,
and FE-07's `<output tabIndex={-1}>` pattern is what tells a screen reader and lands focus.
`focusWhenShown` moved to `src/lib/helpers/` on its second consumer.

**Most of `plan/09` is unbuildable rather than unbuilt, and the reasons are three missing routes.**
`PlanningService.runStage` exists and no controller reaches it, so no stage can be run or re-run.
`PUT /planning/scenes` writes and returns `readonly unknown[]` with no `GET`, so scenes are visible
only as rows in the budget. **Corrected 2026-09-01: there is a dialogue-line controller now** — BE-17
merged as `014712e` and published `POST`/`GET /scenes/:sceneId/dialogue-lines` and
`GET`/`PATCH`/`DELETE /dialogue-lines/:id`, plus speech synthesis, approval and
`POST /productions/:id/dialogue-timing`, all five DTOs through the barrel. It changed nothing here when it landed,
and that was the point: the collection is keyed on `sceneId`, so it was the **third** controller gated
behind the one missing `GET` — until that `GET` landed as `dcf6d49` and all three became reachable at
once. **Dialogue editing landed on 2026-09-01**: a line is created on its scene, edited while
unapproved and deleted while never voiced — Edit is refused upstream with `DIALOGUE_AUDIO_IMMUTABLE`
and so not offered on an approved line, and Delete has no upstream guard at all and would orphan
takes, so it is offered only before a line has audio. It also added `requestNoContent`, the fourth
fetch caller, for the first route here that answers `204`. `continuityReviewSchema` and
`toneReviewSchema` are published contracts with no route. Every one of those is a sentence on screen
under "What this screen cannot do yet", not a note in a plan file.

**The project bible is real as of 2026-09-01, and it is FE-08's step 7 rather than a new phase.**
**`plan/10` unblocked later the same day; `plan/11` did not.** For weeks FE-10 needed exactly one
thing — an idempotent read of a production's scenes. The ids were on the wire, since
`PUT /productions/:productionId/planning/scenes` returns the full rows and only its declared
`readonly unknown[]` throws them away, but that route deletes every scene and re-inserts with fresh
ids, and `shots.scene_id` is `onDelete: 'restrict'`, so it minted new ids when it worked and refused
once shots existed. **A read that destroys what it reads is not a read**, and this product requires
that a reload lose nothing. `dcf6d49` added `GET /productions/:productionId/planning/scenes`, and that
one controller method unblocked three surfaces at once: BE-16's shots, BE-18's twelve storyboard
routes and BE-17's dialogue-line collection, each of which had been published and keyed on an id
nothing produced. **BE-18 was never the blocker** — it merged as `f14098e` and moved nothing here,
because its whole surface hangs off `shots/:shotId`. **Track the missing route, not the phase
number.** FE-11 is still blocked, for its own unrelated reason: there is no `GET /render-jobs` at all,
the controller being exactly `POST /render-jobs` and `GET /render-jobs/:id`.

**This repo reported the wrong reason first, from a working instrument.** A grep over controller
return-type annotations for `Scene` returned zero and was validated against a true positive — seven
hits for `Promise<Production>`. That proved it could find annotations; it never proved annotations
answer *what comes back over HTTP*. `git.md`'s rule catches a broken instrument, not a sound one
pointed at the wrong question. **When the question is about the wire, read the wire, or read a test
that parses it.** **Track the missing route, not the phase number** — "blocked on BE-18" was
the dependency line's answer and it was never the one that mattered. So the phase taken
was the one BE-14 unblocked and `plan/08` had deferred with "one phase is one phase".
`src/features/bible/` reads every version of a project bible, marks the one the orchestrator calls
active, renders world, narrative, audio and subject rules, shows the generated Markdown view, and
**publishes a draft**.

**Which sections a bible shows comes from `bibleCarriesNarrative`, never from a list in this repo** —
and a kind that carries no narrative section says so on screen rather than rendering a blank one.
"Active" is **derived, not a flag**: `findActive` returns the highest published version, so the screen
asks `/bible/active` instead of reading a field. **Publishing is the second approval-class mutation
here and copies FE-07's structure exactly** — no optimistic update, disabled in flight, both queries
invalidated only after the server answers, and the guard that survives a reload is the refetched
version carrying `published: true` rather than any client flag. It is a *publish*, not an approval:
`ApprovalControls` hard-codes its own label, §46 makes publishing a named transition, and the backend
spells it `/publish` while style profiles get `/approve` — so the control composes `Button` rather
than bending a shared primitive to a one-off label.

**`request-text.ts` is the third caller of `fetch` in this repo, and the bar it had to clear was that
the other two genuinely cannot express it.** `GET /bible/:id/markdown` returns `text/markdown`; a
JSON parse of it is a `MALFORMED` throw. It also refuses a 200 whose `Content-Type` is not markdown,
because a single-page-app fallback would otherwise be handed to the caller as the bible's own text.

**The bidi lesson this phase adds: on a `<pre>`, put `dir` on the `<pre>`.** The generated Markdown
view shipped as `<pre>` wrapping `ContentText` — `<bdi dir="auto">` — and under `<html dir="rtl">`
the whole document mirrored, a nested `  - ` bullet losing its indentation. The cause was **not**
`auto`: `dir` was on the inner `<bdi>` while the `<pre>` inherited `direction: rtl` from the page.
The first fix, `<pre dir="ltr">`, was also wrong and review caught it — it puts a Hebrew line's
sentence-final period at the wrong end, FE-07's defect once per line. Measured in Chrome across all
three: `dir="ltr"` computes `unicode-bidi: isolate`; **`dir="auto"` on the `<pre>` computes
`unicode-bidi: plaintext`**, which HTML's rendering section specifies for `pre[dir=auto]` and which
resolves direction **per bidi paragraph** — and with `white-space: pre` every line is a paragraph. So
each line takes its own first-strong direction and its punctuation lands correctly. **All four gate
stages were green over both wrong versions.**

**`jsx-a11y` reported nothing on two real defects, again.** The publish button failed SC 2.5.3 Label
in Name — visible "Publish this version" against an accessible name that did not contain it, so
speech input could not activate it. And the success message was keyed on `publish.isSuccess`, which
never resets while the component is mounted, so selecting any other already-published version
re-announced a stale publish and stole focus out of the version list. It is keyed on
`publish.data?.id === bible.id` now. Both were found by review, not by the linter — the third time
`plan/16`'s point has held.

**A test that looks right and proves nothing is still the expensive failure.** The publish mutation's
"no optimistic update" test counted refetches through `fetchQuery` — and `invalidateQueries` does not
refetch a query with no observers, so an optimistic `onMutate` was added on purpose and the test still
passed. It now spies on `invalidateQueries` and fails on `expected "invalidateQueries" to not be
called at all, but actually been called 1 times`. `git.md`'s rule is the general form: **watch the
assertion fail, not the test.**

**What the screen cannot do, and says so.** `PUT /productions/:productionId/bible` exists, but
`pinProjectBibleRequestSchema` compiles into **zero** files under `dist-esm/` while
`createProjectBibleRequestSchema` compiles into two — so a production's pinned bible can be read and
not set. A subject block was identified by its id alone until 2026-09-02, because `subjectRules`
carries no name and resolving one meant reaching into another feature's `api/`; it is named now, and
the subject-rules paragraph below says what that reach was measured against.

**The bible writes as of 2026-09-01, and creating and editing were published the whole time.** `POST
/projects/:projectId/bible` starts a draft and `PATCH /projects/:projectId/bible/:id` edits one, so a
project with no bible is no longer a dead end — the same class of dead end FE-16's second pass found
on the style library that morning. **The update DTO takes whole sections, not fields**: `world`,
`narrative` and `audio` are complete replacements and an empty body is refused, so the patch is
decided per section and comparison normalises through `parseLines` first, or re-indenting a rule list
would submit as an edit. `null` clears a section and an absent key leaves it alone, which is the same
asymmetry the four library update DTOs have and one level up.

**Which fields exist comes from `bibleCarriesNarrative`, read from two different places.** Editing
takes `projectKind` off the record; creating cannot, so `GET /projects/:id` was added — the first
single-project read here, keyed `['project', id]` rather than under the collection key, because
`invalidateQueries` prefix-matches and a list invalidation must not refetch every detail.

**Subject rules write as of 2026-09-02, and each block is named.** The day before, they were the one
bible section still read-only, refused here because naming a subject meant importing
`projectSubjectsQueryOptions` across a feature boundary `code-style.md` forbids. Counted on master
that morning, sixteen imports across ten feature pairs already do exactly that, and the audio screen
names a line's speaker from this very query — so the rule's phrasing was no longer describing the
tree, and refusing on it would have kept a section read-only for nothing. The open question is
unchanged and still Alex's: where a project-scoped query four features share should live. Both
forms now carry an editor that lists the project's subjects by name and sends the id; the update
sends the whole list, because the DTO takes `subjectRules` as one replacement array; and the read-only
view names each block and each relationship, calling a subject missing **only when the list it read
had no `nextCursor`** — a truncated first page keeps the id and says nothing, because absence from a
partial list is not absence.

**Still not writable, and said on screen rather than only here:** deletion, which is published and
refused for a different reason than the canonical plates are — the immutability trigger permits
`deleted_at` on a published row, so `DELETE` will soft-delete a bible productions planned against as
readily as a draft nobody used, with no `ErrorCode` separating the two.

**FE-10 made the storyboard read, and the keyframe gate real, on 2026-09-01.** `/storyboard` was an
`EmptyState` saying "Not connected to the orchestrator yet"; it is now a strip of scenes, each opening
to its shots, each shot to its storyboard frames and the gate that decides whether it may be rendered.
**One controller method unblocked it** — `GET /productions/:productionId/planning/scenes`, merged as
`dcf6d49` — and the same method unblocked BE-16's shots and BE-17's dialogue lines, both of which had
been published and unreachable for weeks. The phase's dependency line said BE-18, which merged and
changed nothing here.

**Approving a keyframe is the highest-leverage decision in the pipeline, and it is the only write on
this screen.** `POST` and `DELETE /storyboard-frames/:frameId/approval` are buildable precisely
because they take no request body; every other storyboard write has a route whose request shape the
contract does not export. No optimistic update — and the guard for that is a **cache snapshot**, not a
spy on `invalidateQueries`, because the first version of it passed while a `setQueryData` optimistic
update was live. A spy on the wrong verb is a green test over a broken rule.

**Approve is never offered on a draft.** `StoryboardsService.approve` refuses a non-`KEYFRAME` frame
with a 400, and that refusal is a plain `BadRequestException`, so `StudioErrorFilter` never sees it
and it arrives codeless. Offering the control and explaining the refusal afterwards is the defect
`plan/08` avoided in the keyframe-requirement picker.

**A decision writes the shot, not only the frame**, and review caught this repo invalidating only half
of it. `approve` calls `setApprovedKeyframe` and `advanceIfIn` inside one transaction; the query that
reads a `Shot` is a deliberate sibling key, so the prefix invalidation could not reach it and a card
would have read "Storyboard ready" indefinitely after its keyframe was approved.

**No frame is shown as a picture, and that is a missing route rather than a decision.** An `Artifact`
carries a project-relative path and nothing serves its bytes — checked across every controller, with
the search validated against the source-asset thumbnail and proxy routes it does find. So the strip
shows the record of a frame and says why the picture is absent, and the comparison overlay shows the
anchors the orchestrator records rather than two images side by side.

**The phase also removed a second source of truth it had just created.** Deciding which shots need no
keyframe from a copy of the backend's unpublished `NEEDS_NO_KEYFRAME` list would have disagreed
silently the day a strategy was added to it, and it stated one of the two causes of `NOT_REQUIRED` as
if it were the only one. The gate reports what the wire returns.

**The SFX library is the first thing BE-21 unblocked, built the day it merged (2026-09-02).** `/sfx`
is a **top-level** route, not a project one, because `sfx-assets` is not project-scoped — the library
belongs to the installation and is the reuse §30 credits for clips, so filing it under a project
would have said something untrue about the route. It imports, lists, approves and removes, and every
card carries the two things the library exists to keep: its tags and its licence. **A licence is
required for an imported sound and absent is legitimate for a generated one**, which is the
contract's own `refine` rather than a rule invented here, and the form's required marker follows the
chosen origin. Approval is structural in the FE-07 sense: an approved effect renders no Approve and
no Remove at all, so a reload cannot re-offer either.

**Opening and ending audio is a lineage, not a file, and the screen is built on that** (2026-09-02).
Versions fold onto the lineage they belong to, the approved one is named, and an import either starts
a lineage or continues one — the shape FE-08 established for style profiles, met here for the second
time. What the orchestrator did not measure — a frame size, an fps, a duration — says *not measured*
rather than rendering a blank.

**The soundtrack library reads and decides as of 2026-09-02**, on `/projects/:id/music` — a cue's
category, mood, tags, measured duration, tempo, key, loop points, and the **safe dialogue level that
makes the ducking envelope computable rather than drawn by hand**, with approve and remove on the
card. **Rendering and promoting a cue are not here, and the reason is a type rather than a route**:
`GET /music-cues/renders` answers with `MusicCueRender`, declared in the orchestrator's repository
file and never published through `./contracts`, so the render list has no shape to parse and the
promotion has no render id to name. Both request DTOs are published — it is the response type that is
missing, and the screen says so rather than offering a control that cannot work.

**Effects are placed on a shot, and the wholesale route is the right shape there (2026-09-02).**
`PUT /shots/:shotId/audio-cues` replaces a shot's cues, and unlike the scene score — which the Music
Supervisor generates, so nudging one entry would mean restating a machine's work — a shot's effects
are a list a person composes. So the whole list *is* the editing surface: add, remove, save, with
`order` taken from the position on screen rather than typed. Clearing a shot is sending an empty
list. The editor sits on the shot review screen because that is where the shot is, and the audio
screen's sentence points there rather than claiming a missing route.

**A cue is rendered as a candidate and promoted by a person, and the split is the point
(2026-09-02).** `POST …/music-cues/renders` submits a candidate and answers with a render job;
`POST …/music-cues` promotes one into the library. Promotion is where the facts the library needs and
the render does not carry are recorded — the cue's name, where it loops, and the safe dialogue level.
**The blocker here was a response type, not a route**: `MusicCueRender` was declared in the
orchestrator's repository file and not published, so the candidate list had no shape to parse and the
promotion no id to name. That was reported and fixed upstream the same day, with the id **branded**,
so a bare uuid no longer parses where a render id belongs.

**Scoring is the Music Supervisor invoked, not a picker (2026-09-02).** `POST
/productions/:id/score` runs it with an optional brief and an optional cap on how much of a
production one cue may cover, and refuses with `MUSIC_CUE_VARIETY_OVERUSED` when a score would lean
on one. Every scene then shows the cues assigned to it **by name**, resolved through the project's
soundtrack library, with the start offset, gain, loop and fades the mix will use — and a cue the
library no longer returns says so rather than showing an id. **Adjusting a placement is not offered**:
the route replaces a scene's cues wholesale, so moving one would mean restating the rest, and the
screen says that rather than pretending the gap is a missing route.

**FE-13 made the dialogue audio real on 2026-09-01, and its stated dependency gated none of it.**
`/productions/:id/audio` was an `EmptyState`; it now reads a production's scenes, the lines each
carries, and every take a line has produced — model, seed, voice-profile SHA-256, audio hash, sample
rate, peak level and the **measured** duration. It writes too: a line is synthesised in either §22
pass, its audio is approved and un-approved, and the §19 animation tier it would get is shown —
computed on request and stored nowhere, which review caught this repo presenting as a recorded
decision. The phase's
dependency line says BE-21, and BE-21 blocks none of that: the whole dialogue and speech surface has
an explicit publishing block in `src/contracts/index.ts`, and what had made it unreachable was the
same single missing route that blocked FE-10. **That is the second phase running whose blocker was
not the phase on its dependency line.**

**Approval here is not take-selectable, and that shapes the screen.** `POST` and `DELETE
/dialogue-lines/:id/speech/approval` take no request body because the route approves whatever
synthesis matches the line's own `generatedAudioPath`, and refuses if that matches no recorded row —
approving a file with no provenance is what it exists to prevent. So the screen marks which take is
current rather than offering a choice the route cannot express. Re-voicing an approved line is
refused with `DIALOGUE_AUDIO_IMMUTABLE`, so un-approval is the only way back and both directions
shipped together.

**The runtime budget stopped being an estimate.** FE-09 answers "does this plan add up" from
durations a person typed. `POST /productions/:id/dialogue-timing` answers it from the audio that
exists, retiming every shot it can, and the report keeps `measuredSceneCount` and
`estimatedSceneCount` apart because an `ESTIMATED` scene's total is the Director's clamped request
and the contract says in as many words that it must not be reported as a measurement. It is a write,
so it invalidates the shots it retimed and the planner budget computed from them.

**Nothing on this screen can be played, for the same reason no storyboard frame is a picture.** No
route in the orchestrator serves an artifact's bytes — `src/artifacts/` has a module and a repository
and no controller, and the only `StreamableFile` responses in the whole backend are the source-asset
thumbnail and proxy. One missing controller holds back both phases.

**The continuity record became a screen on 2026-09-02, and nothing was blocking it.** Every status
line in `plan/` tracks a route that does not exist yet; nothing tracked a route that does exist and
that this repo had never called. Diffing all 164 orchestrator routes against `API_PATH` found four:
the continuity-fact collection, its `POST`, its `DELETE`, and `GET /planning-context`.
`/projects/:id/productions/:id/continuity` reads the whole record rather than the per-scene subset
the storyboard was showing, records a fact by hand, deletes a wrong one, and reads the Markdown
context a planning role was handed for a scene. **It does not name an entity**: a fact carries a
bare uuid and no type field, so resolving one would mean guessing across three features and reaching
into their queries — the same invention `plan/08` refused over plate kinds. It does not edit either,
because there is no update route, which is exactly why delete is offered. **The instrument matters
more than the screen**: ask what is published and uncalled, not only what is missing.

**Twenty-two stylesheets were reading a design token that does not exist, and all four gate stages
were green over it since the day each shipped.** CSS drops a declaration whose `var()` names an
undefined property and inherits instead, silently. Measured in Chrome against `tokens.css`:
`--font-family-mono` computes to **Times**, so every hash, path, seed and dB figure this app marks
as notation has been rendering in the body serif in fourteen stylesheets. `--color-text-primary` is
`--color-text`. `--color-text-danger` is `--tone-danger-fg`, and that one was the expensive one —
six refusal and error messages were rendering in the ordinary text colour with nothing marking them
as failures. `test/styles/every-css-variable-is-defined.test.ts` collects every definition and every
fallback-free read under `src/` and fails naming the file and the property. **That is the sixth time
`plan/16`'s point has held**, and the first time the defect was in a token name rather than in
markup.

**FE-12's advisory half landed the same evening, and the row that said it was blocked was right about
the blockers and wrong about the word.** `/productions/:id/shots` reads a production's scenes, each
shot's lifecycle state, and every `QcRun` recorded against it — kind, verdict, the sixteen technical
checks with observed against expected, and the run's provenance — and hands a rendered shot to a
reviewer, the one write the contract publishes because it takes no body. **The screen is built around
§27.2**: a shot's state badge is the only thing on the card that can be green, every automated
verdict wears the tone FE-04 gave a technical check, and `test/lib/status-tone/qc-outcome.tone.test.ts`
pins that no automated tone is ever `SUCCESS` while `APPROVED` is. What stays blocked has three
separate reasons — no artifact bytes, two DTOs not re-exported, no render-profile route — and the
phase file keeps them apart because each moves on its own. **The facts in force for each scene sit
above its shots as of 2026-09-02**, from the storyboard's own read, so the expected state is part of
what the reviewer sees beside the checks; the picture to hold them against is still the artifact bytes.

**Two other phases were re-measured at the same time and their rows corrected.** FE-12 read "not
started" while every route it needs had already landed; it is blocked, on three separate things —
the missing artifact bytes, two request DTOs that are not re-exported, and a hero-shot field that
exists nowhere in the contract. FE-14 is a published contract with no controller. **A grep of
`dist-esm/contracts/` is the wrong instrument for "is this published"** — the barrel also re-exports
DTOs from `src/<feature>/dto/`, so that grep called `createProductionRequestSchema` unpublished while
this repo imports it. Ask the resolver this repo compiles with.

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
| Zod | 4.5.2 | pinned exactly, **identical to the backend's pin**. Any split makes two `z.infer`s — measured 2026-09-01, a **minor** one (4.4.3 here against their 4.5.2) took `tsc -b` from 0.9 s to 14.3 GB and never completing. It presents as a hang, not an error |
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
