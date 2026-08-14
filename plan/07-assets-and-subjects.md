# FE-07 — Asset ingestion & subject review

> **Depends on:** 06 · **Blocks:** 08 · **Backend needs:** BE-11, BE-12 · **Plan authority:** §12, §27.3, §39
> **Status:** not started

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

## Verification

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

- [ ] both import transports, with real progress
- [ ] `TEXT_ONLY_NO_VISUAL_SOURCE` is a visible first-class path
- [ ] the grid uses proxies, is virtualised, and reserves every box
- [ ] originals are immutable in the UI; derived work is versioned
- [ ] the capture guide is optional, dismissible, and does not mark missing views as errors
- [ ] subject registration covers all ten types and assumes neither a face nor speech
- [ ] `immutableTraits` capture is guided toward specific, checkable statements
- [ ] canonical approval is per set version, with visible lineage
- [ ] the unapproved-set render block is clearly surfaced
- [ ] canonical anchors are visible on every derived generation
- [ ] the comparison view is large enough to judge drift

## Traps

- **A person-shaped registration form.** §3.1 lists dolls, vehicles, products and abstract mascots.
- **Full-resolution media in the grid.** It will wedge the tab.
- **Making the capture guide feel mandatory.** §12.2 is explicit that it is bypassable.
- **Small comparison thumbnails.** The screen stops doing its job.
- **Hiding the canonical anchor.** Drift becomes invisible until it is in a rendered shot.
