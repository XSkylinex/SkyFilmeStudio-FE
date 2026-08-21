# FE-11 — Render queue

> **Depends on:** 05 · **Blocks:** 12 · **Backend needs:** BE-05, BE-23 · **Plan authority:** §9, §10, §39, §47, §48
> **Status:** not started

## Goal

The screen a user watches for hours. It answers one question continuously: **is this progressing, or is
it wedged?** — and if it is wedged, why, and what can be done.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Layout | a table vs cards | **A dense table**, with an expandable detail row. Thirty jobs should fit on screen. |
| 2 | Update source | socket only vs socket + slow poll | **Both** (phase 05). The poll is the floor; the socket is timeliness. |
| 3 | Cancel semantics | immediate vs confirmed | **Confirmed** for a running job — it may be an hour in — and immediate for a pending one. |

## Steps

### 1. The table

Columns: job id (short) · production / scene / shot · job type · resource class · **state** · attempt
`n/max` · elapsed · progress · worker · hardware profile · priority.

Virtualised. A 20-minute production is hundreds of jobs.

**All twelve job states must be visually distinguishable at a glance**, and — this is the one that
matters — `FAILED_RETRYABLE` and `FAILED_FINAL` must **not** look alike. They mean different things to
the user: one will retry itself, one is waiting for a person. Phase 02's state palette exists for this.

### 2. Elapsed time and progress, honestly

Show elapsed wall-clock always. Show a percentage **only when the backend provides one** — a fabricated
progress bar on a job that reports none is worse than no bar, because it makes a wedged job look
healthy for an hour.

Where the backend reports a stage (`PREPARING`, `SUBMITTED`, `RUNNING`, `POST_PROCESSING`,
`VALIDATING`), show the stage. On a long render, "still running" and "post-processing" are very
different pieces of news.

Include **model load time** where reported (BE-05 records it) — it is often most of a short shot's
duration, and a user watching a queue that seems stuck deserves to know it is loading a 22B model.

### 3. Failures are actionable

Show the typed error code and its mapped sentence (phase 04):

- `CUDA_OUT_OF_MEMORY` / `MPS_OUT_OF_MEMORY` → suggest a lower render profile, not "try again";
- `DISK_SPACE_LOW` → show free vs required;
- `MODEL_FILE_MISSING` / `MODEL_HASH_MISMATCH` → name the file, link to `/system`;
- `GPU_OFFLOAD_THRASHING` → explain it is not a crash;
- `OFFLINE_POLICY_VIOLATION` → **loud and persistent**. A provider was pointed off-machine; this is the
  product's central promise, not a routine error.

Expose the retained stderr excerpt in the detail row. BE-06 preserves it precisely so it can be read
here.

### 4. Retry semantics are visible

Attempt `2/3` on the row. When automatic attempts are exhausted, say so and require a person —
that is the policy (§26), and a queue that silently stops is indistinguishable from one that is stuck.

A manual retry after a **creative** failure is not the same operation as a technical retry: it takes a
new seed and modified parameters. Surface that distinction rather than offering one button.

### 5. Controls

Cancel · retry · reprioritise · pin to a worker. Cancel on a running job asks for confirmation and
states what will be lost.

**No optimistic updates.** Cancel is an approval-class operation.

### 6. Resource usage (§39, §48)

Live from `system.pressure`: current worker load, and the memory metrics that apply to **this** hardware
profile — unified-memory pressure and swap growth on the Mac; VRAM, system RAM and host offload on the
PC. Different metric sets, not a lowest common denominator.

When the scheduler stops claiming new `GPU_HEAVY` jobs because pressure is critical, **say that**. A
queue that quietly stops claiming looks broken; a queue that says "paused: memory pressure" is
informative and lets the user decide to stop.

### 7. Grouping and filtering

Group by production; filter by state, resource class and worker. "Show me only what failed" and "show
me what is waiting on a person" are the two views actually used.

### 8. Worker view

Registered workers, their hardware profiles, capabilities, current load, last heartbeat, and whether
they are `LOCAL` or `PRIVATE_LAN`. A worker that has stopped heartbeating should be obvious — its jobs
are about to go `STALE`.

### 9. Performance

This page receives the most socket traffic in the app. Measure its re-render rate under load (phase
05's buffering does the work; this page proves it). A queue that re-renders sixty times a second is the
most likely INP failure in the product.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn dev
```

- run 50 concurrent-ish jobs and **measure re-renders over ten seconds** — bounded by the flush rate,
  not the message rate;
- confirm all twelve states are distinguishable, and that the two failure states differ;
- kill the socket → the table still updates by polling;
- force `DISK_SPACE_LOW` → free vs required is shown;
- force `OFFLINE_POLICY_VIOLATION` → loud and persistent, not a toast;
- exhaust retries → the row says a person is needed;
- trigger memory pressure → the queue says it paused claiming, and why;
- cancel a running job → confirmation states what is lost;
- `dir="rtl"` — the table mirrors correctly.

## Done when

- [ ] dense virtualised table with all twelve states distinguishable
- [ ] `FAILED_RETRYABLE` and `FAILED_FINAL` are visually different
- [ ] elapsed always; percentage only when real; stage and model-load time shown
- [ ] typed error codes mapped to actionable sentences; stderr excerpt reachable
- [ ] attempt counts visible; exhausted retries say a person is needed
- [ ] creative vs technical retry are distinguishable operations
- [ ] cancel/retry/reprioritise/pin, with confirmation on running cancel and no optimistic updates
- [ ] live pressure metrics, profile-appropriate, with claim-pausing surfaced
- [ ] grouping and filtering, including "failed" and "waiting on me"
- [ ] worker view with heartbeat state
- [ ] re-render rate measured and bounded

## Traps

- **A fabricated progress bar.** It hides a wedged job for an hour.
- **Identical-looking failure states.** One retries itself; one does not.
- **Dispatching per socket message.** The classic INP collapse, and this is the page it happens on.
- **A silent claim pause.** Indistinguishable from broken.
- **A generic error message.** The taxonomy exists so this page can be useful.
- **A poll that stops for good on a condition that clears.** Left for this phase by FE-04
  (2026-08-22). `isPermanentFailure` answers two questions with one helper — "is an immediate retry
  pointless", which feeds `shouldRetryRequest`, and "should this job ever be asked about again",
  which feeds this page's `refetchInterval`. Since 2026-08-22 any failure carrying an orchestrator
  code answers *yes* to both, and the second answer is wrong for a code like `DISK_SPACE_LOW`: the
  user frees 40 GB, the condition is gone, and nothing asks again. Measured against
  `@tanstack/query-core@5.101.4` — with retry and refetch both off, only a window refocus, a remount
  or an explicit invalidate clears the error, so **a monitor left open and focused never recovers.**
  Not reachable while `GET /render-jobs/:id` can only throw a 404 or a validation 400; reachable the
  moment it can raise a `StudioError`. This is the phase with a screen to separate them against —
  see `plan/04-data-layer.md`, "The envelope was a guess".
