# FE-15 — Internationalisation & RTL

> **Depends on:** 03 · **Blocks:** 16 · **Backend needs:** — · **Plan authority:** §11.12, §14.6, §51
> **Status:** done 2026-08-20 — the mechanism is complete and both catalogues are full. Its
> *coverage* is the shell, the eighteen page stubs and the error taxonomy, because that is every
> screen this app has. The verification list below names screens that do not exist yet; those are
> checked in the phase that builds them, not faked here.

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

## What was decided, and what measurement changed

| # | Answer | Verified |
| - | ------ | -------- |
| 1 | **A small typed dictionary.** `src/lib/i18n/catalogue/en.ts` is the source of truth; `TranslationKey` is `keyof typeof EN_CATALOGUE`, and `he.ts` is `Record<TranslationKey, string>`. No framework. | Deleting one key from `he.ts` fails `yarn typecheck` with TS2741 naming that key. Proven twice, on `offline.local.label` and on `error.OFFLINE_POLICY_VIOLATION`. |
| 2 | **English and Hebrew**, English the default. 102 keys each. | A parity test compares the two key sets and fails on any string still carrying its English. |
| 3 | **`Intl` for numbers and dates; technical notation left alone.** | No timecode, fps, sample rate or byte unit is in the catalogue at all — there is no product screen rendering one yet. |

### `:dir()` is unusable here, and not for the reason the floor suggests

The plan's step 3 offers `:dir()` or a logical rule. `:dir()` is Baseline **widely** — and outside
this repo's floor:

```text
dir-pseudo    widely   OUTSIDE floor | blocked by: chrome 120, chrome_android 120, edge 120
```

Outside the floor is not automatically fatal, because the build lowers some things. So it was
measured, by building a two-line stylesheet and reading the emitted CSS. Lightning CSS **does** lower
it — into a language test:

```css
.probe:is(:lang(ae),:lang(ar),…,:lang(he),…,:lang(yi)) { … }
```

That is worse than not lowering it. This phase exists because **interface language is not content
direction**: a Hebrew line marked `dir="rtl"` inside an English UI would not match that selector,
while an element tagged `lang="he"` but rendered LTR would. `:dir()` compiles into precisely the
"Hebrew mode" conflation listed as this phase's first trap. **Use `[dir='rtl']`**, which passes
through untouched and keys off the attribute that actually carries direction.

### `Intl.Locale`'s text info is outside the floor too

`intl-locale-info` is `newly`, blocked by chrome 130 against a floor of 111. `new Intl.Locale('he').getTextInfo()`
returns `{direction:'rtl'}` under Node 26 and would be `undefined` in a browser this app supports, so
direction comes from a static table of RTL primary subtags in `i18n.constants.ts` — matched on the
primary subtag, so `he-IL` resolves like `he`.

### The error sentences moved out of the taxonomy

`ERROR_CODE_GUIDANCE` kept `presentation` and gained an explicit `messageKey`; the sentences now live
in the catalogue. `StudioError` carries `messageKey` and resolves its own `message` through the
**English** catalogue, so a log line and a stack trace stay in one language while the UI renders the
reader's. One definition of each sentence, two audiences.

That forced `resolveRouteErrorView` to stop returning a finished string. It now returns a
`descriptionKey`, optional values, and `descriptionDetail` — the backend's own message, which is
never translated because it is not ours to translate. `composeRouteErrorDescription` joins them at
the boundary, which is the only place that knows the reader's language.

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

Run 2026-08-20.

```text
yarn typecheck   clean
yarn lint        clean
yarn test        500 passed, 99 files   (477 / 92 before this phase)
yarn build       clean, entry 390.47 kB, CSS 33.40 kB
yarn format      clean
```

**A missing key fails the build.** Deleting `offline.local.label` from `he.ts`:

```text
src/lib/i18n/catalogue/he.ts(3,14): error TS2741: Property '"offline.local.label"' is missing in
type '{ … }' but required in type 'Record<"connection.closed.description" | … , string>'.
```

The error-code half is tied to the backend rather than to a list kept here: `en.ts` is
`satisfies Record<string, string> & Record<\`error.${ErrorCode}\`, string>`, so a code the
orchestrator adds fails this build until it has a sentence — the same mechanism FE-04 uses for
`ERROR_CODE_GUIDANCE`, now covering the words as well as the metadata.

**No physical CSS properties, and none had to be fixed.** The grep this phase exists to run —
`margin-left`, `padding-right`, bare `left:`/`right:`, `text-align: left|right` across `src/**/*.css`
— returns **zero**, and `scaleX(` appears nowhere. That is FE-02's discipline holding, and it is the
difference between this phase being a mechanism and being a week of retrofitting.

**What was looked at, not only compiled.** The dev server, at 1552px, in both languages:

- switching the interface to Hebrew set `<html lang="he" dir="rtl">` and persisted
  `studio.shell.interface-language` — **with no reload**, verified by reading `document.documentElement`
  after dispatching through the real `<select>`;
- the whole shell mirrored: brand to the inline-start, navigation, both indicators, the empty state;
- **no tofu.** Every Hebrew glyph rendered from `system-ui`. The font stack is
  `system-ui, 'Segoe UI', Roboto, sans-serif` and there is no `@font-face`, no `fonts.googleapis`,
  no `@import url(` anywhere in `src/`, `index.html` or `public/`;
- Latin runs inside Hebrew sentences — `Local AI Studio`, `orchestrator` — read correctly without any
  hand-placed characters;
- switching back to English restored the LTR layout exactly.

**One defect found by looking and fixed:** the language `<Field>` spanned the whole header, because a
form field is a block and the header is a wrapping flex row. It now has its own stylesheet
constraining it, and the header is one row again in both languages.

**One thing I got wrong while looking, and corrected by measuring.** From a zoomed screenshot I
judged the status badge's icon to be on the wrong side in RTL. Reading the DOM settled it: the badge
is `display:flex`, `direction:rtl`, and its first child sits at x=1666 against the label's x=1607 —
the first child is furthest inline-start, which is correct. The screenshot was the weaker evidence.

**Content direction is covered by test, not by eye,** because there is no user content on any screen
yet. `ContentText` renders `<bdi>` with `dir` resolved from the record's own language field, and its
test asserts a Hebrew line renders `dir="rtl"` while `document.documentElement.dir` is not `rtl` —
the Hebrew-production-in-an-English-UI case. `bdi` is `widely` and **inside** the floor. The visual
check on real dialogue belongs to the phase that first renders dialogue.

**Not translated, deliberately.** `src/shell/design-system-preview/` is a developer gallery, not
product UI, and its fixture strings stay English. Identifiers stay English everywhere: error *codes*,
model ids, file paths, hashes.

## Done when

- [x] interface language is selectable and drives `lang`/`dir` from one place
- [x] the string catalogue is typed; a missing key fails the build
- [x] error-taxonomy sentences are translated — all eighteen, in both languages
- [x] direction switches without a reload — verified in a browser and held by a test
- [x] directional icons flip logically, never by `scaleX(-1)` — there is no `scaleX` in `src/`, and
      the shell's icons are masks that inherit direction from their flex container
- [x] user content resolves `dir` from its own language field; bidi isolation is correct —
      `ContentText` renders `<bdi>`; no screen renders user content yet, so this is proven by test
- [x] `Intl` used for numbers and dates; technical notation left alone — no product screen formats a
      number or a date yet, and nothing technical entered the catalogue
- [x] Hebrew renders with no tofu, from a system font — nothing external, confirmed by grep and by eye
- [x] no physical CSS properties remain in `src/` — zero, and none had to be removed
- [x] identifiers are not translated

Ten of ten, with two carrying an honest asterisk: `Intl` formatting and the visual content-direction
check have **no surface to apply to yet**. The mechanism for both exists and is tested; the screens
that will exercise them are FE-06 and later. That is a smaller claim than the box implies, and it is
recorded here rather than discovered later.

## What later phases inherit rather than re-decide

**Never `:dir()`, always `[dir='rtl']`** — the build lowers `:dir()` to a `:lang()` list, which
conflates interface language with content direction. Measured above; `.claude/rules/css.md` carries it.

**A new user-visible string is a catalogue key, in both files, or it does not compile.** The pattern
to copy is any existing key: add it to `en.ts`, and `he.ts` fails until it is translated.

**A component that translates reads the store,** so its test renders through `test/render-in-store.tsx`.
That helper re-wraps `rerender` too — without that, a rerender drops the provider and the component
silently remounts, which is how two dialog tests failed when this landed.

## Traps

- **A "Hebrew mode" toggle.** Language is per record; the interface and the content are independent.
- **Discovering physical properties here.** That is a week of retrofitting; catch them in every phase.
- **`transform: scaleX(-1)` on an icon.** It mirrors any text inside it.
- **A Google Fonts link.** The single most likely violation of the no-external-asset rule, and it
  arrives disguised as typography work.
- **Localising a timecode.** This is a production tool; `00:20:00` is notation.
