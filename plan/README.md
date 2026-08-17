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
| 03 | [App shell, routing & boundaries](03-app-shell.md) | 02 | — | not started |
| 04 | [Data layer — contracts, queries, store](04-data-layer.md) | 03 | **BE-01** | not started |
| 05 | [Realtime bridge](05-realtime.md) | 04 | **BE-23** | not started |
| 06 | [Project dashboard & system status](06-dashboard.md) | 05 | BE-04, BE-11 | not started |
| 07 | [Asset ingestion & subject review](07-assets-and-subjects.md) | 06 | BE-11, BE-12 | not started |
| 08 | [Style, voice, location & prop studio](08-style-studio.md) | 07 | BE-13 | not started |
| 09 | [Screenplay & production planner](09-planner.md) | 06 | BE-15 | not started |
| 10 | [Storyboard review](10-storyboard.md) | 09 | BE-18 | not started |
| 11 | [Render queue](11-render-queue.md) | 05 | BE-05, BE-23 | not started |
| 12 | [Shot review](12-shot-review.md) | 11 | BE-19, BE-20 | not started |
| 13 | [Audio & music](13-audio.md) | 09 | BE-21 | not started |
| 14 | [Timeline & final production](14-timeline-and-final.md) | 12, 13 | BE-22 | not started |
| 15 | [Internationalisation & RTL](15-i18n-and-rtl.md) | 03 | — | not started |
| 16 | [Accessibility & performance](16-a11y-and-performance.md) | all UI phases | — | not started |
| 17 | [Test suite & acceptance](17-acceptance.md) | all | BE-26 | not started |

## Phases 15 and 16 are not "polish"

**RTL is not a late pass.** Hebrew is a stated production language; every component written before
phase 15 must already use logical properties, because retrofitting them across a finished UI is a
week of work and a permanent source of regressions. Phase 15 is where the *interface* language
mechanism and the direction switch land — not where the CSS gets fixed.

**Accessibility has no automated net today.** `.oxlintrc.json` ships three plugins and two rules;
`jsx-a11y` is not among them until phase 00 adds it. Until then nothing catches a missing label.

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

`not started` · `in progress` · `blocked: <why>` · `done <date>`

Keep the table above current. It is the only place the overall state is recorded.
