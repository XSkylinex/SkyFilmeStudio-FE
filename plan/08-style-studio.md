# FE-08 — Style, voice, location & prop studio

> **Depends on:** 07 · **Blocks:** 09 · **Backend needs:** BE-13 · **Plan authority:** §3.5, §11.5–11.8, §13, §29
> **Status:** blocked 2026-08-22 — BE-13 is in progress but serves no route; the ungated half landed

## Goal

The creative library: versioned style profiles, persistent voices with a pronunciation dictionary,
locations with canonical plates, props with continuity rules — plus the project bible that ties them
together.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Style mode input | a fixed dropdown vs a suggestion list with free entry | **Suggestions + free entry.** §3.5 lists nine examples and says explicitly they are **not a closed enum**; `CUSTOM` is a real path. |
| 2 | Style preview | none vs generate sample images | **Generate samples**, queued as normal jobs. A style profile that cannot be seen cannot be approved. |
| 3 | Bible editing | free-form Markdown vs structured fields | **Structured fields**, per project kind, with a generated readable view. §11: do not store production state in Markdown alone. |

## Steps

### 1. Style profiles (§11.5)

Editor for palette, lighting, camera, texture and motion rules, realism level, prohibited style drift,
reference assets, and image/video generation defaults.

**Versioning is the important part.** Changing a style creates a **new version**; existing productions
stay pinned to the version they used. The UI must show:

- which version a production is pinned to;
- what changed between versions;
- that editing an approved profile will create `v2`, before the user commits.

A user who edits a profile and finds an old production changed has lost trust in the whole system —
so make the immutability visible rather than merely true.

**Never present a style as the default.** No "anime" preset sitting first in the list; the application
is style-agnostic and the UI is where that either holds or quietly stops holding.

### 2. Style sample generation

Generate a few sample images from the profile plus one approved subject, so approval is a visual
decision. This also demonstrates the property §12.7 requires: the **same subject under two style
profiles**, with the canonical identity unchanged. Show that comparison explicitly — it is the clearest
possible illustration that identity and style are separate.

### 3. Voice profiles (§11.6)

Create from a reference WAV plus its **exact transcript** and a language. Preview synthesis. Show
engine, model id, parameters and approval state.

Two things the UI must make obvious:

- **one persistent voice per subject** — the interface should make generating a new voice per line
  awkward, because it is the most audible continuity failure available;
- a voice may belong to a subject, a **narrator**, or a standalone production role — do not require a
  subject.

### 4. Pronunciation dictionary (§18.3)

Per project, per language: subject names, invented places, foreign words, unusual names, recurring
phrases — with **Hebrew entries as a first-class case**, not an edge case. Optional IPA/phoneme
overrides where the runtime supports them.

Provide a preview: type a line, hear it with and without the override. That is the only way to tell
whether an entry helped.

### 5. Locations & canonical plates (§29)

Location editor with immutable features, variants, layout notes and palette.

The **plate set** is the point: wide establishing, left-facing medium, right-facing medium, one close
detail, and lighting variants (day/night/damaged). Show coverage, because a location missing its night
plate will produce a regenerated-from-text night scene — which is exactly the failure §29 exists to
prevent.

### 6. Props (§11.8)

Name, owner subject, canonical description, references, continuity rules. Props feed the continuity
engine — "the subject carries a star in scenes 7–9" is a prop-scoped fact — so link through to where
that appears.

### 7. Project bible (§13)

Structured editor whose **sections depend on the project kind**. A music video gets no narrative
fields; §13 opens by requiring exactly that. Sections: world/project rules · subject rules · visual and
style rules · audio rules.

Versioned. Show which bible version a production planned against, because a later revision must not
rewrite an existing production's provenance.

### 8. Reusable libraries

Surface the animation clip library, OP/ED/title/eyecatch/credits assets, and the SFX library from
BE-13. These are why the second production is cheaper than the first (§49.2) — a library nobody can
find gets rebuilt instead.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn dev
```

- create a `CUSTOM` style profile with a mode not in the suggestion list;
- edit an approved profile → the UI states it will create `v2` **before** committing, and the old
  production stays pinned;
- render the same subject under two style profiles side by side and confirm the canonical identity
  record is unchanged;
- create a narrator voice with **no** subject;
- add a Hebrew pronunciation entry and hear the before/after difference;
- create a location and see plate coverage, including a missing night plate flagged as missing rather
  than as an error;
- open a `MUSIC_DRIVEN` project's bible and confirm **no narrative fields appear**;
- `dir="rtl"` — the editors and previews mirror correctly.

## What landed 2026-08-22 while this phase was blocked

Two pieces of this phase need no backend at all, so they were taken while the routes are still being
written. Nothing else was: BE-13 has entities, migrations, an immutability trigger and a
`StyleProfilesRepository` that is now a registered provider — but **no controller and no route**, so
not one of the seven steps above has an endpoint to call. Six of seven screens would have been a stub
apiece.

**The vocabulary guard** — `test/style-and-language-agnostic.test.ts`. Step 1 says the application is
style-agnostic and that "the UI is where that either holds or quietly stops holding", which until now
nothing enforced. It fails on a style-mode literal anywhere in `src/`, on the word *anime*, on a
language tag outside the three files that own the interface-language mechanism, and on a
language-named field. Proved by a deliberate four-rule violation that failed exactly four of its five
tests; the fifth asserts the walker read more than 150 files, so an empty result means agnostic rather
than nothing scanned. There are 267.

The rule is deliberately stricter than the backend's equivalent: **this repo gets no allowlist for
style modes**. `SUGGESTED_STYLE_MODES` is exported through `./contracts`, so a picker reads the nine
from the wire and a mode written here would be a second source of truth that could drift from the
first. That answers Decision 1's mechanism, though not its UI.

**The two error codes BE-13 reserved** — `STYLE_PROFILE_IMMUTABLE` and `STYLE_VERSION_CONFLICT`, both
409s. The second was shipped with a wrong sentence first: it was read as optimistic concurrency and
told the reader to reload and reapply an edit that was never at risk. It is a version-allocation race
inside `createVersion`, which allocates `coalesce(max(version), 0) + 1` and loses a unique index to a
concurrent writer, so the remedy is to send the same request again. Corrected after asking the backend
session and then reading its `style-profiles.repository.ts` rather than taking the answer on trust.

`STYLE_PROFILE_IMMUTABLE` is a real 409 and the sentence for it can be trusted. An earlier version of
this paragraph said it escaped as a 500 because the `P0001` the trigger raises was untranslated; that
was true for about two minutes on the afternoon of 2026-08-22 and `0811ae4` fixed it. `throwIfImmutable`
catches the raised exception and rethrows it as `StudioError('STYLE_PROFILE_IMMUTABLE')` from all three
update paths — `approve`, `update` and `softDelete` — and the backend has a database test asserting the
translation. Nothing here needs to handle a 500 for this case.

## Two things to settle before this phase resumes

- **A lineage needs a list route.** `canonical-sets` shipped without one and the consequence was
  total: a draft could be created but never rediscovered after a reload, which is why FE-07's
  approval half is still unbuilt. Versioning is this phase's whole feature — which version a
  production is pinned to, and what changed between versions, are both unanswerable from a head
  pointer alone. Raised with the backend session on 2026-08-22, **and fixed the same afternoon**:
  `edb38a3` added `GET .../canonical-sets`, returning every non-deleted set for a subject, drafts
  included. The equivalent route for a style lineage is the thing to check for before this phase
  starts, not after.
- **Request DTOs must reach `./contracts`.** Confirmed by the backend: `src/contracts/` re-exports no
  module DTO at all, and eleven request and query schemas across ten files sit outside the barrel —
`import-asset-request.schema.ts` and `list-assets-query.schema.ts` each carry two. BE-13 will export its
  own as it writes them; the ten existing ones are Alex's call. This repo asked for the direction to
  be visible in the name — `createStyleProfileRequestSchema` beside `styleProfileSchema` — because
  confusing a published response shape for a published request shape has been this repo's single most
  repeated defect.

## Done when

- [ ] style modes are open-ended, with no default style presented
- [ ] versioning is visible: pinning, diffs, and a warning before creating a new version
- [ ] the same-subject-two-styles comparison exists and demonstrates identity is unchanged
- [ ] voices support subject, narrator and standalone roles; one voice per subject is the obvious path
- [ ] the pronunciation dictionary works per language, with Hebrew first-class and an audible preview
- [ ] locations show plate coverage; missing plates are visible
- [ ] props carry continuity rules and link to where they apply
- [ ] the bible is structured, versioned, and shows only fields relevant to the project kind
- [ ] reusable libraries are discoverable

## Traps

- **A closed style dropdown.** §3.5 forbids it and `CUSTOM` is a real path.
- **Presenting "anime" first.** The application is style-agnostic; the UI is where that slips.
- **Editing an approved profile in place.** Old productions must not change under the user.
- **Requiring a subject for a voice.** Narrators exist.
- **Treating Hebrew as an edge case in the dictionary UI.** It is a stated production language.
- **Hiding plate coverage.** Missing plates become locations regenerated from text, and rooms that
  change shape between cuts.
