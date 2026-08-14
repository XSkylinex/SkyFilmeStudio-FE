---
description: File organisation, naming, and type-safety rules for this project's TypeScript and TSX.
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "test/**/*.ts"
  - "test/**/*.tsx"
---

# Code style (`src/**`, `test/**`)

Today `src/` is still the bare `create-vite` scaffold — `App.tsx`, `main.tsx`, two stylesheets. There
is no reference feature to copy yet, so this file *is* the reference until one exists. Once
`src/features/projects/` lands, read it before writing and match it.

## One concern per file

```text
src/features/<feature>/
  <feature>.constants.ts        named constants; no magic strings or numbers in logic
  <feature>.routes.ts           route objects this feature contributes
  api/<name>.ts                 ONE query/mutation definition per file
  helpers/<name>.ts             ONE pure arrow-const per file
  interfaces/<name>.ts          ONE interface or type alias per file
  components/<Name>.tsx         ONE React component per file
  <Feature>Page.tsx             the route-level component

src/shell/                      app frame: layout, navigation, error/suspense boundaries
src/lib/                        cross-feature primitives that two features already import
src/styles/                     tokens.css, reset.css, layers.css

test/features/<feature>/
  helpers/<name>.test.ts        mirrors src/features/<feature>/helpers/<name>.ts
  components/<Name>.test.tsx    mirrors src/features/<feature>/components/<Name>.tsx
```

No `shared/`, `utils/` or `common/` junk drawer: a function goes to `helpers/`, a value to
`*.constants.ts`, a type to `interfaces/`. A helper genuinely used by two features moves down to
`src/lib/`, never sideways into another feature.

`src/lib/` is earned, not anticipated. A helper moves there on its **second** consumer, not its first.

## Functions are arrow consts

`export const fn = (x: X): Y => …`. Never `function fn() {}`. React components are arrow consts too:
`export const ShotCard = ({ shot }: ShotCardProps) => …`.

Annotate the return type on anything exported. `(): void` on an effect cleanup or a callback is not
noise here — it is what catches an accidental `return someValue` inside a `useEffect`, which oxlint's
`consistent-return` will otherwise flag.

## Named exports only

No `export default` anywhere in `src`. Default exports make a symbol renameable at each import site
and defeat grep. **This is enforced, not reviewed** — `import/no-default-export` is on since
`plan/00`, switched off in `.oxlintrc.json` `overrides` for exactly two files that cannot avoid it,
`vite.config.ts` and `vitest.config.ts`. The companion rules are `func-style: ["error", "expression"]`
for the arrow-const rule above and `typescript/no-non-null-assertion` for `!`.

Lazy routes still use named exports: `lazy: () => import("./ShotReviewPage").then((m) => ({ Component: m.ShotReviewPage }))`.

## Types are named interfaces, one per file

Every object shape — props, state, hook arguments, return values — is a named `interface` in its own
file under `interfaces/`. Unions and tuples may be `type` aliases, still one per file. Never write an
inline object type in a parameter or return position; extract and import it.

Type-only imports must use `import type` — `verbatimModuleSyntax` is on and a value import of a type
is an error, not a style preference.

**Types that describe the wire are not written by hand.** Anything crossing the API boundary — a
Project, a Shot, a RenderJob, a QC report — is inferred from the shared Zod contract, never
re-declared in `interfaces/`. See `.claude/rules/studio-domain.md`; a hand-typed DTO that drifts from
the backend is the single most expensive bug class in a two-repo project.

## Value-sets and casts

- Model a fixed set as an explicit union type plus a `satisfies`-typed const:
  `export type ShotState = 'PLANNED' | 'APPROVED'` alongside
  `export const SHOT_STATE = { PLANNED: 'PLANNED', APPROVED: 'APPROVED' } satisfies Record<string, ShotState>`.
  Banned: `as const`, `enum`, and `(typeof X)[keyof typeof X]` fake-enums.
  When the set is defined by a backend Zod enum, derive it — `z.infer<typeof shotStateSchema>` — and
  do not restate the members.
- No `any` and no `as unknown as`. If you reach for a cast, the seam is usually wrong.
- Never return a bare `false` or a magic string to signal an outcome. Model it as a discriminated
  union and branch on the tag. A render submission returns
  `{ ok: true; renderJobId: string } | { ok: false; reason: RenderRejection }`, never `string | null`.

## `noUncheckedIndexedAccess`

Turn it on (`tsconfig.app.json`) and keep it on. `arr[i]` then has type `T | undefined`, so bind and
guard before use:

```ts
const shot = scene.shots[index];
if (!shot) continue;
```

A non-null assertion (`!`) is not the fix — these lists arrive from the server and a stale index is a
real state, not a theoretical one.

## Magic numbers

Any literal that carries meaning becomes a named module-scope const at the top of its file:
`const QUEUE_POLL_INTERVAL_MS = 2_000`. One-off human-readable strings in a label or a
`console.warn` are the only routine exception.

Timing, sizes and thresholds that the **backend** also knows — retry counts, lease durations, target
runtime tolerance — are not duplicated as frontend constants. Read them from the config the API
serves. Two copies of `maxAttempts = 3` will disagree eventually, and the UI will be the one lying.

## Tests mirror `src/`, they never sit inside it

A test for `src/features/shots/helpers/format-duration.ts` goes to
`test/features/shots/helpers/format-duration.test.ts` — same path, different root. **Nothing under
`src/` is a test.** No `__tests__/`, no `*.test.tsx` beside a component, no `*.spec.ts` in a feature
folder. The production tree stays exactly what ships.

Because the depth no longer matches, **tests import through the `@/` alias**, never relatively:

```ts
import { formatDuration } from "@/features/shots/helpers/format-duration";
```

That alias must agree in `tsconfig.app.json` (`paths`) and in the Vite/Vitest config. Vite 8.2 can
collapse those into one with `resolve.tsconfigPaths: true` — `.claude/rules/modern-stack.md` carries
the measured behaviour and which combination actually resolves under Vitest. Until that switch is
flipped, every location must be edited together; nothing checks it for you.

Assert a claim the code makes — a 20-minute target with 11 minutes of planned scenes produces a
warning, a rejected shot keeps its previous attempts — not the shape of the code. Prove the test has
teeth: break the helper on purpose, watch it fail, put it back.

## No shell commands inside `.ts` / `.tsx`

Source files describe the app. They do not describe how to operate it.

- No command lines in comments — not `// run: yarn dev`, not a `@example yarn build` block.
  Commands live in `package.json` scripts, in `.claude/skills/`, and in `plan/`. A command in a
  comment is documentation nothing verifies, and it rots the day a script is renamed.
- No process spawning from the browser bundle. Obvious here, but it stays a rule so the frontend
  never grows a "dev helper" that shells out.
- No `eval`, no `new Function`, no dynamically assembled `import()` specifiers.

If you want the reader to know how to run something, put it in the plan file for that phase and link
the phase from the code review, not from a comment.

## Before you claim done

Run the `gate` skill, or at minimum `yarn typecheck && yarn lint && yarn test`. A green `tsc` proves
nothing about Rules of Hooks, React Compiler purity, or a floating promise — oxlint owns all three —
and neither of them notices a duration formatter that compiles and returns the wrong minutes.
