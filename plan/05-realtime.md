# FE-05 — Realtime bridge

> **Depends on:** 04 · **Blocks:** 11, 12 · **Backend needs:** **BE-23** · **Plan authority:** §2.8, §39
> **Status:** not started

## Goal

Render progress reaches the UI as it happens, without the tree re-rendering continuously — and the app
stays completely correct if the socket never connects at all.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Client | matches BE-23's transport (socket.io expected) | Follow the backend. Do not hand-roll a protocol on top of it. |
| 2 | Flush cadence | every message vs a fixed interval | **A fixed interval**, a few times a second. See below. |
| 3 | Where flushed data lands | Redux vs the query cache | **The query cache.** It is server state. Socket events either write a fresh value in or invalidate the key — never both, and never into Redux. |

## Steps

### 1. One owner

A provider in `src/shell/` owns the connection. Features subscribe to a **typed event channel**;
nobody opens their own socket. The transport is injectable so tests can drive it without a real socket.

### 2. Buffer in a ref, flush on an interval

This is the design, and it is not optional.

```text
message -> validate with the shared schema -> write into a ref keyed by entity id
                                            -> a timer flushes the ref a few times a second
```

**Never `setState` or `dispatch` from the message handler.** At peak this is a message every few
hundred milliseconds per active job across several jobs; dispatching each one re-renders the tree
continuously and INP collapses. The backend coalesces too (BE-23) — both sides doing it is correct, not
redundant.

Flush the **latest** state per entity, not a backlog. Progress is a level, not an event stream.

### 3. The handler is a `useEffectEvent`

So the subscription is not torn down and re-established whenever a prop changes. Re-subscribing on
every prop change is the classic version of this bug, and it presents as **"the queue misses updates"**
— which sends people looking at the backend.

`useEffectEvent` results may not be returned or passed down; it is called from the effect only.

### 4. Validate every message

Parse with the same Zod schema the REST layer uses. **An unvalidated socket message is untyped data
wearing a type annotation.** A message that fails validation is dropped and logged, never rendered.

### 5. Degrade to polling, deliberately

```text
socket healthy  -> events invalidate immediately; the slow refetchInterval almost never fires
socket dead     -> the refetchInterval carries the UI; nothing is lost, only timeliness
```

**Test this by disabling the socket entirely.** If any screen stops working, the socket has become
load-bearing and that is a defect — the database row is the source of truth (BE-23).

### 6. Reconnection, visibly

Exponential backoff with a cap. Surface the state in the shell: connecting / live / reconnecting /
offline. On a local machine a dead socket usually means the orchestrator died — and so did the render.
Saying "reconnecting…" while the user waits for a shot that will never arrive is worse than saying the
server is gone.

On reconnect, ask for current state in one round trip rather than replaying a log.

### 7. Message types to handle

```text
job.state.changed · job.progress · job.failed
shot.state.changed · production.state.changed
artifact.created · queue.summary · system.pressure
```

**`system.pressure` needs a real UI treatment.** A Mac swapping hard or a PC thrashing offload is
something the user must see *while it is happening* — it is the difference between pausing a render and
losing an evening to an unresponsive machine.

### 8. Rooms

Subscribe per project/production. A user with three productions open should not receive the other two's
traffic.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn dev
```

Measure, do not assume:

- run a render and **count re-renders** of the queue page over ten seconds (React DevTools profiler).
  It should be roughly the flush rate, not the message rate;
- **disable the socket entirely and confirm every screen still works** by polling;
- drop and restore the connection mid-render — one catch-up round trip, no duplicated rows;
- send a malformed message → dropped and logged, not rendered;
- change a prop the handler reads → the subscription is **not** re-established;
- trigger `system.pressure` → visible immediately.

## Done when

- [ ] one provider owns the connection; features use a typed channel
- [ ] messages buffer in a ref and flush on an interval; nothing dispatches from the handler
- [ ] the handler is a `useEffectEvent` and the subscription is stable across prop changes
- [ ] every message is schema-validated; invalid ones are dropped
- [ ] the app is **provably** correct with the socket disabled
- [ ] reconnection uses backoff and its state is visible in the shell
- [ ] `system.pressure` has a real, immediate UI treatment
- [ ] rooms isolate productions
- [ ] re-render count measured and bounded

## Traps

- **Dispatching per message.** The single most likely performance defect in this app.
- **A subscription effect that depends on props.** Presents as missed updates; wastes a day in the
  backend.
- **Trusting the socket.** It is an accelerator. The row is the truth.
- **Rendering an unvalidated payload.** It typechecks and it is a lie.
- **A silent reconnect spinner** while the orchestrator is dead.
