# FE-10 — Storyboard review

> **Depends on:** 09 · **Blocks:** 12 · **Backend needs:** BE-18 · **Plan authority:** §17, §39, §49.4
> **Status:** blocked — no idempotent read of a production's scenes. The ids exist on the wire; the
> only route carrying them replaces the scene set to do it, and refuses once shots exist

## Goal

The gate that stands between a plan and hundreds of expensive video renders. If this screen is
pleasant to use at two hundred shots, the pipeline works. If it is not, people will skip it — and
§17's whole point is that they must not.

> "Never send an unreviewed screenplay directly into hundreds of final video renders." — §17

## Why this cannot start yet — measured 2026-08-31, re-measured 2026-09-01

Two blockers were measured. **One of them is gone as of 2026-09-01, and the phase is still blocked**,
which is the useful part: the blocker that mattered was never the one on the dependency line.

**BE-18 has merged, and it changes nothing here.** ~~BE-18 has not started~~ — that was true on
2026-08-31 and false twenty-two minutes before this was written. BE-18 landed on backend `master` as
`f14098e`, and it is not a stub: `storyboards.controller.ts` publishes `POST`/`GET .../frames`,
`frames/regenerate`, `frames/revise-prompt`, `frames/change-framing`, `frames/change-expression`,
`keyframe-waiver`, `keyframe-requirement` and `keyframe-status` under `shots/:shotId/storyboard`,
plus `GET :frameId/comparison` and `POST`/`DELETE :frameId/approval` under `storyboard-frames`. All
five of its refusals are wired to real throw sites now, not merely declared. Steps 2, 3, 5 and 6 have
something to read at last — and no way to reach it, because **every one of those routes is keyed on a
`shotId`**, which is keyed on a `sceneId`, which is the blocker below.

The lesson is about how this file was read, not about the backend. "Blocked on BE-18" was the
dependency line's answer and it was the wrong one to track; the phase would have unblocked the day a
`GET` returned scenes, whether or not BE-18 existed. **Track the missing route, not the phase
number.**

**The shot half that BE-16 *did* publish is unreachable.** BE-16 merged as `d658f69` and shipped
`shots.controller.ts`, which is real: `GET /scenes/:sceneId/shots`, `GET /shots/:id`,
`GET`/`POST /shots/:id/prompt` and `POST /shots/:id/transition`. Every one of them is keyed on an id
this repo cannot obtain.

**Corrected 2026-09-01.** An earlier version of this section said "no published route yields a
`SceneId`" and gave the wrong reason. It was wrong twice over, and the corrected statement is
narrower and more useful.

Not true: that the contracts are incomplete. `sceneSchema` is published and carries
`id: sceneIdSchema`, and both `shotSchema` and `dialogueLineSchema` carry a `sceneId`. A `Shot` in
hand does hand you the scene it belongs to.

Not true either: that one path contains `scenes`.
`PUT /productions/:productionId/planning/scenes` is a second, and `scenes/:sceneId/shots` is a
*controller* carrying two routes rather than a route. The earlier sentence conflated the two.

**Corrected again, later the same day, by the backend session.** The claim above this line — that
`PUT /planning/scenes` "discards the ids it just created" — was **false**, and the way it was reached
is the more useful half.

`PUT /productions/:productionId/planning/scenes` **returns the full scene rows, ids included.**
`ScenesRepository.replaceForProduction` returns `Promise<readonly Scene[]>`;
`PlanningService.applySceneOutline` returns that exact value and declares `Promise<readonly unknown[]>`;
the controller widens it again. The widening is two lines of declaration over a complete value. The
proof is not inference: the backend's own `test/storyboards/storyboards.e2e-spec.ts` parses that
route's live response body with `z.array(sceneSchema)` and then uses `scene.id` to reach
`/shots/:shotId/…`, and it passes on master.

**How this repo got it wrong is worth more than the fact.** The instrument was a grep over controller
**return-type annotations** for `Scene`, which returned zero — and it was validated against a true
positive first, seven hits for `Promise<Production>`. That proved the grep could find return-type
annotations. It never proved that return-type annotations answer *what comes back over HTTP*. A
working instrument aimed at the wrong question, which no true-positive check catches. When the
question is about the wire, read the wire — or read a test that parses it.

**The phase is still blocked, and the blocker is now exact: there is no way to *re-read* the ids.**
`replaceForProduction` deletes every scene for the production and re-inserts with
`id: sceneIdSchema.parse(randomUUID())`, so each call mints new ids and the previous ones are dead.
And `shots.scene_id` is `onDelete: 'restrict'`, so once a scene has shots the delete fails outright —
the repository's own docblock says re-planning past committed work "fails loudly rather than
orphaning it". By the time a storyboard has anything to review there are shots, so the only
id-yielding route refuses to run.

A read that destroys what it reads is not a read. This screen loads on mount and again after every
reload, and `CLAUDE.md` requires that a reload lose nothing.

- the only route yielding a `shotId` is `GET /scenes/:sceneId/shots`, which needs the `sceneId`;
- the only route yielding a `dialogueLineId` needs a `sceneId` too, or a `Shot`'s `dialogueLineIds`
  — and a `Shot` needs one of the above.

The two places a scene otherwise surfaces genuinely carry no id: `runtimeSegmentShareSchema` has
`order`, `label`, `targetDurationSeconds`, `reused` and `shareOfTarget`, and
`sceneOutlineEntrySchema` is `scenePlanSchema.omit({ shots: true })`, which has none.

**The missing piece is one idempotent `GET` that returns a production's scenes** — and it is smaller
than it sounds. `ScenesRepository.listForProduction(productionId): Promise<readonly Scene[]>` already
exists and is already called from `planning.service.ts` twice and `dialogue-timing.service.ts` once.
What is missing is a controller method delegating to it. No query, no new contract.

**A precondition to design for, not a refusal to handle afterwards.** The backend is making §23's
production render gate actually run on submission — it was silently skipped for storyboard and speech
jobs because neither passed a `productionId`. Once that lands, a storyboard submit is refused with
`PRODUCTION_RENDER_NOT_PERMITTED` unless the production is in `STORYBOARDING` or `STORYBOARD_REVIEW`,
and dialogue speech needs `AUDIO_RENDER` or `VIDEO_RENDER`. So this screen moves the production into
the right state through `POST /productions/:id/transitions` before it offers a submit control, the
same way FE-07's approval gate reads server state before rendering a button.

Two smaller gaps sit behind the same wall. `ShotPromptSpec` is typed from
`src/shots/prompt-specs.repository`, not from `src/contracts/`, so the compiled prompt has no
published response shape; and no `../shots/dto/*` appears in the backend's `src/contracts/index.ts`,
so `transitionShotRequestSchema` and `planSceneRequestSchema` are unpublished the same way the
render-job DTO is. Approve and reject would have no validated request body even with an id in hand.

**Updated 2026-09-01: the missing scene `GET` now gates three surfaces, not one.** BE-17 merged as
`014712e` and published dialogue lines, speech synthesis, speech approval, the §19 tier choice and
`POST /productions/:id/dialogue-timing`, with every DTO exported through the barrel and — unlike the
shot DTOs — properly published. Its collection is `@Controller('scenes/:sceneId/dialogue-lines')`.
So a third fully-contracted surface is now unreachable for exactly the same reason as the first two.
**One route that returns a production's scenes would unblock shots, dialogue and this phase's strip
together**, which makes it the single highest-value thing the backend could add for this repo.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Layout | a scene strip vs a flat shot grid | **Scene strip of shot cards** (§39). Storyboards are read scene by scene, and framing decisions only make sense in sequence. |
| 2 | Approval granularity | per shot only vs per shot with scene bulk actions | **Both.** The backend state machine is per shot; a scene-level "approve all remaining" is a real workflow need at this volume. |
| 3 | Comparison view | inline vs a dedicated overlay | **Overlay**, keyboard-driven. Judging identity drift needs size (§27.3). |

## Steps

### 1. Scene strip

Scenes in order, each expanding to its shot cards. Each card shows: order, shot type, target duration,
generation strategy, subjects, location, the storyboard frame, and state.

Virtualise it. Two hundred shots with images is the normal case, not the stress case.

### 2. Level 1 and Level 2 (§17.1)

Show which level a frame is:

- **Level 1** — cheap draft, for composition and framing.
- **Level 2** — the approved keyframe, anchored to canonical subject assets, location plates, props,
  the correct costume/state for that point in the story, and the required framing.

The Level 2 keyframe becomes the **anchor for image-to-video**, so its approval is the highest-leverage
decision in the pipeline. Make the distinction unmistakable — approving a draft as if it were the
keyframe is a plausible and expensive mistake.

### 3. The comparison overlay (§27.3)

```text
canonical reference  |  candidate keyframe
```

Large, side by side, with the subject's **immutable trait list** visible next to them. That checklist
is the same frozen descriptor the prompt compiler inserted and the QC reviewer will check — showing it
here is what turns "looks about right" into a real check.

Keyboard: next/previous shot, toggle comparison, approve, reject. This screen is used at speed.

### 4. Operations (§17.2)

Approve · reject · regenerate · edit prompt · change framing · change expression · compare with
canonical reference.

**Regeneration mode is always explicit** — `SAME_PROMPT_NEW_SEED`, `CONTROLLED_PROMPT_REVISION`,
`NEW_KEYFRAME`. Never a bare "Retry". Five different operations behind one label means the user cannot
tell what ran, and the attempt history becomes unreadable.

**No optimistic updates.** Approve/reject wait for the server, then re-read.

### 5. The gate is visible

A shot cannot proceed to video rendering without an approved keyframe where one is required. Show that
state on the card, so a refused render is explained before it is attempted.

**The requirement control is two refusals, not one, and neither is about direction.** Read from the
two guards in `ShotsService.setKeyframeRequirement` on backend `master`, and corrected there by the
backend session after this repo got it wrong from their prose: the first guard tests the **incoming**
value and refuses the subject-derived one whatever the shot currently is; the second tests the
**stored** value and refuses every edit once the shot already carries a canonical subject. The
enum has no ordering, so "raise" and "lower" are not expressible in it — the method's own docblock
and `plan/18` both describe the design as *raised by hand, never lowered by hand*, and a UI built
from that sentence would offer a control the first guard refuses.

So: **never offer the subject-derived value in a picker.** When a person wants a keyframe on a shot
that does not require one, the affordance is the value meaning *a person asked for this*, not an
error toast after the fact. When the shot does carry a canonical subject, offer the waiver — which
takes a reason — instead of a disabled control with no explanation.

### 6. Motion drafts before finals (§49.4)

> "Never render 200 HERO shots before reviewing motion drafts."

After keyframes are approved, the next step is **DRAFT-profile motion renders**, reviewed here or in
Shot Review, before finals are queued. Make that the obvious path and skipping it a deliberate,
visible override.

### 7. Shots that need no storyboard

`REUSE_APPROVED_CLIP` and `LIMITED_ANIMATION_HOLD` over an existing still need no keyframe. Show them
as complete rather than pending, or the strip will look permanently unfinished.

### 8. Continuity context

Show the continuity facts in scope for the scene alongside its shots — "subject is muddy from scene 6",
"carries a star through scene 9". A keyframe that ignores continuity is the failure that is only noticed
after the shot is rendered, and this is the screen where a human can catch it.

### 9. Progress

Storyboard generation is a queue of jobs. Show progress per shot via the socket, and make the page
usable while frames are still arriving — reserved boxes, no layout shift.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn dev
```

- load a 200-shot storyboard: scrolling stays smooth and **nothing shifts** as frames arrive;
- approve twenty shots by keyboard without touching the mouse;
- open the comparison overlay and confirm the immutable trait list is visible beside both images;
- regenerate → the mode is explicit and recorded, and the previous frame survives;
- confirm approve/reject show no state change until the server confirms;
- confirm a shot with an unapproved keyframe visibly blocks video rendering;
- confirm `REUSE_APPROVED_CLIP` shots are not shown as pending;
- confirm the scene's continuity facts are visible next to its shots;
- `dir="rtl"` — the strip and overlay mirror correctly.

## Done when

- [ ] scene strip with shot cards, virtualised, usable at 200+ shots
- [ ] Level 1 and Level 2 are visually unmistakable
- [ ] the comparison overlay is large and shows the immutable trait list
- [ ] all seven §17.2 operations exist
- [ ] regeneration modes are explicit; there is no bare "Retry"
- [ ] no optimistic updates on approve/reject
- [ ] the keyframe gate is visible on the card
- [ ] motion drafts are the obvious next step; skipping is a deliberate override
- [ ] reuse/hold shots are not shown as pending
- [ ] continuity facts appear alongside their scene
- [ ] keyboard-first review works end to end

## Traps

- **A grid that is pleasant at 12 shots and unusable at 200.** Design for the second.
- **Small comparison images.** Drift is only visible at size.
- **Approving a Level 1 draft as the keyframe.** Expensive, and easy if the levels look alike.
- **A bare "Retry".** The attempt history becomes uninterpretable.
- **A keyframe-requirement picker offering the subject-derived value.** It is refused on the way
  in, whatever the shot's current state.
- **Hiding continuity facts.** The clean-subject-in-a-muddy-scene error survives to the render.
