# `.claude/` — how this project configures Claude Code

Four mechanisms, and they differ in **when they cost context**. Putting something in the wrong one is
the usual mistake: it either burns tokens every session or never loads when it's needed.

| Mechanism | Loads | Use for |
| --------- | ----- | ------- |
| `CLAUDE.md` (repo root) | every session, in full | facts true of the whole repo — commands, the local-only contract, toolchain decisions |
| `rules/*.md` | when a file matching `paths:` is read | conventions for one part of the tree |
| `skills/*/SKILL.md` | when invoked, or when the model judges the `description` relevant | procedures and checklists |
| `agents/*.md` | when delegated to | a specialist with its own context window and tool set |

Rules with `paths:` are **not re-injected after compaction** — they reload the next time a matching
file is read. Don't put something load-bearing-for-the-whole-session in a path-scoped rule.

## What's here

```
.claude/
├── agents/
│   ├── studio-ui-engineer.md      routes, pages, components, editor state  → src/features/, src/shell/
│   ├── studio-data-engineer.md    contracts, queries, slices, the socket   → src/features/*/api/, src/lib/
│   ├── web-platform-engineer.md   CSS, index.html, public/, RTL, a11y
│   └── fe-reviewer.md             read-only review of what the gate cannot see
├── rules/
│   ├── code-style.md              src/**, test/**   — file layout, arrow consts, types, mirrored tests
│   ├── modern-stack.md            src/**, vite.config.ts — TS 7 / React 19.2 / Vite 8 / oxlint idioms
│   ├── studio-domain.md           src/**   — what the UI may talk to and must never claim
│   ├── state-and-data.md          src/**   — Query vs Redux vs refs, and the WebSocket bridge
│   ├── css.md                     **/*.css — the browser floor and what the build was measured rewriting
│   ├── html-seo.md                index.html, public/** — the document shell, and why SEO is not a thing here
│   └── testing.md                 test/**  — Vitest, mirrored layout, what to assert
├── skills/
│   ├── newest/                    look up today's real versions and browser support — never from memory
│   ├── gate/                      typecheck · lint · test · build, and what each stage misses
│   └── add-feature/               scaffold a Studio feature slice end to end
└── settings.json                  permissions + a SessionStart reminder + a Stop verification hook
```

The three engineering agents partition the tree with no overlap: React tree, data seam, platform.
When work spans two, delegate twice rather than letting one reach into the other's files.

## Frontmatter that actually exists

Claude Code ignores unknown keys silently, so an invented field looks like it works and doesn't.
These are the supported ones — check the docs before using anything not listed. (VS Code's own agent
linter flags `when_to_use` and `allowed-tools` as unsupported; that is VS Code's schema, not Claude
Code's. Both work here.)

**Skills** (`skills/<name>/SKILL.md`) — `name` (optional, defaults to the directory), `description`
(what it does *and when*), `when_to_use` (extra trigger phrases; combined with `description` it is
truncated at 1,536 characters in the listing), `argument-hint`, `arguments`, `allowed-tools`,
`disallowed-tools`, `model`, `effort`, `paths`, `disable-model-invocation`, `user-invocable`,
`context`, `agent`, `background`, `hooks`, `shell`, `metadata`, `license`, `compatibility`.

**Agents** (`agents/<name>.md`) — `name` and `description` are required. Then `tools`,
`disallowedTools`, `model` (`sonnet` · `opus` · `haiku` · `fable` · an id · `inherit`), `skills`
(preloads full skill content at startup), `permissionMode`, `maxTurns`, `memory`, `effort`,
`isolation`, `color` (`red` `blue` `green` `yellow` `purple` `orange` `pink` `cyan`), `background`,
`mcpServers`, `hooks`, `initialPrompt`.

**Rules** (`rules/<name>.md`) — `paths` (globs; omit it and the rule loads every session). A
`description` line is kept here for humans reading the directory.

## House style for these files

- **A skill body is a recurring token cost** — it stays in context across turns once loaded. Keep
  `SKILL.md` tight and push long reference material into a sibling file the skill points at, the way
  `newest/` splits its durable protocol from its dated `reference/snapshot.md`.
- **Write the failure, not the aspiration.** The rules here are dense with things that will actually
  go wrong in *this* app — a socket handler that re-renders the tree, an approve button with an
  optimistic update, `margin-left` in a UI that has to flip to Hebrew, a hand-written wire type that
  drifts from the backend. A rule nobody has been bitten by is noise.
- **Facts are measured, not recalled.** Every version number and browser-support claim in these files
  carries the date it was checked and the command that produced it. The CSS pipeline table in
  `rules/css.md` came from building probe declarations through this repo's own Vite and reading
  `dist/assets/*.css` — not from a blog post.
- **State how to verify, and what verifying does not cover.** Every file here ends that way.
- **Anything version-shaped belongs to the `newest` skill**, not to prose in a rule.

## Extending it

Adding a rule, skill or agent means adding a line to the tree above **and** to the "Where things live"
section of the root `CLAUDE.md`, which indexes the same set. Nothing checks that the two agree.
