# Frontend build plan — `SkyFilmeStudio-FE`

The frontend half of `../../LOCAL_AI_STUDIO_PLAN.md`, split into phases that are executed **one at a
time, in order**. The backend half is `../../sky-filme-studio-be/plan/`.

Read this file, then the phase you are on. Do not read all 18 phases into context at once.

## How to execute a phase

1. Open the phase file. It states what is true when the phase is done.
2. Answer its **Decisions** table first. A phase with an unanswered decision is not ready to start —
   bring the options to the user, do not pick silently.
3. Check the **backend dependency**. Most phases here cannot start until a specific backend phase has
   published its contract. Building against a guessed shape is the most expensive mistake available in
   this repo.
4. Work through **Steps** in order.
5. Run everything under **Verification** and paste the real output — and say what you *looked at*, not
   only what compiled.
6. Tick **Done when**. Every box, or the phase is not done.
7. Update the status line in this file's table, and commit.

## The rules that outrank the plan

They are in `../CLAUDE.md` and `../.claude/rules/`. The short version:

- the UI talks to the **NestJS orchestrator and nothing else** — never ComfyUI (`:8188`), never LM
  Studio (`:1234`), never a database;
- **no external asset reaches the bundle** — no CDN font, no analytics, no error-reporting SDK;
- wire types are **inferred from the shared Zod contract**, never hand-written;
- **no optimistic updates** on approve / reject / retake / cancel / export;
- renders return a `renderJobId` and are never awaited;
- **logical CSS properties only** — Hebrew is a first-class production language;
- tests live in `test/`, mirroring `src/`;
- **no shell commands in `.ts`/`.tsx`, not even in comments.**

## Phases

| # | Phase | Depends on | Backend needs | Status |
| - | ----- | ---------- | ------------- | ------ |
| 00 | [Toolchain & repository hardening](00-toolchain.md) | — | — | done 2026-08-15 |
| 01 | [Document shell & app identity](01-document-shell.md) | 00 | — | done 2026-08-15 |
| 02 | [Design system & tokens](02-design-system.md) | 01 | — | done 2026-08-17 |
| 03 | [App shell, routing & boundaries](03-app-shell.md) | 02 | — | done 2026-08-17 |
| 04 | [Data layer — contracts, queries, store](04-data-layer.md) | 03 | **BE-01** | **done 2026-08-20 · error envelope corrected 2026-08-22** · seam complete. **Error codes now reach the client**: BE-11 landed a global exception filter, and the envelope this phase had guessed — and flagged in writing as a guess — turned out wrong, so all twenty-one codes were falling through to the status-only sentence in a fully green tree. `POST /render-jobs`, capabilities and the socket are still blocked on the backend — see the phase file |
| 05 | [Realtime bridge](05-realtime.md) | 04 | **BE-23** | **blocked: BE-23 not started** — no `*.gateway.ts`, no websocket dependency and no realtime event schema in the shared contract, all re-checked 2026-08-21. Its own decision 1 is "follow the backend"; there is nothing yet to follow |
| 06 | [Project dashboard & system status](06-dashboard.md) | 05 | BE-04, BE-11 | **partly done 2026-08-21** · `/system`, the readiness strip and now the **project list** are real. BE-11 published `/projects` mid-session and the list is the part this repo can consume. Creation, per-project storage, rename and delete are blocked on their request and response shapes living outside `src/contracts/`, so the package does not publish them — a missing export, not a missing endpoint. Reusable libraries wait on **BE-13**; memory and runtimes on **BE-23** |
| 07 | [Asset ingestion & subject review](07-assets-and-subjects.md) | 06 | BE-11, BE-12 | **partly done 2026-08-21, detail view and subject review 2026-08-22** · the asset library, capture guide, **asset detail** and now the **subject list and Subject Review** are real. BE-12 published `subjects` and `canonical-sets`, so a subject's identity, its approved set's lineage — version, frozen descriptor and its SHA-256 — and its references with anchor eligibility all render. **Approval is real as of 2026-08-22** — the *Open draft* section finds the `PENDING` set, shows what it depicts, and approves it. **The first mutation in this app**: no optimistic update, disabled while the request is in flight, both affected queries invalidated after the server answers, and the guard that survives a reload is the refetched list having no `PENDING` set rather than any client flag. What had blocked it was a missing `GET` on the collection rather than a missing export, and `edb38a3` added it. **Registration, draft creation and both import transports are still blocked on request shapes outside `./contracts`** — BE-13 began re-exporting its own DTOs through the barrel, but no subject, asset or project DTO is published, so each of those says so on screen rather than offering a control that does nothing. The draft-versus-approved comparison is now endpoint-backed and simply unbuilt |
| 08 | [Style, voice, location & prop studio](08-style-studio.md) | 07 | BE-13, BE-14 | **partly done 2026-08-22, step 7 landed 2026-09-01** — corrected 2026-09-01: this row still read `blocked: BE-13 in progress, no route yet` after PRs #22 and #23 had landed the phase, which is the same staleness the row itself was written to fix. The creative library reads and approves across style profiles, voices, the pronunciation dictionary, locations and props. **The project bible is now real** — BE-14 merged as `f168891`, and `/projects/:projectId/bible` lists every version, marks the active one, renders the four sections against `bibleCarriesNarrative` so a kind carrying no narrative section says so, shows the orchestrator's generated Markdown view, and **publishes a draft** with the same structural guard FE-07 established. Still unbuilt: style samples (blocked on the unpublished render-job DTO), reusable libraries (no controller), and bible create/edit. Pinning a bible to a production has a route whose request shape is unpublished |
| 09 | [Screenplay & production planner](09-planner.md) | 06 | BE-15 | **partly done 2026-08-22** · BE-15 merged upstream as `31b4713` and the two screens it allows are real: the **production list**, which also creates a production across all eight kinds and six modes with the contract as its validator, and the **planner**, whose runtime budget answers the question the phase exists for — 12m 30s against a 20m target, 7m 30s short, the underweight scenes named, approval refused. Stages come from `GET /planning/stages`, so a music-driven production shows no screenplay stage because the wire has none. Plan approval is real and gated on server state twice over. **What is left is unbuildable rather than unbuilt**: no route runs a planning stage, no route returns a production's scenes, and — corrected 2026-09-01 — a dialogue-line controller that exists and cannot be reached. BE-17 merged as `014712e` with dialogue lines, speech, approval and dialogue timing, every DTO through the barrel; its collection is `@Controller('scenes/:sceneId/dialogue-lines')`, so it is the third surface gated behind the missing scene `GET` rather than a fourth thing to build. Between them these block the staged process, scene and dialogue editing, and the continuity review |
| 10 | [Storyboard review](10-storyboard.md) | 09 | BE-18 | **blocked: no idempotent read of a production's scenes** — measured 2026-08-31, re-measured twice on 2026-09-01. The scene ids **are** on the wire: `PUT /productions/:productionId/planning/scenes` returns the full rows, and only its declared `readonly unknown[]` throws them away — the backend's own e2e spec parses that response with `z.array(sceneSchema)` and uses `scene.id`. But it is a destructive replace: every scene is deleted and re-inserted with a fresh `randomUUID()`, and `shots.scene_id` is `onDelete: 'restrict'`, so it mints new ids when it works and refuses once shots exist — which is exactly when a storyboard has something to review. **A read that destroys what it reads is not a read.** The missing piece is a controller method over the already-existing `ScenesRepository.listForProduction`; no query and no new contract. **BE-18 is not the blocker and never was** — its status went `not started` → `in progress` → **merged as `f14098e`** inside one session, publishing all twelve storyboard routes, and the phase did not move once, because every one of them is keyed on a `shotId`. **Track the missing route, not the phase number.** This repo also reported the wrong reason first, from a grep over controller return-type annotations that was validated against a true positive — a sound instrument aimed at the wrong question, which no true-positive check catches |
| 11 | [Render queue](11-render-queue.md) | 05 | BE-05, BE-23 | **blocked: there is no `GET /render-jobs`** — measured 2026-08-31. The controller publishes exactly `POST /render-jobs` and `GET /render-jobs/:id`, so the table this phase exists for has nothing to enumerate; `renderJobSchema` is published, so this too is a missing `GET` rather than a missing shape. `createRenderJobRequestSchema` remains outside `./contracts`, and workers, pressure and progress are **BE-23**, not started |
| 12 | [Shot review](12-shot-review.md) | 11 | BE-19, BE-20 | not started |
| 13 | [Audio & music](13-audio.md) | 09 | BE-21 | not started |
| 14 | [Timeline & final production](14-timeline-and-final.md) | 12, 13 | BE-22 | not started |
| 15 | [Internationalisation & RTL](15-i18n-and-rtl.md) | 03 | — | **done 2026-08-20** · taken out of order because 05 is blocked and 15 needs no backend. the mechanism is complete and both catalogues are full — 102 keys at the time, 183 after FE-06 — direction switches without a reload, zero physical CSS properties found |
| 16 | [Accessibility & performance](16-a11y-and-performance.md) | all UI phases | — | **partly done 2026-08-21** · taken out of order because 07–14 are all backend-gated and 16 needs no backend. Everything the current surface allows is done and measured: focus on navigation, SC 2.1.4 single-key shortcuts, SC 1.4.11 control contrast, contextual approval names, a live region for the readiness verdict. Every remaining box needs a screen that does not exist — the phase file names which phase each one waits for |
| 17 | [Test suite & acceptance](17-acceptance.md) | all | BE-26 | not started |

## Phases 15 and 16 are not "polish"

**RTL is not a late pass.** Hebrew is a stated production language; every component written before
phase 15 must already use logical properties, because retrofitting them across a finished UI is a
week of work and a permanent source of regressions. Phase 15 is where the *interface* language
mechanism and the direction switch land — not where the CSS gets fixed.

**Accessibility's automated net is real but shallow.** Corrected 2026-08-21 — an earlier version of
this line said `jsx-a11y` was not enabled. It has been on since phase 00 landed: `.oxlintrc.json`
ships nine plugins and eleven rules, and measured in FE-16 the plugin reports nothing on `src/` even
with `pedantic`, `style` and `suspicious` added to the default `correctness` category.

That is the point rather than the reassurance. `jsx-a11y` reads attributes. It does not know that a
navigation left focus on the link that was clicked, that a single-letter shortcut fires approve from
anywhere on the page, or that a border is at a quarter of the contrast its own criterion asks for.
All three were live in a green tree, and FE-16 found them by using the app.

## The contract guard stopped depending on their checked-out branch — 2026-09-01

`test/contract-source-matches-runtime.test.ts` used to read the backend's
`src/contracts/enums/error-code.ts` **from their working tree** and compare it to
what their build exports. That made this repo's gate a function of which branch
the sibling happened to have checked out, and it oscillated three times in one
session: 59 codes, then 63 when they built on `be-18-storyboard-and-keyframes`,
then 59 again when they rebuilt from `origin/master` at our request, then 63 again
the next time their own gate rebuilt — which it does after every `.ts` edit.

**The backend session named the defect correctly: the coupling was wrong, not the
guard.** No amount of rebuilding from either side settles a check keyed to a
working tree.

The guard now compares the **two halves of the same build**: the literals declared
in `dist-esm/contracts/enums/error-code.d.ts`, read as text, against the runtime
`ERROR_CODE` loaded from `dist-esm/contracts/enums/error-code.js`. That is the
invariant the file is named for — *the contract this app loads is one build, not
two* — tested directly rather than through a proxy, and it is the exact failure
that was live for twenty minutes on 2026-08-22 when `types` and `import` briefly
came from different compilations.

**What that trades away, stated plainly.** The old assertion also caught "their
build is behind their source". Nothing here catches that now. It was never a
reliable signal anyway — it fires constantly while they work, and it stayed green
through the one real instance of build rot this seam has produced, where six
emitted files carried unrewritten `@/` specifiers and only `yarn build` failed.
**Build rot is caught by the bundle; type/runtime divergence is caught here.**

Their suggestion of resolving the contracts entrypoint to an artifact built from a
pinned ref is still the better long-term answer and is still unpicked, alongside
the three options already on record. This change makes the gate stop lying in the
meantime; it does not settle the seam.

## What the backend must have published first

The coupling that will actually bite:

- **BE-01 (contracts) blocks FE-04, and FE-04 blocks almost everything.** Do not start the data layer
  against a guessed shape.
- **BE-23 (gateway) blocks FE-05.** The queue and shot-review pages depend on it.
- A page whose backend phase has not landed can be built against **contract-derived fixtures** — never
  against invented types.

## Milestone mapping (plan §50)

| Milestone | Frontend phases |
| --------- | --------------- |
| M2 — asset + subject pipeline | 00–08 |
| M3 — 30–60 s end-to-end slice | 09–14 |
| M4 — 5-minute mini production | 15–16 + fixes from M3 |
| M5 — full ~20-minute production | 17 |

## Status legend

`not started` · `in progress` · `blocked: <why>` · `partly done <date>` · `done <date>`

**`partly done` is not `done`.** Use it when a phase built everything its endpoints allow and the
rest is waiting on a named backend phase. The phase file must say which box waits for what; a phase
with an unfinished box and no named blocker is `in progress`.

Keep the table above current. It is the only place the overall state is recorded.
