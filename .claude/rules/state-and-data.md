---
description: Who owns which state — TanStack Query for server state, Redux Toolkit for editor state, refs for the render loop — and how the WebSocket bridge feeds them without re-rendering the tree.
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# State ownership

Three stores, and the boundary between them is the thing that goes wrong. Put a piece of state in the
wrong one and the symptom is never "wrong store" — it is a stale approval, a queue that re-renders
sixty times a second, or a page that forgets a half-finished edit.

| Kind of state | Lives in | Examples |
| ------------- | -------- | -------- |
| **Server state** — anything the orchestrator owns | TanStack Query | projects, productions, scenes, shots, render jobs, artifacts, QC reports, hardware profiles, model manifest, capabilities |
| **Editor state** — user intent not yet committed | Redux Toolkit | screenplay draft edits, shot-list reordering before save, selected shots, review filters, panel layout, playback position |
| **Ephemeral** — one component's business | `useState` / `useRef` | open/closed, hover, an uncontrolled input mid-keystroke |

The plan (§57) fixes this split, so it is not a preference to relitigate.

## The rule that decides every ambiguous case

**If the backend could tell you the value, it is server state.** Do not copy it into Redux "so it's
easier to read". A `shot.state` in a Redux slice is a second source of truth that will be wrong within
one WebSocket frame, and the bug surfaces as an approval button enabled on an already-approved shot.

The legitimate reason to hold server data in Redux is that **the user has changed it and not saved
it yet**. That is editor state, and it is a different value with a different name:
`draftScreenplay`, not `screenplay`.

## TanStack Query

- **Every fetcher forwards `signal`.** `queryFn: ({ signal }) => requestJson(path, schema, { signal })`.
  Without it an unmounted screen's request runs to completion, and the render-queue poll cannot be
  cancelled.
- **Query keys are built by a factory, never inline.** One file per query under an `api/` folder,
  exporting both the key and the fetcher. An inline `['shots', id]` at a call site is how
  invalidation silently stops matching.
- **Installation-wide status lives in `src/shell/api/`; a feature's `api/` holds that feature's own
  project or production data.** System mode, preflight and the model setup report describe the
  machine rather than any screen, and the shell renders the first of them persistently in the header.
  FE-04 colocated all three under `src/features/system/api/` before anything consumed them; FE-06
  moved them, because leaving them there meant `src/shell/` importing `src/features/` outside
  `route-tree.ts`, and it meant the dashboard reaching sideways into the system feature for the
  readiness strip. The render-queue's job query stays in its feature — that is production data.
- **Invalidate on the server's word.** After a mutation resolves, invalidate the affected keys and let
  the refetch land. See `.claude/rules/studio-domain.md` — approvals get **no** optimistic update.
- **Never poll something the socket already pushes**, and never rely only on the socket. The queue
  view sets a slow `refetchInterval` as a floor and lets socket events invalidate for immediacy. If
  the socket is healthy the poll almost never fires; if it dies the UI still converges.
- **`staleTime` is a decision per query, not a global.** The model manifest and hardware profile are
  effectively immutable during a session — long `staleTime`. Render jobs are not.
- **Errors are typed and rendered, not swallowed.** The backend defines an error taxonomy
  (`MPS_OUT_OF_MEMORY`, `CUDA_OUT_OF_MEMORY`, `DISK_SPACE_LOW`, `MODEL_FILE_MISSING`,
  `OFFLINE_POLICY_VIOLATION`, …). Map each to a sentence a user can act on. A generic "Something went
  wrong" on `DISK_SPACE_LOW` wastes an hour of someone's evening.

## Redux Toolkit

**The store landed in FE-03, not FE-04** (2026-08-17, the user's call). The split above is unchanged
— this is a timing decision, not a re-litigation. It exists so the shell stops passing state through
props and every later feature has a slice to attach to.

```text
src/shell/store/index.ts               configureStore, and the per-store listener wiring
src/shell/store/hooks.ts               useAppDispatch / useAppSelector, typed
src/shell/store/store.interface.ts     RootState / AppDispatch
src/shell/shell.slice.ts               the shell's own slice and its selectors
```

**The client is `fetch`, wrapped in exactly one folder.** `axios` was added alongside the store on
2026-08-17 and removed on 2026-08-18 because nothing imported it; FE-04 did not bring it back.
`src/lib/api/` is the only place in the app that calls `fetch`, and it sits **under**
TanStack Query, never beside it. A component that imports it directly is the bug this arrangement
exists to prevent.

**Corrected 2026-08-22: there are two callers, not one.** `request-json.ts` remains the only one for
a body-bearing request. `request-exists.ts` was added for a `HEAD` — asking whether the orchestrator
has produced a file without downloading it, which is how the asset detail view knows a scrub proxy
exists. It cannot go through `request-json`: a `HEAD` has no body to parse, and 404 is an *answer*
there rather than a failure. The rule that matters is unchanged and is the reason both live in
`src/lib/api/` — **no component calls `fetch`, and nothing outside this folder does either.** Add a
third only for a verb these two genuinely cannot express.

Four things about the shell slice worth copying rather than re-deriving:

- **A selector types against the smallest state it needs** (`{ shell: ShellState }`), not `RootState`.
  Not because of a cycle — there is none — but because a selector that names the whole root state
  couples every slice to every other, and the narrow shape is structurally assignable so a `RootState`
  argument still satisfies it. When FE-04 adds a slice, a selector reading a shape that no longer
  exists fails loudly at its call site.
- **`RootState` is derived, never hand-written**: `ReturnType<typeof store.getState>`. Annotating
  `createStore` with `ReturnType<typeof configureStore>` erases the store's generics — `getState()`
  becomes `unknown` and thunks stop type-checking — which forces a hand-maintained `RootState` that
  silently drifts from the reducer map. Leave the return type inferred.
- **Persistence is a listener, not a reducer.** Writing `localStorage` inside a reducer makes it
  impure and untestable, so `createListenerMiddleware` watches the action and writes afterwards. The
  listener factory lives in `store/shell-persistence.listener.ts` and is created **per store**, not
  registered once at module scope — a shared instance would let an isolated test store write for the
  singleton.
- **The read is separate from the listener, and guarded.** It runs at module scope in the slice's
  `initialState`, so it is the *read* that must never throw: a browser with storage blocked falls
  back to the default rather than failing to boot. That guard took the entire shell down once when it
  was missing, and it is load-bearing for the whole test suite — Node 26's experimental
  `localStorage` global shadows jsdom's and is absent without `--localstorage-file`, so
  `globalThis.localStorage` is `undefined` under Vitest.

- Slices are per feature and colocated: `src/features/<feature>/<feature>.slice.ts`.
- **No thunks that fetch.** Fetching is TanStack Query's job. A thunk in this app is for coordinating
  editor state across slices, and most of the time you do not need one.
- Selectors are exported from the slice file and take the root state; components never reach into
  `state.someFeature.nested.thing` inline.
- **Nothing that arrives over the socket goes into Redux.** See below.

## The WebSocket bridge

The orchestrator streams render progress. At peak this is a message every few hundred milliseconds
per active job, and there may be several. Naively `dispatch`-ing each one re-renders the tree.

- **Socket messages land in a ref and are flushed on an interval** (a few times a second), exactly
  once, into whichever store owns the value. Never `setState` or `dispatch` directly from the message
  handler.
- **The handler is a `useEffectEvent`,** so it always sees fresh props without re-subscribing the
  socket. Re-subscribing on every prop change is the classic version of this bug and it presents as
  "the queue misses updates".
- **The socket has one owner**, a provider in `src/shell/`. Features subscribe to a typed event
  channel; they do not open their own connection.
- **Reconnect with backoff, and show it.** A disconnected socket on a local machine usually means the
  orchestrator died — which the user needs to know, because their render did too.
- **Message payloads are validated with the shared Zod schema before use.** An unvalidated socket
  message is untyped data with a type annotation on it.

## Contracts come from the backend, once

Every wire type is inferred from the shared Zod contract published by the orchestrator — not
hand-written in `interfaces/`, not copy-pasted from a Swagger page.

**The mechanism, landed 2026-08-20.** `package.json` depends on
`sky-filme-studio-be@portal:../sky-filme-studio-be` and every wire type comes from
`import ... from 'sky-filme-studio-be/contracts'`. The backend's `exports` map points that subpath's
`types` condition at `./src/contracts/index.ts` — its *source*, not its build output — which is what
makes a rename break this repo on the next `tsc` instead of on the next version bump.

**`vite.config.ts` aliases that specifier to the same source file, and must keep doing so.** The
backend's `default` export condition points at `dist/`, which is gitignored and CommonJS. Left alone,
the runtime would load a build artifact while the types came from source — so appending an enum value
in the backend would typecheck green here and then throw at `parse()` against a stale `dist/`. The
alias also lets the bundle tree-shake: 456.68 kB and 17 zod modules, against 759 kB and 79 through
`dist/`. Do not "simplify" it away.

- **`zod` is the same version in both repos**: `4.4.3` in each `package.json` (registry latest,
  re-checked 2026-08-20). A v3/v4 split silently produces two incompatible `z.infer` shapes.
- **Two zod copies are installed; one reaches the bundle.** The frontend uses zod's types, which
  erase, and its runtime only through the contracts. Measured from the build sourcemap: a single zod
  root, 17 modules. Do not add `resolve.dedupe` until a file here constructs its own schema.
- **The contract module is browser-safe, and that is load-bearing.** All 47 files import nothing but
  `zod`; no `@nestjs/*`, no `drizzle-orm`, no `node:*`. Check that again before importing any *new*
  backend subpath — the portal link would happily drag a database driver into the bundle.
- **Everything is `z.strictObject` and every id is branded.** A route param is a `string` and a
  `ProjectId` is not; run it through `projectIdSchema.parse` at the boundary. `Timestamp` is an ISO
  string, never a `Date`.
- When a contract changes, the frontend build should break. That is the feature. Do not add a
  permissive `Record<string, unknown>` to make it compile.
- **A red build against the backend? Check `git -C ../sky-filme-studio-be status --porcelain` first.**
  The portal link reads that repository's *working tree*, so this build sees every intermediate state
  it passes through — including files written by an agent that has not run its own gate yet. A dirty
  tree means you are reading a draft, not a contract, and the cheapest first move is to wait or ask
  rather than to read the error. Measured 2026-08-22: four style-profile DTOs re-exported from
  `contracts/index.ts` while still importing through the backend's own `@/` alias produced seven
  errors here, six `TS2307` and one `TS7006` that was a *symptom* of the six — an unresolved schema
  makes a `.refine` callback's parameter implicitly `any`. Nothing was wrong on this side.
- **Anything reachable from the contracts barrel must import relatively.** A `paths` alias does not
  cross a package boundary: `@/` resolves against *this* repo's `tsconfig`, so a contract file that
  uses one is unresolvable here. The barrel stopped being a directory boundary the moment it began
  re-exporting upward out of `src/contracts/`, and that is also how the browser-safety guarantee two
  bullets up gets lost.

## Errors are typed, and the taxonomy is exhaustive

`src/lib/api/error-taxonomy.ts` maps **every** `ERROR_CODE` the contract defines to a sentence a
person can act on. It is typed `Record<ErrorCode, ErrorCodeGuidance>`, so a new backend code fails
`yarn typecheck` here rather than rendering nothing.

- `StudioError` carries `kind` — `NETWORK`, `HTTP`, `MALFORMED` or `CONTRACT` — plus the code, status
  and detail. The four are genuinely different failures: the orchestrator is down; it refused; something
  that is not the orchestrator answered (a `MALFORMED` non-JSON reply is usually Vite's SPA fallback on
  a path missing from the dev proxy); or the two halves disagree about the shape. A single "request
  failed" hides which, and telling someone the contract drifted when they actually got HTML sends them
  hunting a version skew that does not exist.
- **`presentation` means "may this message auto-dismiss".** `PERSISTENT` when the sentence carries the
  only remedy or names a broken promise; `TRANSIENT` when re-running the step is the whole answer. Both
  out-of-memory codes are `PERSISTENT` — their remedy is "choose a lower render profile", and a toast
  takes the remedy away with it. `OFFLINE_POLICY_VIOLATION` is `PERSISTENT` because the product's
  central promise was nearly broken.
- **The out-of-memory codes never say "try again".** The identical request fails identically.
- **A sentence never points at a screen or an action this build does not have.** A test greps for the
  ones that were wrong once.
- **`CONTRACT`, `MALFORMED`, any 4xx and any cancellation are never retried.** Retrying a shape
  mismatch or an aborted request only spends time; `isPermanentFailure` is the single definition, and
  the render-queue poll uses it too so a job id that 404s stops being asked about.

## Forbidden shortcuts

- No `window.__STUDIO__` global, no module-level mutable singleton holding project data.
- No `localStorage` as a cache for server data. It may hold UI preferences (panel widths, last-opened
  project id) and nothing else — a stale project cached in `localStorage` will outlive a database
  reset and produce a ghost.
- No `useEffect` that fetches. If it looks like one is needed, the data belongs in a query.
- No derived server state stored in a `useState` and synced with an effect. Derive it during render;
  the compiler handles the cost.
