# Memory Hygiene — codebase-electron

Two memory stores touch this repo. Both are local/per-machine, neither is committed to git (`.serena/` and Claude's global auto-memory dir are both outside version control) — this doc is guidance for each contributor, not a shared state.

## 1. Serena project memory (`.serena/memories/`)

Written via `mcp__serena__write_memory` during long sessions (architecture notes, in-progress plan state). Gitignored (`.gitignore:.serena/`), local only.

**Prune when:**

- A memory describes a plan/task that's since been merged or abandoned — `mcp__serena__delete_memory` it. A stale plan memory is worse than no memory: it gets read back as current state on the next session.
- File count exceeds ~15-20 — at that point `list_memories` itself becomes noisy to skim before a session starts.

**Check:** `mcp__serena__list_memories` at the start of any session that feels like it's picking up prior context. If a memory names a file/symbol, verify it still exists before trusting it (see global memory instructions: "the memory says X exists" is not "X exists now").

## 2. Global auto-memory (`~/.claude/projects/<project-hash>/memory/`)

Cross-session, keyed by this project's working directory. Holds `user`/`feedback`/`project`/`reference` memory types per the global memory system. Not scoped to `codebase-electron` specifically in format, but in practice most entries here will be about this repo since it's the active project directory.

**Prune when:**

- A `project`-type memory's `Why:`/deadline has passed and the decision it recorded is now just... how the code is (verifiable by reading the code instead of recalling the memory).
- A `feedback`-type memory has been superseded by a later, contradicting correction — delete the old one rather than leaving both for a future session to reconcile.
- `MEMORY.md` index approaches its 200-line truncation limit — collapse or delete the least-referenced entries first.

**Not this doc's job:** memory _content_ quality (that's the global memory-system instructions in `~/.claude/CLAUDE.md`). This doc is only about not letting either store rot into misleading dead weight for this specific repo.
