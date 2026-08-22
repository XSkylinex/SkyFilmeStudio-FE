---
description: The Local AI Studio rules that bind the frontend — what the UI is allowed to talk to, what it must never claim, and how long-running renders and approvals behave.
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# Studio domain rules (frontend side)

The authority for all of this is `LOCAL_AI_STUDIO_PLAN.md` at the repository parent, and the split
plan in `plan/`. This file is the subset a frontend change can violate.

## The frontend talks to exactly one thing

```text
React Studio UI  ->  NestJS Orchestrator  ->  { PostgreSQL, ComfyUI, Python runtimes, FFmpeg }
```

**The UI never calls ComfyUI, LM Studio, a Python runtime, FFmpeg, or PostgreSQL directly.** Not
"temporarily to unblock a demo", not through a dev proxy, not for a progress bar. If a screen needs
something the orchestrator does not expose, the fix is a backend endpoint, not a second client.

Concretely, these must never appear in `src/`:

- a `fetch` to `:8188` (ComfyUI), `:1234` (LM Studio), or any port that is not the orchestrator's;
- a ComfyUI workflow JSON, node id, or `prompt_id` used as anything other than an opaque string to
  display;
- an LTX / Qwen / MOSS / ACE-Step model id used to branch UI logic — the backend advertises
  capabilities, the UI renders them;
- a database concept (a raw SQL string, a table name, a Drizzle import).

The reason is not purity. ComfyUI's graph is an implementation detail that changes per hardware
profile; a UI that knows about it stops working the moment a shot renders on the other workstation.

## Never state a location the app did not verify

The product's central promise is that **nothing leaves the machine**. The UI is where that promise is
either kept or quietly broken, so:

- **Do not add an external asset to the app.** No CDN font, no Google Fonts link, no analytics, no
  error-reporting SDK, no remote image, no `<iframe>` to a hosted service. Every byte the page loads
  must come from `dist/`. This is checkable and it will be checked — `plan/00-toolchain.md` adds a
  build assertion that no absolute external URL survives into the bundle.
- **`STRICT_OFFLINE` is visible state, not a footnote.** The plan defines a mode where Claude Code may
  act as an optional MCP operator, and in that mode project context can leave the device. The UI must
  distinguish strict-offline from operator-enabled **visibly and persistently**, not in a settings
  page nobody opens. A user who cannot tell which mode they are in has lost the feature.
- **Never render a capability the backend did not advertise.** `maxTestedDurationSeconds` means
  *measured on that exact hardware/backend/model*. Do not offer a 20-second shot in a duration picker
  because the model's marketing says 20 seconds. Build the picker from the capability payload.

## Long-running work is submitted, not awaited

A render takes minutes to hours. Therefore:

- **A mutation returns a `renderJobId`, not a result.** Any component that `await`s a render to
  completion is wrong, including in a loading state.
- **Progress arrives over the WebSocket**; the job row in the queue is the source of truth, and the
  socket is an accelerator. If the socket drops, the UI degrades to polling and keeps working. It must
  never depend on having received every frame.
- **Submitting twice must not render twice.** The backend enforces idempotency; the UI cooperates by
  disabling the control on the *server-acknowledged* state, not on a local `isSubmitting` boolean that
  a refresh resets.
- **A page reload must not lose or restart anything.** All job state is server state. Nothing about an
  in-flight render lives only in a React ref.

## Approvals are the product, so they do not get optimistic updates

Approve / reject / retake are the gates that stop hundreds of expensive renders from running on a
wrong keyframe. They are the one place where showing the user a state the server has not confirmed is
actively harmful.

- **No optimistic update on an approval, rejection, retake, cancel, or export.** Wait for the server,
  then re-read. Optimistic UI is fine for renaming a project.
- **A rejected shot never destroys its previous attempts.** The UI must be able to show attempt
  history, and a "regenerate" control must make the regeneration mode explicit —
  `EXACT_REPLAY`, `SAME_PROMPT_NEW_SEED`, `CONTROLLED_PROMPT_REVISION`, `NEW_KEYFRAME`,
  `RETAKE_REGION`. A single unlabelled "Retry" button is a bug: it hides which of five different
  operations is about to run.
- **An automated QC `PASS` is advisory and must be labelled as such.** The plan is explicit that a
  VLM pass is not equivalent to human approval for a hero shot. Do not style it like a green
  check-mark that implies the work is done.

## Media

- **Media is served by the orchestrator from project-relative paths.** Never build a filesystem path
  in the UI, never display a machine-absolute path as an asset's identity, and never assume a
  separator. Project bundles move between macOS and Windows.
- **Never load a full master into an `<img>`/`<video>` for a grid.** The backend produces proxies and
  thumbnails; use them. A contact sheet of 200 shots at full resolution will wedge the tab.
- **Reserve the box before the media arrives** (`aspect-ratio` on the cell). See
  `.claude/rules/css.md`.
- **Show provenance where the artifact is.** Every generated artifact records model, runtime version,
  seed, prompt and input hashes. The Shot Review page exists so a user who likes a shot can find out
  exactly how it was made — that panel is a feature, not debug output.

## Language is data

Hebrew must work as a production language, and the plan is explicit that no schema field is named for
a language. The same applies here:

- no `textHebrew`-shaped prop, no `isHebrew` boolean, no RTL-specific component;
- dialogue text carries its own `language`, and the component renders `dir` from that value;
- the *interface* language and the *production* language are two different things. A Hebrew production
  reviewed in an English UI must render RTL dialogue inside an LTR shell correctly.

**The mechanism landed in FE-15 (2026-08-20); use it rather than rebuilding it.**

- **Every user-visible string is a catalogue key.** `src/lib/i18n/catalogue/en.ts` is the source of
  truth and `he.ts` is `Record<TranslationKey, string>`, so a string added in one language and not the
  other does not compile. Reach for `useTranslate()` in a component; a helper that cannot call a hook
  returns a key and lets its caller translate.
- **Wrap user content in `ContentText`**, which renders `<bdi>` with `dir` resolved from that record's
  own language field and `dir="auto"` when the field is absent. `<bdi>` is the isolation; never
  hand-place directional characters.
- **Never `:dir()`** — the build lowers it to a `:lang()` list and so conflates interface language
  with content direction, which is this exact rule inverted. `[dir='rtl']` and logical properties.
- **Identifiers are never translated:** error *codes*, model ids, workflow ids, file paths, hashes,
  provenance fields. Translating them breaks copy-paste and search. Neither is technical notation —
  `00:20:00`, `24 fps`, `48 kHz`, `−16 LUFS` are notation, and localising a timecode makes a
  production tool harder to read, not easier.
- **Notation gets `dir="ltr"` on an inline element of its own, and a translated sentence never
  interpolates it.** Measured in FE-06: `8.0 GB` inside `<html dir="rtl">` renders as `GB 8.0`,
  because the digits and the unit resolve to two separate runs and the neutral between them takes the
  paragraph's direction. Two things follow. **Inline, not block** — putting `dir` on the `<dd>` fixed
  the order and moved the value to the opposite edge from its own label, because `dir` sets alignment
  too. And **not inside a sentence** — `interpolate` returns a string, so a substituted value cannot
  be given an element, and the same reordering happens where it is harder to see. A key that needs a
  figure ends in a colon and the figure is rendered beside it.
- **The order inside the run decides whether it breaks, and the two orders are not symmetric.**
  Measured 2026-08-22 with `bidi-js` (already installed here) at base direction RTL, because FE-08
  asserted the general rule from memory and got it backwards:

  ```text
  נשארו 8.0 GB בלבד          → דבלב GB 8.0 וראשנ        digits then Latin — INVERTED
  התיאור שלו וה-SHA-256 שלו   → ...SHA-256-הו ולש רואיתה   Latin then digits — intact
  SHA-256 של התיאור:          → :רואיתה לש SHA-256         intact
  ```

  UAX#9 rule W7 folds a European number into `L` when the nearest preceding strong type is `L` — the
  `A` of `SHA` — so `SHA-256` is one left-to-right run and the hyphen goes with it. In `8.0 GB` the
  number has no preceding strong `L`, stays `EN`, and N1 treats `EN` as `R` for the space, which is
  what splits it. So an identifier that *starts* with letters is safe inside a Hebrew sentence, and a
  measurement that starts with digits is not. **Measure it rather than reasoning about it** — this
  file's own `8.0 GB` line is the correct fact and was generalised into a false one within a day.
- **A backend-authored message is passed through, not translated.** It is not ours to translate, and
  it arrives in whatever language the orchestrator wrote it.
- **Passing it through is not the same as dropping it into the paragraph — it still needs
  isolating.** Measured in FE-07: the capture guide's `Diffuse, even lighting.` rendered as
  `.Diffuse, even lighting` inside `<html dir="rtl">`, because a sentence-final period is a
  bidi-neutral and takes the *paragraph's* direction rather than its own run's. Wrap it in
  `ContentText` with no `language`, which is `<bdi dir="auto">` and infers direction from the
  string's own first strong character. This is the `8.0 GB` case one level up: there the run was
  notation, here it is a whole sentence, and the mechanism is identical.

## Where this is enforced

Nothing in the gate checks any of the above. `yarn typecheck` will happily compile a `fetch` to
ComfyUI. These are review rules, and the review is where they are caught — which is why
`.claude/agents/fe-reviewer.md` reads this file first.
