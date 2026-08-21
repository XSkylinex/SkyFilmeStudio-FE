# FE-06 — Project dashboard & system status

> **Depends on:** 05 · **Blocks:** 07+ · **Backend needs:** BE-04, BE-11 · **Plan authority:** §39, §8, §9, §48
> **Status:** the installation half is done 2026-08-21; the project half is **blocked on BE-11 and
> BE-13**, which are not started. `/system` and the dashboard's readiness strip read the three real
> endpoints and are the first screens in this app that fetch anything. Project lists, creation,
> reusable libraries and per-project storage have no endpoint to read and were not faked. The
> unchecked boxes below name which backend phase each one waits for.

## Goal

The two screens that answer "what is this project" and "can this machine actually do the next thing":
the Project Dashboard and System Status.

## What the orchestrator actually serves

Read on 2026-08-21 from all four controllers in `../sky-filme-studio-be/src/**/*.controller.ts`, not
from the backend plan:

```text
GET  /                   app root
GET  /system/mode        SystemMode
GET  /preflight          PreflightReport      — 11 checks, disk gate, optional hardwareProfileId
GET  /preflight/models   ModelSetupReport     — per model: role, licence, bytes, files, downloadArgv
POST /render-jobs        (BE-05)
GET  /render-jobs/:id    RenderJob
```

That is the whole HTTP surface. Everything this phase built stands on the middle three; everything it
did not build is missing because nothing serves it.

## What was decided, and what the endpoints allowed

| # | Answer | Verified |
| - | ------ | -------- |
| 1 | **Both**, as recommended. `/system` carries seven panels; the dashboard carries a summary strip and a link to the detail. The strip lives in `src/shell/system-readiness/` rather than in either feature, because both pages render it and the query it reads is shell-owned. | `/system` and `/projects/:id` both loaded against a stub serving the three endpoints; the strip renders the same three answers on both. |
| 2 | **A persistent summary, refreshed on demand**, as recommended. The strip is always visible and carries a "Re-run checks" control that refetches `/preflight`; the orchestrator runs the eleven checks on that GET. | A test swaps the handler between two reports and asserts the click changes the answer. |
| 3 | *(new)* **A check that did not run is not a check that passed.** `NOT_IMPLEMENTED` counts as a failure and `NOT_APPLICABLE` does not — the same predicate the orchestrator uses for its own `passed` field. Where the report's `passed` and its own checks disagree, the pessimistic answer wins. | `resolveSystemReadiness` is handed a report claiming `passed: true` with a `FAIL` check and must still say blocked. |
| 4 | *(new)* **The header badge takes `operatingMode` from the contract.** The shell used to re-derive a mode from `localOnly`, `strictOffline` and `claudeCodeOperatorEnabled` with a different precedence from the backend's, so the two disagreed whenever `allowLanWorkers` and `strictOffline` were both set. | A test hands the component a payload whose booleans contradict its `operatingMode` and asserts the mode wins. |

## What this phase could not build, and why

Each of these is a missing endpoint, not a deferred decision. None of them was faked, and none is
rendered as an empty value that could be mistaken for a real zero.

- **Model `compatibility`.** `plan/06` asks for `VERIFIED_UPSTREAM_SUPPORT` /
  `VERIFIED_LOCAL_BUT_NOT_OPTIMIZED` / `REQUIRES_LOCAL_BENCHMARK` / `REJECTED_FOR_THIS_HARDWARE` to be
  shown plainly. That field is on `ModelManifestEntry`; `/preflight/models` returns
  `ModelSetupReport`, which has no such field, and no route serves the manifest. The panel therefore
  says what its green badge does **not** mean: files present is not benchmarked. Unblocking this needs
  a manifest endpoint, not a frontend change.
- **Memory and pressure.** Needs `system.pressure` over the socket — FE-05, blocked on BE-23. The panel
  exists and says the orchestrator publishes no reading yet.
- **Runtimes.** `contracts/manifest/runtime-manifest.ts` exists; no route serves it. Same treatment.
- **Hardware detail.** `PreflightReport` carries `hardwareProfileId` and nothing else about the
  machine. The acceleration backend and the measured capabilities are not published, and the panel
  says so. An absent id is rendered as a failure state, because absent means
  `HARDWARE_PROFILE_KNOWN` failed and renders will refuse.
- **Projects: list, creation, five kinds, audience profile.** BE-11 is not started, and it waits on
  BE-10, the dual-workstation benchmark, which is a **STOP AND REPORT** gate.
- **Reusable libraries** (BE-13) and **per-project storage** (BE-11).
- **Productions awaiting approval, and anything blocked.** BE-15 and later.

The dashboard says all of that in one sentence rather than rendering counts of zero, and offers no
"import assets" or "create a production" control, because every one of those routes is still a stub
and a button that lands on an empty page teaches the user that this app's affordances lie.

## Steps

### 1. Project Dashboard (§39)

Built: the readiness strip (preflight, disk gate, failing count, checked-at, re-run), a link to
`/system`, and an empty state that says why nothing else is there. The operating mode is already
persistent in the header, which is where §4.5.5 wants it.

Not built: subjects, locations, productions, reusable assets, anything awaiting approval — no endpoint.

### 2. Project list and creation

Not built. No endpoint. `ProjectListPage` is unchanged.

### 3. Empty states that teach

A brand-new project has no assets, no subjects and no productions — and **that is a valid, supported
state**, including permanently: `TEXT_ONLY_NO_VISUAL_SOURCE` productions never import anything, and a
production with zero subjects is valid.

The dashboard's empty state says what belongs there and that the orchestrator serves none of it yet.
The "real next steps" half waits for FE-07, when those routes stop being stubs.

### 4. System Status (`/system`)

Built, in this order: readiness strip · hardware profile · disk · operating mode · memory and pressure
(unavailable) · runtimes (unavailable) · preflight · models.

**Disk** shows all five terms of §8's formula and the shortfall, and a failing gate says *a render will
refuse to start* in those words.

**Preflight** shows all eleven checks in the order the orchestrator ran them, each with its typed id
verbatim, its status, the backend's own sentence, and — when it carries an `errorCode` — the taxonomy
sentence plus the raw code.

**Models** shows role, licence, upstream repository, size, missing bytes and every file's status, and
for anything not ready, the argv to run. **There is no button and no link anywhere in that panel**, and
the test asserts it by counting roles rather than by looking for a label, so the absence is structural.

**Operating mode** shows the resolved contract identifier plus the five flags it was computed from,
each toned by what it means rather than by whether it is on: local-only off is DANGER, LAN workers on
is ATTENTION, strict offline on is SUCCESS. `lmStudioMcpHostEnabled` is neutral in both states and
carries a sentence saying it is a control surface on this machine rather than a route off it — which
is also why it is deliberately absent from the header badge.

### 5. Reusable assets

Not built. BE-13 is not started.

### 6. Storage

Not built. BE-11 is not started. The cache cleanup action is deliberately not stubbed: it would be a
destructive control with nothing behind it.

## What the browser found that the gate could not

Both of these passed `yarn typecheck`, `yarn lint`, `yarn test` and `yarn build` and were only visible
by loading the page.

**The dev proxy was swallowing the `/system` page.** `ORCHESTRATOR_ROUTE_PREFIXES` lists `/system` and
`server.proxy` matches on prefix, so the browser's own navigation to the `/system` route was forwarded
to the orchestrator and the app never loaded. Latent since FE-04; invisible until `/system` had a page.
Fixed with a `bypass` that returns `req.url` for a request whose `Sec-Fetch-Dest` is `document`.
`Accept` is only the fallback for a client that sends no `Sec-Fetch-Dest`, because an XHR is free to
ask for `text/html`.

**Every byte figure printed its unit before its number in Hebrew.** `8.0 GB` rendered as `GB 8.0`.
UAX#9: in an RTL paragraph the digits and `GB` resolve to two level-2 runs and the neutral space
between them takes the paragraph direction, because an EN run influences adjacent neutrals as if it
were R — so the two runs lay out right-to-left. Each figure now sits in an **inline** `dir="ltr"`
element; putting `dir` on the block fixed the order and moved the value to the opposite edge from its
own label, because `dir` sets alignment too.

The rule that follows: **a translated sentence never interpolates notation.** `interpolate` returns a
string, so a substituted value cannot be given an element of its own. `readiness.diskShortfall` and
`system.models.missingTotal` both end in a colon and render the value beside them. Every later screen
has this shape — timecodes, frame rates, sample rates, loudness — and `.claude/rules/studio-domain.md`
carries it.

Backend-authored `detail` prose has the same problem in reverse: an English sentence in a Hebrew page
put its full stop at the wrong end. It goes through `ContentText` now, which is what FE-15 built.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build
```

**This branch typechecks against an unmerged backend branch, and that is a live hazard.** The portal
link resolves against the sibling repository's *working tree*, so this repo's gate result changes when
someone switches branches over there. It changed twice while this phase was being written: the
orchestrator appended `MEDIA_TOOL_UNAVAILABLE` on `be-10-benchmark`, `master` here went red until a
sentence was written for it, and a later checkout of the backend's `master` made that same sentence a
compile error in the other direction. The first commit on this branch is the one that answers it, so
every other commit can be checked out on its own. If BE-10 lands without that code, that commit comes
out and nothing else is affected.

**The orchestrator would not start on this machine.** `yarn start` in the backend refuses to boot:
`STORAGE_ROOT`, `MODELS_ROOT`, `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER` and
`POSTGRES_PASSWORD` are all absent from its `.env`, and configuring the backend's environment is not
this repo's business. Populated states were therefore read against a **stub** serving the three
contract endpoints on `127.0.0.1:5556`, through the dev proxy, at the same origin the orchestrator
would use. The stub lives outside this repository.

What that proves: the rendering, the direction handling, the tone mapping and the proxy fix. What it
does **not** prove: that the orchestrator's real payloads parse. That check has to be repeated the
first time the backend boots here, and until then no claim in this file says otherwise.

Looked at, in both directions, with the stub returning a failing preflight, a failing disk gate, one
ready model, one wholly missing model and one with a hash mismatch:

- the dashboard answers "can I proceed" above the fold, with the shortfall in bytes;
- `/system` renders all seven panels; memory and runtimes say the orchestrator publishes nothing;
- a model with every file present is not presented as tested — the caveat sits above the list;
- a missing model shows its size and its command, and there is no control that would fetch it;
- an unrecognised profile renders a failure state (exercised through the test, not the stub);
- `dir="rtl"`: the whole page mirrors, every byte figure and command reads left-to-right in place, and
  the backend's English sentences keep their punctuation.

**Not looked at: a narrow window.** The browser connection was lost before the responsive case could
be loaded, so the `minmax(min(22rem, 100%), 1fr)` change in the three grids is reasoned from the
stylesheet and the floor check, not measured. The arithmetic says the old rule only overflows once
the content column is under about 352 px — a very narrow window or a heavily zoomed page, which is
narrower than the commit message for that change implies. The fix is right and costs nothing; the
severity in that message is overstated. Check it in a browser before FE-16 claims responsiveness.

## Done when

- [x] the dashboard answers "what is waiting for me" **for the machine**; the project half is BE-11
- [ ] project creation covers all five kinds; audience profile is optional — **BE-11 not started**
- [x] empty states are valid states; the "real next steps" half waits for FE-07's routes to be real
- [x] `/system` shows hardware, disk, preflight and models; memory and runtimes are named as unpublished
- [~] model `compatibility` is shown plainly — **cannot be**; the panel says what "files present" does
      not mean instead, and unblocking needs a manifest endpoint
- [x] nothing in the UI can trigger a model download
- [x] the disk gate's state is visible and explained
- [ ] pressure metrics are profile-appropriate and live — **FE-05, blocked on BE-23**
- [ ] reusable libraries are surfaced — **BE-13 not started**
- [x] approved sources and masters cannot be deleted from the UI — nothing here deletes anything

## Traps

- **A dashboard of counts.** The user wants to know what is blocked and what needs them.
- **Treating an empty project as an error.** Text-only and subject-free productions are first-class.
- **A "Download model" button.** Runtime downloads are forbidden; this is bootstrap.
- **Showing VRAM on the Mac.** It has none in that sense; the metric sets genuinely differ.
- **Marking an unbenchmarked model green.** §1.6: anything not positively verified must pass the
  benchmark before it is a production dependency. This screen cannot show `compatibility` at all, so
  it says what its badge does not mean — that sentence is load-bearing, not decoration.
