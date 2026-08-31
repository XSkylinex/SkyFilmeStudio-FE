# FE-10 — Storyboard review

> **Depends on:** 09 · **Blocks:** 12 · **Backend needs:** BE-18 · **Plan authority:** §17, §39, §49.4
> **Status:** blocked — BE-18 not started, and no route yields a `SceneId`

## Goal

The gate that stands between a plan and hundreds of expensive video renders. If this screen is
pleasant to use at two hundred shots, the pipeline works. If it is not, people will skip it — and
§17's whole point is that they must not.

> "Never send an unreviewed screenplay directly into hundreds of final video renders." — §17

## Why this cannot start yet — measured 2026-08-31

Two blockers, and the second is the one that would not have been guessed from the dependency line.

**BE-18 has not started.** The backend's own table says so, and there is no storyboard, keyframe or
artifact controller on its `master`. Steps 2, 3, 5 and 6 — Level 1 versus Level 2, the comparison
overlay, the keyframe gate and motion drafts — have nothing to read.

**The shot half that BE-16 *did* publish is unreachable.** BE-16 merged as `d658f69` and shipped
`shots.controller.ts`, which is real: `GET /scenes/:sceneId/shots`, `GET /shots/:id`,
`GET`/`POST /shots/:id/prompt` and `POST /shots/:id/transition`. Every one of them is keyed on an id
this repo cannot obtain.

- Enumerating every `@Controller` on backend `master`, the only route whose path contains `scenes` is
  `@Controller('scenes/:sceneId/shots')` itself. There is no scene collection and no scene resource.
- `PUT /productions/:productionId/planning/scenes` writes the outline and returns
  `readonly unknown[]`, so the ids it creates are not in its own response.
- The two places a scene otherwise surfaces carry no id. `runtimeSegmentShareSchema` has `order`,
  `label`, `targetDurationSeconds`, `reused` and `shareOfTarget`; `sceneOutlineEntrySchema` is
  `scenePlanSchema.omit({ shots: true })`, and `scenePlanSchema` has no `id` field.

So a scene strip cannot be assembled from anything published, and neither can a single shot card.
`shotSchema` itself is a published contract and carries everything a card needs — order, type,
target duration, subjects, location, props, framing, `generationStrategy`, `approvedKeyframeId` and
`state` — which is what makes this worth recording rather than waiting: **the missing piece is a
`GET` that returns a production's scenes, not a contract.**

Two smaller gaps sit behind the same wall. `ShotPromptSpec` is typed from
`src/shots/prompt-specs.repository`, not from `src/contracts/`, so the compiled prompt has no
published response shape; and no `../shots/dto/*` appears in the backend's `src/contracts/index.ts`,
so `transitionShotRequestSchema` and `planSceneRequestSchema` are unpublished the same way the
render-job DTO is. Approve and reject would have no validated request body even with an id in hand.

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
- **Hiding continuity facts.** The clean-subject-in-a-muddy-scene error survives to the render.
