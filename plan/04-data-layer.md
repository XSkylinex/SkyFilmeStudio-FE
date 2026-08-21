# FE-04 — Data layer: contracts, queries, store

> **Depends on:** 03 · **Blocks:** 05+ · **Backend needs:** **BE-01** · **Plan authority:** §40, §42, §57
> **Status:** done 2026-08-20, **error envelope corrected 2026-08-22.** The seam is complete and
> proven. Its *coverage* was four endpoints on the day it closed, because four is what the
> orchestrator served; see "What the orchestrator serves today" before assuming a query is missing by
> oversight. The one thing this phase got *wrong* rather than left undone was the HTTP error envelope,
> which it guessed and flagged as a guess — BE-11's exception filter made the real shape observable and
> the guess was wrong. See "The envelope was a guess, and the guess was wrong".

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

## What was decided, and what it cost

| # | Answer | Verified |
| - | ------ | -------- |
| 1 | **Yarn `portal:` sibling link**, mirroring BE-01's decision 1. `sky-filme-studio-be@portal:../sky-filme-studio-be`, imported as `sky-filme-studio-be/contracts` — and aliased to the backend's **source** for the runtime too, see below. | A rename in the backend contract breaks `yarn typecheck` here in one step — recorded under Verification. |
| 2 | **`fetch`**, wrapped once in `src/lib/api/request-json.ts`. No HTTP library was installed. | `grep` over `src/` finds exactly one URL: `ORCHESTRATOR_DEFAULT_ORIGIN`. |
| 3 | **Key factories**, one file per query, colocated as `src/features/<feature>/api/<name>.query.ts`. | No inline key exists; each factory has a test. |
| 4 | **Same-origin in both, through a Vite dev proxy** — see below; the env var survives as an override, and the resolved host must be loopback either way. | `resolveApiBaseUrl` throws on a non-loopback host, in both the configured and the same-origin path. |

Two decisions the phase had to make that the table did not anticipate:

**Zod is not duplicated, and no `resolve.dedupe` was added.** Two copies are installed — this repo's
and the backend's — but only the backend's reaches a bundle, because the frontend imports zod's
*types* (erased) and its *runtime* only through the contracts. Measured from the build sourcemap:
one zod root, 17 modules. Adding `resolve.dedupe: ['zod']` would be configuration against a problem
that does not exist. It becomes real the day a file here writes `import { z } from 'zod'` and
constructs a schema; re-measure then rather than pre-emptively configuring.

**The runtime resolves to the backend's source, not its build output — and that had to be forced.**
The backend's `exports` map is `{ "types": "./src/contracts/index.ts", "default": "./dist/contracts/index.js" }`.
Types therefore come from source (which is what makes a rename break instantly), but every bundler and
Node resolver picks `default`, so the *runtime* was resolving to `dist/`. Confirmed:

```text
runtime resolves to: .../sky-filme-studio-be/dist/contracts/index.js
.gitignore:2:/dist    dist/contracts/index.js
```

Two problems with that, one sharp and one merely expensive.

**The sharp one: types and runtime could disagree without anything failing.** An *incompatible* change
breaks `tsc`, which is the design. But a *compatible* one — appending an enum value, exactly what
happened mid-phase — typechecks green while a stale `dist/` still rejects the new value at
`parse()` time. Green build, runtime failure, and nothing points at the cause. `dist/` is gitignored,
so a fresh clone has none at all and the build simply cannot resolve the import.

**The expensive one: `dist/` is CommonJS**, emitted by `tsc` as `__exportStar(require(...))`, which
defeats tree-shaking completely.

`vite.config.ts` therefore aliases `sky-filme-studio-be/contracts` to
`node_modules/sky-filme-studio-be/src/contracts/index.ts`, so types and runtime read the same file.
Measured, with one query imported from the entry:

| Resolution | Entry chunk | zod modules | contract modules |
| ---------- | ----------- | ----------- | ---------------- |
| `dist/` (CJS, the default condition) | 759 kB | 79 | from `dist` |
| `src/` (ESM, via the alias) | **456.68 kB** | **17** | 42, from source |

The alias removes the stale-build hazard *and* takes about 300 kB off the bundle. Verified in dev as well:
the dev server serves `/@fs/…/sky-filme-studio-be/src/contracts/index.ts` with a 200, so no
`server.fs.allow` entry was needed. If this dependency ever becomes a published npm package, this
alias breaks loudly — which is the correct failure.

**Decision 4 changed during the phase, because the orchestrator does not allow cross-origin
requests.** `../sky-filme-studio-be/src/main.ts` calls `NestFactory.create()` with no
`enableCors()`, and there is no `cors` anywhere in that repo — Nest disables it by default. "Env var
in dev" would have pointed the browser at `http://127.0.0.1:5556` from the Vite dev origin, which the
browser blocks before the orchestrator ever sees it. Worse, the failure arrives as a bare
`TypeError: Failed to fetch`, so this client would have reported *"the orchestrator is not
answering"* about a process that was answering perfectly.

The fix is local to this repo: `vite.config.ts` proxies `/system`, `/preflight` and `/render-jobs` to
the orchestrator, so **dev is same-origin exactly like production** and the `isDevelopment` branch
disappeared from `resolveApiBaseUrl` entirely. `VITE_ORCHESTRATOR_URL` remains as an override for
running the orchestrator on another loopback port, and it still refuses a non-loopback host.

This is not the "no dev proxy" that rule 1 forbids. That rule bans proxying to a *second* service —
ComfyUI, LM Studio, a database. This proxies to the one backend, which is the rule's whole point.

The prefixes live in `src/lib/api/orchestrator-routes.constants.ts`, a module with no imports so
`vite.config.ts` can read it without dragging contract types into the config, and a test asserts every
`API_PATH` starts with one of them — otherwise a new endpoint silently misses the proxy and fails only
in dev, only in a browser, with a misleading message.

**`import.meta.env` is read by literal member access, not a computed key.** The first draft used
`import.meta.env[ORCHESTRATOR_BASE_URL_ENV_KEY]`. That builds — Vite materialises the whole env
object at a computed access site — but it types as `any`, which silently defeats every strictness
setting this repo turns on. `src/vite-env.d.ts` now declares `VITE_ORCHESTRATOR_URL?: string` and the
access is literal; assigning it to a `number` fails with `string | undefined`, which is the proof.

## What the orchestrator serves today

Measured 2026-08-20 by reading every `*.controller.ts` in `../sky-filme-studio-be/src`. There are
four controllers and **no WebSocket gateway**. Port 5556, bound to `127.0.0.1`.

| Method | Path | Response schema | Wired here |
| ------ | ---- | --------------- | ---------- |
| `GET` | `/system/mode` | `systemModeSchema` | yes |
| `GET` | `/preflight` | `preflightReportSchema` | yes |
| `GET` | `/preflight/models` | `modelSetupReportSchema` | yes |
| `GET` | `/render-jobs/:id` | `renderJobSchema` | yes |
| `POST` | `/render-jobs` | `submitRenderResponseSchema` | **no — see below** |
| `GET` | `/` | plain string | no, and never |

### Five things this phase could not do, and why each is a backend task

1. **`POST /render-jobs` cannot be typed from the contract.** The endpoint validates its body with
   `createRenderJobRequestSchema`, which lives at `src/render-queue/dto/create-render-job-request.schema.ts`
   — outside `src/contracts/` and unreachable through the `./contracts` subpath export. The contract
   *does* export `submitRenderRequestSchema`, but the backend's own docblock on the DTO says that is
   "the shot-facing shape a future `ShotsService` will translate into this one". Writing the mutation
   today means hand-writing a wire type, which is this phase's first trap. **The backend fix is one of
   two:** export the DTO through `./contracts`, or serve the shot-facing endpoint that accepts
   `submitRenderRequestSchema`. Until then there is no submit mutation here, and the idempotency-key
   and no-optimistic-update rules have nothing to attach to.
2. **No capability endpoint exists.** `providerCapabilitySchema` — including
   `maxTestedDurationSeconds` — is defined in the contract and nothing serves it. Step 7 has no data
   source. That is BE-06.
3. **No error code ever reaches the client.** The backend has no exception filter, so a failure
   returns Nest's default `{statusCode, message, error}` with no `errorCode` field. The taxonomy here
   is complete and exhaustively tested against `ERROR_CODE`, and `readErrorBody` picks the code up the
   moment one is sent — but today every failure lands on the status-only sentence.

   **Closed 2026-08-22, and the second half of that sentence was wrong.** BE-11 landed
   `src/common/filters/studio-error.filter.ts`, registered globally through `APP_FILTER` in
   `app.module.ts`. `readErrorBody` did *not* pick the code up, because it was reading a field name
   this phase invented. See "The envelope was a guess, and the guess was wrong" below.
4. **No socket.** Confirmed by search: no `*.gateway.ts` anywhere in the backend. FE-05 waits on
   BE-23, as the plan table already says. The render-job query therefore polls on a floor with no
   accelerator yet, which is the degraded mode the design was built for rather than a gap.
5. **No approval endpoints.** Nothing to approve, reject, retake, cancel or export against.

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

Run 2026-08-20.

**The contract rename, which is the whole mechanism.** `DISK_SPACE_LOW` was renamed to
`DISK_SPACE_CRITICAL` in `../sky-filme-studio-be/src/contracts/enums/error-code.ts`, and this repo's
`yarn typecheck` failed in one step:

```text
src/lib/api/error-taxonomy.ts(80,3): error TS2353: Object literal may only specify known properties,
and 'DISK_SPACE_LOW' does not exist in type 'Record<"AUDIO_CLIPPING" | ... | "DISK_SPACE_CRITICAL"
| ... , ErrorCodeGuidance>'.
```

The error names both the stale key and the new contract shape. The backend file was then restored
with `git checkout` and the typecheck went green again.

**Re-run against the finished branch**, because a mechanism proved mid-phase is not a mechanism proved
at the end. Renaming `AUDIO_CLIPPING` to `AUDIO_PEAKING` failed **both** `yarn typecheck` and
`yarn build` on the committed tree — the build stage matters separately, since `yarn build` is
`tsc -b && vite build` and a bundler alone would happily emit the stale shape. Note what made this work: the backend's
`exports` map points the `types` condition at its **source**, so there was no rebuild step between
the rename and the break.

**And then it happened for real, unstaged.** Mid-phase, the backend session appended
`NO_ELIGIBLE_PROVIDER` and `CAPABILITY_NOT_BENCHMARKED` to `errorCodeSchema`. The next `yarn typecheck`
in this repo failed on its own, naming both missing keys:

```text
src/lib/api/error-taxonomy.ts(4,14): error TS2739: Type '{ ... }' is missing the following properties
from type 'Record<..., ErrorCodeGuidance>': CAPABILITY_NOT_BENCHMARKED, NO_ELIGIBLE_PROVIDER
```

Nobody rebuilt anything, nobody bumped a version, and no one told this repo. That is a better proof
than the staged rename, and it is the argument for `Record<ErrorCode, …>` over a lookup that falls
back to a default sentence: a fallback would have shipped two silent blanks. The taxonomy now covers
eighteen codes.

**One host.** Grepping `src/` for `http://`, `https://`, `8188` and `1234` returns three lines, and
only one of them is an address:

```text
src/lib/api/orchestrator-routes.constants.ts   http://127.0.0.1:5556
src/assets/lib/components/icon/circle.svg      http://www.w3.org/2000/svg
src/assets/lib/components/icon/close.svg       http://www.w3.org/2000/svg
```

The two `w3.org` hits are XML namespace identifiers inside SVG artwork, which name a namespace rather
than something fetchable — the same category the external-URL guard allowlists. No ComfyUI port, no
LM Studio port, and no second client.

**Nothing external reached the bundle — but the guard had to be taught two new shapes first.** Adding
the contracts made `build/find-external-urls.ts` fail the build with five URLs, and all five were
false positives worth understanding rather than suppressing:

- `https://json-schema.org/draft/2020-12/schema`, `http://json-schema.org/draft-07/schema#` and
  `http://json-schema.org/draft-04/schema#` come from `zod/v4/core/to-json-schema.js`. They are
  `$schema` **dialect identifiers** — the same category as the W3C XML namespaces the guard already
  allowed — so they were added to the *exact*-match list, not the prefix list.
- `http://[${e}]` and `http://[${e.value}]` are zod's IPv6 validator building a URL for the parser to
  check; the source reads `http://[${address}]`. The rule added is that **a URL whose authority
  contains a template placeholder is not a literal address**, and the guard cannot judge it. The
  placeholder must be in the authority: `https://evil.example.com/${token}` is still reported,
  because there the host is literal. Exact-matching the minified `${e}` was rejected — a minifier
  rename would break the build for no reason.

**The dev proxy was verified by the shape of its failure, not by assumption.** With the orchestrator
not running, `yarn dev` on port 5199 answered:

| Request | Status | Content-Type |
| ------- | ------ | ------------ |
| `/system/mode` | 502 | `text/plain` |
| `/design-system` | 200 | `text/html` |

Without the proxy both would be `200 text/html` — Vite's SPA fallback serves `index.html` for any
unmatched path, which is exactly how a missing proxy entry hides itself. The 502 is the proxy
forwarding to a port with nothing on it. (Incidentally, Vite 8 binds `[::1]`, not `127.0.0.1`;
curling the numeric address gets connection-refused even while the server is up.)

**FE-03's error-message fixture is gone, and the shell now reads the one taxonomy.**
`src/shell/route-error-messages.fixture.ts` held sixteen hardcoded sentences keyed by
`Record<string, string>` — no exhaustiveness, and by the time this phase started it was **already
stale**, missing the two codes added that morning. Its out-of-memory sentences also ended in "and
retry", which step 5 of this phase explicitly forbids. `resolve-route-error-view.ts` now reads
`ERROR_CODE_GUIDANCE`, and a test asserts it renders the shared sentence rather than a copy.

**The lookup deliberately does not call zod.** The first version guarded with
`errorCodeSchema.safeParse(code)`, which is the obvious thing and cost **89.8 kB**: it dragged zod's
runtime into the entry chunk for what is a string lookup. Widening the map to
`Record<string, ErrorCodeGuidance>` for the read is exactly equivalent — the object is *defined* as
`Record<ErrorCode, …>`, so its keys are the contract's codes, checked at compile time — and the entry
chunk went 455.41 kB → **365.62 kB** at that change. Shipping eighteen contract-derived sentences
therefore costs about 1 kB over FE-03, not 91. The shipped figure is 365.81 kB rather than 365.62,
because the review fixes below landed after this measurement.

**A hole in the loopback guard, found while writing this phase and closed.** Both the shipping guard
and `build/find-external-urls.ts` tested the loopback IPv4 range with
`hostname.startsWith('127.')`. That is a prefix test on a *dotted* name, so:

| Host | Was judged | Actually is |
| ---- | ---------- | ----------- |
| `127.0.0.1.evil.com` | loopback | a remote host |
| `127.evil.com` | loopback | a remote host |
| `127.999.1.1` | loopback | a DNS name, since 999 is not an octet |

A hardcoded external host beginning `127.` would have passed the build guard *and* the runtime base
URL check — the exact exfiltration path the local-only promise exists to close. The near-miss test
that existed covered `localhost.evil.example.com` and missed this because the two checks were written
differently: an exact/suffix comparison for the name, a prefix for the address.

The check is now a full-hostname match on 127.0.0.0/8 with real octets, it lives in exactly one place
(`src/lib/api/helpers/is-loopback-host.ts`), and `build/find-external-urls.ts` imports it rather than
keeping the second copy that had the same bug. `127.255.255.255` still passes; the whole range is
loopback, not just `127.0.0.1`.

**Bundle sizes**, measured with `yarn build`:

| Build | Entry chunk |
| ----- | ----------- |
| FE-03, before this phase | 339.52 kB |
| FE-04 with TanStack Query wired, before the shell used the taxonomy | 364.53 kB |
| FE-04 as shipped | **365.81 kB** |
| The same, guarding the code lookup with `errorCodeSchema.safeParse` | 455.41 kB |
| With a probe importing one contract query, resolving to `dist/` | 759 kB |
| The same probe, after the source alias | **456.68 kB** |

The last row is the number FE-06 and FE-16 need: **zod plus the contracts cost about 90 kB
uncompressed** once the first screen imports a query. It is not in today's bundle because nothing
renders a query yet. Note also that `yarn build --sourcemap` fails the external-URL guard — the
`.map` files embed unminified sources, URLs and all. Sourcemaps are not enabled in this repo's build;
if they are ever wanted, the guard needs to learn to skip `.map`.

**Zod is not duplicated.** Read from the finished branch's build sourcemap `sources` array, with one
query imported from the entry: a single zod root, `../../../sky-filme-studio-be/node_modules/zod`,
17 modules, and 42 contract modules all from source. Two copies are installed; one is reachable.

**`import.meta.env` types.** `src/vite-env.d.ts` declares `VITE_ORCHESTRATOR_URL?: string`.
Assigning it to a `number` fails with `Type 'string | undefined' is not assignable to type 'number'`,
which is how the declaration was confirmed to merge rather than fall through to the `any` index
signature.

**What could not be verified, because the backend does not do it yet:** a failed mutation surfacing a
typed code (no endpoint emits one), an approval mutation not updating optimistically (no approval
endpoints), and a duration picker built from `maxTestedDurationSeconds` (no capability endpoint).
Those three bullets stay unticked below rather than being marked done against nothing.

**The gate, run at the end of the phase:**

```text
yarn typecheck   clean
yarn lint        clean
yarn test        511 passed, 91 files   (365 / 72 before this phase)
yarn build       clean, entry 365.81 kB, 347 ms
```

**What the gate could not tell me, and a review did.** An `fe-reviewer` pass over the finished source
found nine defects the four green stages had no opinion about. The worst was mine and was a
regression: the first version of the templated-authority rule above skipped *any* URL with a
placeholder in its authority, which silently readmitted
`https://${region}.amazonaws.com/…`, `https://${key}@o12345.ingest.sentry.io/1` and
`https://api.openai.com${path}` — all four shapes the guard reported before this phase touched it.
The rule now strips the `${…}` spans and skips only when **no registrable host remains**, so
`[${e}]` still passes and every one of those four is reported again. Each is a test.

The other eight, all fixed: `refetchOnWindowFocus: false` froze the preflight gate for as long as a
tab stayed unfocused (the default already respects `staleTime`, so the override bought nothing); a
render job whose request failed permanently polled a dead id every fifteen seconds forever; a reply
that was not JSON at all was reported as a contract mismatch, which is a lie that sends the reader
hunting a version skew — it is now its own `MALFORMED` kind; an aborted request became a `NETWORK`
error and was then retried twice; four sentences pointed at a model-setup screen and a benchmark
that do not exist; both out-of-memory codes were marked `TRANSIENT`, i.e. safe to auto-dismiss, while
their own text carried the only remedy; `SCREENPLAY_APPROVED` and `STORYBOARD_APPROVED` — the same
human act — wore different tones, and a signed-off screenplay was indistinguishable from unreviewed
output; and a configured base URL silently dropped a path prefix and credentials.

Three smaller ones worth recording: six `as const` violated `.claude/rules/code-style.md`, which bans
it outright and which every other constants file in this repo obeys; `modelSetupQueryKey` was a
prefix child of `preflightQueryKey`, so invalidating the cheap check also invalidated the expensive
model scan; and the base URL was resolved at module scope, where a throw is a blank page rather than
something `FatalBoundary` can catch — it is now resolved lazily on first use.

**Two gaps left open deliberately.** `URL_PATTERN` in the guard matches `https?` only, so a
`wss://` address and a protocol-relative `//cdn.example.com/x.js` are both invisible to it. That is
pre-existing and it matters for **FE-05**, which adds a WebSocket — fix it there, with the socket
that makes it real, rather than widening this phase. And the error envelope
(`errorCode` / `errorDetail` / `message`) is still a guess, because the backend has no exception
filter to define one; if it eventually emits `{ code }` or `{ error: { code } }`, nothing here
matches and the gate stays green regardless.

## The envelope was a guess, and the guess was wrong

Closed 2026-08-22. **The paragraph directly above predicted this failure exactly** — it named
`{ code }` as a likely shape, and it said the gate would stay green regardless. Both held.

The orchestrator now has a global exception filter, so a typed failure finally reaches the browser.
It emits `{ statusCode, code, message }`. This phase read `errorCode` and `errorDetail`, which the
backend has never sent under any name, so **all twenty-one codes fell through to the status-only
sentence**: `The orchestrator refused this request with status 507.` where the taxonomy had a
sentence naming the disk and the remedy. That is the failure
`.claude/rules/state-and-data.md` describes as wasting an hour of someone's evening, arriving by a
different route than the generic string it warns about.

Three envelopes reach the client, not one, and the reader has to survive all three:

| Source | Body | Carries a code |
| ------ | ---- | -------------- |
| `StudioErrorFilter` | `{ statusCode, code, message }` | yes |
| Nest's built-in `HttpException` | `{ statusCode, message, error }` | no |
| `nestjs-zod` `ZodValidationException` | `{ statusCode, message: 'Validation failed', errors }` | no |

The third is its own small trap: `message` is the constant `Validation failed`, and everything a
person could act on is in `errors`, an array of Zod issues. Reading `message` shows the user a
sentence with no information in it.

**This repo already had the right answer written down, in the other reader.** There are two places
that read an HTTP error body, both from this phase, and they disagreed:

| Reader | Path it serves | Reads |
| ------ | -------------- | ----- |
| `src/lib/api/helpers/read-error-body.ts` | every query, through the fetch wrapper | `errorCode` / `errorDetail` |
| `src/shell/helpers/parse-route-error-payload.ts` | a router `ErrorResponse` | `code` / `message` |

The shell's reader was right, and it was right by accident of being written against React Router's
shape rather than against the guess. The one that runs on every request was wrong. Two readers of one
wire format is the defect underneath the field name, and it is why the fix is "make them agree"
rather than "pick a new name".

Two properties of the filter that the client depends on. A status at or above 500 replaces `message`
with a generic server-fault sentence **but still sends the real `code`**, so the code is the
trustworthy field and the message is not. And the filter maps only eight of the twenty-one codes at
all, of which just **four** land below 500 — three `400`s and a `409`. The other four are three
`503`s and a `507`, and the thirteen it does not map arrive as a plain `500`.

**That second property is why the retry policy had to change with the reader.** `isPermanentFailure`
knew only the 4xx band, so **seventeen of the twenty-one codes were retried twice** — thirteen
unmapped ones arriving as a plain `500`, plus the three `503`s and `DISK_SPACE_LOW` at `507`. On this
product that is two more multi-minute GPU attempts that fail identically, against a rule this repo
had already written down in words: "The out-of-memory codes never say 'try again'." The app was
saying it anyway, just not out loud.

**The rule the codes support is simpler than the one first written here, and getting it wrong is
worth recording.** The first attempt added a per-code `retry` axis to `ErrorCodeGuidance`, on the
theory that a code describing *what a generation attempt produced* — clipping, silence, a failed
decode — could succeed on a second try, while a code describing the machine could not.

That theory does not survive contact with what `shouldRetryRequest` actually does. **It re-issues the
identical HTTP request.** It does not start a new generation, so "a fresh attempt might differ" is
not a property it can exploit; a second `GET` of a job that already failed returns the same failure.
Checked against the backend rather than reasoned about:

- `OUTPUT_DECODE_FAILED` sits in the *same* adapter failure-mapping list as `MPS_OUT_OF_MEMORY` and
  `MODEL_FILE_MISSING` — `src/generation/constants/runtime-failure-patterns.ts`.

  **Corrected 2026-08-22, before this PR merged.** The first version of this bullet also named
  `GPU_OFFLOAD_THRASHING` and `OUTPUT_DURATION_INVALID`, citing `plan/06-provider-abstraction.md` §7.
  Both were wrong, and wrong in the way this repo keeps warning about: **§7 is a taxonomy paragraph
  listing codes an adapter is meant to map one day, not an implemented list.** Checked against the
  code instead — `OUTPUT_DURATION_INVALID` is in a different list entirely
  (`src/media/constants/ffmpeg-failure-patterns.ts`, which contains no out-of-memory code), and
  `GPU_OFFLOAD_THRASHING` appears in *no* failure-mapping list anywhere in the backend's `src/`. The
  same phase file says why, at `plan/06-provider-abstraction.md` §"not done": neither code "is
  something a runtime prints", and pattern-matching stderr for them "would produce confident wrong
  answers".
- `CHARACTER_IDENTITY_FAILURE` is the only `CREATIVE` code in `classify-failure.ts`, and the backend
  retries it with a **new seed** — its own comment says everything else "retries the same spec". Even
  the backend does not believe an identical retry fixes it.
- `AUDIO_SILENT` and `AUDIO_CLIPPING` are thresholds on a *measurement* of an already-written file —
  "silence and clipping are measured, then named". Re-measuring the same file gives the same numbers.

So all twenty-one are permanent, and a `Record<ErrorCode, …>` column holding one value twenty-one
times would be structure recording no decision — which is the thing `CLAUDE.md` tells this repo not
to ship. The rule is stated directly instead: **a failure carrying an orchestrator error code is
permanent, because the orchestrator classified it and re-asking the identical question gets the
identical answer.** One line, and it reads as what it is.

The cost is real and worth naming: a future code that *is* retryable — a queue-full or worker-busy
shape — will inherit permanence silently, with no per-code slot forcing anyone to choose. That is the
trade, taken because a uniform column implies a judgement that was never exercised. The evidence
above is here so the next person does not have to re-derive it.

**One helper now answers two questions, and the second one it answers wrongly.**
`isPermanentFailure` feeds both `shouldRetryRequest` — "is an immediate retry pointless" — and
`render-job.query.ts`'s `refetchInterval`, which is "should this job ever be asked about again". The
rule *"re-asking the identical question gets the identical answer"* is true of the request and **not
of the world.** `DISK_SPACE_LOW` is the case that will actually happen: the user frees 40 GB while
watching the render, the condition is gone, and nothing asks again. Read out of
`@tanstack/query-core@5.101.4` rather than assumed — with `retry` false and `refetchInterval` false,
`query.state.error` is never cleared by the query's own machinery; recovery needs a window refocus, a
remount or an explicit invalidate. **A render monitor left open and focused never recovers**, and
with `plan/05` blocked on BE-23 the poll is the only channel there is.

Not reachable today, which is why it is recorded rather than fixed: `GET /render-jobs/:id` throws
only a `404` or a validation `400`, both already permanent by the status band, and a database fault
is a plain Nest `500` carrying no code. It becomes reachable the moment that route can raise a
`StudioError`. The fix belongs with **FE-11**, which is the phase that owns the queue and the only
place the two questions can be separated with a screen to test against. `state-and-data.md`
deliberately couples them today, so splitting them is a decision, not a tidy-up.

`presentation` was deliberately not reused for any of this. It answers "may this message
auto-dismiss", which is a question about a toast, and `PROMPT_SCHEMA_INVALID` is `TRANSIENT` by that
measure while being permanently failing. Two questions; the second one now has no field at all
because it needs none.

**What is still not published, and why the compiler could not have caught this.** `StudioErrorBody`
is declared inside the filter, not in `src/contracts/`, so the `./contracts` export does not carry it
and this repo cannot infer the envelope the way it infers every domain type. That is the whole
explanation. This phase proved — twice, once deliberately and once for real when the backend appended
two codes mid-session — that a contract change breaks `yarn typecheck` here immediately. **The
mechanism worked; it simply does not reach this.** `ErrorCode` is in the contract, so the twenty-one
*values* were guarded exhaustively. The envelope that carries one is not, so the *field name* was
guarded by nothing at all, and the taxonomy was keyed off a field that never arrived.

The lesson generalises past this bug: the compile-time guard is exactly as wide as `src/contracts/`,
and everything this app reads off the wire from outside it — the error envelope today, the project
create and asset import DTOs still — is held by tests or by nothing. Here it is tests, written
against the backend's own real-HTTP e2e assertions rather than against another guess. That is
strictly weaker than the compiler, and it is worth saying so out loud rather than letting a green
gate imply otherwise. The backend fix is one line in `src/contracts/`; until then a rename of `code`
breaks this silently again.

### What actually changes on screen

Mapped 2026-08-22 by reading every render site. Every API error in this app funnels through one
mapper — `resolveRouteErrorView` — into `ErrorState`, and eleven screens use it: both error
boundaries, the readiness strip, the project list, the asset library, the capture guide and the five
system panels. So this is not invisible plumbing. On ten of the eleven the user now sees the code's
own sentence instead of `The orchestrator refused this request with status 500.`, and the `<code>`
chip carries `DISK_SPACE_LOW` instead of `500`.

Four things that mapping turned up, none of which this phase invented:

- **The orchestrator's message was being dropped into the paragraph unisolated.**
  `composeRouteErrorDescription` returned `${sentence} (${detail})` as one flat string and
  `ErrorState` renders `description` as plain text — so an English backend sentence sat inside a
  Hebrew paragraph with nothing around it. This is FE-07's bug again, and worse: the parentheses are
  bidi-neutrals as well as the full stop. Pre-existing, but this branch is what makes it fire, since
  until now no code arrived and the taxonomy sentence never ran. The composer returns a node now and
  the detail goes in `ContentText`; the parentheses stay outside, because they belong to the
  surrounding sentence and should mirror with it. **The gate was green through all of it, in a repo
  whose rules file already carried the lesson in writing.**

- **`detail: error.code ?? error.status ?? error.kind`** means a network failure — no code, no status
  — puts the literal string `NETWORK` in the chip. Harmless while the chip only ever held a number;
  actively misleading the moment real codes land beside it, because `NETWORK` then reads as a
  twenty-second error code. Fixed here, since this phase is what makes it wrong.
- **`presentation` still has no consumer.** Nothing in `src/` reads `TRANSIENT`/`PERSISTENT`; there is
  no toast queue, no provider and no auto-dismiss timer anywhere, and `Toast` is imported only by the
  design-system preview. The field is a decision recorded early for a mechanism that does not exist.
  That is a real gap, but it needs the toast wiring, not this phase.
- **`FatalBoundary` flattens a `StudioError` to `error.message`,** losing code, status, detail and
  kind. Left alone deliberately: it is the last-resort boundary, its job is to render something rather
  than the right thing, and widening it here would mean touching a boundary this phase has no other
  reason to open.

## Done when

- [x] every wire type is inferred from the backend contract; none is hand-written
- [x] `zod` majors match across repos — `4.4.3` exactly, in both `package.json` files
- [x] one client, one host; nothing else is reachable from `src/`
- [x] responses are schema-validated before use
- [x] key factories everywhere; no inline keys
- [x] `staleTime` chosen per query; the queue polls as a floor — and stops on a terminal job state,
      read from the contract's own `TERMINAL_JOB_STATES` rather than a local list
- [ ] **blocked** — no optimistic update on any approval-class mutation: no approval endpoint exists
- [ ] **blocked** — renders return `renderJobId`; idempotency keys sent; controls gate on server
      state: `POST /render-jobs` validates against a DTO outside the `./contracts` export
- [x] every backend error code maps to an actionable sentence — eighteen when this phase closed,
      **twenty-one** as of 2026-08-22, held exhaustive by `Record<ErrorCode, ErrorCodeGuidance>` and by
      a test that compares its keys to `ERROR_CODE`
- [x] **a code the orchestrator sends actually arrives** — added 2026-08-22, once BE-11's exception
      filter made one reachable. The reader takes `code` from the real envelope, survives all three
      the backend can produce, and the retry policy stops repeating a failure the orchestrator
      classified as permanent
- [x] Redux holds only uncommitted intent; `localStorage` holds only preferences — unchanged from
      FE-03; this phase added no slice and no stored value
- [ ] **blocked** — pickers derive from the capability payload: nothing serves `providerCapabilitySchema`
- [x] fixtures parse through the real schemas

Ten of thirteen. The three unticked boxes are not deferred work in this repo — each needs a backend
endpoint that does not exist, and each is named with its remedy under "What the orchestrator serves
today". Ticking them would mean building against a shape nobody serves, which is this phase's first
trap.

## Two things later phases inherit rather than re-decide

**The contract is imported from the backend's source, and that is deliberate.** Nothing here reads
`dist/`. If a future change points the import at built output to "avoid recompiling", the instant
break demonstrated above becomes a break-on-next-rebuild, and the phase's whole purpose is lost.

**`StatusTone` mapping now exists for six contract enums** in `src/lib/status-tone/`, closing the
question FE-02 left open. Two of those mappings encode product rules rather than taste, and both are
held by a test: an automated QC `PASS` must never carry the same tone as a human `APPROVED`, because
QC is advisory; and `NOT_IMPLEMENTED` on a preflight check must never read as a pass.

## Traps

- **Starting before BE-01.** Everything built here would be rewritten.
- **A hand-written `interface Shot`.** Compiles forever, diverges silently, surfaces as `undefined` in
  a review screen.
- **An optimistic approval.** The one place a wrong-looking UI causes real, expensive damage.
- **Widening a type to make the build pass** after a contract change. The break is the feature.
- **A second client "just for the progress bar".** The rule has no exceptions.
