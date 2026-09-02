# FE-09 — Screenplay & production planner

> **Depends on:** 06 · **Blocks:** 10, 13 · **Backend needs:** BE-15 · **Plan authority:** §14, §22 Phase A, §23, §39
> **Status:** partly done 2026-08-22 — the runtime budget and the approval gate are real; the staged
> planning process is blocked on a route that runs a stage, and scene editing on a read
> surface that does not exist

## Goal

Create a production, run the staged planning process appropriate to its mode, and approve a plan whose
**runtime actually adds up** — before anything expensive is rendered.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Editor | a rich screenplay editor vs structured scene/line editing | **Structured.** The backend's source of truth is structured JSON (BE-15), dialogue lines are separate entities so TTS can measure them, and a free-text editor would have to round-trip through parsing. |
| 2 | Stage navigation | linear wizard vs revisitable stages | **Revisitable.** §14.3's process includes a revision step; planning is iterative. |
| 3 | Runtime budget display | a summary number vs a per-scene breakdown | **Both, always visible.** See below. |

## Steps

### 1. Production creation

`productionKind` (8 values) · `narrativeMode` (6 values) · `targetRuntimeSeconds` · production profile ·
style profile · title · logline · brief.

**`narrativeMode` determines which stages exist.** A `MUSIC_DRIVEN` production must show **no
screenplay stage** — §3.2 is explicit that no stage may require a screenplay when the mode does not
need one. Drive the stage list from the backend's per-mode table (BE-15), not from a hard-coded array.

Targets other than 20 minutes must work identically: 30 seconds, 3 minutes, 45 minutes, custom.

### 2. Creative input (§14.1)

Accept any of: a one-sentence idea · a paragraph or treatment · a complete screenplay · a lesson or
theme · a shot list · a music track or musical brief · reference images or video · required subjects,
locations and props · an imported timeline concept · or "propose ideas".

Each is a different entry point to the same planner. Do not build a single "describe your video" box
and call it done.

### 3. Staged planning (§14.3)

```text
idea/treatment -> logline -> beat sheet -> timed scene outline
  -> screenplay/dialogue where applicable -> continuity review
  -> audience/tone review -> runtime estimation -> revision
```

Each stage is a separate backend call with its own schema. The UI shows each stage's output, lets the
user edit it, and lets them re-run **one stage** without discarding the others. Re-running the beat
sheet should not silently destroy an edited scene outline — warn, and make the consequence explicit.

For non-narrative modes the stages differ (music sections → visual beats → scenes → shots). Same
mechanism, different list.

### 4. The runtime budget — the most important panel on this screen

Every scene has a target duration. **The sum plus reusable material must approximate the production
target**, and the backend blocks approval outside tolerance (BE-15).

> "Do not wait until final assembly to discover that a 20-minute target contains only 11 minutes of
> planned material." — §14.4

So: a persistent, always-visible budget bar showing target, planned, reusable and delta — with a
per-scene breakdown of where the time went. When a plan is short, the UI must say **which scenes are
underweight**, not just that the total is wrong.

This panel is why this phase exists before rendering.

### 5. Scene and dialogue editing

Scenes: order, slugline, location, time of day, purpose, emotional beat, target duration, subjects,
props, continuity in/out. For music-driven or abstract work, `purpose` describes visual or musical
intent — label it accordingly rather than showing "narrative purpose".

Dialogue lines: speaker (**optional** — narrator lines have none), voice profile, language, text,
pronunciation overrides, emotion, pace, pauses.

**Language is per line.** Render `dir` from the line's own `language` field, so a Hebrew line inside an
English UI displays correctly (phase 15 owns the mechanism). Never a "Hebrew mode" toggle.

**Dialogue duration is measured, never estimated.** Until TTS has run (BE-17), show it as unknown —
not as a word-count guess. §59 names estimating from word count as an anti-pattern, and a guessed
number displayed confidently is worse than a blank.

### 6. Continuity review

Show the Continuity Editor's findings (BE-14/BE-08) inline against the scenes they concern. Advisory:
it flags, it does not block. Let the user dismiss with a reason, and keep the reason.

### 7. Structure profiles (§14.5)

Offer reusable structures — the 20-minute episodic profile is **an example, not the format**. Show the
selected structure against the actual scene plan so an overrun act is visible.

### 8. Approval and state

The production state machine (§23) drives what is available. `SCREENPLAY_APPROVED` and
`OUTLINE_APPROVED` are transitions with consequences: **final rendering is not permitted before the
required approvals**. Make the gate visible so a refused render is not a mystery.

## What landed, and what the orchestrator does not offer

BE-15 merged upstream as `31b4713` and published three surfaces: productions, structure profiles, and
planning. Measured against a running orchestrator on 2026-08-22 rather than read off a route table.

**Readable and built.** `GET /projects/:id/productions` and `GET :id`; `POST`, `PATCH` and
`POST :id/transitions`; `GET /projects/:id/production-profiles`; and the three planning routes —
`GET /productions/:id/planning/stages`, `GET …/budget` and `POST …/approval`. Every request and
response shape is published through `./contracts`.

**A production is edited as of 2026-09-02.** `PATCH /projects/:id/productions/:id` had been published
since BE-15 and this repo never built against it, so a title typed wrong stayed wrong — the dead-end
class FE-16's second pass found on the style library. The card now offers Edit, and the form sends
only the fields that changed, because `updateProductionRequestSchema` is `.partial()` with a refine
that refuses an empty body. Kind and mode are offered too, since the DTO accepts them and
`ProductionsService.update` applies them; the hint says the stage list follows the mode and nothing
already planned is re-run, which is what that service does and all it does. **One asymmetry, said on
the field**: every optional field is `.optional()` with no `null`, so once a logline, brief,
tolerance, sequence number or structure profile is set it cannot be emptied from here — an absent key
is *leave alone* and there is no way to say *none*. The form names it on the field the moment it is
emptied rather than saving a no-op.

**A transitions control is not built, and the reason is one missing export.**
`POST :id/transitions` and `transitionProductionRequestSchema` are published, but the table that says
which moves are legal from a state — `PRODUCTION_TRANSITIONS` and `canTransition` — lives in
`src/productions/constants/` in the sibling and is not re-exported through `src/contracts/index.ts`.
Offering every state and explaining `PRODUCTION_TRANSITION_INVALID` afterwards is the defect `plan/08`
refused in the keyframe-requirement picker, and copying the table here is the second source of truth
FE-10 removed. Reported to the backend session on 2026-09-02; one export unblocks it.

**Not offered at all, and this is what blocks most of this phase.**

- **No route runs a planning stage.** `PlanningService.runStage` exists, refuses a stage the mode does
  not need, and refuses `RUNTIME_ESTIMATE` outright as arithmetic — and no controller reaches it. Its
  parameters are a local-LLM provider, a request and an abort signal, all server-internal. Re-measured
  at commit time: `grep -rn runStage src --include="*.ts"` in the sibling finds its definition and one
  more line, and no controller. **The second hit is a docblock in BE-16's `DirectorService`, prose
  about `runStage` rather than a call to it** — this file said "one service-to-service call" and that
  was a grep hit read as evidence without opening the line, which is the fourth time on 2026-08-22
  that shape has produced a false sentence here. The conclusion is unaffected and the reason for it is
  corrected. `ContinuityReviewService` is in the same position: referenced by its own module and by
  `DirectorService`, by no controller. So steps 2, 3 and 6 are unbuildable, not unbuilt.
- **No `GET` for a production's scenes.** `PUT /planning/scenes` replaces them wholesale and returns
  `readonly unknown[]`. This screen therefore sees scenes only as rows in the budget report, which is
  why step 5 is unbuildable.
- **Corrected 2026-09-01: the dialogue-line controller exists, and it changes nothing here.** BE-17
  merged as `014712e` and published `POST`/`GET /scenes/:sceneId/dialogue-lines`,
  `GET`/`PATCH`/`DELETE /dialogue-lines/:id`, speech synthesis and dialogue timing, with every DTO
  through the barrel. Its collection is keyed on `sceneId`, so it is the third surface behind the
  missing scene `GET` rather than a fourth thing to build. This file said "no dialogue-line controller
  of any kind" and the screen said "There is no dialogue route at all"; both were false for a day, and
  both named the wrong blocker even while they were true. **Track the missing route, not the phase
  number** — the same lesson `plan/10` records.
- **A production's pinned style version, on the other hand, is resolvable and this file said it was
  not.** `GET /projects/:projectId/style-profiles/:id` takes exactly the id `Production.styleProfileId`
  carries; the lineage-scoped routes are the other two on that controller. The screen said the lookup
  could not be formed, which was a claim that the orchestrator lacked something it had. It is built
  now, which also ticks `plan/08`'s "which version a production is pinned to" — that box was blocked
  on a production having no route, and BE-15 gave it one.
- `continuityReviewSchema` and `toneReviewSchema` are published contracts with no route, so step 6 has
  a shape and no data. `GET /productions/:id/planning-context` exists and returns **markdown**, not
  findings.

## Step 1 is real, and it is the first create form in this app

`/projects/:projectId/productions` lists a project's productions and creates one. All eight kinds and
all six narrative modes come from `productionKindSchema.options` and `narrativeModeSchema.options`;
their labels are `satisfies Record<X, TranslationKey>` maps, so a member added upstream breaks the
build here rather than rendering as a raw token.

**Nothing defaults to twenty minutes.** Target runtime is a minute field and a second field, both
starting empty, with a live clock under them. An unedited submit fails the contract rather than
sending a target nobody chose.

**The contract is the validator.** The body is assembled and run through
`createProductionRequestSchema`; there are no hand-written rules to drift from it. What a rejected
field *says*, though, is translated: `fieldErrorsFromIssues` maps the issue's own `code` and `origin`
onto a catalogue key, because Zod's `Too small: expected string to have >=1 characters` is developer
prose and a Hebrew reader would have got an English assertion about character counts.

`styleProfileId` is required and this project may have none, so the form is replaced by a sentence
saying where one comes from. **Corrected 2026-09-01: that sentence used to send the user to the
orchestrator**, because the style library could approve a profile and not create one. FE-08's write
half closed that gap the same morning, and the sentence outlived it by hours — it now points at
`/styles`, which is where the first version actually gets made. The chain is still a chain; it just
no longer leaves the app.

**A production's tolerance is three states and the third one is load-bearing:** declared here,
declared by its bound structure profile, or declared by neither — in which case the orchestrator
refuses to compute a budget at all. The card says so rather than leaving the user to meet
`RUNTIME_TOLERANCE_UNDECLARED` as a refusal on the next screen.

## The runtime budget is the part that is real, and it is the reason for the phase

`RuntimeBudgetReport` carries target, tolerance, planned, reused, total, variance, a verdict, a
server-authored sentence, and one `RuntimeSegmentShare` per segment. The panel renders all of it:
every figure as a clock in its own inline `dir="ltr"` element, the sentence through `ContentText`
untranslated, and the segments in plan order with reused material marked.

**"Which scenes are underweight" is measured, not invented.** The report gives no per-scene target and
inventing one — an even split, a profile section mapped onto a scene — would be a number this repo made
up, which is the same mistake `plan/08` refused for `NIGHT`. So underweight means *below this plan's
own mean planned scene*, the screen says so in as many words, and it publishes the mean and the
per-scene move that would close the gap beside it. When every scene sits on the mean it says the
shortfall is spread rather than naming nothing.

The mean is over planned scenes only. A structure profile's **reusable** sections enter the budget as
segments; letting a 45-second recap into the mean would move it.

**A structure profile's non-reusable sections are not checked by anything.** `collectRuntimeSegments`
filters to `reusable`, so the acts a profile declares are structure the budget ignores. That is why
step 7's "show the selected structure against the actual scene plan so an overrun act is visible" is
only half met: the reusable half is in the budget, the act shape is not compared by the orchestrator
and this screen does not invent the comparison.

## Approval, and the two guards that survive a reload

`POST /planning/approval` is the second mutation in this app and follows FE-07's pattern: nothing
optimistic, disabled in flight, every affected query invalidated and awaited before it settles.

Both guards are **server-given state, not client flags**. The control renders only when the production
is in the one state the transition table allows the move from, and only when the server's own report
says `withinTolerance`. A reload re-reads both. Confirmed end to end against the orchestrator: with a
plan totalling 20m 0s against a 20m target the control appeared, approving it moved the production to
`STORYBOARDING`, and the refetch replaced the control with the sentence saying the production is no
longer at the planning gate.

There is no reject, so `ApprovalControls` gets no `onReject`. There is no regeneration, so it gets an
empty `regenerationModes`. Rendering a control the orchestrator cannot serve is the defect FE-07 named.

The three refusals were exercised live: `RUNTIME_BUDGET_OUT_OF_TOLERANCE` on a short plan,
`PLANNING_STAGE_MISSING` on a production with no scenes, and `RUNTIME_TOLERANCE_UNDECLARED` on one
bound to no structure profile. The last is a state of the production rather than a failure of the
request, so it gets its own panel naming what is missing and why there is no default.

`PLANNING_STAGE_MISSING` is checked **before** the state, so a production at `IDEA` with no scenes is
refused for the scenes rather than for the transition. That ordering is why the approval control still
surfaces a refusal rather than assuming its two guards are sufficient.

## The stage list is read, never derived

`GET /planning/stages` is the authority. The contract also publishes
`REQUIRED_STAGES_BY_PLANNING_MODE` and `requiredStagesForNarrativeMode`, and this repo deliberately
uses neither: the route is what a given production actually needs, and a table is a second place for
it to be true. A test hands the component a single stage no mode produces and asserts it renders that.

Measured live: a `SCREENPLAY` production returns seven stages including `SCREENPLAY`; a `MUSIC_DRIVEN`
production returns four and none of them is it. §3.2's clearest rule, and it holds because the answer
comes off the wire.

**Two constants in `planner.constants.ts` mirror backend tables the contract does not publish, and a
later phase should re-check them rather than inherit them.** Neither `PLANNING_STAGE_EXECUTION` nor
`PRODUCTION_TRANSITIONS` is exported through `./contracts` — measured, not assumed. So:

- `RUNTIME_ESTIMATE` is marked *answered by the budget above* because it is the single
  `DETERMINISTIC` entry in the backend's stage table and its refusal message tells a caller to read
  the budget. If another stage ever becomes deterministic, this screen badges the wrong one.
- approval is offered only from `PLANNING`, because `STORYBOARDING` appears as a destination nowhere
  else in the transition table. If another state ever reaches it, this screen hides a control that
  would work.

Both fail silently through a green gate, because the values are contract enum members and only the
*tables* are unpublished. Both were re-checked at commit time. The stage name and the state name come
from the contract's own `PLANNING_STAGE` and `PRODUCTION_STATE`, never from a string literal.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn dev
```

- create a `MUSIC_DRIVEN` production → **no screenplay stage appears anywhere**;
- create a `SCREENPLAY` production from one sentence and walk every stage;
- import a full screenplay → normalised, not regenerated;
- build a plan summing to 11 minutes against 20 → the budget bar shows the deficit **and names the
  underweight scenes**, and approval is blocked;
- re-run one stage → the others survive, with an explicit warning about what is affected;
- add a Hebrew dialogue line inside an English UI → it renders RTL, the shell stays LTR;
- confirm dialogue duration reads "not yet measured" before TTS, never a guess;
- create a 30-second production → nothing assumes 20 minutes;
- attempt a video render before approval → refused, with the reason visible.

## Done when

- [x] all 8 kinds and 6 modes; stages derive from the backend's per-mode table — and from the *route*
      rather than the table the contract also publishes, so a production's own answer is what renders
- [ ] every §14.1 input path is reachable — **two of ten.** A one-sentence idea is `logline` and a
      paragraph or treatment is `brief`, both on the create form. The other eight — a complete
      screenplay, a shot list, a music track, reference images, required subjects or locations, an
      imported timeline, "propose ideas" — all need a route that runs a planning stage, and there is
      none
- [ ] stages are individually re-runnable, with explicit consequences — **unbuildable, same reason**
- [x] the runtime budget is always visible and names underweight scenes
- [~] scenes and dialogue lines are structured; speaker is optional — **the dialogue half is built,
      2026-09-01.** A line is created on its scene with text, language, voice, an optional speaker,
      position, emotion, pace and both pauses; edited for text, emotion, pace and pauses; and deleted
      while it has never been voiced. Language and voice are frozen after creation because the update
      DTO does not carry them — existing audio would disagree with the line — and the form says so.
      Edit is refused upstream on an approved line (`DIALOGUE_AUDIO_IMMUTABLE`) and so is not offered;
      Delete has **no** upstream guard and would orphan takes, so it is offered only before a line has
      audio. The scene half stays unbuildable: `PUT /planning/scenes` still deletes and re-inserts
- [x] language is per line, with `dir` from the data; no language toggle — **a line carries its own
      `language`, entered once and frozen; the card renders its text through `ContentText` with that
      language, and a test asserts a `he` line's `<bdi>` is `dir="rtl"` while `<html>` is not**
- [x] dialogue duration is measured or blank, never estimated — **`durationMs` shows only once a
      synthesis has written it, and the card shows nothing before; the timing run (FE-13) reports a
      scene as `ESTIMATED` rather than a number when no shot in it carries dialogue**
- [ ] continuity findings are inline and advisory, with dismissal reasons kept — **contract, no route**
- [ ] structure profiles are selectable and compared against the plan — **selectable, half compared.**
      A production is bound to one when it is created, and its reusable sections are in the budget,
      marked as reused, and named. Its non-reusable act shape is compared by nothing:
      `collectRuntimeSegments` filters to `reusable`, so an overrun act is not visible and this screen
      does not invent the comparison
- [x] approval gates are visible and enforced

## Traps

- **A screenplay tab on a music video.** §3.2's clearest rule.
- **One "describe your video" box.** There are ten legitimate entry points.
- **Estimating dialogue duration.** §59 names it; the number arrives from TTS.
- **A total-only budget.** "You are nine minutes short" without saying where is not actionable.
- **A Hebrew mode toggle.** Language is data on each line.
- **Regenerating everything when one stage is re-run.** Staged planning exists so that is unnecessary.
