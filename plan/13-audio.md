# FE-13 — Audio & music

> **Depends on:** 09 · **Blocks:** 14 · **Backend needs:** BE-21 · **Plan authority:** §32, §33, §34, §18
> **Status:** not started

## Goal

Manage the project soundtrack, the SFX and ambience library, per-scene cue assignment, and the mix —
including the loudness numbers that decide whether the export is acceptable.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Mix editing depth | full DAW-like editing vs cue assignment + levels + ducking | **The latter.** The plan explicitly does not require NLE-grade work in-app; a human may polish the exported master later (§2.7). Building a DAW here is scope that will not finish. |
| 2 | Waveform rendering | canvas vs pre-rendered images from the backend | **Backend-rendered peaks**, drawn on a canvas. Decoding audio in the browser for a 20-minute production is a wasted minute per view. |
| 3 | Loudness display | pass/fail vs measured numbers | **Measured numbers**, with the target beside them. See below. |

## Steps

### 1. Project OST (§32.1)

The cue library: category (`MAIN_THEME · ADVENTURE · MAGICAL · COMEDY · MYSTERY · DANGER_LIGHT ·
SAD_GENTLE · VICTORY · BEDTIME · ENDING`), bpm, key if known, mood, loopable, intro and outro duration,
**safe dialogue level**.

Generate, preview, approve. The library is **small and reusable by design** — §32.2: do not generate a
new random soundtrack for each shot. The UI should make reuse the obvious action and per-shot
generation awkward, because the plan names it as an anti-pattern (§59).

### 2. Scene scoring (§32.2)

Assign cues to scenes, with transitions. Show the Music Supervisor's suggestions (BE-08) as a starting
point the user adjusts — not as a decision already made.

A timeline strip showing which cue plays where, against scene boundaries, is what makes "the same cue
three scenes in a row" visible.

### 3. SFX and ambience (§33)

The indexed library: `footsteps · doors · magic · impacts_soft · cloth · forest · roomtone · wind ·
sparkle`, with tags and **licence/provenance metadata** for externally sourced assets. Assign per shot
or per scene; ambience beds per scene.

Show provenance plainly — an asset with unclear licensing in a production the user may share is a real
problem, and the metadata exists precisely so it is answerable.

### 4. Dialogue audio

Per line: the generated WAV, its **measured** duration, the voice profile version used, and the QC
result (decodes · not silent · duration in range · peak not clipped). Regenerate a single line without
touching the rest.

Show the optional ASR round-trip result as **advisory** (§18.4) — unusual names, fictional terms and
stylised speech confuse ASR, and the plan explicitly forbids rejecting on it alone.

### 5. Stems and mix (§34)

Per scene: **DX** (dialogue) · **MX** (music) · **FX** (effects) · **AMB** (ambience), with levels,
solo and mute. Then the scene mix, then the production mix.

Keeping stems visible is what makes a later fix cheap; a UI that only shows the final mix teaches the
user that changing one music level means re-rendering everything.

### 6. Loudness (§34.1)

Show the **measured** integrated loudness and true peak against the configured target — the home-video
default is ≈ **−16 LUFS** and ≈ **−1 dBTP**.

Show numbers, not a green tick. "−18.4 LUFS, target −16" tells the user what to do; "loudness: OK"
does not. And note where the plan does: the perceived level must be validated on the actual target
device — the app can report the number, it cannot confirm it sounds right on a TV.

### 7. Dialogue priority (§34.2)

Visualise the music ducking envelope against the dialogue line timings. Both are already known — the
cue's safe dialogue level and each line's measured duration — so the envelope is computable and
reviewable rather than hand-drawn.

Where QC flags "music consistently masks dialogue" (BE-20), surface it here, where it can be fixed.

### 8. Reusable audio assets (§31)

Opening and ending themes, title card and eyecatch audio, credits bed — versioned per season/project.
Reusing them is part of why a 20-minute production does not require twenty new minutes each time.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn dev
```

- generate and approve 6–10 cues; confirm each stored bpm, mood, loopable and safe dialogue level;
- score a 5-scene production and confirm **cue reuse is the easy action**;
- confirm a repeated cue across consecutive scenes is visible on the strip;
- regenerate one dialogue line without disturbing the others;
- confirm an ASR mismatch on an invented name is shown as advisory, not as a failure;
- solo and mute each stem and confirm the scene mix reflects it;
- read the measured LUFS and true peak, and confirm the target is shown beside them;
- view the ducking envelope against real dialogue timings;
- `dir="rtl"` — the timeline strips mirror correctly.

## Done when

- [ ] the OST library exists with full per-cue metadata; reuse is the obvious action
- [ ] scene scoring with a visible cue-vs-scene strip
- [ ] SFX/ambience library with tags and licence provenance shown
- [ ] per-line dialogue audio with measured duration and QC results; single-line regeneration
- [ ] ASR round-trip presented as advisory
- [ ] DX/MX/FX/AMB stems with level, solo and mute, then scene and production mixes
- [ ] loudness shown as measured numbers against the target, not a tick
- [ ] the ducking envelope is visualised against dialogue timings
- [ ] reusable OP/ED and title audio surfaced

## Traps

- **Building a DAW.** Out of scope; the exported master can be polished elsewhere.
- **Encouraging per-shot music.** §59 names it, and it destroys the project's identity.
- **A pass/fail loudness badge.** The number is what makes it actionable.
- **Auto-rejecting on ASR.** Fictional names will fail it constantly.
- **Hiding stems.** Every later fix then costs a full re-render.
- **Decoding audio in the browser** for a 20-minute production.
