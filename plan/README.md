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
| 04 | [Data layer — contracts, queries, store](04-data-layer.md) | 03 | **BE-01** | **done 2026-08-20** · seam complete; covers the 4 endpoints the orchestrator serves. `POST /render-jobs`, capabilities, error codes over HTTP and the socket are all blocked on the backend — see the phase file |
| 05 | [Realtime bridge](05-realtime.md) | 04 | **BE-23** | **blocked: BE-23 not started** — no `*.gateway.ts`, no websocket dependency and no realtime event schema in the shared contract, all re-checked 2026-08-21. Its own decision 1 is "follow the backend"; there is nothing yet to follow |
| 06 | [Project dashboard & system status](06-dashboard.md) | 05 | BE-04, BE-11 | **partly done 2026-08-21** · `/system`, the readiness strip and now the **project list** are real. BE-11 published `/projects` mid-session and the list is the part this repo can consume. Creation, per-project storage, rename and delete are blocked on their request and response shapes living outside `src/contracts/`, so the package does not publish them — a missing export, not a missing endpoint. Reusable libraries wait on **BE-13**; memory and runtimes on **BE-23** |
| 07 | [Asset ingestion & subject review](07-assets-and-subjects.md) | 06 | BE-11, BE-12 | **unblocked for its asset half 2026-08-21** — BE-11 now serves `/projects/:projectId/assets` (upload, import, list, thumbnail, proxy) and `/capture-guide`, and `captureGuideSchema` and `sourceAssetSchema` are both published. Subjects and canonical sets still need **BE-12**, which has not started |
| 08 | [Style, voice, location & prop studio](08-style-studio.md) | 07 | BE-13 | not started |
| 09 | [Screenplay & production planner](09-planner.md) | 06 | BE-15 | not started |
| 10 | [Storyboard review](10-storyboard.md) | 09 | BE-18 | not started |
| 11 | [Render queue](11-render-queue.md) | 05 | BE-05, BE-23 | not started |
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
