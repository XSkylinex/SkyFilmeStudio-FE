# FE-06 — Project dashboard & system status

> **Depends on:** 05 · **Blocks:** 07+ · **Backend needs:** BE-04, BE-11 · **Plan authority:** §39, §8, §9, §48
> **Status:** not started

## Goal

The two screens that answer "what is this project" and "can this machine actually do the next thing":
the Project Dashboard and System Status.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | System status placement | its own route vs a dashboard panel | **Both.** A summary strip on the dashboard, `/system` for detail. Model and disk problems block renders, so they cannot be two clicks away. |
| 2 | Preflight presentation | on demand vs always visible | **A persistent summary, refreshed on demand.** The user should see "ready" or "3 problems" without asking. |

## Steps

### 1. Project Dashboard (§39)

Required content: subjects · locations · productions · reusable assets · **model status** · **disk and
memory status**.

Design it around the question the user has when they open it: *what is waiting for me, and can I
proceed?* Not around "here are some counts". Concretely, the top of the page should surface:

- productions with something awaiting approval, and what kind (storyboard, shot review, final);
- anything blocked, with the reason;
- any preflight failure;
- the offline/operator mode, already persistent in the shell (phase 03).

### 2. Project list and creation

Create a project with kind (`SERIES | STANDALONE | MUSIC | EXPERIMENTAL | CUSTOM`), primary language,
additional languages, and optional defaults.

**`audienceProfile` is optional and must never force an age range.** The domain is deliberately
agnostic (§3.1); a required "target age" field would contradict it in the UI even if the schema allows
absence.

### 3. Empty states that teach

A brand-new project has no assets, no subjects and no productions — and **that is a valid, supported
state**, including permanently: `TEXT_ONLY_NO_VISUAL_SOURCE` productions never import anything, and a
production with zero subjects is valid.

So the empty state must offer the real next steps (import assets · start from text · create a
production) rather than implying something is missing.

### 4. System Status (`/system`)

**Hardware profile** — which machine this is (`mac-m5-max-40gpu-64gb` or `pc-285k-rtx4080-16gb-96gb`),
its acceleration backend, and its measured capabilities. If the machine matches no known profile, that
is a **failure state**, not a blank: renders will refuse.

**Models** — every manifest entry: role, size, licence, present/missing, hash verified, and
`compatibility` (`VERIFIED_UPSTREAM_SUPPORT` / `VERIFIED_LOCAL_BUT_NOT_OPTIMIZED` /
`REQUIRES_LOCAL_BENCHMARK` / `REJECTED_FOR_THIS_HARDWARE`). Show the classification plainly — a model
that has not been benchmarked on this machine is not "ready".

**Missing models show the expected size and the setup instructions, and nothing in the UI downloads
them.** Runtime downloads are forbidden (§53); this screen tells the user what to run.

**Disk** — free space, the working-space reservation, and whether the gate currently passes:

```text
required = missing_model_bytes + configured_working_space + safety_headroom
```

A red state here means a render will refuse to start, and the screen should say that in those words.

**Memory / pressure** — live, from `system.pressure` (phase 05). Mac shows unified-memory pressure and
swap growth; PC shows VRAM used/free, system RAM and host offload. **They are different metrics**, so
render the ones that apply to this profile rather than a lowest common denominator.

**Runtimes** — ComfyUI (version, node lockfile), LM Studio (present, loaded model), FFmpeg build and
available encoders, PostgreSQL container health.

**Preflight** — run the eleven checks (BE-04) on demand and show each result with its typed code.

### 5. Reusable assets

The libraries from BE-13: approved animation clips, OP/ED and title assets, the OST, the SFX library.
These are the reason a second production is cheaper than the first (§49.2), so make them visible rather
than buried.

### 6. Storage

Per-project disk usage broken down by sources / canonical / storyboards / shots / audio / proxies /
exports, plus the cache cleanup action. **Approved sources and final masters are never deletable from
here** — the plan forbids automatic deletion, and a UI that offers it invites the same mistake.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn dev
```

- a project with zero assets, zero subjects and zero productions renders a useful dashboard;
- a model marked `REQUIRES_LOCAL_BENCHMARK` is **not** presented as ready;
- a missing model shows size and instructions and offers **no download button**;
- set the working-space reservation above free space → the disk panel goes red and says renders will
  refuse;
- an unrecognised hardware profile renders a failure state, not an empty one;
- Mac-only and PC-only memory metrics both render correctly on the machine they belong to;
- `dir="rtl"` — the dashboard mirrors correctly.

## Done when

- [ ] the dashboard answers "what is waiting for me" above the fold
- [ ] project creation covers all five kinds; audience profile is optional
- [ ] empty states are valid states, with real next steps
- [ ] `/system` shows hardware, models, disk, memory, runtimes and preflight
- [ ] model `compatibility` is shown plainly; unbenchmarked ≠ ready
- [ ] nothing in the UI can trigger a model download
- [ ] the disk gate's state is visible and explained
- [ ] pressure metrics are profile-appropriate and live
- [ ] reusable libraries are surfaced
- [ ] approved sources and masters cannot be deleted from the UI

## Traps

- **A dashboard of counts.** The user wants to know what is blocked and what needs them.
- **Treating an empty project as an error.** Text-only and subject-free productions are first-class.
- **A "Download model" button.** Runtime downloads are forbidden; this is bootstrap.
- **Showing VRAM on the Mac.** It has none in that sense; the metric sets genuinely differ.
- **Marking an unbenchmarked model green.** §1.6: anything not positively verified must pass the
  benchmark before it is a production dependency.
