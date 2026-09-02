# FE-13 — Audio & music

> **Depends on:** 09 · **Blocks:** 14 · **Backend needs:** BE-21 · **Plan authority:** §32, §33, §34, §18
> **Status:** partly done 2026-09-01 — the dialogue half is real; the music, effects and mix
> halves are not, for three different reasons. See "What was buildable, and what was not" below.

## What was buildable, and what was not

Measured 2026-09-01 against the orchestrator's `origin/master`, not against this file's dependency
line.

**The dialogue surface was fully published and had been for weeks.** `src/contracts/index.ts` carries
an explicit block for it — the three dialogue-line DTOs, `synthesiseSpeechRequestSchema`,
`chooseDialogueTierRequestSchema` and the dialogue-timing report — so reading, writing, synthesising,
approving and retiming were all buildable. What had made them unreachable was the same single missing
route that blocked FE-10: nothing produced a `sceneId` until `dcf6d49` added
`GET /productions/:productionId/planning/scenes`. **Track the missing route, not the phase number** —
BE-21 is this phase's stated dependency and it gates none of what landed.

**The music half is not on master.** BE-21's cue and profile work exists on an unmerged
`be-21-audio` branch. `.claude/rules/state-and-data.md` permits mapping a refusal from a branch and
forbids building a screen on one, so nothing here reads it.

**The effects, stems, mix and loudness halves have no routes at all** — not unpublished shapes, no
controllers. That is a different blocker from the music half and is recorded separately rather than
merged into one line. **Corrected 2026-09-02, measured on the unmerged branch's 09:28 build:** the
effects half has a controller there now, and the paragraph below says exactly what the branch holds.

**What `be-21-audio` holds, measured 2026-09-02 so the day it merges is a checklist and not a
survey.** Read from the sibling's working tree and from what the live `dist-esm` build exports
through `sky-filme-studio-be/contracts`; nothing here is built on any of it until the branch is on
master, per `state-and-data.md`.

- **Controllers, with their routes.** `projects/:projectId/music-cues` — `POST` and `GET` `renders`,
  `POST`, `GET`, `GET :id`, `POST :id/approve`, `DELETE :id`.
  `projects/:projectId/opening-ending-assets` — `POST`, `GET`, `GET approved`, `GET :id`,
  `POST :id/approve`, `DELETE :id`. `sfx-assets` — `POST`, `GET`, `GET :id`, `POST :id/approve`,
  `DELETE :id`. `productions/:productionId/score` — `POST`, `GET`; `scenes/:sceneId/cues` — `PUT`,
  `GET`; `shots/:shotId/audio-cues` — `PUT`, `GET`.
- **Published through the barrel**, by the resolver this repo compiles with: `musicCueSchema`,
  `musicProfileSchema`, `measuredMusicProfileSchema`, `sfxAssetSchema`, `openingEndingAssetSchema`,
  `sceneCueSchema`, `audioCueSchema`, `sceneScorePlanSchema`, `sceneScoreAssignmentSchema`,
  `audioStemSchema`, `sceneMixSchema`, `productionMixSchema`; the request DTOs
  `submitMusicCueRequestSchema`, `promoteMusicCueRequestSchema`, `importSfxAssetRequestSchema`,
  `importOpeningEndingAssetRequestSchema`, `scoreProductionRequestSchema`,
  `replaceSceneCuesRequestSchema`, `replaceAudioCuesRequestSchema`; and the four list-query
  schemas. Six refusal codes from it are already in the taxonomy here.
- **The mixes landed on the branch later the same day**, so the sentence above them is corrected
  rather than left: `scenes/:sceneId/mixes` and `productions/:productionId/mixes` each carry a
  bodiless `POST` returning `202` and a `GET` that lists. A scene mix is refused with
  `AUDIO_TIMELINE_CONFLICT` when a line or cue would overrun its shot, and a production mix with
  `SCENE_MIX_MISSING` naming every scene not yet mixed; both are in the taxonomy here already. The
  submit **response** is `SubmitMixResult`, an interface in the service rather than a published
  schema — `submitRenderResponseSchema` is the published `{ renderJobId }` shape, and whether the two
  agree is a thing to check at build time, not to assume.
- **Still absent even on the branch:** no route serves an artifact's bytes, so nothing here gains
  playback whatever else merges. `Shot.audioCueIds` is removed on the branch, which is why
  `test/fixtures/shot.fixture.ts` asks the schema whether the key exists.
- **The order to build when it merges:** drop the fixture's conditional; absorb any refusal code the
  merge adds; the SFX library (import, list, approve, delete — the same shape as the four creative
  libraries); music cues (submit a render, list renders, list, approve, delete) and the OP/ED assets
  beside them; scoring (score a production, then the scene cue and shot audio-cue lists with their
  `PUT` replacements); then the mixes, which are the phase's §34 half and the first submit-and-wait
  writes outside the render queue. Every one of those is a §32–§34 step and none needs a screen that
  does not exist.
- **`BE-21` is a PR as of 2026-09-02 afternoon** — 38 commits, awaiting review — so what this
  paragraph measures on a working tree becomes master's the moment it merges. Re-measure then rather
  than trusting this list: it was already corrected once between the branch's morning and afternoon
  builds.

**Nothing can be played.** No route in the orchestrator serves an artifact's bytes; the only
`StreamableFile` responses are the source-asset thumbnail and proxy. So a take is shown as its record
— measured duration, peak level, sample rate, both hashes, the file path — rather than as sound. This
is the same wall FE-10 hit on frames, and it is one missing controller away from moving for both.

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

**What was run, 2026-09-01:** `yarn typecheck` 0 · `yarn lint` 0, with the five documented warnings
and no new one · `yarn test` 1,469 tests across 218 files · `yarn build` 0 · `yarn format:check` 0.
Both catalogues hold 977 keys and are equal. Every commit on the branch was checked out and
typechecked on its own, because a green tip proved nothing about the eleven underneath it in FE-10.

**What was not run, and why.** None of the list below it was exercised against a seeded production —
there is no seeded dialogue on this machine, so no line has ever been synthesised here. The `dir="rtl"`
pass and the repeated-cue check are therefore unverified rather than passed, and are not claimed. Each
guard that could be checked was checked by watching it fail first — and one of them was wrong the
first time. The no-optimistic-update snapshot originally covered only `['dialogue-line', id]`, while
the badge and the control choice read `['scene-dialogue-lines', sceneId]`, a sibling key the prefix
cannot reach; review demonstrated with `@tanstack/query-core` that a `setQueryData` on the scene list
left that snapshot byte-identical. It now snapshots both keys, and a planted optimistic update on the
scene list fails it. Each invalidation was proven by deleting it and watching `expected 1 to be 2`.

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

Each unticked box names what it waits for, rather than being left blank.

- [x] the OST library exists with full per-cue metadata; reuse is the obvious action — **the library
      is real as of 2026-09-02**, on `/projects/:id/music`: every cue with its category, mood, tags,
      measured duration, tempo, key, loop points and the safe dialogue level, approved and removed
      from the card. Still unticked because **reuse is not yet the obvious action**: a cue is
      rendered and then promoted, and the render list cannot be read here — `GET
      /projects/:id/music-cues/renders` answers with `MusicCueRender`, a type declared in
      `src/music/music-cue-renders.repository.ts` and never published through the barrel, so there is
      no shape to parse and no render id for `promoteMusicCueRequestSchema` to name. Both request
      DTOs were published all along; the response type was the missing piece, and it landed in BE-21's
      follow-up on 2026-09-02. **Reuse is the obvious action now**: a candidate is rendered with a
      category, mood, prompt, duration and an optional seed, appears in a list of candidates with its
      model, seed, measured duration and peak level, and is promoted into the library with the facts
      the library needs and the render does not carry — its name, where it loops, and the level
      dialogue may sit over it at. A candidate still cannot be heard before that decision, because
      nothing serves an artifact's bytes; the decision is made from the record
- [~] scene scoring with a visible cue-vs-scene strip — **built 2026-09-02.** Scoring is run on the
      production with an optional brief and an optional cap on how much of it one cue may cover, and
      every scene shows the cues assigned to it by name, with the start offset, gain, loop and fades
      the mix will use. Still unticked for the second half of the phrase: **a placement cannot be
      adjusted**. `PUT /scenes/:sceneId/cues` replaces a scene's cues wholesale and
      `replaceSceneCuesRequestSchema` says so, so moving one cue means restating the rest — an editor
      would have to reconstruct the scene from the screen, which is a design rather than a form
- [x] SFX/ambience library with tags and licence provenance shown — **built 2026-09-02**, and
      **placed against shots the same day**: a shot's effects and ambience are edited on the shot
      review screen, where the shot is. The whole list is sent at once because `PUT
      /shots/:shotId/audio-cues` replaces rather than appends, and `order` is the position on screen
      rather than a number a person types — which is the difference between this and the scene score,
      where the list is generated and nudging one entry would mean restating the rest. It is the
      first thing taken from the BE-21 build order the day it merged. `/sfx` is a top-level route because
      `sfx-assets` is not project-scoped: the library belongs to the installation, which is what §30's
      reuse means, and putting it under a project would have misrepresented the route. Import, list,
      approve and remove; tags and licence are on every card, and a licence is required for an
      imported sound because the contract's own `refine` says so
- [x] per-line dialogue audio with measured duration and single-line regeneration — **done, with one
      part of the box unmet**: the duration is the measured `durationMs`, the voice profile is
      identified by id and SHA-256, and each line is re-voiced on its own in either pass. The QC
      results named in step 4 are not shown, because the QC controller is scoped to a shot rather
      than to a dialogue line and no route returns an `AUDIO` run for one. `peakLevelDb` is shown,
      so "peak not clipped" is answerable; "decodes" and "not silent" are not
- [ ] ASR round-trip presented as advisory — `asrReviewSchema` is **a published contract with no
      route**, the same shape as `continuityReviewSchema` in phase 09
- [~] DX/MX/FX/AMB stems with level, solo and mute, then scene and production mixes — **the mixes are
      built as of 2026-09-02**: a scene is mixed from its four stems and a production from its scene
      mixes, both submitted and never awaited, both refusals shown as sentences. Still unticked for
      the half the box names first — **a stem cannot be levelled, soloed or muted**. A mix is
      submitted with no body at all, its four stems are recorded by id, and no route returns a stem,
      so there is nothing in the request to carry a per-stem control and nothing to show about one
- [x] loudness shown as measured numbers against the target, not a tick — **built 2026-09-02.** A
      production mix carries the integrated loudness and true peak both before and after correction,
      the target for each, and the target loudness range; all six are on screen as measured numbers,
      with a sentence saying the corrected figure is the one an export is judged on. The sentence
      this replaces said no route serves them, which stopped being true when BE-21 merged. **Per
      scene there is still nothing**: a scene mix carries no loudness figures at all
- [ ] the ducking envelope is visualised against dialogue timings — half its inputs exist (each
      line's measured duration) and the other half is a cue's safe dialogue level, which **waits for
      BE-21**
- [x] reusable OP/ED and title audio surfaced — **built 2026-09-02**, beside the cues on
      `/projects/:id/music`. Each opening or ending is a **lineage**, not a file: versions fold onto
      the lineage they belong to, the approved one is named on the card, and an import either starts
      a lineage or is the next version of one — which is how a season replaces its titles without
      losing what came before. A frame or duration the orchestrator did not measure says so rather
      than showing a blank

## Delivered beyond this list

`POST /productions/:productionId/dialogue-timing` is not in the boxes above — it is §15.3 and §14.4
rather than §32–34 — and it is the most useful thing this phase landed. FE-09's runtime budget is
computed from target durations a person typed; this route reads the generated audio and retimes every
shot it can, then recomputes the budget on top. The screen reports `measuredSceneCount` and
`estimatedSceneCount` separately and states on screen that an `ESTIMATED` scene's total is the
Director's clamped request rather than a measurement, because the contract is explicit that it must
not be reported as one.

The animation tier from §19 is also here, **and it is a calculation rather than a recorded
decision** — review caught this repo presenting it as the latter. `POST /dialogue-lines/:id/dialogue-tier`
reads the line and the speaker's subject type, runs a pure helper and returns; `SpeechService.chooseTier`
makes no repository call, and there is no column, no table and no `GET` for the answer. The screen now
says so in its own copy and lists it under what the screen cannot do. Three of the four tiers can be
requested and the list of gated ones is read from the published `BENCHMARK_GATED_TIERS` rather than
copied — the first version hard-coded `['DUBIT']`, which is the `NEEDS_NO_KEYFRAME` defect FE-10
removed one phase earlier. Whether this workstation has *passed* the gate lives in a private
`BENCHMARKED_TIERS` in the service and is on no wire, so the copy no longer claims to know.

## Traps

- **Building a DAW.** Out of scope; the exported master can be polished elsewhere.
- **Encouraging per-shot music.** §59 names it, and it destroys the project's identity.
- **A pass/fail loudness badge.** The number is what makes it actionable.
- **Auto-rejecting on ASR.** Fictional names will fail it constantly.
- **Hiding stems.** Every later fix then costs a full re-render.
- **Decoding audio in the browser** for a 20-minute production.
