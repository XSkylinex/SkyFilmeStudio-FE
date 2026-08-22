# FE-08 — Style, voice, location & prop studio

> **Depends on:** 07 · **Blocks:** 09 · **Backend needs:** BE-13 · **Plan authority:** §3.5, §11.5–11.8, §13, §29
> **Status:** unblocked 2026-08-22 for steps 1–6 — BE-13 merged; step 7 needs BE-14, step 8 needs a route

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
written. Nothing else was: at the time, BE-13 had entities, migrations, an immutability trigger and a
registered `StyleProfilesRepository`, but no controller and no route, so not one of the seven steps
above had an endpoint to call.

**Corrected the same evening — style profiles now have a full surface.** `0d2bc37` published eight
routes under `/projects/:projectId/style-profiles`, including the `GET /versions?lineageId=` this file
asked for below, `POST /:id/approve`, and a `PATCH` that returns a real 409 `STYLE_PROFILE_IMMUTABLE`
rather than the raw 500 recorded above. `GET /approved?lineageId=` is 404 before approval and 200
after, which is the same shape as the canonical head and maps to `null` here rather than to a failure.
The request DTOs are published through `./contracts`, with the direction in the name, so a create and
an edit form are both buildable.

**The phase stays blocked, because one surface of four is not a phase.** Voices, the pronunciation
dictionary, locations and props still have no controller, and the project bible needs BE-14 on top.
Building step 1 alone would mean one screen and six explanations of absence, which is worse for a
reader than an honest status line. Start this phase when all four have a surface.

**That paragraph was true for about six hours.** By the evening BE-13 was complete on
`be-13-styles-voices-locations-props`, and all four domains have controllers — verified here by
reading them, not by taking the backend session's summary on trust. The condition this paragraph set
is met; the section below records what is actually there and what now blocks instead.

**The vocabulary guard** — `test/style-and-language-agnostic.test.ts`. Step 1 says the application is
style-agnostic and that "the UI is where that either holds or quietly stops holding", which until now
nothing enforced. It fails on a style mode written anywhere in `src/`, on the word *anime*, on a quoted
language tag outside the three files that own the interface-language mechanism, and on a
language-named identifier.

Its first version matched only single-quoted names, which a review showed left eight ways through —
double quotes, a template literal, a bare object key, and most realistically an i18n key like
`'style.mode.PHOTOREAL_CINEMATIC'`, which is precisely the second source of truth this rule exists to
stop. Prettier's default double-quotes JSX attributes, so `lang="he"` was reformatted past the guard by
`yarn format` itself. Matching is now on word boundaries rather than on quoting. Proved by a deliberate four-rule violation that failed exactly four of its five
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

## What BE-13 publishes, measured 2026-08-22

Read from the controllers and the barrel in `../sky-filme-studio-be`, not from a summary. Re-measure
before building against any of it; this is a working tree.

**Every domain in steps 1, 3, 4, 5 and 6 has a surface**, all under `/projects/:projectId` —
`style-profiles` (with `versions` and `approved`), `voice-profiles` (with `approved`),
`pronunciation-dictionaries` (with `by-language` and a nested `entries` collection), `locations` (with
a nested `plates` collection and its own `approved`), and `props`. Each of the five carries
`POST :id/approve`, so the approval gate FE-07 built has four more places to go.

**Every approved-head route 404s when nothing is approved yet** — style profiles, voice profiles and
plates behave exactly like the canonical head, so one handler covers all four and none of them
returns a null body or a 200 with nothing in it.

**The request DTOs are published**, which is what the previous version of this section said was the
blocker. Measured: 34 `*/dto/*.schema.ts` in the backend, **23 re-exported** through `./contracts`,
and the direction is in the name as this repo asked. BE-13 published all of its own.

**The eleven that are not published are all from earlier phases**, and each one is a blocker already
named elsewhere in this repo: project create and update, asset import and the asset list query,
subject create, update, list and add-reference, the canonical draft body, `POST /render-jobs`, and the
model-hash verification query. That retrofit is Alex's call and is not purely additive — six of those
files import through the backend's own `@/` alias, which does not cross a package boundary and broke
this build on contact once already.

**A plate's `kind` is an open vocabulary**, exactly like `StyleMode`: a branded
`SCREAMING_SNAKE_CASE` string with `SUGGESTED_PLATE_KINDS` as suggestions, not an enum. A plate
picker reads those four from the wire. When one exists, `test/style-and-language-agnostic.test.ts`
should grow a plate-kind rule for the same reason it has a style-mode rule — until then there is no
code for it to guard.

**A plate anchors exactly one of `sourceAssetId` or `artifactId`.** Neither or both is a 400, and so
is a `PATCH` that clears the only anchor. That is a form-level constraint, not an error to render
after the fact.

**`PRONUNCIATION_ENTRY_EXISTS` collides on the normalised term**, so two strings that look different
on screen can collide — a decomposed accent, a pasted bidi mark, a doubled space. `normaliseTerm` is
not published, so this repo cannot compute the same key to warn before submitting. The backend offered
to export it; it was agreed as advisory-never-a-gate and is worth taking when step 4 starts, because
"that term exists" in front of a term the reader cannot see is unactionable.

**Dictionaries and entries cannot be edited, only created and deleted.** Neither controller carries a
`PATCH`. Step 4's optional IPA overrides are therefore a delete-and-re-add, and the UI has to say so
rather than offering an edit that does not exist.

**Step 8 has types and no route.** `6f33f99` scaffolded the animation, opening-ending and SFX library
wire shapes under `contracts/domain/`, and there is no libraries controller. That is the inverse of
the usual gap here and just as blocking.

## What actually blocks this phase now

**Nothing in steps 1–6.** BE-13 merged the same evening it was reported complete — `325d09d` on
backend master — and master now carries all 35 error codes, the ten this repo mapped ahead of the
merge included. Verified by reading master here, not by being told.

Step 7 needs BE-14, which is in progress on `be-14-bible-and-continuity`. Step 8 has wire types and
no controller; that is deliberate on the backend's side and its HTTP surface is a later phase there.

**This section has been wrong about BE-13 three times in one day** — no route, then one surface of
four, then four surfaces on an unmerged branch, and now merged. None of those was careless and each
was true when written; the file simply cannot carry a status that changes faster than it is read. So
it carries the check instead, and the answer gets recomputed rather than trusted:

```bash
git -C ../sky-filme-studio-be branch --show-current
git -C ../sky-filme-studio-be log master --oneline -1
git -C ../sky-filme-studio-be show master:src/contracts/enums/error-code.ts | grep -cE "^  '[A-Z_]+',"
```

One thing that does **not** expire, because it is a decision rather than a status: map a refusal from
an unmerged branch, and do not build a screen on one. That held here — the ten codes were mapped
before the merge and cost nothing when it landed, and no screen was written that a rename could have
invalidated.

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
