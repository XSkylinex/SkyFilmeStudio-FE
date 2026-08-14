# FE-15 — Internationalisation & RTL

> **Depends on:** 03 · **Blocks:** 16 · **Backend needs:** — · **Plan authority:** §11.12, §14.6, §51
> **Status:** not started

## Goal

The interface language is selectable, the document direction follows it, and **user content renders in
its own direction regardless of the interface** — because a Hebrew production reviewed in an English UI
is the normal case, not an edge case.

## This is not a late polish pass

Every component written before this phase must **already** use logical CSS properties. Phase 02
establishes that and every UI phase repeats it. This phase adds the *mechanism*: language selection,
direction switching, and translated strings.

If phase 15 turns into "go fix all the `margin-left`s", something went wrong earlier and it will cost a
week. Check as you go, not here.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Library | a full i18n framework vs a small typed dictionary | **A small typed dictionary** to start. One or two interface languages, no pluralisation-heavy content, and no server-side rendering. Add a framework when the need is real, not in anticipation. |
| 2 | Interface languages | English only vs English + Hebrew | **Both**, since the user works in Hebrew productions. English is the development default. |
| 3 | Number/date formatting | manual vs `Intl` | **`Intl`**, with the interface locale. Durations are the one exception — see below. |

## The distinction that matters most

**Interface language ≠ production language.**

```text
interface = en  ->  <html lang="en" dir="ltr">
dialogue line language = he  ->  that element renders dir="rtl"
```

A Hebrew dialogue line inside an English UI must render correctly **inside** an LTR shell. That is the
common case: the user reads the app in English and reviews Hebrew content.

Consequences:

- **Never a "Hebrew mode" toggle** that flips everything. Language is data on each record (§11.12,
  §14.6).
- Any element rendering user content — dialogue text, subject names, project titles, screenplay lines,
  subtitles, location names — takes `dir` from **that content's own language field**, or `dir="auto"`
  where the field is absent.
- Mixed-direction text (a Hebrew line containing an English product name) needs correct bidi isolation.
  Use `<bdi>` or `unicode-bidi: isolate`; do not hand-place characters.

## Steps

### 1. Interface language selection

Stored as a user preference (`localStorage` is legitimate for this — it is a preference, not server
data). Drives `<html lang>` and `<html dir>` through the single place phase 01 and 03 established.

### 2. Typed string catalogue

Keys are typed so a missing translation is a **compile error**, not a runtime fallback to a key name.

Translate the things a user reads while working: navigation, buttons, state labels, empty states, and —
importantly — the **error taxonomy sentences** from phase 04. A `DISK_SPACE_LOW` message that only
exists in English is the one most likely to be read under stress.

### 3. Direction switching

Flipping `dir` must not require a reload. Verify: the shell, navigation, tables, the timeline strip,
the storyboard strip, the shot-review comparison, dialogs, tooltips and toasts.

Directional icons flip via `:dir()` or a logical rule — **never `transform: scaleX(-1)`**, which
mirrors text inside the icon too.

### 4. Content direction

Every user-content element resolves `dir` from its own data. Test with:

- a Hebrew production in an English UI;
- an English production in a Hebrew UI;
- a line mixing both.

### 5. Formatting

`Intl.NumberFormat` and `Intl.DateTimeFormat` with the interface locale for counts, sizes and
timestamps.

**Durations and timecodes are not localised.** `00:20:00`, `24 fps`, `48 kHz`, `−16 LUFS` are technical
notation and stay in one form — localising a timecode makes it harder to read, not easier, and this is
a production tool.

### 6. Fonts

Whatever the design system uses must cover Hebrew. **No web font may be fetched from a CDN** — nothing
external reaches the bundle. Either use system fonts that cover Hebrew, or self-host a subset in
`public/` and verify it renders. Check for tofu with real Hebrew content, not with a placeholder.

### 7. What is *not* translated

Model ids, error **codes** (as opposed to their sentences), file paths, hashes, and provenance fields.
They are identifiers; translating them breaks copy-paste and search.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn dev
```

- switch the interface to Hebrew: **every** screen mirrors correctly — dashboard, asset grid, subject
  review, planner, storyboard strip, queue table, shot review comparison, timeline;
- a Hebrew dialogue line in an English UI renders RTL inside an LTR shell;
- a Hebrew line containing an English product name renders with correct bidi isolation;
- delete a translation key → **the build fails**;
- confirm no `margin-left` / `padding-right` / physical `left:` / `right:` remains — grep `src/`;
- confirm timecodes and technical units are unchanged in both languages;
- confirm no font is fetched from an external host (network panel, plus the phase-00 build assertion);
- confirm subtitle preview (phase 14) renders Hebrew correctly.

## Done when

- [ ] interface language is selectable and drives `lang`/`dir` from one place
- [ ] the string catalogue is typed; a missing key fails the build
- [ ] error-taxonomy sentences are translated
- [ ] direction switches without a reload, verified on every screen
- [ ] directional icons flip logically, never by `scaleX(-1)`
- [ ] user content resolves `dir` from its own language field; bidi isolation is correct
- [ ] `Intl` used for numbers and dates; technical notation left alone
- [ ] Hebrew renders with no tofu, from a self-hosted or system font — nothing external
- [ ] no physical CSS properties remain in `src/`
- [ ] identifiers are not translated

## Traps

- **A "Hebrew mode" toggle.** Language is per record; the interface and the content are independent.
- **Discovering physical properties here.** That is a week of retrofitting; catch them in every phase.
- **`transform: scaleX(-1)` on an icon.** It mirrors any text inside it.
- **A Google Fonts link.** The single most likely violation of the no-external-asset rule, and it
  arrives disguised as typography work.
- **Localising a timecode.** This is a production tool; `00:20:00` is notation.
