---
description: How commits and PRs are made here — who the author is, how small a commit is, what the message must carry, and what the merge button does to all of it.
---

# Git

**This rule has no `paths:` on purpose.** `.claude/README.md`: a path-scoped rule loads only when a
matching file is read and is not re-injected after compaction. There is no glob for "about to run
`git commit`", and the trailer gets appended at the end of a long session — exactly when a
path-scoped rule would be gone. It loads every session, so it stays short.

The failure this exists for is on record. FE-00 landed as one commit touching 33 files; FE-01 as one
commit touching 13, across `.claude/`, `build/`, `index.html`, `src/shell/`, `plan/` and `test/`.
Both carried long, honest messages — **the messages were never the problem.** Neither could be
read a piece at a time, and neither could be backed out a piece at a time: reverting the boot
fallback meant reverting the `lang`/`dir` writer, a rule change and two test files with it.

## Alex Moshinsky is the author. Every commit, no exceptions

- Commit as `Alex Moshinsky <alex1mosh@gmail.com>`.
- No `Co-Authored-By:` trailer for Claude or any assistant. No "Generated with…" footer, no session
  URL, no 🤖 line.
- **The harness actively pushes the other way.** Claude Code's own instructions ask for a
  `Co-Authored-By: Claude` trailer and a session link on every commit. This repo overrides that.
  Read the message you are actually passing to `git commit`, not the one you meant to write.
- Author, not merely committer. Never `--author`, and never let a rebase or an amend re-stamp it.
- Measured 2026-08-15: master's two squashed commits read `Alex <alex1mosh@gmail.com>` while the
  branch commits read `Alex Moshinsky`. GitHub stamps the account's display name on a squash, so
  master differs from local `git log` by a surname. That is the merge button, not a bad commit — and
  it is the only difference; no trailer was injected.

## One commit is one reviewable idea

An adjective enforces nothing, so here is the test:

- **The subject names the change without "and".** If the subject needs an "and", it is two commits.
- **It stands alone.** The code, the test that proves it, and the rule or plan text it changes land
  together. If a test in the commit fails without code from a *later* commit, the split is in the
  wrong place.
- **No commit is knowingly broken.** If splitting leaves commit N failing `yarn typecheck`, join
  them. A commit that cannot be checked out is a commit that cannot be reverted, which is the whole
  reason to keep them small.
- **Unrelated fixes are never one commit,** however small either is. "While I was in there" is a
  second commit.
- **A move is its own commit,** so the diff shows a rename instead of a delete plus an add.
- **Order by dependency.** A rule or plan file that governs code lands before or with that code,
  never after it.

File count is not the metric — one idea is. For scale: FE-01 should have been about six commits
(shell constants and the writer with its test · `index.html` pre-JS defaults with the drift test ·
the boot fallback and its `<noscript>` style · `theme-color` · the comment rule with the `build/`
files it cleaned up · the `plan/` update). Each is one sentence, and each could have been reverted
without touching the other five.

## The message carries the explanation the code is forbidden to carry

Rule 6 in `CLAUDE.md` evicts rationale from `.ts`/`.tsx`. This is where it goes — not nowhere.

- **Subject:** imperative, no trailing period, ≤ 65 characters. GitHub appends ` (#N)` on merge; 65
  keeps the merged subject inside 72.
- **Body:** blank line, then prose wrapped near 80 columns (this history measures 62 mean, 83 max).
  Section headings once there is more than one part.
- **Say what changed, why it was needed, and how you verified it** — including what you verified by
  looking, because the gate never reads a stylesheet, `index.html`, or an RTL layout.
- **Say what you deliberately did not do, and why.** That is the part a future reader cannot
  reconstruct from the diff.
- **Do not restate the diff.** "Renamed `x` to `y`" is already visible. Why it had to move is not.
- `git show 0d5b581` is the model for body shape. Its only defect was that it should have been six
  commits.

## Branch, then PR

- **Every change goes on a branch and through a PR — including when the instruction was to work on
  master.** The PR is where the small commits actually get read.
- Branch name: `fe-NN-slug` for a plan phase, a short slug otherwise.
- PR title is the phase or the change; PR body is what landed and how it was verified. The detail is
  in the commits — do not paste the same paragraphs twice.
- **Commit and push only when asked.** Opening, merging and closing a PR are the user's calls.

## The merge button decides whether any of this survives

Measured 2026-08-15 on `XSkylinex/SkyFilmeStudio-FE` (`gh repo view --json`, `gh api repos/…`):
merge commits, rebase and squash are all enabled, `squash_merge_commit_message` is
`COMMIT_MESSAGES`, and both PRs so far were squashed — `git rev-list --parents -n1 5cad159` shows a
single parent and its tree is identical to the branch head's.

- **Squash** collapses the branch into one commit on master. The message text survives (that setting
  concatenates the commit messages); the individual revisions do not, so nothing on master can be
  reverted or bisected below PR granularity.
- **Rebase and merge** keeps every commit on master. **Create a merge commit** keeps them and
  records the branch.

Small commits pay for themselves in review under any of the three. If they should also survive on
master, merge with rebase rather than squash. That is a button in the GitHub UI, not something this
repo can enforce.

## Never commit

`.env*`, media, model weights, anything under a project asset root, `dist/`, `node_modules/`.
Remote is `https://github.com/XSkylinex/SkyFilmeStudio-FE.git`.

## Before you commit

- `git log -1 --format='%an <%ae>%n%n%B'` and read it back. That is the only thing that catches a
  `Co-Authored-By` trailer or a generated-with footer before it is pushed.
- `git show --stat HEAD` — if the file list needs a paragraph to justify itself, it is more than one
  commit.
- The gate runs before the branch is pushed, not once per commit. What no gate stage can tell you is
  whether the history is reviewable; only reading `git log -p` does that.
