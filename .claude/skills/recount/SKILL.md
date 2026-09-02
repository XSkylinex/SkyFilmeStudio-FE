---
name: recount
description: Re-count the i18n catalogue and rewrite CLAUDE.md's count sentence, including through the rebase conflict every PR hits on it. Invoke after adding or removing catalogue keys, when a rebase stops on the "keys in English and Hebrew" paragraph, or when test/catalogue-count-in-claude-md.test.ts fails.
allowed-tools: Read, Bash(node .claude/skills/recount/scripts/*)
---

# recount — the number is measured, never incremented

CLAUDE.md carries the catalogue's key count in one sentence, and that sentence has been wrong more
than once because someone incremented it. Every PR that adds a key moves the number, and every
rebase across a merged PR conflicts on the same paragraph — eleven times on 2026-09-02 alone.

```bash
node .claude/skills/recount/scripts/recount.mjs --check                 # exit 1 if CLAUDE.md disagrees
node .claude/skills/recount/scripts/recount.mjs "the structure-profile form"   # rewrite the sentence
```

The rewrite counts both catalogues, requires them equal, and writes the sentence as **N keys**,
counted today after *what you named*, followed by the chain of earlier counts it found there. It
keeps the paragraph's history intact and reflows it to 100 columns.

**In a rebase conflict on that paragraph**, run the rewrite before `git add CLAUDE.md`: it keeps the
upstream side of the block, then rewrites the number from the merged catalogues, so the chain
records the upstream count as the previous link. Other conflict blocks in the file are left to you.

`test/catalogue-count-in-claude-md.test.ts` fails the suite when the sentence and the catalogues
disagree, which is what keeps the number a fact rather than a memory.
