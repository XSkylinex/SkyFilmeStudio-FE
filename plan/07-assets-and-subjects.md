# FE-07 — Asset ingestion & subject review

> **Depends on:** 06 · **Blocks:** 08 · **Backend needs:** BE-11, BE-12 · **Plan authority:** §12, §27.3, §39
> **Status:** partly done 2026-08-21, **detail view added 2026-08-22**

## Goal

Import any user-owned material, register persistent subjects, and approve canonical reference sets —
the screen where subject consistency, the project's hardest problem, is actually decided by a human.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Import UX | drag-and-drop upload vs point-at-a-local-path vs both | **Both** (BE-11 supports both). Phone photo sets are frequently tens of gigabytes already on disk; forcing an upload wastes a copy. |
| 2 | Capture guide | modal wizard vs an optional side panel | **Optional panel.** §12.2 requires it to be **bypassable**; a modal wizard makes it feel mandatory even when it is skippable. |
| 3 | Canonical approval | per asset vs per set version | **Per set version** — matches BE-12 and §12.6. |

## Steps

### 1. Asset library

Grid of `MediaTile`s (phase 02) using **proxies and thumbnails**, never full-resolution media. Filter
by type, origin, capture date, subject and privacy class. Virtualised — a phone photo set is hundreds
of files and this page must stay usable at a thousand.

Detail view: original metadata, SHA-256, probe results, derived assets, and which subjects reference
it.

**Originals are immutable.** The UI offers no edit-in-place; derived work creates a new versioned
asset. Make that visible, so a user does not go looking for a crop tool.

### 2. Import

Both transports. Show progress, hashing and proxy generation as they happen — a 40 GB import is a
several-minute operation and a spinner is not enough.

Support every ingestion mode from §12.1, including **`TEXT_ONLY_NO_VISUAL_SOURCE`**: the path where a
user imports nothing at all must be a visible, first-class option on this screen, not an absence.

### 3. Capture guide (§12.2)

Optional and dismissible, with an explicit "skip — I'm starting from drawings / generated assets /
text". Shows the recommended views (front, rear, left/right, three-quarter, detail and texture
close-ups, distinctive features, scale reference, a short 360° clip) and the capture advice (diffuse
lighting, sharp focus, minimal motion blur, minimal filters, true colour, enough coverage).

Track which views exist so the user can see coverage — **without implying that a missing view is an
error.** A car has no expression sheet.

### 4. Subject registration (§12.4)

The form answers the plan's questions: what is this · which source assets define its identity · which
features must never drift · which may change · speaking or not · does it need pose/expression/wardrobe
variants · source-faithful or intended for stylization · which style profiles are approved.

**`subjectType` covers all ten values** — `HUMAN · ANIMAL · OBJECT · FIGURE · CREATURE · VEHICLE ·
PRODUCT · ROBOT · ABSTRACT · OTHER`. The form must not be shaped around a person: no required face
fields, no required voice, no assumption of speech.

`immutableTraits[]` deserves real UI attention. These become the **frozen descriptor** the prompt
compiler inserts verbatim (BE-12, BE-16) and the checklist the QC reviewer works through (BE-20). A
vague trait produces a vague lock. Guide toward specific, visual, checkable statements.

### 5. Canonical reference set

Assemble the set from source assets, generate derived views, or generate from scratch — the three paths
from §12.5. **Every view is optional.**

The approval screen is the important one:

```text
candidate view  |  source asset  |  immutable trait checklist
```

Approve the **set version**, not individual assets. Approved sets are immutable; a change creates `v2`
and existing productions keep resolving `v1` — show that lineage, because "why does this old
production look different" is a question that will be asked.

**A subject cannot be used for final rendering until its set is approved.** Surface that state clearly
on the subject card; it is a hard gate in the backend and the user needs to know why a render is
refused.

### 6. Anti-drift, made visible

Derived views are generated **from canonical references**, never from a previous edit (§2.2). The UI
should make the anchor explicit — show which references a generation used. If a user cannot see the
anchor, they cannot notice when it is wrong.

### 7. Subject Review (§39)

Raw photos · canonical versions · expression sheets (where applicable) · voice profile. Side by side,
at a size where identity drift is visible. **Do not shrink the comparison to fit a tidy grid** — the
whole purpose of this screen is seeing a difference.

## What the orchestrator actually serves, 2026-08-21

BE-11 published its HTTP surface during this phase's session. Read off its source on the
`be-11-projects-and-assets` branch, not off its status table:

| Route | Returns | Usable here? |
| ----- | ------- | ------------ |
| `GET /capture-guide` | `CaptureGuide` | **yes** |
| `GET /projects/:projectId/assets` | `Page<SourceAsset>` | **yes** |
| `GET .../:assetId/thumbnail` | `image/jpeg` stream | **yes** — a URL needs no type |
| `GET .../:assetId/proxy` | `video/mp4` stream | yes, unused until a player exists |
| `GET .../:assetId` | `SourceAsset` | yes, unused until a detail view exists |
| `POST .../upload` | `AssetIngestionResult` | **no** |
| `POST .../import` | `AssetIngestionResult` | **no** |

**The line between those two groups is the `exports` map, not the route table.** The package
publishes only `./contracts`. `captureGuideSchema` and `sourceAssetSchema` are under
`src/contracts/`; `uploadAssetQuerySchema`, `importAssetFromPathRequestSchema` and
`AssetIngestionResult` are under `src/projects/`, so this repo cannot import them and both import
transports stay unwired. Hand-typing them is the single thing `state-and-data.md` forbids outright.

BE-12 has entities on disk but no controller, so subjects, canonical sets and Subject Review have no
endpoint at all.

## Decisions

| # | Decision | Answer |
| - | -------- | ------ |
| 1 | Import UX | **Both**, as recommended — and **neither is built**, because neither request shape is published. Recorded rather than half-built: a form with nowhere to post is worse than an honest sentence. |
| 2 | Capture guide | **Optional side panel**, as recommended. Collapsed by default and it fetches nothing until opened. |
| 3 | Canonical approval | **Per set version**, as recommended — unbuilt, waiting on BE-12. |

## What landed

- **The asset library is real.** Type, origin, privacy class, capture date and immutability, in a
  grid whose every box is reserved before its image arrives.
- **Proxies only.** Each tile requests the thumbnail endpoint; an asset that cannot have one asks for
  no image rather than a URL that will 404.
- **`EXPORTABLE` is visually distinct from `PROJECT_PRIVATE`**, because that field is what may leave
  the machine.
- **The capture guide is offered and never required.** The contract makes that unrepresentable —
  `bypassable` is `z.literal(true)` and every view's `optional` is too — and the panel does not undo
  it.
- **The route parameter is validated on the page**, so a hand-edited URL produces a sentence instead
  of a request the orchestrator would refuse.

## The detail view, 2026-08-22

`GET /projects/:projectId/assets/:assetId` returns `SourceAsset`, which is fully published, so step
1's detail view was buildable without a single hand-written type. What it shows is the whole of that
record: path, media type, **SHA-256**, capture and ingest timestamps, the three badges, and whatever
the orchestrator recorded in `metadataJson`.

**`metadataJson` is `z.record(z.string(), z.unknown())`, and the UI is not allowed to pretend
otherwise.** There is no published shape for a probe result, so nothing here names a unit, converts
a number, or orders the keys by importance — it renders what was written, says on screen that the
contract types it as free-form, and leaves interpretation to the reader. A duration rendered as
`12.5 s` would be inventing a unit the contract does not carry.

Values are wrapped in `ContentText` and keys are `dir="ltr"`. That split is FE-07's own bidi lesson
applied one more time: a key is a machine identifier, a value is something the orchestrator wrote
and may be in any language.

### The first `<video>` in this codebase

The scrub proxy is `GET …/assets/:assetId/proxy`, `video/mp4`. Three things about it are decisions
rather than defaults.

**A missing proxy is a normal state, not an error.** The endpoint 404s with "has no proxyVideo yet;
its proxy job has not produced one", because a proxy is produced by a *queued job*. So the player
renders an `EmptyState`, not an `ErrorState`, and it carries a control to look again — the job can
finish while the page is open, and without that the only remedy is a reload. The wording says the
usual cause without asserting it, because an `onError` cannot distinguish a 404 from a decode
failure.

**Nothing autoplays, and the element carries its own accessible name.** `controls` with no
`autoplay`, and an `aria-label` naming the asset, since a bare `<video>` beside a filename has no
name of its own.

**The route is `lazy`.** This is the page that makes `plan/16`'s "media code is out of the entry
chunk" box non-vacuous for the first time, and it would be a poor joke to land the first `<video>`
in the entry chunk on the same day.

**What is deliberately not claimed: the proxy's dimensions.** They are real — `ASSET_PROXY_MAX_WIDTH`
and friends — but they live in `src/projects/constants/`, outside `src/contracts/`, so the package
does not publish them. Printing `960 x 540` on screen would be exactly the "capabilities are
advertised, not assumed" violation the rules open with. The copy says it is a proxy for scrubbing and
stops there.

**An accessibility gap this phase could not close.** `jsx-a11y(media-has-caption)` warns on the
`<video>`, and the warning is correct: WCAG 1.2.2 wants captions on prerecorded media. There is no
caption source — the orchestrator produces none for a source asset, and an empty `<track>` would
assert captions exist when they do not, which is the same dishonesty as `plan/11`'s fabricated
progress bar. **The warning is left visible rather than suppressed**, because the remedy is a backend
capability and not a lint configuration. The delivered-video case, where this criterion really
bites, belongs to **FE-14**.

## What the browser found that the gate could not, 2026-08-22

Two more, both in a tree where `yarn typecheck`, `yarn lint`, 777 tests and `yarn build` were all
green.

**A localised date was being forced left-to-right, which reversed it.** `formatDateTime` returns an
`Intl` string, so in Hebrew it is *Hebrew* — `16 באוג׳ 2026, 13:00:00`. Wrapping that in a
`dir="ltr"` span, the way this repo correctly wraps a path or a checksum, rendered it as
`16 13:00:00 ,2026 באוג׳`: the day at the far left and the comma on the wrong side of the year.

The distinction the rule already draws, and which FE-07 itself got wrong: **notation stays notation,
dates follow `Intl`.** A SHA-256, a project-relative path and a media type are machine identifiers
and pin to LTR. A formatted date is *translated output*, so it already matches the interface
language and must inherit the paragraph's direction. This was live in `AssetTile` since FE-07 and was
copied into the new detail view before being caught by looking at it.

**Swept repo-wide rather than fixed only where it was seen**, because a half-fixed bidi bug is worse
than an obvious one. The two formatters in `src/lib/format/` fall on opposite sides and both are now
right: `formatBytes` is hand-rolled ASCII — `` `${scaled.toFixed(1)} ${unit}` `` with units from a
literal array, no `Intl` and no locale — so it is genuinely notation and **its eight `dir="ltr"` call
sites** are correct; that is FE-06's `8.0 GB` case, and removing them would reintroduce it.
`formatDateTime` is `Intl.DateTimeFormat(language, …)` and has five call sites: two interpolate it
into a translated sentence with no wrapper at all, which is right, two are new code in this phase
that was never wrapped, and **the one that did wrap it** — `AssetTile`, since FE-07 — is the one
fixed here.

**Corrected 2026-08-22, by review, in the paragraph whose entire job was to be counted.** It first
said "five" and "three". Both were wrong: eight and one, verified by grep against the committed tree
rather than from memory. The substantive claim — hand-rolled ASCII on one side, `Intl` on the other —
was right and is unchanged, which is exactly what makes the wrong count worth recording: a
certification whose numbers are guessed certifies nothing, and this is the second time in two phases
that a number was carried into prose without being re-counted where it was stated.

**An `onError` on `<video>` is not a reliable signal that a proxy is missing.** Measured in Chrome on
the running app: with `preload="metadata"` and a `src` that 404s, the element sat at
`networkState: LOADING`, `readyState: HAVE_NOTHING` and **`error: null`** — no `error` event at six
seconds. With `preload="none"` it sat at `IDLE`/`HAVE_NOTHING`, equally silent. So the "no proxy yet"
state cannot be reached by waiting for the element to fail.

**The first version of this measurement was taken against the wrong condition, and the first version
of the fix was worse than wrong — it was false.** Corrected 2026-08-22, by review. The original
measurement used a `502`, which this repo's dev proxy returns when *the orchestrator is not
listening* — a connection failure, not an absent resource. It was a `502` for a mundane reason:
`PORT=3000` in the backend's `.env` against `ORCHESTRATOR_DEFAULT_ORIGIN` of `127.0.0.1:5556`, so
nothing was on the port at all. Re-measured against a real `404` from a running orchestrator, the
conclusion happens to hold — but it was not established by the first measurement, and "it turned out
right" is not the same as "it was checked".

**The claim built on it was false and shipped to users in both languages.** The copy said "the
orchestrator publishes no way to ask whether one exists". It does: `GET …/assets/:assetId/proxy`
answers **404 when the proxy is absent and 200 when it is present**, which the backend's own comment
states outright, and `HEAD` on that route returns the same status with a zero-length body. The
sentence was the load-bearing justification for the whole design, and it was wrong.

**So the player asks, rather than hedging.** A query does `HEAD` on the proxy route: absent renders
an `EmptyState` with a control to ask again, present renders the `<video>`, and a failure that is
neither says plainly that it could not find out — which is a different sentence from "there is no
proxy", because they are different facts. That also retires machinery the review found to be dead:
an `attempt` counter used as a React `key` on an element that was already unmounted whenever the
reset could run, so its only reader could never fire.

A timeout that guessed "probably missing after N seconds" would still be `plan/11`'s fabricated
progress bar wearing a different hat. Asking is not guessing.

**What was checked and is right:** a 404 `poster` cannot fire the media `error` event — poster
loading runs its own algorithm in the WHATWG media spec and never touches `networkState` or
`readyState` — so pointing the poster at a thumbnail that may not exist is safe and cannot trip the
absent state. `preload="metadata"` over loopback costs one header read and is what makes the scrub
bar show a duration; `playsInline` is still load-bearing at this floor for iOS 16.4, which is the
only engine that otherwise forces a fullscreen player.

**What could not be checked here:** whether native `<video>` controls mirror under `dir="rtl"`. No
primary source states the behaviour for any of the three engines at this floor, and this session had
no real media file to render controls against — the proxy 404s without a backend. `direction: ltr`
on the element would sidestep it, and was deliberately **not** added, because this repo does not ship
CSS for a behaviour nobody has measured. It is a question for the first phase that has real video
playing.

## What the browser found that the gate could not

**Backend-authored English inside a Hebrew page moved its own full stops.** `Diffuse, even lighting.`
rendered as `.Diffuse, even lighting`, and `…are read against.` as `.against` — a sentence-final
period is a bidi-neutral and takes the *paragraph's* direction, not the run's. This is the same
defect FE-06 measured as `8.0 GB` becoming `GB 8.0`, one level up: there it was notation, here it is
a whole sentence the orchestrator wrote.

The fix is `ContentText` with no language, which gives each string a `<bdi dir="auto">` that infers
direction from its own first strong character. **The rule to carry forward: passing a
backend-authored message through untranslated is not the same as dropping it into the paragraph — it
still needs isolating.** `yarn typecheck`, `yarn lint` and 697 tests were all green while this was
on screen.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build
```

2026-08-21: typecheck clean, lint clean, **697 tests across 123 files**, build clean,
`format:check` clean.

Loaded in Chrome against a stub serving the three endpoints, because none of the below is visible to
the gate:

- four assets render with reserved boxes; the audio asset requests no thumbnail and says so;
- the capture guide is closed on arrival and issues no request until opened;
- with the interface in Hebrew the page mirrors, the asset paths stay `dir="ltr"` in monospace, the
  capture date is Hebrew through `Intl`, and the guide's own sentences stay English **and** keep
  their punctuation.

## What is not built, and what each waits for

| Box | Waits for |
| --- | --------- |
| Both import transports, with real progress | **BE-11 to publish its request shapes** — the endpoints exist |
| `TEXT_ONLY_NO_VISUAL_SOURCE` as a first-class path | the same; it is an ingestion mode on an import that cannot be sent |
| Virtualised grid, second page onward | nothing external — the first page is 50 items and `nextCursor` is carried but unused |
| Filters by type, origin, capture date, subject, privacy | subject filtering needs **BE-12**; the rest is unbuilt |
| Asset detail: metadata, SHA-256, probe results, derived assets | a detail route, unbuilt |
| Subject registration, `immutableTraits`, canonical sets, Subject Review | **BE-12**, which has entities but no controller |

## Original verification checklist

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn dev
```

- import a 200-file photo set: the grid stays responsive and **nothing shifts** as thumbnails arrive;
- register a **vehicle** subject with no face views and no voice — the form does not fight it;
- register a speaking humanoid with expression references;
- skip the capture guide entirely and still complete registration;
- confirm a subject with an unapproved set is visibly blocked from final rendering;
- create `v2` of a set and confirm the lineage and the old production's pinning are both visible;
- confirm every generation shows its canonical anchor;
- `dir="rtl"` — the comparison layout mirrors correctly.

## Done when

- [ ] both import transports, with real progress — **blocked: request shapes not published**
- [ ] `TEXT_ONLY_NO_VISUAL_SOURCE` is a visible first-class path — **same blocker**
- [x] the grid uses proxies and reserves every box — **not virtualised**; the first page is 50
      items and nothing accumulates yet
- [x] the detail view shows the original's metadata, SHA-256 and probe results — added 2026-08-22
      against `GET /projects/:projectId/assets/:assetId`, plus the **scrub proxy**, which is the
      first `<video>` this app has ever had
- [ ] the detail view lists derived assets and the subjects that reference it — **no endpoint for
      either.** Derived assets have no route at all; subjects wait on **BE-12**
- [x] originals are immutable in the UI — nothing here edits anything, and `immutable` is shown
- [x] the capture guide is optional, dismissible, and does not mark missing views as errors
- [ ] subject registration covers all ten types and assumes neither a face nor speech — **BE-12**
- [ ] `immutableTraits` capture is guided toward specific, checkable statements — **BE-12**
- [ ] canonical approval is per set version, with visible lineage — **BE-12**
- [ ] the unapproved-set render block is clearly surfaced — **BE-12**
- [ ] canonical anchors are visible on every derived generation — **BE-12**
- [ ] the comparison view is large enough to judge drift — **BE-12**

## Traps

- **A person-shaped registration form.** §3.1 lists dolls, vehicles, products and abstract mascots.
- **Full-resolution media in the grid.** It will wedge the tab.
- **Making the capture guide feel mandatory.** §12.2 is explicit that it is bypassable.
- **Small comparison thumbnails.** The screen stops doing its job.
- **Hiding the canonical anchor.** Drift becomes invisible until it is in a rendered shot.
