# FE-09 — Screenplay & production planner

> **Depends on:** 06 · **Blocks:** 10, 13 · **Backend needs:** BE-15 · **Plan authority:** §14, §22 Phase A, §23, §39
> **Status:** not started

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

- [ ] all 8 kinds and 6 modes; stages derive from the backend's per-mode table
- [ ] every §14.1 input path is reachable
- [ ] stages are individually re-runnable, with explicit consequences
- [ ] the runtime budget is always visible and names underweight scenes
- [ ] scenes and dialogue lines are structured; speaker is optional
- [ ] language is per line, with `dir` from the data; no language toggle
- [ ] dialogue duration is measured or blank, never estimated
- [ ] continuity findings are inline and advisory, with dismissal reasons kept
- [ ] structure profiles are selectable and compared against the plan
- [ ] approval gates are visible and enforced

## Traps

- **A screenplay tab on a music video.** §3.2's clearest rule.
- **One "describe your video" box.** There are ten legitimate entry points.
- **Estimating dialogue duration.** §59 names it; the number arrives from TTS.
- **A total-only budget.** "You are nine minutes short" without saying where is not actionable.
- **A Hebrew mode toggle.** Language is data on each line.
- **Regenerating everything when one stage is re-run.** Staged planning exists so that is unnecessary.
