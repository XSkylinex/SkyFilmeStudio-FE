# FE-14 — Timeline & final production

> **Depends on:** 12, 13 · **Blocks:** 17 · **Backend needs:** BE-22 · **Plan authority:** §35, §36, §37, §38.2, §39, §51
> **Status:** blocked — `contracts/media/timeline.ts` and `contracts/media/delivery.ts` are published
> and no controller reaches either. Measured 2026-09-01.

## Goal

See the assembled production as a structure, watch the final, read the QC report, and export — the last
human gate before a production is `COMPLETE`.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Timeline editing | read-only vs limited edits | **Read-only with targeted actions** — reorder, adjust a transition, change a clip's in/out. The manifest is the source of truth (§36) and full NLE editing is explicitly out of scope. |
| 2 | Playback | stream the master vs a proxy | **A proxy**, generated at assembly. A 20-minute master is not something to scrub. |
| 3 | Subtitle preview | none vs overlay on playback | **Overlay.** Hebrew RTL rendering is a real risk and this is the only place it is visible before export. |

## Steps

### 1. Timeline view (§36)

Render the manifest: clips with `timelineIn` / `timelineOut` / `sourceIn` / `sourceOut` and transitions,
plus dialogue, music, SFX and subtitle tracks.

Show what each clip **is** — a generated shot, an imported clip, a reused library animation, an OP/ED
asset. Reuse is a feature (§49.2), and seeing it is how a user knows the second production was cheaper
than the first.

**The manifest is the source of truth.** The UI reads and edits it; it never becomes a second store.

### 2. Structure and runtime

Against the production's structure profile and target: total runtime, tolerance, and where it lands.
±30 s on a 20-minute target is the default (§3.3).

By this point the runtime should already be right — phase 09's budget panel exists so a shortfall is
caught at planning. If it is wrong **here**, say clearly that this is late, and show which scenes
drifted from their planned durations. Discovering an eleven-minute production at assembly is the
failure §14.4 was written to prevent.

### 3. Blocking states, named

Assembly requires every shot approved. Show, precisely:

- shots still in `MANUAL_REVIEW` or `REJECTED`, with links;
- missing artifacts, named;
- any failed QC check.

A production that "cannot assemble" without saying which shot is unhelpful in exactly the situation
where the user is most stressed.

### 4. Subtitles (§35)

Preview `.srt` (and `.ass` if styled) overlaid on playback, in the production's language.

**Verify Hebrew RTL rendering here.** A subtitle file that is byte-correct and renders reversed is
still broken, and this is the only screen where a human sees it before export. Check both sidecar and
burned-in paths.

Timing comes from approved `DialogueLine` durations — never ASR (§35). Show that the timings match.

### 5. Watch the final

Full playback with subtitles, chapter markers at scene boundaries, and jump-to-shot. §22 Phase F makes
the **manual watch review** part of reaching `COMPLETE` — so build it as a step with an explicit
confirmation, not an incidental video player.

### 6. QC report (§38.2, §51)

Every check with its result: final runtime in tolerance · 1920×1080 · 24 fps · audio present · 48 kHz
stereo · subtitles present if enabled · **no missing timeline asset** · **no black or missing segment**.

Plus the §51 acceptance criteria that apply: subject continuity (where subjects are used), style
continuity (every final shot references an explicit `StyleProfile` version), audio (loudness within
profile, dialogue not masked), provenance completeness.

Waivers are allowed and **must be recorded with a reason** — "explicitly waived" is a valid state in
§51, but only if someone said why.

### 7. Export

Delivery copy: 1920×1080 · 24 fps · H.264 · AAC stereo 48 kHz · MP4. Optional master (ProRes or a
high-bitrate alternative), **off by default** — §37.2 warns against keeping huge masters when disk is
insufficient, and phase 06's disk panel is the place that shows why.

Show the export destination, the estimated size, and a **disk check before starting**. Export is a
long operation: submit it as a job and track it in the queue like anything else.

### 8. Provenance for the production

The master traces back to exact approved shot and audio artifacts (§51). Expose that chain — it is the
reproducibility manifest Milestone 5 requires.

### 9. Portable bundle (BE-25)

Export/import a project bundle from here, with the asset-class selection (sources · canonical ·
generated · proxies · exports) and a size estimate. On import, **report what is missing locally** —
models, ComfyUI node commits, runtime versions — and never offer to download any of it.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn dev
```

- assemble a short production and confirm the timeline reflects the manifest exactly;
- leave one shot unapproved → assembly is blocked and **names the shot**;
- remove an artifact → blocked and named;
- preview Hebrew subtitles → RTL renders correctly, sidecar and burned-in;
- confirm subtitle timings match the dialogue durations exactly;
- watch the final with chapter markers and jump-to-shot;
- read the QC report; waive one check and confirm the reason is required and stored;
- export with the disk check → it refuses when space is short, and says how much is needed;
- export a bundle and re-import it, confirming the missing-model report appears and offers no download;
- `dir="rtl"` — the timeline mirrors correctly.

## Done when

- [ ] the timeline renders the manifest and shows each clip's origin, including reuse
- [ ] runtime is shown against target and tolerance, with drift attributed to scenes
- [ ] blocking states name the specific shot or asset
- [ ] subtitles preview with verified Hebrew RTL, from DB timing not ASR
- [ ] the manual watch review is an explicit step required for `COMPLETE`
- [ ] the QC report covers all §38.2 checks and the applicable §51 criteria
- [ ] waivers require and store a reason
- [ ] export meets the delivery profile; the master is optional and off by default
- [ ] export runs as a tracked job with a disk check first
- [ ] the production's provenance chain is exposed
- [ ] bundle export/import works and reports missing models without downloading

## Traps

- **Making the timeline a second source of truth.** §36 opens with this.
- **"Cannot assemble" with no name.** Useless exactly when it matters.
- **Skipping the Hebrew subtitle check.** A correct file that renders reversed still ships broken.
- **A default ProRes master.** It will fill the disk that the next production needs.
- **Declaring `COMPLETE` on a green ffprobe.** §51: the project is not done because a video file
  exists.
- **Offering to download a missing model on import.** Runtime downloads are forbidden.
