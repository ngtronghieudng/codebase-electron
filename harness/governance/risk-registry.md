# Risk Registry — codebase-electron

Three tiers. Tier 0 is explicitly-authorized autonomy — invoking the command by name IS the confirmation, by design, no prompt in between. Tier 1 is hook-enforced deny (`harness/security/guard-dangerous-cmd.js` for Bash, `harness/security/guard-env-read.js` for Read/Grep/Glob/Edit/Write/MultiEdit/NotebookEdit, wired via `.claude/settings.json`) — Claude physically cannot run these without the user running them manually. Tier 2 is hook-enforced ask (`harness/security/guard-dangerous-cmd.js` for Bash, `harness/security/guard-config-edit.js` for Edit/Write/MultiEdit/NotebookEdit) — the hook returns `permissionDecision: "ask"` for a PreToolUse match, which forces the CLI's native interactive approval prompt; Claude cannot silently allow itself past it.

Source of truth for what the hooks actually block: `harness/security/guard-dangerous-cmd.js` (Bash), `harness/security/guard-env-read.js` (`.env` file access across all read/write tools), `harness/security/guard-config-edit.js` (config file edits). If this table and the hooks ever disagree, the hooks win — update the hook first, then this file.

MCP-provided file tools (e.g. Serena's `read_file`/`create_text_file`/`replace_content`) are not covered by any hook here — their `tool_name` values don't match the matchers above. Treat them as outside this registry's enforcement until explicitly added.

## Tier 0 — Explicitly-authorized autonomous actions (opt-in commands, no confirmation prompt)

These commands push to remote and/or write to GitLab on their own. That's the entire point of choosing them over a plain edit — but the scope must stay exactly what's documented here, not creep silently. If a command's actual behavior grows beyond its row below, update this table in the same change, not after.

| Command       | What it does without asking                                                    | What it does NOT do                                                                                 |
| ------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `/uam-commit` | Commits (commitlint-compliant), pushes current branch, opens or updates the MR | Never force-pushes (Tier 1 blocks it anyway); never targets a branch other than the one checked out |

`/uam-commit` is the only Tier 0 command. The other three current skills (`/uam-feature`, `/uam-bugfix`, `/uam-refactor`, see below) never push or write to GitLab on their own, so none belong in this table.

**Idempotency:** `/uam-commit` is safe to re-invoke on the same state — it stages+commits only if there is an actual diff (an empty `git status --short` means nothing to commit — no-op, not an error) and checks for an existing open MR before creating one (`glab mr list --source-branch`), so re-running it updates the same MR instead of opening a duplicate.

## Tier N/A — Gated workflows (no autonomous write, human review at every gate)

`/uam-feature`, `/uam-bugfix`, `/uam-refactor` are multi-step workflows (research/plan → TDD/implement → review → verify → doc), each ending in a report with **no commit step** — they never push or touch GitLab, so they sit outside this registry's push/write concern entirely. Listed here only so their review-gate agents aren't mistaken for Tier 0 autonomy:

| Workflow        | Spec/plan gate                                   | Implementation gate — mandatory         | Implementation gate — conditional                                                       |
| --------------- | ------------------------------------------------ | --------------------------------------- | --------------------------------------------------------------------------------------- |
| `/uam-feature`  | `architect` (spec), `architect`/`council` (plan) | `typescript-reviewer`, `react-reviewer` | `security-reviewer`, `a11y-architect`, `performance-optimizer`, `silent-failure-hunter` |
| `/uam-bugfix`   | `architect` (root-cause)                         | `typescript-reviewer`, `react-reviewer` | `security-reviewer`, `a11y-architect`, `performance-optimizer`, `silent-failure-hunter` |
| `/uam-refactor` | `architect`/`council` (plan)                     | `typescript-reviewer`, `react-reviewer` | `security-reviewer`, `a11y-architect`, `performance-optimizer`, `silent-failure-hunter` |

Conditional agents trigger on file/change pattern (auth or payment code, UI markup, AI Workflow canvas/SSE hooks, or a new `try`/`catch`/fallback) — see each workflow's `review-implement` (or `review-root-cause`) step for the exact trigger. `planner` (drafts the task list) and `tdd-guide` (drives RED→GREEN) are implementers, not reviewers, so they're not gates. None of these agents run Bash/Edit/Write outside Tier 1/2 hook coverage — a gated workflow editing `.claude/settings.json` or running `pnpm add` still hits the same Tier 2 ask-prompt as a plain edit would.

## Tier 1 — Hook-blocked (technical enforcement)

| Command pattern                                                                                                         | Why blocked                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git push --force` / `--force-with-lease`                                                                               | Overwrites remote history, can destroy teammates' work                                                                                                                                                                                                                                                                                                                  |
| `git reset --hard`                                                                                                      | Discards uncommitted work irreversibly                                                                                                                                                                                                                                                                                                                                  |
| `git checkout .` / `git restore .`                                                                                      | Discards all uncommitted changes                                                                                                                                                                                                                                                                                                                                        |
| `git clean -f`                                                                                                          | Deletes untracked files irreversibly                                                                                                                                                                                                                                                                                                                                    |
| `git branch -D`                                                                                                         | Force-deletes a branch, bypassing merge check                                                                                                                                                                                                                                                                                                                           |
| `git ... --no-verify`                                                                                                   | Skips pre-commit chain (lint-staged: format+lint, validate-branch-name, commitlint)                                                                                                                                                                                                                                                                                     |
| `git ... --no-gpg-sign` / `-c commit.gpgsign=false`                                                                     | Bypasses commit signing                                                                                                                                                                                                                                                                                                                                                 |
| `rm -rf <repo path>` (outside `/tmp` or scratchpad)                                                                     | Irreversible file deletion in tracked code                                                                                                                                                                                                                                                                                                                              |
| `git push` to `develop`/`main`/`master` directly                                                                        | Bypasses MR review. Also blocked server-side (GitLab protected branches) and locally at commit time (`validate-branch-name` requires branch name matching `feature/bugfix/hotfix/release`, so committing while checked out on develop/main already fails) — this hook is a third, agent-facing layer, not the only one. Never allowed, not even with user confirmation. |
| Any Bash command or Edit/Write/MultiEdit/NotebookEdit touching `.env`/`.env.*` (excluding `.env.example`/`.env.sample`) | Environment secrets must never be read, printed, or written by the agent, regardless of user confirmation                                                                                                                                                                                                                                                               |

## Tier 2 — Hook-enforced ask (interactive human confirmation)

These patterns emit `permissionDecision: "ask"` instead of `"deny"` — the tool call pauses for the user's explicit approve/deny in the CLI, same technical gate as Tier 1's block, just non-terminal. Two hook wirings cover it: `Bash` matcher → `guard-dangerous-cmd.js` for command-based patterns, `Edit|Write|MultiEdit|NotebookEdit` matcher → `guard-config-edit.js` for file-path-based patterns.

| Pattern                           | Detection                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Editing `.claude/settings.json`   | File-path match on Edit/Write/MultiEdit/NotebookEdit tool calls (`guard-config-edit.js`)                         |
| Editing `docker-compose.prod.yml` | File-path match, same tools — no such file exists in this repo today; guarded pre-emptively in case one is added |
| Editing `Dockerfile`              | File-path match, same tools — same pre-emptive reasoning as above                                                |
| `pnpm add` / `pnpm remove`        | Bash command match (`guard-dangerous-cmd.js`)                                                                    |
| `kill` / `pkill` / `killall`      | Bash command match                                                                                               |

Promote a Tier 2 pattern to Tier 1 (hard deny) if it is repeatedly approved without real justification — that signals the ask-gate isn't doing its job as a checkpoint.

## Changing this registry

Adding a Tier 1 rule = edit the `DENY_PATTERNS` array in `harness/security/guard-dangerous-cmd.js`, test with the JSON-stdin cases shown in that file's usage, then mirror the entry here. Removing a Tier 1 rule requires explicit user sign-off — it is a deliberate loosening of the safety net, not a cleanup.

Adding a Tier 2 rule = edit `ASK_PATTERNS` (Bash) in `harness/security/guard-dangerous-cmd.js`, or `ASK_FILE_PATTERNS` (file-path) in `harness/security/guard-config-edit.js`, mirror the entry in the table above. Removing a Tier 2 rule is a smaller change than removing Tier 1 but still needs user sign-off — it's still a loosened checkpoint, just a softer one.

Adding a Tier 0 capability = when a skill file (`.claude/skills/*/SKILL.md`) gains any new push/write/GitLab-API behavior it didn't have before, add or update its row in the Tier 0 table **in the same commit** — this table is what stands between "opt-in autonomy" and "silent scope creep."
