# FE-16 — Accessibility & performance

> **Depends on:** all UI phases · **Blocks:** 17 · **Backend needs:** — · **Plan authority:** §39, §48
> **Status:** partly done 2026-08-21

## Goal

The console is usable by keyboard and screen reader, honours reduced motion for real, and stays
responsive while a render queue streams updates for four hours.

## Why this phase ran now, out of order

Every phase from 07 to 14 is gated on a backend phase that has not published an endpoint. Re-checked
against the orchestrator's own source on 2026-08-21, not against its status table: it serves four
controllers and five routes, and there is no gateway. `domain/project.ts` and `domain/subject.ts`
exist as schemas, so the shapes are known, but nothing serves them — FE-07 needs BE-11 and BE-12,
and BE-11 had moved to a branch mid-session without publishing a controller.

16 is the only phase left that needs no backend, which is the same reason 15 was taken early.

The half of this phase that could run is worth running early rather than late. `jsx-a11y` has been
on since FE-00 and reports nothing; every defect below is one it structurally cannot see, and each
one found now is found against seventeen primitives and three real screens rather than against
fourteen more phases of them. Three of the fixes — the shortcut provider, the approval control and
the border token — are inherited unchanged by FE-10 and FE-12, so they are cheaper here than there.

## Decisions

| # | Decision | Answer |
| - | -------- | ------ |
| 1 | Conformance target | **WCAG 2.2 AA**, as recommended. It is what makes 1.4.11 and 2.1.4 below binding rather than opinions. |
| 2 | Live-region strategy | **Announce decisions**, as recommended. The readiness verdict is announced; the 60-second poll behind it is not. |
| 3 | Perf budget | **Measured** — but INP and CLS could not be measured at all this phase. See below. |

## What landed

**The automated net was checked before anything was assumed.** `plan/README.md` said accessibility
had no automated net; that is stale. `.oxlintrc.json` has carried `jsx-a11y` since FE-00, and the
plugin reports nothing on `src/` — not only in the default `correctness` category but with
`pedantic`, `style` and `suspicious` added too. So the net is on and green, and everything below is
what it cannot reach.

### Accessibility

- **A navigation now moves focus.** `grep -rn "focus(" src` returned nothing before this phase.
  Activating a nav link changed the URL, the heading and the title, and left focus on the link.
  `RouteFocus` moves it to the `<main>` the skip link has always targeted, skipping the first paint
  so a cold deep link is not hijacked.
- **`.app-shell__main` got the design system's focus ring.** It was the one focusable element in the
  shell with no `:focus-visible` rule, and it is now the element a keyboard user lands on constantly.
- **Single-key shortcuts can be turned off** — WCAG 2.2 SC 2.1.4, Level A. `a`, `r`, `c`, space and
  `?` were bound on `window` with no modifier, no off switch and no scoping. Arrow keys stay live
  when the toggle is off, because the criterion exempts them.
- **The shortcuts dialog is reachable without a shortcut.** Turning `?` off would otherwise strand
  the control that turns it back on, so the header carries a visible `Keyboard shortcuts` button.
- **Approval controls name what they decide.** `contextLabel` is required, so FE-10 and FE-12 cannot
  render a card without answering it.
- **The readiness verdict announces.** `<output>` for the verdict, `role="alert"` for a preflight
  that could not be read.
- **The preview stopped nesting a second `<main>`** inside the shell's.
- **Control borders clear 3:1** — WCAG 2.2 SC 1.4.11. Measured in Chrome by resolving each token to
  sRGB; the old border was 1.27:1 in light and 1.57:1 in dark, and the raised fill is 1.06:1 against
  the page, so the border was carrying the whole job at a quarter of the required contrast. The
  table is in `.claude/rules/css.md`.

### The i18n debt this phase turned up

Not the subject of the phase, but found by it and fixed rather than filed: `ApprovalControls`,
`Toast`, `MediaTile` and the whole keyboard-shortcuts dialog rendered hardcoded English. All four
predate FE-15, whose migration went through the shell and the pages without reaching the primitive
layer. Fourteen of the twenty-one keys this branch adds are that debt being paid — two approval
verbs, three strings across `Toast` and `MediaTile`, and nine for the shortcuts dialog. The
catalogue went from 183 keys to 204; the other seven are new copy, five for the features below and
two for error codes the backend appended mid-session.

Worth recording *how* they were nearly missed. A grep for capitalised text between JSX tags finds
`ApprovalControls` and nothing else, because the other three sit in a prop, a ternary and a
`const`. The sweep that finds all of them looks for capitalised **string literals**.

### Performance

- **`/system` is lazy.** It was the only statically imported route with real weight. Entry chunk
  531.05 kB → 516.30 kB, and 7.43 kB of CSS left with it.
- **Nothing leaks.** `src/` contains zero `createObjectURL`, zero timers, zero observers, zero
  sockets, and its two `addEventListener` calls both have matching removals in a cleanup.
- **The compiler is genuinely on and clean.** Zero `react/react-compiler` violations, zero
  suppressions, and zero `useMemo` / `useCallback` / `memo` in `src/` or `test/`. The entry chunk
  contains 213 `_c(n)` memo-cache calls, which is the compiler emitting rather than being configured.

## What this phase could not do, and what each waits for

**Every remaining box needs a screen that does not exist.** This is not a scoping choice.

| Box | Waits for |
| --- | --------- |
| Keyboard-completable storyboard and shot review | FE-10, FE-12 |
| Live regions on the render queue | FE-11, and FE-05 for the socket |
| Reduced motion in the React layer — autoplay, looping playback | FE-12 |
| Contrast against real media | FE-07 for a real asset to put behind a panel |
| Queue re-render rate bounded by the flush rate | FE-05 + FE-11 |
| Contact-sheet CLS and memory over a long session | FE-10 |
| Media code out of the entry chunk | FE-11 to FE-14 |

The last one is worth stating precisely, because it currently looks satisfied and is not.
`TimelinePage`, `AudioPage`, `ShotReviewPage`, `StoryboardPage` and `ShotsPage` are all `EmptyState`
stubs, and `src/` contains no `<video>`, no `<audio>` and no `<canvas>`. The box is vacuously true,
so it stays unticked.

Decision 3 has the same shape. INP and CLS are the two metrics `plan/16` says will fail, on the two
pages it names — the render queue and the storyboard. Both are stubs and there is no socket, so
there is nothing to profile. Measuring them on this build would produce a number that means nothing.

## Two findings recorded rather than fixed

- **Status-tone borders fail 3:1 against their own fill** on seven of ten tones in light and eight in
  dark. Left alone deliberately: every tone pairs its border with a text label and a `StatusDot`, so
  the border is not the only carrier of the state, and restyling ten tones is FE-02's territory.
- **The render queue is eagerly in the entry chunk while the storyboard is lazy** — an inversion,
  since the queue is the page `plan/16` names for INP. It is a stub with nothing to split today;
  FE-11 has to make it lazy when it fills it.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build
```

Real output, 2026-08-21: typecheck clean, lint clean, **665 tests across 118 files**, build clean.
`yarn format:check` clean.

What the gate did not tell us, and was checked by loading the app in Chrome against the dev server:

- after clicking a nav link, `document.activeElement.id` is `app-shell-main`; on a fresh load of the
  same URL it is `<body>`;
- `:focus-visible` does **not** match on `main` after a mouse-driven navigation, so no ring is
  painted around the whole page, and `focus({ focusVisible: true })` renders `solid 2px` at `-2px`;
- with single-key shortcuts off, `?` does nothing and the header button still opens the dialog; the
  choice survives a reload;
- the dialog uses `showModal()`, traps focus, closes on a real Escape and restores focus to its
  trigger — checked because it was the most likely defect, and it was already correct;
- control borders measure 3.29:1 against their actual rendered background in dark mode.

## Done when

- [x] `jsx-a11y` is active and clean — verified across four categories, not assumed
- [x] the shell's own focus handling is correct: navigation moves focus, the skip-link target has a
      ring, and the first paint is left alone
- [x] character-key shortcuts satisfy SC 2.1.4, with the off switch reachable without a shortcut
- [x] approval controls have contextual accessible names, enforced by a required prop
- [x] live regions announce decisions, not progress; progress uses `progressbar`
- [x] control boundaries satisfy SC 1.4.11, measured rather than eyeballed
- [x] reduced motion is honoured in CSS — every transition in `src/` uses a duration token, and the
      three keyframe loops each also set `animation: none`
- [x] no `react/react-compiler` errors, and no suppressions
- [ ] every workflow is keyboard-completable — **FE-10, FE-12**
- [ ] the automated-pass vs human-approved distinction survives being read aloud — **FE-12**
- [ ] reduced motion is honoured in the React layer, including autoplay — **FE-12.** The one media
      element that exists does not autoplay, so there is nothing here for the query to damp yet; the
      box this describes is a shot preview that plays on its own, which FE-12 introduces
- [ ] contrast checked against real media, not a flat background — **still FE-10 or later.** FE-07's
      detail view has a media surface now, but nothing is drawn *over* it: the player has no overlay,
      no badge and no caption on the frame. The criterion needs a contact sheet or a shot grid with
      chrome on top of a picture, which is **FE-10**
- [ ] queue re-render rate measured and bounded — **FE-05, FE-11**
- [ ] contact-sheet CLS ≈ 0, memory stable over a long session — **FE-10**
- [~] media code is out of the entry chunk, verified in the build — **no longer vacuous.** FE-07's
      asset detail page (2026-08-22) is the first `<video>` in this codebase and its route is `lazy`,
      so it builds as its own 11.35 kB chunk. Verified by grepping `dist/`: the `jsx('video', …)`
      call is in `AssetDetailPage-*.js` and not in the entry. **The entry still contains
      `case 'video': case 'audio':` — that is React DOM's own media event plumbing, which ships
      whether or not the app uses media, and is not ours to move.** Remaining players are
      **FE-11 to FE-14**

## Traps

- **`aria-live` on the queue.** It will announce every tick and make the page unusable.
- **Damping a keyframe and calling reduced motion done** while previews autoplay.
- **Identical labels on two hundred approve buttons.**
- **Measuring performance on an idle page.** LCP is trivially fine on localhost; INP and CLS are what
  fail, and only under load.
- **Suppressing a compiler error.** It is a silent perf regression, not a style complaint.
- **Reading a green `yarn lint` as accessibility coverage.** It was green before this phase and every
  defect fixed here was already present.
- **Trusting `oklch()` lightness as contrast.** Two tokens one percent apart in `L` are not one
  percent apart in ratio. Resolve to sRGB in the browser and compute.
