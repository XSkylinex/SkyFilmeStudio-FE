# FE-16 — Accessibility & performance

> **Depends on:** all UI phases · **Blocks:** 17 · **Backend needs:** — · **Plan authority:** §39, §48
> **Status:** partly done 2026-08-21 · second pass 2026-09-01

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
plugin reported nothing on `src/` when this was written — not only in the default `correctness`
category but with `pedantic`, `style` and `suspicious` added too. So the net was on and green, and
everything below is what it cannot reach.

**It is no longer silent, and the second pass is what broke the silence.** Re-measured 2026-09-01:
five warnings, `yarn lint` still exit 0. Four come from this phase's own fixes — two rules on each of
the two `role="region"` scrollers this pass added, in `runtime-budget-panel` and
`bible-markdown-view`: `no-noninteractive-tabindex` objecting to the `tabIndex={0}` SC 2.1.1
requires, and `prefer-tag-over-role` on the same elements. The fifth is `media-has-caption` on
FE-07's asset proxy `<video>`, which has no caption track because nothing local produces one. **None is a defect, and the phase's thesis
is unchanged**: the linter now has an opinion about three deliberate decisions and still reports
nothing about a single one of the defects either pass actually found.

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
  **That last instrument does not survive a rebuild and should not be re-run as written.** Re-measured
  2026-09-01: `grep -c '_c('` on the entry returns **5**, not because the compiler stopped emitting but
  because the minifier aliased the import — the entry carries `useMemoCache:mo` and `useMemoCache:Oo`,
  and `useMemoCache` appears in it four times. A count keyed to a minified local name measures the
  mangler, not the compiler. What is stable is the presence of `useMemoCache` in the bundle plus a
  clean `react/react-compiler`; use those.

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

## The second pass — 2026-09-01

Run for the same reason as the first: 10, 11 and 12 are all blocked, this time on one missing
controller method. Measured against backend `origin/master` @ `aa2c3db` after a fetch — 27
controllers, 139 route decorators, validated lossless by counting the decorators directly and by
finding `POST /render-jobs` where `CLAUDE.md` says it is. Five routes contain "scene"; four of them
*take* a `sceneId`, and the fifth is the destructive `PUT`. `ScenesRepository.listForProduction` is
called by three services and no controller. Continuity facts looked reachable — controller keyed on
`:productionId`, all four symbols through the barrel — and are not: `continuityFactSchema` scopes by
`sceneIdSchema`, and its own docblock says "scoped by scene id, never by scene number".

Since 2026-08-21 the surface roughly doubled and none of it had been audited: four creative-library
screens, eight create and edit forms, the production list and its create form, the planner, the
project bible. Three reviewers went over it in parallel.

### What landed

- **The four library approvals announce and take focus.** `plan/16` had named this exact remainder
  and it was still true. The guard is *which record* was approved — `approve.variables === version.id`
  on style profiles, because one mutation serves a whole lineage — so an already-approved row does not
  steal focus on mount.
- **A saved style or voice no longer strands the user.** The success branch returned only an
  `<output>`, replacing its own Cancel, while the parent hid Approve and Edit for as long as its
  `isEditing` flag was set and nothing ever cleared it. A style version you had just edited could not
  be approved. The five style and voice call sites moved into `Dialog`, which is what locations and
  props already used, so all eight siblings now answer focus-on-open, Escape and focus-restore the
  same way.
- **The edit forms stopped diffing against a stale record.** `hasChanges` and the patch body were two
  hand-written lists of the same ten comparisons; both now derive from one
  `baseline = update.data ?? record`, which is why "Saved." can clear itself.
- **Two screens stopped claiming the orchestrator cannot do what it does.** The planner said "There
  is no dialogue route at all" (BE-17 published five) and the create-production form sent the user to
  the orchestrator for a style profile (`/styles` has had an Add control since that morning). Both are
  the FE-08 stale-sentence class, and the catalogue's existing "wrong once" guard now greps for them.
- **The subject list stopped truncating silently** — the fifth, which `CLAUDE.md` names by number.
- **A location's features stopped sharing one `<bdi>`**, which put the separating comma on the wrong
  side of a mixed-direction list, and the runtime budget's `<th scope="row">` stopped being
  `display: flex`, which is the one declaration that takes a cell out of its table.

### Measured

| | before | after |
| - | ------ | ----- |
| entry JS | 597.00 kB (gzip 175.91) | **473.88 kB** (gzip 144.93) |
| entry CSS | 65.86 kB (gzip 8.21) | **36.96 kB** (gzip 5.89) |
| Vite's >500 kB warning | fires | does not fire |

Seven route-level pages were statically imported while smaller ones beside them were lazy — the same
inversion this file already recorded for the render queue. The entry is now smaller than the
516.30 kB measured on 2026-08-21, with roughly twice the app behind it.

Control-border contrast re-measured in Chrome against the actual rendered background: secondary
**3.29:1**, primary **7.74:1**. The 3.29 matches 2026-08-21 exactly, so `--color-border-control` has
not regressed. **The first two instruments were wrong and were discarded** — resolving the token
string through a detached element returned `1.00:1` for every pair, and parsing
`getComputedStyle`'s `oklch(0.52 0.018 264)` with an rgb regex read those three numbers as sRGB. The
third resolves through a canvas and was validated on black-on-white (21.00), white-on-white (1.00)
and an oklch that must not come back black. This is the trap at the bottom of this file, met three
times in one session.

## Recorded rather than fixed

- **A failed validation is silent in eight forms — fixed 2026-09-01, on eleven.** The count had
  grown: the bible's two forms arrived after this was written. `ValidationSummary`, the twentieth
  primitive, is an `<output tabIndex={-1}>` that takes focus when it appears and is keyed on an
  attempt counter so it takes focus again on the next failed submit — without the key, only the
  first failure is ever heard, and a test was watched failing with it removed. Every form renders it
  first inside `<form>`. The create-production form's `role="alert"` banner, the unreliable shape,
  is gone with its string and its rule. **The number it announced was wrong until 2026-09-02.**
  Every form passed `Object.keys(fieldErrors).length`, and `fieldErrorsFromIssues` keys every prefix
  of a failing path on purpose, so a section's field can show a failure recorded at a list index
  beneath it. On a flat form the two are equal; on the bible's sectioned forms one bad language tag
  announced *Fields needing attention: 3* — measured by rendering the form, not inferred from the
  helper. `invalidFieldCount` counts the leaves of that map and folds a trailing list index into the
  box it belongs to, so two bad tags in one box are one field and the same field in two subject
  blocks is two. All thirteen forms use it, and the bible form's test pins the number.
- **Nothing conveys which fields are required — fixed 2026-09-01, and the count was wrong.** This
  bullet said twelve, read off the contract. That counted keys the wire needs present, and every
  form always sends every key, so a field whose schema accepts `''` is one the user may leave blank.
  Asking `safeParse('')` instead gives **thirteen**: two on styles, four on voices, one on locations,
  one on props, and five on the production form this bullet never counted. A style's `description`
  and a location's and prop's `canonicalDescription` are `z.string()` with no `.min(1)`, and an empty
  prop form reports one field, not two — which is how the over-count was found. `Field` takes
  `required`, renders the marker *beside* the label rather than inside it so the accessible name is
  untouched, and clones `aria-required` onto the control; the native `required` attribute is still
  not used, for the reason above, and a test pins its absence. The target runtime is one value split
  across two inputs, so its marker is on the fieldset's legend.
- **Both language catalogues ship on first paint.** `use-translate` is a 180.53 kB chunk that
  `index.html` links and the entry statically imports, and it contains **24,672** Hebrew characters —
  measured with a grep validated on a four-character probe. An English reader parses the whole Hebrew
  catalogue. Splitting it means making the catalogue load asynchronously, which is FE-15's mechanism
  and a real redesign, so it is named here rather than half-done. Note this is a localhost product:
  the cost is parse time, not transfer.
- **Two approval announcements are keyed on `isSuccess` rather than on the record** — plan approval
  and the canonical draft — which is the shape the bible publish button was fixed for. Latent today,
  because the only links to those routes come from a different route, so React unmounts the component
  in between. It goes live the moment anything links review→review or plan→plan.
- **`role="alert"` sits on a `display: contents` wrapper in five places.** Consistent across the
  repo rather than a divergence, so it is a repo-wide question. Worth one browser check.
- **Heading levels skip on three of the four library screens** — `h1 → h3` on locations and props,
  and `/voices` runs 1 → 3 → 4 → 2 → 4. Advisory under SC 1.3.1 rather than a listed failure, and
  invisible to `jsx-a11y` because the levels are split across components.
- **A style approval refusal is not attributable to the version that caused it.** One mutation per
  lineage means one card-level alert saying "That version was not approved" when three drafts exist,
  and `pending` disables every version's Approve at once.
- **Locations and props drop `failure.detail` on a server refusal** while styles and voices render
  it. The code is what a user can search for, and `ErrorState` shows it everywhere else.
- **The four Edit accessible names are assembled in `src/`** with a hardcoded space and word order.
  SC 2.5.3 passes in both languages today; a `library.editContext` slot key, like
  `approval.approveContext`, is the correct shape.

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
- [x] live regions announce decisions, not progress; progress uses `progressbar` — **narrowed
      2026-08-22, closed 2026-09-01.** Every approve control in this app replaces itself when the
      decision lands, so the focused button disappears. FE-07's canonical draft already handled it: an
      `<output tabIndex={-1}>` that takes focus, which is what actually makes a screen reader read the
      outcome — a live region inserted at the same moment is the unreliable case. FE-09's plan
      approval copies it, and the two-line ref moved to `src/lib/helpers/focus-when-shown.ts` on its
      second consumer. The four that did nothing — style, voice, location and prop — now announce,
      each scoped to the record it approved rather than to "an approval happened", and
      `CreateProductionForm` was the last create form saying nothing at all. **A failed validation now
      announces on all eleven forms** — see the sweep above, closed 2026-09-01
- [x] control boundaries satisfy SC 1.4.11, measured rather than eyeballed
- [x] reduced motion is honoured in CSS — every transition in `src/` uses a duration token, and the
      three keyframe loops each also set `animation: none`
- [x] no `react/react-compiler` errors, and no suppressions
- [~] every workflow is keyboard-completable — **the library workflows are, as of 2026-09-01.**
      Creating, editing and approving a style, voice, location or prop can be completed and left by
      keyboard: the forms open in a modal `Dialog` that takes focus and gives it back, and a
      successful save no longer removes every control on the card. Before this, saving a voice edit
      left the card with no Approve, no Edit and no Cancel until a reload. The storyboard and shot
      review remain **FE-10, FE-12**
- [x] the automated-pass vs human-approved distinction survives being read aloud — **pinned
      2026-09-02** by a test that reads FE-12's QC section as text in document order: the heading
      *Automated checks* and the sentence saying none of them is an approval come before any verdict,
      every verdict is preceded by its run's kind, and the word the shot's own state uses for a human
      decision never appears inside the section. Moving the advisory sentence below the runs fails it
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
