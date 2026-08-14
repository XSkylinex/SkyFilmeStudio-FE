# FE-12 — Shot review

> **Depends on:** 11 · **Blocks:** 14 · **Backend needs:** BE-19, BE-20 · **Plan authority:** §25, §27, §39, §44
> **Status:** not started

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

- [ ] `canonical | first | middle | last` at a size where drift is visible
- [ ] the immutable trait list is shown beside the comparison
- [ ] playback uses proxies, loops, and aligns audio to dialogue lines
- [ ] QC findings are per-trait and advisory; automated-pass ≠ human-approved
- [ ] continuity expectations are part of the displayed "correct"
- [ ] all six operations exist; every regeneration mode is explicit
- [ ] `RETAKE_REGION` has a real time-range selection
- [ ] no optimistic updates on any approval-class action
- [ ] attempt history is complete, browsable and comparable
- [ ] the provenance panel is complete and copyable
- [ ] keyboard-first review works end to end
- [ ] hero shots are marked as requiring human review

## Traps

- **A green check on an automated pass.** The single most damaging design error available on this
  screen.
- **Small frames.** Identity drift is invisible below a certain size, and then the gate is theatre.
- **A bare "Retry".** Five different operations, and the attempt history becomes unreadable.
- **Regenerating a whole shot for a two-second flaw.** `RETAKE_REGION` exists.
- **Losing attempt history on reject.** §24 requires it, and attempt 2 is often the good one.
- **Treating provenance as debug output.** It is the answer to the best question a user can ask.
