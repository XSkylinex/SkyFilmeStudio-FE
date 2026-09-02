# FE-12 — Shot review

> **Depends on:** 11 · **Blocks:** 14 · **Backend needs:** BE-19, BE-20 · **Plan authority:** §25, §27, §39, §44
> **Status:** partly done 2026-09-01 — the advisory half is built; the comparison, the decision
> and every operation are blocked, each on a different missing thing. See "What was buildable".

## What was buildable, and what was not

Measured 2026-09-01 against the orchestrator's `origin/master`. The routes this phase names all
exist: `shots/:shotId/qc` publishes `GET runs`, `POST request-review` and `POST review`, and
`shots/:shotId/video` publishes all five §44 regeneration modes. What is reachable from this repo is
decided by three other things, and they fail independently:

- **No route serves an artifact's bytes.** `src/artifacts/` has a module and a repository and no
  controller; the only `StreamableFile` responses in the orchestrator are the source-asset thumbnail
  and proxy. So the `canonical | first | middle | last` comparison this screen exists for cannot be
  drawn, and playback cannot happen. This is the same wall FE-10 and FE-13 hit.
- **`reviewShotRequestSchema` and `submitVideoRenderRequestSchema` are not re-exported by
  `src/contracts/index.ts`.** The human decision cannot be recorded and no regeneration can be
  submitted. `qcRunSchema`, `shotReviewSchema`, the sixteen `QcCheckId`s and the eight
  `subjectQcRule` verdicts *are* published.
- **A hero shot cannot be identified.** `HERO` is a published `qualityIntent` and `Shot` carries a
  `renderProfileId`, but `src/render-profiles/` has no controller, so nothing resolves that id. The
  concept exists and is unreachable — a missing route, not a missing shape.

**What was built with that**: the queue by scene, each shot's lifecycle state, every `QcRun` recorded
against it with per-check results and provenance, and the hand-over to a reviewer — which is a
named transition (`VIDEO_READY`/`AUTO_QC` → `MANUAL_REVIEW`) refused with a typed
`SHOT_TRANSITION_INVALID` unless a run exists. The screen is arranged around §27.2: the state badge is
the only green on the card, every automated verdict wears FE-04's technical-check tone, and a test pins
that no automated tone is ever `SUCCESS`.

**The two states the hand-over is offered from are a copy of an unpublished table**,
`src/shots/constants/shot-transitions.ts`, in the same direction FE-09 chose for `PLANNING`: if the
table grows, this screen hides a control that would work rather than offering one that fails. It
fails silently through a green gate, and is re-checked at commit time rather than pinned.

**`findings` is unshaped on the wire.** `QcRun.findings` is `jsonObject[]`, nothing on master writes
it, and no route returns a `subjectQcRuleVerdict` per shot — so identity findings are shown as
recorded, key and value, and said to be unshaped rather than dressed as the eight rules.

## Goal

The screen where a human decides whether a rendered shot is good enough — comparing it against the
canonical reference, with the QC findings visible but clearly advisory, and with every regeneration
option explicit.

> "The UI is important because fully autonomous visual approval is not trustworthy enough." — §39

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Primary layout | video-first vs contact-sheet-first | **Contact sheet first, video one key away.** §27.3 specifies `canonical | first | middle | last`. Identity drift is judged on frames; motion is judged on playback. Both, in that order. |
| 2 | Queue navigation | one shot per page vs a review queue | **A review queue.** The user reviews dozens in a sitting; keyboard next/previous is the primary interaction. |
| 3 | QC presentation | a single verdict vs per-trait findings | **Per-trait.** The backend checks eight identity rules against the frozen trait list; collapsing them to PASS/FAIL discards the useful part. |

## Steps

### 1. The comparison (§27.3)

```text
canonical reference  |  first frame  |  middle frame  |  last frame
```

Large. The contact sheet comes from BE-20 at ~10/50/90%, chosen because drift accumulates — the last
frame is where it shows.

Beside it: the subject's **immutable trait list**, the same frozen descriptor the prompt compiler
inserted and the QC reviewer checked. The comparison plus the checklist is what turns "looks fine" into
a real decision.

### 2. Playback

Video with the shot's audio, a waveform aligned to the dialogue lines, and frame stepping. Use the
**proxy** for scrubbing; the master only on demand.

Loop playback by default — a 4-second shot judged once is judged badly.

### 3. QC findings, advisory and labelled

Per-trait results from BE-20: correct number of visible subjects · correct primary colour · correct
clothing · correct major accessories · correct approximate proportions · no duplicate face/head · no
extra limbs · no severe eye mutation.

**"Automated check passed" and "human approved" are different fields and must look different.** §27.2:
do not treat a VLM `PASS` as equivalent to human approval for a hero shot. A green check-mark that
implies the work is done has quietly deleted the gate this screen exists to provide.

Show continuity expectations too — if scene 6 says the subject is muddy, that is part of correct.

### 4. Operations (§27.3)

Approve · reject · **retake region** · regenerate · change keyframe · change prompt.

**Every regeneration is a named mode** (§44), never a bare "Retry":

```text
EXACT_REPLAY               reproduce exactly — meaningful only because seed and params were preserved
SAME_PROMPT_NEW_SEED       same intent, different roll
CONTROLLED_PROMPT_REVISION change specific parameters, keep canonical anchors
NEW_KEYFRAME               back to the storyboard
RETAKE_REGION              repair a time range, keep the rest of an approved shot
```

`RETAKE_REGION` needs a real UI: select a time range on the timeline of the shot. It exists so a
two-second problem does not cost a whole re-render.

**No optimistic updates.** Approve, reject, retake and cancel wait for the server.

### 5. Attempt history

Every attempt, with its artifact, seed, parameters, regeneration mode, worker, hardware profile and
outcome. **A rejected shot never destroys previous attempts** (§24) — the history is browsable and
comparable, because "attempt 2 was better" is a real and common conclusion.

### 6. Provenance panel (§25)

Model ids · runtime version and commit · prompt and negative prompt · seed · input image and audio
hashes · width/height/fps/frame count/steps/sampler · worker · hardware profile · workflow id and
version · ComfyUI `prompt_id` · output hash.

This is a **feature**, not debug output: "this shot is excellent, how do I get another like it" is
exactly the question §25 exists to answer. Make it copyable.

### 7. Review queue and keyboard

Filter to shots awaiting review. Keyboard: next, previous, play/pause, toggle comparison, approve,
reject. The user will review fifty in a sitting; a mouse-only flow makes that an hour instead of ten
minutes.

### 8. Hero shots

Where the backend marks a shot as requiring human review regardless of the automated result (BE-20),
say so explicitly on the card. The user should understand why this one cannot be bulk-approved.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn dev
```

- review a shot with a deliberately wrong subject colour → the QC finding **names the trait**, and the
  comparison makes it visible;
- confirm automated-pass and human-approved are visually and semantically distinct;
- confirm a hero shot cannot be approved by the automated result alone;
- retake a 2-second region → the rest of the approved shot is untouched;
- reject a shot → previous attempts remain browsable and comparable;
- copy the provenance block and confirm it contains everything needed to reproduce the shot;
- review twenty shots by keyboard only;
- confirm approve/reject show no change until the server confirms;
- `dir="rtl"` — the comparison and controls mirror correctly.

## Done when

Each unticked box names what it waits for.

- [ ] `canonical | first | middle | last` at a size where drift is visible — **no route serves an
      artifact's bytes**
- [ ] the immutable trait list is shown beside the comparison — waits on the comparison
- [ ] playback uses proxies, loops, and aligns audio to dialogue lines — **no route serves an
      artifact's bytes**
- [x] QC findings are per-check and advisory; automated-pass ≠ human-approved — **done for the
      sixteen technical checks and the run verdict**, with the tone rule pinned by a test. The eight
      per-trait identity verdicts are **not** per-trait here: no route returns one for a shot, and
      `findings` arrives unshaped
- [~] continuity expectations are part of the displayed "correct" — **composed here as of
      2026-09-02**: each scene in the review queue shows the facts in force for it, from the same
      `in-force` read the storyboard makes, above the shots and their checks. What is still absent is
      the picture to hold them against, which is the artifact bytes; until then the expected state
      is read beside the automated checks rather than compared to anything
- [ ] all six operations exist; every regeneration mode is explicit — **`submitVideoRenderRequestSchema`
      and `reviewShotRequestSchema` are not re-exported**
- [ ] `RETAKE_REGION` has a real time-range selection — same
- [x] no optimistic updates on any approval-class action — the one write here, the hand-over, has
      none, proven by a planted `cancelQueries`/`setQueryData` pair
- [ ] attempt history is complete, browsable and comparable — **no route lists a shot's render
      attempts**
- [ ] the provenance panel is complete and copyable — each `QcRun`'s provenance is shown; the
      attempt's own (`attempt-provenance.ts`) has no route
- [~] keyboard-first review works end to end — the queue is keyboard-completable but is read one
      scene at a time, because **no route lists a production's shots across scenes**
- [ ] hero shots are marked as requiring human review — **no route serves a render profile**

## Verification, 2026-09-01

`yarn typecheck` 0 · `yarn lint` 0 with the five documented warnings and no new one · `yarn build` 0
· `yarn format:check` 0. Every commit on the branch checked out and typechecked on its own.

**The shot-bearing tests are red on this machine, and it is not this phase.** The orchestrator's
working tree is on the unmerged `be-21-audio` branch, which removed `audioCueIds` from `Shot` and
rebuilt `dist-esm`; `origin/master` still has the field, and the shared `buildShot` fixture keeps
master's shape. The eight component tests here were verified with that fixture temporarily matching
the in-flight shape, uncommitted — all pass, and each guard fails when its rule is broken — and are
committed against the real fixture.

**Not run:** nothing against a seeded production; no QC run has ever been recorded on this machine.
The `dir="rtl"` pass is unverified, not passed.

## Traps

- **A green check on an automated pass.** The single most damaging design error available on this
  screen.
- **Small frames.** Identity drift is invisible below a certain size, and then the gate is theatre.
- **A bare "Retry".** Five different operations, and the attempt history becomes unreadable.
- **Regenerating a whole shot for a two-second flaw.** `RETAKE_REGION` exists.
- **Losing attempt history on reject.** §24 requires it, and attempt 2 is often the good one.
- **Treating provenance as debug output.** It is the answer to the best question a user can ask.
