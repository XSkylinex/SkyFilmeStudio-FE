# FE-17 — Test suite & acceptance

> **Depends on:** all · **Blocks:** release · **Backend needs:** BE-26 · **Plan authority:** §51, §52, §62
> **Status:** not started

## Goal

A test suite that asserts the claims this UI makes, and a walkthrough that proves the sixteen steps of
§62 are actually doable by a person on either workstation.

## The suite

### 1. Layout

`test/` mirrors `src/`. Nothing under `src/` is a test. Imports go through `@/`. Fixtures are **parsed
through the real contract schemas** — a hand-written fixture that no longer matches the backend is how
a green suite ships a broken page.

### 2. What to assert

Claims the code makes, not the shape of the code:

**Contracts and data**
- a valid payload parses; an unknown key is rejected;
- a socket message that fails validation is dropped and logged, never rendered;
- an approval mutation shows no state change until the server confirms;
- a duration picker built from `maxTestedDurationSeconds: 8` has no 12 s option;
- every backend error code maps to a non-generic sentence — **including `DISK_SPACE_LOW` and
  `OFFLINE_POLICY_VIOLATION`**.

**Domain behaviour**
- a `MUSIC_DRIVEN` production shows no screenplay stage;
- scene durations summing to 11 minutes against a 20-minute target produce a visible deficit **and name
  the underweight scenes**;
- a production with zero subjects renders every screen without error;
- an unapproved canonical set blocks final rendering, visibly;
- rejecting a shot keeps its previous attempts browsable;
- a QC `PASS` is not presented as human approval;
- every regeneration control names its mode; no bare "Retry" exists.

**Language and direction**
- a `he` dialogue line renders RTL inside an LTR shell;
- switching the interface language flips direction without a reload;
- a missing translation key fails the build.

**Realtime**
- with the socket disabled, every screen still converges by polling;
- the queue's re-render count under load is bounded by the flush rate.

**Formatting**
- `formatDuration` renders `00:20:00`; `754 ms` does not become `1 s`.

### 3. Prove the tests have teeth

Break the implementation on purpose, watch the test fail, restore it. Say in the report that you did.
A test that passes on broken code reads as coverage and is worse than nothing.

### 4. Mock at the HTTP boundary

MSW, not stubbed query hooks — stubbing hooks tests the mock. The socket transport is injectable so
tests drive it without a real connection.

## What the suite cannot see

Say this plainly whenever reporting: stylesheets, `index.html`, RTL layout, whether a video actually
plays, whether a 200-cell contact sheet is usable, and **every rule in
`.claude/rules/studio-domain.md`** — `yarn typecheck` will happily compile a `fetch` to ComfyUI.

Those are verified by running the app and looking, and by the checks below.

## Acceptance walkthrough

Run these on **both** workstations, against a real backend, with the public internet disconnected
(BE-26 owns the backend half).

### 5. The §62 walkthrough

Do all sixteen, as a person, and record where the UI got in the way:

1. create or choose a project · 2. choose kind, target runtime, languages, style · 3. import phone
media / existing assets / generated assets, **or start from text only** · 4. register subjects only
where continuity is needed · 5. create and approve the plan appropriate to the mode · 6. review the
storyboard where enabled · 7. start production · 8. let the queue run · 9. review only what is flagged
or awaiting approval · 10. regenerate specific failed shots **without losing completed work** ·
11. assemble · 12. export ~20 minutes at 1080p · 13. repeat for a **materially different** style/source
type · 14. disconnect the internet and repeat · 15. move the project between Mac and PC · 16. optionally
drive the same domain through MCP.

Step 13 is a test of generality, not a nicety — an architecture that only handles one style has
silently violated §3.1, and the UI is where that shows first.

### 6. Local-only verification

- **network panel across a full session: zero requests to any non-loopback host.** Not one font, not
  one analytics beacon;
- the phase-00 build assertion still fails on an external URL — prove it;
- the offline/operator mode indicator is visible on every screen, and correct;
- `OFFLINE_POLICY_VIOLATION` renders loudly if forced.

### 7. Long-session check

Keep the app open through a full 5-minute-production render. Watch for memory growth, leaked listeners,
unbounded query cache and accumulating object URLs. This is the failure that only appears in the
scenario this product is built for.

### 8. Cross-platform

The same build, on macOS and Windows, in the browsers the user actually uses. The floor is
`chrome111 / edge111 / firefox114 / safari16.4 / ios16.4` — confirm nothing in the app requires
something outside it (`floor-check.mjs`).

## Done when

- [ ] the suite covers every assertion listed above and each has teeth (demonstrated)
- [ ] fixtures parse through the real contract schemas
- [ ] mocking is at the HTTP boundary; the socket transport is injectable
- [ ] the §62 walkthrough completes on **both** machines
- [ ] step 13 completed with two materially different style/source cases
- [ ] a full session produces **zero** non-loopback requests
- [ ] the external-URL build assertion still works
- [ ] no memory growth or leaked listeners over a long render
- [ ] the app works on both platforms within the declared browser floor
- [ ] the report states explicitly what was **looked at**, not only what compiled

## Traps

- **Reporting "tests pass" as if it covered the visual, RTL and domain layers.** Name what you looked
  at.
- **Fixtures that drifted from the contract.** They keep the suite green while the page breaks.
- **Snapshot tests of markup.** They assert the shape of the code and fail on every refactor.
- **Skipping the second style case.** It is the generality claim, and it is the one most likely to
  fail.
- **Testing offline with devtools throttling.** Disconnect the machine.
