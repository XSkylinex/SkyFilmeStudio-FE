---
name: newest
description: >-
  Look up today's real version, API and browser-support facts before writing
  React 19.2, React Compiler, TypeScript 7, Vite 8, CSS, HTML or SEO code —
  never state one from memory. Gives the exact command or endpoint that answers
  each question, the support floor this repo actually builds to, and a dated
  snapshot that expires.
when_to_use: >-
  Invoke before naming a version, claiming a browser supports a feature,
  reaching for a "new" CSS/HTML/React/TS feature, adding a meta tag or
  structured data, upgrading a dependency, or answering "is X available yet".
  Trigger phrases: "latest", "newest", "current version", "is it supported",
  "Baseline", "what's new", "can I use", "modern".
allowed-tools: Read, Grep, Glob, WebFetch, WebSearch, Bash(node .claude/skills/newest/scripts/*), Bash(yarn npm info*), Bash(curl -s https://registry.npmjs.org/*), Bash(curl -s https://api.webstatus.dev/*), Bash(yarn oxlint*), Bash(yarn typecheck*), Bash(find ~/.yarn/berry/cache*), Bash(unzip -p*)
---

# newest — look it up, don't remember it

This stack moves faster than any model's training data: TypeScript 7, Vite 8, oxlint,
React 19.2, and a CSS/HTML platform where features cross into Baseline **every month**. A version
number or a support claim recalled from memory is a guess wearing a fact's clothes.

**The rule: no version number, no API name, and no "browser X supports Y" reaches the user or the
code until a command or a fetch in this file returned it in this session.**

Two halves, and the split is the point:

- **This file is the protocol.** It does not expire.
- **[reference/snapshot.md](reference/snapshot.md) is the answers**, stamped with the date they were
  verified. It expires. Read it for orientation, then re-run the lookup for anything you are about
  to act on.

## The lookup table

| Question | What actually answers it |
| -------- | ------------------------ |
| Newest version of a package, and is it installable yet | `node .claude/skills/newest/scripts/pkg-check.mjs <pkg>…` |
| Same, for every dependency in this repo | `node .claude/skills/newest/scripts/pkg-check.mjs --all` |
| **Can *this repo* ship a CSS/HTML feature** | `node .claude/skills/newest/scripts/floor-check.mjs <ids…>` |
| Is a feature Baseline at all | `curl -s "https://api.webstatus.dev/v1/features/<feature-id>"` |
| …and I don't know its feature-id | `curl -s "https://api.webstatus.dev/v1/features?q=<text>&page_size=5"` |
| What crossed into Baseline recently | `https://web.dev/baseline/<year>`, monthly `web.dev/blog/baseline-digest-<mon>-<year>` |
| What React shipped | `https://react.dev/versions`, then the registry — **the docs page lags npm** |
| A React API's exact signature | `https://react.dev/reference/react/<api>` |
| React Compiler behaviour | `https://react.dev/reference/react-compiler/` (`directives`, `configuration`) |
| What a TS release changed | `https://devblogs.microsoft.com/typescript/` |
| What a Vite release changed | `github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md` — the minor matters, 8.2 ≠ 8.0 |
| What Google does with a page | `https://developers.google.com/search/docs/…` |
| Current Core Web Vitals thresholds | `https://web.dev/articles/vitals` — the metric set has changed before |
| What a config option defaults to | the shipped `.d.ts`, read out of the Yarn zip (see below) |
| Whether an export exists | grep the same zip — a wrong name is a build failure, not a warning |

### Reading inside a package under Yarn PnP

There is no `node_modules`. Packages are zips in the global Yarn cache, so the usual
`cat node_modules/<pkg>/…` returns nothing and looks like the file is missing:

```bash
Z=$(find ~/.yarn/berry/cache -name "vite-npm-8*.zip" | head -1)
unzip -l "$Z" | grep dist/node          # what is in there
unzip -p "$Z" node_modules/vite/dist/node/chunks/node.js | grep -A8 BASELINE_WIDELY_AVAILABLE
```

`.yarn/unplugged/` holds only packages with native binaries — that is where `oxlint`,
`lightningcss`, the Rolldown binding and the TypeScript 7 Go binary actually live on disk.

### Four traps in the lookups themselves

- **`npm view` and `npx` are broken on this machine.** `~/.npm/_cacache` contains root-owned files
  from an older npm, so both die with `EACCES`. Measured 2026-08-14: `npx oxlint@1.78.0` failed with
  `npm error code EACCES … mkdir /Users/…/.npm/_cacache/index-v5/…`. That reads as "the package does
  not exist" and it is not. Use `pkg-check.mjs` (plain HTTPS, no npm cache) or `yarn npm info`.
- **Documentation lags the registry.** When a docs page and npm disagree about *what exists*, npm
  wins; when they disagree about *what an API does*, the docs win.
- **A shipped `.d.ts` can be wrong about behaviour, not merely stale about wording.** Verified
  2026-08-14 on vite 8.2.1: `build.target`'s JSDoc names four browsers where the shipped constant
  has five. Precedence when sources disagree: **the resolved constant or source in the package >
  the published docs at the installed version's tag > JSDoc prose.**
- **`latest` is not always the newest thing that exists, and sometimes it is not what you want.**
  `pkg-check.mjs` prints `next`/`rc`/`beta` alongside it for exactly this reason. A package whose
  `latest` is `0.x` while `rc` is `1.0.0` is a *decision* to bring to the user, not a lookup to
  resolve silently.

## The support floor is derived, not chosen

Do not argue about browser support from memory or from a caniuse screenshot. This repo's floor falls
out of its build config, and it is quotable. Verified 2026-08-14 against vite 8.2.1:

```text
ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET
  = ["chrome111", "edge111", "firefox114", "safari16.4", "ios16.4"]
```

That is what `build.target`'s default `'baseline-widely-available'` resolves to, and
`build.cssTarget` follows it. Re-read the constant after any Vite upgrade.

**Quote the constant, not the JSDoc.** The prose for that same option lists only four browsers — it
silently omits **iOS 16.4**, the engine most likely to lag.

## Deciding whether to use a feature

`api.webstatus.dev` returns a `baseline.status` of `widely`, `newly` or `limited`:

| Status | Means | Do |
| ------ | ----- | -- |
| `widely` | interoperable 30+ months | Probably fine — still check the floor. |
| `newly` | all core browsers, recently | Behind `@supports` or with a fallback. A two-year-old Safari is inside our floor and outside this feature. |
| `limited` | not in every core browser | Don't ship it. Progressive enhancement only, and only if the page is whole without it. |

**But the badge is not the question — the floor is, and the two disagree constantly.** Measured
here, 2026-08-14:

```text
color-mix           widely   INSIDE  floor
container-queries   widely   INSIDE  floor
has                 widely   OUTSIDE floor | firefox 121 > 114
subgrid             widely   OUTSIDE floor | chrome 117 > 111
nesting             widely   OUTSIDE floor | chrome 120, firefox 117, safari 17.2
light-dark          newly    OUTSIDE floor | chrome 123, firefox 120, safari 17.5
view-transitions    newly    OUTSIDE floor | firefox 144, safari 18
anchor-positioning  limited  OUTSIDE floor | not shipped anywhere in range
```

Five of those are `widely` or `newly` and none of the five is safe to ship *raw* here.

**And "outside the floor" is not automatically banned — the build may already handle it.** Nesting
and `light-dark()` are both outside and both usable, because Lightning CSS lowers them. That is a
*measurement*, not a guess: `.claude/rules/css.md` records what the pipeline was observed doing, and
the way to settle a new case is to build a two-line stylesheet in the scratchpad and read the emitted
CSS in `dist/assets/`.

So the decision is three questions, in order: **is it inside the floor → if not, does the build lower
it → if not, is the page whole without it.**

## Reporting a fact

Every version or support claim you write carries three things: **the number, the source, and the date
you checked.** "React is on 19.2.8 (registry, 2026-08-14)" is a fact. "React is on the latest 19.2"
is a guess. If a lookup failed, say the lookup failed — do not fill the hole from memory.

When you find drift between `package.json` and the registry, report the pair and stop. `package.json`
is the user's file: show the diff and wait, never edit it unasked.

## Before an upgrade

1. `node .claude/skills/newest/scripts/pkg-check.mjs <pkg>` — what exists, and how old it is.
2. Check the `AGE` column against `npmMinimalAgeGate` in `.yarnrc.yml` if one is ever configured.
   Nothing is set today, so the gate is off — but NestJS and `@swc/core` both published on
   2026-08-14, so a same-day version is a real scenario. Pick the newest version that clears the
   gate rather than disabling the gate.
3. Read the changelog **before** the version bump, not after the build goes red.
4. Run the `gate` skill.

## Scope

This skill establishes facts. It does not decide taste — `.claude/rules/` owns what this project does
with them. When a rule states a version-shaped fact and your lookup disagrees, the lookup is right and
the rule is stale: say so, and fix the rule.
