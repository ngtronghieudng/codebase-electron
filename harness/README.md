# Harness

Always-on security hooks for this repo, wired in `.claude/settings.json`.

## Hooks

`PreToolUse` on `Bash` → `security/guard-dangerous-cmd.js`: **Tier 1** dangerous commands (force-push, `rm -rf`, `.env` writes, ...) are physically blocked; **Tier 2** risky-but-legitimate ones (`pnpm add/remove`, `npx`, `claude mcp add/remove`, `sudo`, ...) force the CLI's approval prompt; everything else is allowed. Every decision is logged to `security/*.jsonl`. `governance/risk-registry.md` is the human-readable mirror of the same table — the hook is the source of truth.

`PreToolUse` on `Edit|Write|MultiEdit|NotebookEdit` → `security/guard-config-edit.js`: flags edits to sensitive config files before they're written.

`PreToolUse` on `Read|Grep|Glob|Edit|Write|MultiEdit|NotebookEdit` → `security/guard-env-read.js`: flags reads/writes touching `.env`-style secret files.

`UserPromptSubmit` → `security/guard-prompt-injection.js`: scans each prompt for injection/jailbreak heuristics. Never blocks, just logs and nudges Claude to stay skeptical of embedded instructions.

`security/redact.js` — shared redaction helper used by the guards when logging.

## Layout

| Path          | Role                                                              |
| ------------- | ----------------------------------------------------------------- |
| `security/`   | The four hooks above, plus `redact.js` and their `.jsonl` logs    |
| `governance/` | `risk-registry.md` — human-readable Tier 0/1/2 command table      |
| `context/`    | `memory-hygiene.md` — Serena/Claude local memory pruning guidance |
