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

**Answered 2026-08-17.**

**1 — `react-router-dom@7.18.2`, chosen by the user over the recommendation.** The recommendation
above was written against a fact that does not hold: **`react-router-dom` has no 8.x and never has.**
Registry metadata, checked 2026-08-17 — `dist-tags.latest` is `7.18.2`, zero `8.*` versions exist, and
its sole dependency is `react-router@7.18.2`. In v7 the DOM bindings moved into `react-router` itself
and `react-router-dom` became a re-export shim; its whole published surface is two lines:

```ts
export { HydratedRouter, RouterProvider, RouterProviderProps } from 'react-router/dom';
export * from 'react-router';
```

So this repo is on the **v7 data router**, one major behind `react-router@8.3.0`. That was put to the
user with both options and the trade-off; they chose the `react-router-dom` name. The trap note below
about "reading the v7 docs" is therefore inverted for this repo: **v7 is what we run**, and v8 docs
are the wrong ones.

2 and 3 as recommended.

### The v7 route API, read out of the installed `.d.ts` rather than from docs

Verified 2026-08-17 against `react-router@7.18.2` in `node_modules`:

- `createBrowserRouter(routes: RouteObject[], opts?: DOMRouterOpts): Router`. Its own JSDoc:
  *"Data Routers should not be held in React state. You should create your router once outside the
  React tree."* So the tree is a module-level const, not a `useMemo`.
- `RouteObject = IndexRouteObject | NonIndexRouteObject`. Both carry `path`, `id`, `loader`,
  `action`, `handle`, `shouldRevalidate`, `lazy`, and these **mutually exclusive pairs**:
  `Component` / `element`, `ErrorBoundary` / `errorElement`, `HydrateFallback` /
  `hydrateFallbackElement`. Use the `Component`-style capitalised forms; the element forms are the
  older spelling.
- `lazy` accepts **two shapes** in v7 — a function returning the route object minus
  `lazy | caseSensitive | path | id | index | children | middleware`, or an object of per-property
  loaders. The function form is the one this phase uses.
- Peer range is `react >=18`, so React 19.2 is in range.

### The authority contradicts itself about `narrativeMode`, so no union is written

`LOCAL_AI_STUDIO_PLAN.md` gives two different lists:

| Source | Values |
| ------ | ------ |
| §2171, the data model | `SCREENPLAY` `TREATMENT` `MUSIC_DRIVEN` `VISUAL_ONLY` `IMPORTED_TIMELINE` `CUSTOM` |
| §14.2, planning modes | `SCREENPLAY` `TREATMENT_TO_SCENES` `MUSIC_DRIVEN` `VISUAL_MONTAGE` `IMPORTED_SCRIPT` `IMPORTED_SHOT_LIST` `CUSTOM` |

Four of the seven disagree. Hand-writing the union would have meant picking one list and being wrong
about the other — which is exactly what `code-style.md`'s rule against re-declaring wire types
exists to prevent, demonstrated rather than argued. The mode stays a `string` here, the stage sets
live in a file named as a fixture, and BE-01 resolves which list is real.

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

The media-heavy routes — storyboard, shot review, timeline, audio — are `lazy`. They will pull in
video players, waveform rendering and possibly a canvas timeline, and none of that belongs in the
entry chunk. The dashboard is what should paint first.

> **Corrected 2026-08-17: "behind `Suspense`" was wrong for this router, and the correction changes
> what you build.** Verified by reading the installed source
> (`node_modules/react-router/dist/development/chunk-HHGH3NKS.js`), not the docs: in the v7 data
> router `route.lazy` resolves **before** render, in the same pipeline as a `loader`
> (`getMatchesToLoad` → `loadLazyRoute`). No promise is ever thrown, so a `<Suspense fallback>`
> wrapped anywhere in the tree **never activates** for a lazy route. `<Suspense>` here belongs to
> `<Await>` and deferred loader data.
>
> The two real mechanisms, and they cover different moments:
>
> - **`HydrateFallback`** — the *first* paint only: a cold deep link or hard refresh into a route
>   whose match chain includes `lazy`. Without it the router also logs a "No `HydrateFallback`
>   element provided" warning.
> - **`useNavigation().state === 'loading'`** — *same-session* navigation. Clicking `/plan` →
>   `/storyboard` leaves the previous screen mounted with no feedback at all unless the shell renders
>   one. This is the shell's job, not the route's.
>
> Step 4's "Suspense fallbacks that are skeletons" means these two, and the sizing requirement still
> holds: the layout must not jump when the destination arrives.

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
- **Loading fallbacks that are skeletons**, sized like the content, so the layout does not jump. See
  the correction in step 2 for which mechanism actually fires — `Suspense` is not it here.
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
