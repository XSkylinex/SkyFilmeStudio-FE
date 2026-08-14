# FE-04 — Data layer: contracts, queries, store

> **Depends on:** 03 · **Blocks:** 05+ · **Backend needs:** **BE-01** · **Plan authority:** §40, §42, §57
> **Status:** not started

## Goal

One typed seam to the orchestrator: contracts inferred from the backend's Zod schemas, TanStack Query
owning server state, Redux Toolkit owning uncommitted edits, and a typed error taxonomy the UI can act
on.

**Do not start this phase before BE-01 has published its contracts.** Building against a guessed shape
is the most expensive mistake available in this repo.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Contract consumption | mirrors BE-01's decision — package, monorepo, or generated file | Whatever BE-01 chose. The property that matters: **a contract change breaks this build.** |
| 2 | HTTP client | `fetch` + a thin typed wrapper vs a library | **`fetch`.** One host, one base URL, no auth complexity. A client library is weight with nothing to buy. |
| 3 | Query key strategy | inline vs factories | **Factories, one file per query.** An inline `['shots', id]` at a call site is how invalidation silently stops matching. |
| 4 | Where the base URL comes from | env var vs same-origin | **Same-origin in production, env var in dev.** The URL must never be user-editable to a non-loopback host. |

## Steps

### 1. Contracts

Import the schemas from BE-01 and infer every wire type. **Nothing in `src/**/interfaces/` duplicates a
backend shape.** Interfaces here are for props and view models only.

`zod` must be the **same major as the backend's** — both were on 4.4.3 (registry latest, 2026-08-14).
A v3/v4 split produces two `z.infer` implementations that typecheck separately and disagree at runtime.

### 2. The client

A thin wrapper that: builds the URL from the configured base · sends and parses JSON · **validates the
response with the contract schema** · maps non-2xx bodies into a typed `StudioError` carrying the
backend's error code.

**One host, no exceptions.** No `fetch` in `src/` may target anything but the orchestrator. Never
`:8188` (ComfyUI), never `:1234` (LM Studio), never a database — not temporarily, not through a dev
proxy, not for a progress bar. If a screen needs something the orchestrator does not expose, that is a
backend task; say so and stop.

### 3. Query layer

One file per query under `src/features/<feature>/api/`, each exporting a key factory and a fetcher.

`staleTime` is a decision per query, not a global:

| Data | Behaviour |
| ---- | --------- |
| model manifest, hardware profile, capabilities | effectively immutable for a session — long `staleTime` |
| projects, subjects, styles, voices | minutes |
| production plan, screenplay, storyboard | invalidate on mutation |
| render jobs, shot states | short, plus socket-driven invalidation (phase 05) |

**Never poll what the socket pushes, and never rely only on the socket.** The queue sets a slow
`refetchInterval` as a floor; socket events invalidate for immediacy. Healthy socket → the poll almost
never fires. Dead socket → the UI still converges.

### 4. Mutations

- **No optimistic update on approve, reject, retake, cancel, or export.** These are the gates that stop
  hundreds of expensive renders running on a wrong keyframe. Wait for the server, then re-read.
  Optimistic UI is fine for renaming a project.
- **A render mutation returns a `renderJobId`, not a result.** Nothing awaits a render, including in a
  loading state.
- **Send an idempotency key** on every submission, and gate the control on **server-acknowledged**
  state — not a local `isSubmitting` flag a refresh resets.

### 5. Error taxonomy

Map every backend code to a sentence a user can act on, keeping the code visible for the log:

```text
DISK_SPACE_LOW            "Not enough free space to start this render. N GB required, M available."
MODEL_FILE_MISSING        name the model and where it is expected
MODEL_HASH_MISMATCH       name the file
MPS_OUT_OF_MEMORY /
CUDA_OUT_OF_MEMORY        suggest a lower render profile — do not suggest "try again"
GPU_OFFLOAD_THRASHING     explain what is happening; it is not a crash
OUTPUT_DECODE_FAILED      the render produced an unreadable file
CHARACTER_IDENTITY_FAILURE point at the subject and the canonical reference
AUDIO_SILENT / AUDIO_CLIPPING
PROMPT_SCHEMA_INVALID     the planner returned an unusable structure
OFFLINE_POLICY_VIOLATION  loud, persistent, not a toast — a provider was pointed off-machine
RUNTIME_START_FAILED
```

A generic "Something went wrong" on `DISK_SPACE_LOW` wastes an hour of someone's evening.
`OFFLINE_POLICY_VIOLATION` is special: it means the product's central promise was nearly broken.

### 6. Redux — uncommitted intent only

Slices per feature: draft screenplay edits, shot-list reordering before save, selection, review
filters, playback position, panel layout.

**If the backend could tell you the value, it is server state.** The legitimate reason to hold
server-shaped data in Redux is that the user changed it and has not saved — and then it has a different
name: `draftScreenplay`, not `screenplay`. No fetching thunks. Nothing from the socket.

`localStorage` may hold UI preferences and nothing else. A cached project there will outlive a database
reset and produce a ghost.

### 7. Capability-driven UI inputs

Fetch the capability payload (BE-06) and **build pickers from it**. If a worker advertises
`maxTestedDurationSeconds: 8`, a 12-second option must not exist. `maxTestedDurationSeconds` means
*measured on that exact hardware, backend and model* — never a model's marketing number.

### 8. Test fixtures from schemas

Fixtures are **parsed through the real schema** in a test helper. A hand-written fixture that no longer
matches the contract is how a green suite ships a broken page.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build
```

- rename a field in the backend contract → **this build fails.** Prove it; that is the mechanism;
- an unvalidated response shape is rejected rather than rendered;
- a failed mutation surfaces the typed code and the mapped sentence;
- an approval mutation shows **no** state change until the server confirms;
- a duration picker built from `maxTestedDurationSeconds: 8` has no 12 s option;
- grep `src/` for `http://`, `https://`, `8188`, `1234` — nothing but the orchestrator base URL.

## Done when

- [ ] every wire type is inferred from the backend contract; none is hand-written
- [ ] `zod` majors match across repos
- [ ] one client, one host; nothing else is reachable from `src/`
- [ ] responses are schema-validated before use
- [ ] key factories everywhere; no inline keys
- [ ] `staleTime` chosen per query; the queue polls as a floor
- [ ] no optimistic update on any approval-class mutation
- [ ] renders return `renderJobId`; idempotency keys sent; controls gate on server state
- [ ] every backend error code maps to an actionable sentence
- [ ] Redux holds only uncommitted intent; `localStorage` holds only preferences
- [ ] pickers derive from the capability payload
- [ ] fixtures parse through the real schemas

## Traps

- **Starting before BE-01.** Everything built here would be rewritten.
- **A hand-written `interface Shot`.** Compiles forever, diverges silently, surfaces as `undefined` in
  a review screen.
- **An optimistic approval.** The one place a wrong-looking UI causes real, expensive damage.
- **Widening a type to make the build pass** after a contract change. The break is the feature.
- **A second client "just for the progress bar".** The rule has no exceptions.
