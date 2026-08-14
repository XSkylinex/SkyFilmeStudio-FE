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
  reviewed in an English UI must render RTL dialogue inside an LTR shell correctly. Use
  `dir="auto"` on user text, logical CSS properties everywhere, and never mirror by hand.

## Where this is enforced

Nothing in the gate checks any of the above. `yarn typecheck` will happily compile a `fetch` to
ComfyUI. These are review rules, and the review is where they are caught — which is why
`.claude/agents/fe-reviewer.md` reads this file first.
