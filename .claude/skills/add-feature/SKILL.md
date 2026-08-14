---
name: add-feature
description: Scaffold a new Studio feature slice end to end — route, page, query layer, slice, components, tests — in the order that makes each step checkable. Invoke when asked to "add a page", "add a feature", "build the storyboard view", or to wire a new Studio screen into the app.
argument-hint: '[feature-name]'
allowed-tools: Read, Edit, Write, Grep, Glob, Bash(yarn typecheck*), Bash(yarn lint*), Bash(yarn oxlint*), Bash(yarn test*), Bash(yarn vitest*), Bash(yarn build*)
---

# add-feature — one slice, one route, one contract

A Studio feature is a vertical slice: it owns a route, the queries that feed it, its editor state, its
components, and its tests. It does not reach into another feature's folder.

| # | File | Holds |
| - | ---- | ----- |
| 0 | `src/features/<name>/interfaces/*.ts` | props and view-model shapes — **not** wire types |
| 1 | `src/features/<name>/<name>.constants.ts` | ids, labels, tuning numbers |
| 2 | `src/features/<name>/api/*.ts` | one query-key factory + fetcher per file |
| 3 | `src/features/<name>/<name>.slice.ts` | editor state only, if the feature has any |
| 4 | `src/features/<name>/helpers/*.ts` | one pure arrow-const per file |
| 5 | `src/features/<name>/components/*.tsx` | one component per file |
| 6 | `src/features/<name>/<Name>Page.tsx` | the route-level component |
| 7 | `src/features/<name>/<name>.routes.ts` | the route object this feature contributes |
| 8 | `src/shell/routes.ts` | the single registration |
| 9 | `test/features/<name>/**` | mirrors 4–6 |

`.claude/rules/code-style.md`, `state-and-data.md` and `studio-domain.md` fire on these paths and are
not restated here.

## Design the screen before you write it

The question is always **what decision does this page let the user make, and what does it need to see
to make it?** The Studio's pages exist because autonomous visual approval is not trustworthy — every
one of them is a human gate.

- **Shot Review** exists so a person can compare a generated frame against the canonical reference and
  say yes or no. Its whole job is putting `canonical | first | middle | last` side by side at a size
  where identity drift is visible. Shrink those images to fit a tidy grid and the page stops working.
- **Render Queue** exists so a person can tell whether a four-hour render is progressing or wedged.
  That means elapsed time, current stage, and the failure reason — not a spinner.

If the answer is "it shows the data", the screen is not designed yet.

## Order of work

1. **Contract first.** Find the Zod schema for the data this page needs. If it does not exist, that is
   a backend task — say so and stop rather than hand-writing an interface that will drift.
2. **Route id and registration**, so a typo fails immediately instead of producing a page nobody can
   reach.
3. **Query layer**, with the key factory. Render raw JSON on the page and confirm the data arrives
   before styling anything.
4. **Components**, structure before polish.
5. **Editor state last** — most features turn out not to need a slice, and adding one first guarantees
   they get one.
6. **Tests**, mirrored into `test/`.

## Six things that will not fail the gate but will be wrong

**a. Hand-written wire types.** An `interface Shot` in `interfaces/` that duplicates the backend's Zod
shape compiles forever and diverges silently. Infer it.

**b. Optimistic approval.** Approve/reject/retake/cancel/export wait for the server. See
`studio-domain.md`; this is the one place a wrong-looking UI causes real damage.

**c. `dispatch` from a socket handler.** Buffer in a ref, flush on an interval. Otherwise the queue
re-renders continuously and INP collapses.

**d. Physical CSS properties.** `margin-left` instead of `margin-inline-start`. Compiles, passes
everything, breaks the moment the interface is Hebrew.

**e. Unreserved media boxes.** A thumbnail grid without `aspect-ratio` on the cell shifts the page as
images arrive. On a 200-shot contact sheet this is not a subtle metric — it makes the page unusable.

**f. Full-resolution media in a grid.** Use the proxies and thumbnails the backend produces.

## Verify

`yarn oxlint src/features/<name>` and `yarn build` in the inner loop, then the `gate` skill. Then
**actually look at it**: `yarn dev`, open the route with real data, and check the narrow breakpoint and
`dir="rtl"`. The gate cannot see an approve button wired to the reject mutation.
