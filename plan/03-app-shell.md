# FE-03 — App shell, routing & boundaries

> **Depends on:** 02 · **Blocks:** 04+ · **Backend needs:** — · **Plan authority:** §39, §3.2
> **Status:** not started

## Goal

The frame every page lives in: routes, navigation that reflects where a production actually is, lazy
boundaries that keep media code out of the entry chunk, and error/suspense handling that fails
informatively.

## Decisions

| # | Decision | Options | Recommendation |
| - | -------- | ------- | -------------- |
| 1 | Router | `react-router` 8.3.0 (`latest`, 2026-07-22) vs TanStack Router | **`react-router` 8.** Verify the version and the v8 data-router API through the `newest` skill before writing routes; v7 is still tagged and most tutorials describe it. |
| 2 | Route shape | flat vs nested under a project/production | **Nested.** Nearly every screen is scoped to a project, and most to a production. Putting that in the URL is what makes a page reloadable and shareable between the two machines. |
| 3 | Navigation model | static list vs pipeline-aware | **Pipeline-aware.** The nav should show where the production *is* — see below. |

## Steps

### 1. Route tree

```text
/                                        project list
/projects/:projectId                     dashboard
  /assets                                source assets
  /subjects  /subjects/:subjectId        subject review
  /styles  /voices  /locations  /props   creative library
  /productions                           production list
  /productions/:productionId
     /plan                               screenplay / planner
     /storyboard                         storyboard review
     /queue                              render queue
     /shots  /shots/:shotId              shot review
     /audio                              music & mix
     /timeline                           timeline & final
/system                                  hardware, models, disk, offline mode
```

Every stateful screen is addressable. A reload must land on the same view with the same data — nothing
about an in-flight render lives only in React.

### 2. Lazy boundaries

The media-heavy routes — storyboard, shot review, timeline, audio — are `lazy` behind `Suspense`. They
will pull in video players, waveform rendering and possibly a canvas timeline, and none of that belongs
in the entry chunk. The dashboard is what should paint first.

Lazy routes still use **named exports**:

```ts
lazy: () => import("./ShotReviewPage").then((m) => ({ Component: m.ShotReviewPage }))
```

`react/only-export-components` protects Fast Refresh, not style.

### 3. Pipeline-aware navigation

The production nav is not a static list. §3.2's journey has stages, and **which stages exist depends on
`narrativeMode`** — a `MUSIC_DRIVEN` production has no screenplay stage at all, and §3.2 is explicit
that no stage may be required when the mode does not need it.

So: derive the visible stages from the production's mode and state. A screenplay tab on a music video
is a bug, not a spare link.

Show each stage's state (pending / in review / approved / blocked) so the nav answers "what is waiting
for me" — which is the question the user actually has.

### 4. Boundaries

- **Route-level error boundaries** that render the typed backend error code as a sentence and keep the
  rest of the shell alive. A failed shot list must not blank the app.
- **Suspense fallbacks that are skeletons**, sized like the content, so the layout does not jump.
- **A global fatal boundary** that says what happened and offers a reload — with **no external
  error-reporting SDK**. Nothing leaves the machine.

### 5. Offline-mode indicator

The backend exposes `{ localOnly, strictOffline, allowLanWorkers, claudeCodeOperatorEnabled, … }`
(BE-02). Render it **persistently in the shell**, not in a settings page.

The distinction is real: with the Claude Code operator enabled, project context can leave the device
through Claude's own service. A user who cannot tell which mode they are in has lost the feature. This
is a product requirement (§4.5.5), not a status badge.

### 6. Connection state

The shell owns the WebSocket provider (phase 05 fills it in) and renders its state. On a local machine
a dead socket usually means the orchestrator died — and so did the render. Say so.

### 7. Keyboard

A review console is used at speed. Establish the shortcut layer now: next/previous shot, approve,
reject, play/pause, toggle the reference comparison. Do not scatter `keydown` handlers into pages
later.

### 8. Shell state only

The shell owns: current project, current production, panel layout, theme, nav collapse, toasts, and the
socket. **Nothing else.** Server data belongs to the query layer (phase 04); uncommitted edits belong
to feature slices.

## Verification

```bash
yarn typecheck && yarn lint && yarn test && yarn build && yarn dev
```

- every route loads directly by URL, including deep ones;
- a `MUSIC_DRIVEN` production shows **no screenplay stage** (fixture-driven until BE-15);
- throw inside one route and confirm the shell survives and shows the error;
- check the network panel: the entry chunk does **not** contain the media routes;
- confirm the offline-mode indicator is visible on every screen;
- navigate the whole shell by keyboard only;
- `dir="rtl"` on `<html>` — the nav, breadcrumbs and layout all mirror correctly.

## Done when

- [ ] the full route tree exists and every stateful screen is addressable
- [ ] media-heavy routes are lazy behind `Suspense`, with named exports
- [ ] nav stages derive from `narrativeMode` and state; no stage is hard-coded
- [ ] route error boundaries render typed codes; the shell survives
- [ ] no external error-reporting SDK anywhere
- [ ] offline/operator mode is persistently visible
- [ ] socket connection state is surfaced
- [ ] a keyboard shortcut layer exists
- [ ] shell state is limited to the list above
- [ ] verified under `dir="rtl"`

## Traps

- **A static nav.** It will show a screenplay tab on a music video, which contradicts §3.2.
- **Eagerly importing a video player.** It goes straight into the entry chunk and the dashboard pays.
- **Putting the offline indicator in settings.** It is a persistent, load-bearing signal.
- **An error boundary that swallows the code.** The backend's taxonomy is the whole point of having one.
- **Reading the router's v7 docs.** v8 is `latest`; check before writing route objects.
