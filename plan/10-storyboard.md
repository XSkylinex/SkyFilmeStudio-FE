# FE-10 — Storyboard review

> **Depends on:** 09 · **Blocks:** 12 · **Backend needs:** BE-16, BE-18 · **Plan authority:** §17, §39, §49.4
> **Status:** partly done 2026-09-01 — the strip reads and the keyframe gate approves. What is left is
> unbuildable rather than unbuilt: no route serves an artifact's bytes, and seven write DTOs are
> unpublished

## Goal

The gate that stands between a plan and hundreds of expensive video renders. If this screen is
pleasant to use at two hundred shots, the pipeline works. If it is not, people will skip it — and
§17's whole point is that they must not.

> "Never send an unreviewed screenplay directly into hundreds of final video renders." — §17

## What unblocked it, on 2026-09-01

**One controller method.** `GET /productions/:productionId/planning/scenes` merged upstream as
`dcf6d49`, declared `Promise<readonly Scene[]>`, and it changes nothing when it runs. That is the
whole unblock. Everything below it — `GET /scenes/:sceneId/shots` from BE-16, all twelve storyboard
routes from BE-18, and BE-17's dialogue-line collection — had been published and unreachable, every
one of them keyed on an id that no idempotent read produced.

**The blocker was never the phase on the dependency line.** This file said "Backend needs: BE-18" and
tracked it through `not started` → `in progress` → merged, and the phase did not move once, because
all twelve of BE-18's routes hang off a `shotId`. The lesson stands and is now demonstrated in both
directions: **track the missing route, not the phase number.** A single `GET` that nobody had
scheduled unblocked three surfaces at once.

**What the old blocker actually was**, kept because the reasoning is still correct: the only route
carrying scene ids was `PUT /productions/:productionId/planning/scenes`, which deletes every scene and
re-inserts with fresh ids, and refuses outright once shots exist because `shots.scene_id` is
`onDelete: 'restrict'`. A read that destroys what it reads is not a read. That route still behaves
exactly that way — it is simply no longer the only one. Its refusal is now a typed `SCENE_IN_USE`
rather than a 500, which this repo has absorbed.

**This repo reported the wrong reason first, from a working instrument.** A grep over controller
return-type annotations for `Scene` returned zero and was validated against a true positive — seven
hits for `Promise<Production>`. That proved the grep could find annotations; it never proved
annotations answer *what comes back over HTTP*. A sound instrument aimed at the wrong question, which
no true-positive check catches. **When the question is about the wire, read the wire.**

## What is still blocked, and why each one is different

Three distinct reasons, which matter because they have three different fixes.

**No frame is shown as a picture — no route serves an artifact's bytes.** `Artifact` carries
`path: projectRelativePathSchema`, a path inside the project, and every controller on backend master
was searched for a route serving it. The search was validated against the two it does find,
`GET /projects/:projectId/assets/:assetId/thumbnail` and `.../proxy`, which are for *source assets*.
A storyboard frame is an artifact, not a source asset. Reaching the file any other way would mean this
app talking to something that is not the orchestrator, which rule 1 forbids outright. So the strip
shows the record of a frame — level, attempt, regeneration mode, anchors, approval state — and says on
screen why the picture is absent. This is FE-06's "do not report structure that does not exist"
applied to an image.

**Seven writes have routes and no published request shape.** `generate`, `regenerate`,
`revise-prompt`, `change-framing`, `change-expression`, `keyframe-waiver` and `keyframe-requirement`
all exist under `shots/:shotId/storyboard`, and their DTOs live in `src/storyboards/dto` and
`src/shots/dto` without being exported through the orchestrator's `src/contracts/index.ts`. Counted:
the barrel carries forty `dto/` lines and none of them is a shot or storyboard DTO. There is nothing
to validate a request body against, so none of the seven is offered.

**Progress needs the socket.** BE-23 has not started. Frames still rendering do not update on their
own, and the screen says so rather than polling a local machine on a timer.

**The two approval routes are buildable for exactly one reason: they take no body.**
`POST` and `DELETE /storyboard-frames/:frameId/approval` are identified entirely by the path id and
both answer with the published `ShotKeyframeStatus`. That is why the gate this phase exists for is
real while the operations around it are not.

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

**What was actually run, 2026-09-01.** `yarn typecheck`, `yarn lint`, `yarn test`, `yarn build` and
`yarn format:check` all exit 0; 1420 tests across 211 files; entry chunk 491.90 kB with the whole
storyboard in its own 27.19 kB chunk. Four of the nine bullets above cannot be run here at all —
three need images this build has no route for, and the fourth needs a regenerate control that has no
published request shape. The 200-shot and `dir="rtl"` passes need a seeded production and have not
been done; **that is a gap in this phase's verification, not a passed check.**

## Done when

- [x] scene strip with shot cards, usable at 200+ shots — **by disclosure rather than
      virtualisation.** A scene fetches its shots only when opened and a shot its frames and gate only
      when opened, which bounds the mounted DOM and the request count together. No virtualisation
      dependency was added; revisit if a single scene ever holds enough shots to matter, which is not
      the shape of the data
- [x] Level 1 and Level 2 are visually unmistakable — badge, tone and a sentence each, and the
      distinction is enforced rather than decorative: approve is **not offered** on a `DRAFT`, because
      `StoryboardsService.approve` refuses one with a 400
- [ ] the comparison overlay is large and shows the immutable trait list — **cannot be met.** No route
      serves an artifact's bytes, so there are no images to place side by side, and the trait list is a
      canonical set's frozen descriptor in another feature's data. The overlay shows the anchors the
      orchestrator records and says what it is not
- [ ] all seven §17.2 operations exist — **two of seven.** Approve and reject are buildable because
      their routes take no body; regenerate, revise prompt, change framing, change expression and
      compare-with-reference-images all need request shapes the contract does not export
- [ ] regeneration modes are explicit; there is no bare "Retry" — vacuously true and left unticked:
      there is no regeneration control at all. The five modes have catalogue labels ready for one
- [x] no optimistic updates on approve/reject — and the guard is a cache snapshot rather than a spy on
      `invalidateQueries`, because the first version of it passed while a `setQueryData` optimistic
      update was live
- [x] the keyframe gate is visible on the card — `videoPermitted`, the requirement, any waiver, and
      the orchestrator's own sentence
- [ ] motion drafts are the obvious next step; skipping is a deliberate override — needs the render
      queue, which is FE-11 and blocked on a missing `GET /render-jobs`
- [x] reuse/hold shots are not shown as pending — **taken from the wire, not from the strategy.** An
      earlier pass carried a copy of the backend's unpublished `NEEDS_NO_KEYFRAME` list; the gate now
      reports the requirement the orchestrator returns, which also covers the commoner second cause of
      `NOT_REQUIRED` — a shot with no canonical subject that nobody marked by hand
- [x] continuity facts appear alongside their scene
- [x] keyboard-first review works end to end — real buttons in DOM order with `aria-expanded`, so Tab
      and Enter reach every control. Deliberately **no** single-key shortcuts: FE-16 fixed a Level A
      failure of SC 2.1.4 in this repo already

## Traps

- **A grid that is pleasant at 12 shots and unusable at 200.** Design for the second.
- **Small comparison images.** Drift is only visible at size.
- **Approving a Level 1 draft as the keyframe.** Expensive, and easy if the levels look alike.
- **A bare "Retry".** The attempt history becomes uninterpretable.
- **A keyframe-requirement picker offering the subject-derived value.** It is refused on the way
  in, whatever the shot's current state.
- **Hiding continuity facts.** The clean-subject-in-a-muddy-scene error survives to the render.
