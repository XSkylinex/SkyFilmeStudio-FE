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

- **Query keys are built by a factory, never inline.** One file per feature under `api/`, exporting
  both the key and the fetcher. An inline `['shots', id]` at a call site is how invalidation silently
  stops matching.
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

**No HTTP client is installed.** `axios` was added alongside the store and removed again on
2026-08-18: nothing imported it, and nothing could — the data layer is FE-04 and FE-04 is blocked on
BE-01. The rule it leaves behind is the part worth keeping: when a client does arrive it sits
**under** TanStack Query, never beside it. A component that imports one directly is the bug this
arrangement exists to prevent.

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

- The generation/sync step and where the contracts land is `plan/04-data-layer.md`.
- **`zod` must be the same major in both repos.** Backend and frontend were both on `zod@4.4.3`
  (registry latest, 2026-08-14). A v3/v4 split silently produces two incompatible `z.infer` shapes.
- When a contract changes, the frontend build should break. That is the feature. Do not add a
  permissive `Record<string, unknown>` to make it compile.

## Forbidden shortcuts

- No `window.__STUDIO__` global, no module-level mutable singleton holding project data.
- No `localStorage` as a cache for server data. It may hold UI preferences (panel widths, last-opened
  project id) and nothing else — a stale project cached in `localStorage` will outlive a database
  reset and produce a ghost.
- No `useEffect` that fetches. If it looks like one is needed, the data belongs in a query.
- No derived server state stored in a `useState` and synced with an effect. Derive it during render;
  the compiler handles the cost.
