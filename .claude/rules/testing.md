---
description: Test layout and conventions — Vitest, tests mirroring src/ from a separate root, and what a test in this app should actually assert.
paths:
  - "test/**/*.ts"
  - "test/**/*.tsx"
  - "vitest.config.ts"
---

# Tests (`test/**`)

`plan/00-toolchain.md` landed 2026-08-15: Vitest, Testing Library and this directory exist, and
`yarn test` runs 8 tests in 2 files. `test/setup.ts` wires jest-dom's matchers and an `afterEach`
cleanup. What is here is a toolchain proof, not coverage — `test/App.test.tsx` asserts the placeholder
names the product, and `test/build/find-external-urls.test.ts` covers the build's external-URL guard.
Everything below is the contract the real suite builds to.

## Layout — mirrored, never nested

```text
src/features/shots/helpers/format-duration.ts
test/features/shots/helpers/format-duration.test.ts

src/features/shots/components/ShotCard.tsx
test/features/shots/components/ShotCard.test.tsx
```

Same path, different root. **Nothing under `src/` is a test.** No `__tests__/`, no `*.test.tsx`
beside the component, no `*.spec.ts` inside a feature. The production tree stays exactly what ships,
and `tsconfig.app.json`'s `include: ["src"]` stays honest.

Because depth no longer matches, **import through `@/`, never relatively**:

```ts
import { formatDuration } from "@/features/shots/helpers/format-duration";
```

There is exactly one definition of that alias: `paths` in `tsconfig.app.json`. `vite.config.ts` sets
`resolve.tsconfigPaths: true` and `vitest.config.ts` `mergeConfig`s it, so nothing mirrors and nothing
can drift. **This was verified on both resolvers before being relied on** (2026-08-15): `@/App`
resolves in `yarn build` and in `yarn test`. Do not add a `resolve.alias` "to be safe" — a second
definition is the failure this arrangement exists to prevent.

A test for something outside `src/` imports relatively, because `@/` means `src/`:
`test/build/find-external-urls.test.ts` imports `../../build/find-external-urls.ts`. Do not invent a
second alias for it; one alias with one definition is the whole point.

`test/` needs its own tsconfig (`tsconfig.test.json`, referenced from the root `tsconfig.json`) so
that `include: ["src"]` in `tsconfig.app.json` is not widened. Test-only globals go in that file's
`types` array — remember `types` defaults to `[]` in TS 7, so leaving it out makes `describe` an
unresolved name rather than an obvious error.

## Runner

Vitest **4.1.10**, installed 2026-08-15. `5.0.0` was `rc` and was declined — a test runner is the
worst place to run a release candidate.

Environment: `jsdom@30.0.1`. `happy-dom` was *not* measured against it; the suite is far too small for
the comparison to mean anything. Revisit when the suite is slow, and measure then rather than
assuming.

`@testing-library/react@16.3.2` for components, `@testing-library/user-event@14.6.3` for interaction,
`@testing-library/jest-dom@7.0.1` for matchers (imported once, in `test/setup.ts`).

## What to assert

Assert a **claim the code makes**, not the shape of the code.

Good, in this app:

- a 20-minute production target whose scene durations sum to 11 minutes produces a runtime warning;
- rejecting a shot leaves its previous attempts intact and reachable;
- a duration formatter renders `00:20:00`, and `754ms` does not become `1s`;
- a capability payload with `maxTestedDurationSeconds: 8` produces a duration picker with no 12s
  option;
- a dialogue line with `language: "he"` renders with `dir` resolved from the data, and an English UI
  around it stays LTR;
- an approval control stays disabled until the server confirms — not until a local flag flips;
- a socket message that fails Zod validation is dropped and logged rather than rendered.

Bad: snapshot tests of markup, assertions that a component "calls `useQuery`", tests that assert a
class name.

**Prove the test has teeth.** Break the implementation on purpose, watch the test fail, put it back. A
test that passes on broken code is worse than no test because it reads as coverage.

## Mocking

- **Mock the network at the HTTP boundary** (MSW or Vitest's fetch mocking), not by stubbing the query
  hooks. Stubbing hooks tests the mock. **MSW is not installed yet** — it lands in `plan/04` with the
  first real fetcher, because until BE-01 publishes a contract there is nothing to mock and no way to
  prove a handler works.
- **Mock responses are built from the shared Zod schema** — parse the fixture through the real schema
  in a test helper. A hand-written fixture that no longer matches the contract is how a green suite
  ships a broken page.
- Never mock `Date.now()` implicitly. If a test depends on time, inject it.
- No real WebSocket in a unit test; the socket provider takes its transport as a prop/context so a
  test can drive it.

## What the suite cannot see

The same blind spots as the rest of the gate: stylesheets, `index.html`, RTL layout, whether a video
element actually plays, whether a 200-item contact sheet is usable. Those are verified by running the
app and looking. Never report "tests pass" as if it covered them — name what you looked at.

## Running

`yarn test` for the suite, `yarn vitest <path>` for one file while iterating. Paste the real output;
"should pass" is not a result.
