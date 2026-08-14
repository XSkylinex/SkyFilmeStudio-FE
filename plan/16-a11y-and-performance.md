# FE-16 — Accessibility & performance

> **Depends on:** all UI phases · **Blocks:** 17 · **Backend needs:** — · **Plan authority:** §39, §48
> **Status:** not started

## Goal

The console is usable by keyboard and screen reader, honours reduced motion for real, and stays
responsive while a render queue streams updates for four hours.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Conformance target | WCAG 2.2 AA vs "reasonable" | **AA as the working target.** It is a single-user local tool, so nobody is auditing it — which is exactly why picking a target is what makes the work happen. |
| 2 | Live-region strategy | announce everything vs announce decisions | **Announce decisions.** See below; this is the trap. |
| 3 | Perf budget | none vs measured thresholds | **Measured.** INP ≤ 200 ms and CLS ≤ 0.1 at the 75th percentile, on the two pages that will fail them. |

## Accessibility

### 1. There is no automated net until phase 00

`.oxlintrc.json` ships three plugins and two rules; `jsx-a11y` is added in phase 00. If that did not
happen, nothing has been catching a missing label — check before assuming coverage.

`jsx-a11y` catches attributes. It does not catch focus order, a dialog that does not trap focus, or a
live region that announces sixty times a second. Those are found by using the app the way someone who
cannot use a mouse would.

### 2. Keyboard

Every workflow completable without a mouse — especially the two that are used at speed:

- **storyboard review**: next/previous, toggle comparison, approve, reject;
- **shot review**: the same, plus play/pause and frame stepping.

Visible focus everywhere. Focus trapped in dialogs and returned on close. Skip links to the main
region. No keyboard trap in the media players.

### 3. Screen reader

Real labels on **`ApprovalControls`** — "Approve shot 12 of scene 3", not "Approve". The buttons look
identical across two hundred cards and context is the only difference.

Tables get proper semantics; virtualised rows still need correct row/column relationships. Icon-only
buttons get accessible names. Images that convey information get descriptions; decorative ones get
`alt=""`.

**The QC distinction must survive being read aloud.** "Automated check passed" and "approved by you"
are different states (§27.2), and a screen-reader user who hears only "passed" has lost the gate.

### 4. Live regions — the trap

The render queue updates continuously. A naive `aria-live="polite"` on it will announce every progress
tick and make the page **unusable** with a screen reader.

Announce **decisions and transitions**, not progress:

```text
announce:      "Shot 12 render failed: out of memory"   "Storyboard approved"
                "Queue paused: memory pressure"
do not announce: percentage ticks, elapsed seconds, per-frame updates
```

Progress belongs in a `progressbar` role with `aria-valuenow`, which assistive tech polls rather than
announces.

### 5. Reduced motion, honoured properly

`prefers-reduced-motion: reduce` must damp CSS transitions **and** be honoured by the React layer:
autoplaying shot previews, looping playback in shot review, and any animated progress indicator.

A media app that damps one keyframe while autoplaying every preview has honoured half the query. The
tokens are in phase 02; the React side is here.

### 6. Contrast

Panels sit over media. Check the token pairings against real content — a contrast ratio measured
against a flat background is not the ratio a user sees over a bright frame.

## Performance

### 7. The two pages that will fail

**Render queue (INP).** Hundreds of rows, continuous socket traffic. Phase 05 buffers and flushes;
phase 11 virtualises. **Measure it**: run 50 jobs and profile re-renders over ten seconds. It should
track the flush rate, not the message rate.

**Storyboard / contact sheets (CLS + memory).** Two hundred `MediaTile`s. Every box reserved with
`aspect-ratio`; every image a proxy, never a master. Watch memory across a long review session — leaked
object URLs and undisposed video elements are the realistic failure.

### 8. Bundle

The entry chunk must not contain video players, waveform rendering or timeline canvas code. Verify in
the build output, not by intention. `Some chunks are larger than 500 kB` from `vite build` is usually a
genuine signal here that a lazy boundary was lost.

### 9. React Compiler

The compiler is on. A `react/react-compiler` error means a component **silently stopped being
optimised** — it is a performance regression reported as a lint error. Fix the purity violation; never
suppress it.

No `useMemo`, `useCallback` or `memo` — they fight the compiler.

### 10. Long sessions

This app is open for hours. Check: no unbounded query cache growth, no leaked socket listeners on route
changes, no accumulating object URLs, no video elements left attached after navigation.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn preview
```

Then, with the app running and real data:

- complete storyboard review and shot review **by keyboard only**;
- run a screen reader over the queue during an active render — it must remain usable;
- confirm "automated pass" and "human approved" are distinguishable aurally;
- enable reduced motion → previews stop autoplaying, not just transitions;
- profile the queue under 50 jobs → re-render count bounded by the flush rate;
- load a 200-cell contact sheet → **CLS effectively zero**, memory stable across ten minutes;
- read the build output → media code is not in the entry chunk;
- navigate away from shot review ten times → no listener or memory growth.

## Done when

- [ ] `jsx-a11y` is active and clean
- [ ] every workflow is keyboard-completable, with visible focus and correct dialog focus handling
- [ ] approval controls have contextual accessible names
- [ ] live regions announce decisions, not progress; progress uses `progressbar`
- [ ] the automated-pass vs human-approved distinction survives being read aloud
- [ ] reduced motion is honoured in CSS **and** in the React layer, including autoplay
- [ ] contrast checked against real media, not a flat background
- [ ] queue re-render rate measured and bounded
- [ ] contact-sheet CLS ≈ 0, memory stable over a long session
- [ ] media code is out of the entry chunk, verified in the build
- [ ] no `react/react-compiler` errors, and no suppressions

## Traps

- **`aria-live` on the queue.** It will announce every tick and make the page unusable.
- **Damping a keyframe and calling reduced motion done** while previews autoplay.
- **Identical labels on two hundred approve buttons.**
- **Measuring performance on an idle page.** LCP is trivially fine on localhost; INP and CLS are what
  fail, and only under load.
- **Suppressing a compiler error.** It is a silent perf regression, not a style complaint.
