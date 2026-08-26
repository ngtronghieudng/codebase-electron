---
name: cb-commit
description: Smart commit for codebase-electron. Auto-increments ticket from last commit, generates [TICKET-XXX] commit with bullet body, stages, commits, and pushes directly to the branch. No confirmation prompt — invoking this command is the confirmation.
---

## Context

Before starting, gather the current repo state by running these yourself:

- `git status --short`
- `git diff --cached`
- `git diff`
- `git log --oneline -20` (for ticket extraction)
- `git branch --show-current`
- `git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>&1 || echo "none"` (upstream tracking)

## Task

Analyze the diffs and create a git commit that passes **commitlint** enforcement (`commitlint.config.mjs`, run by husky's `commit-msg` hook).

---

### Step 1 — Resolve ticket number

- Parse recent commits for pattern `[TICKET-NNN]`
- Take the highest NNN found, add 1 → new ticket
- Example: last commit `[TICKET-095]` → use `TICKET-096`

---

### Step 2 — Generate commit message

**Commitlint rules enforced on every commit (`commitlint.config.mjs` — `@commitlint/config-conventional` + a custom prefix rule):**

| Rule | Name | Constraint |
|------|------|-----------|
| custom | `prefix-commit-message` | Title MUST match `^\[TICKET-\d+\]: .+` |
| custom | `body-empty` | Body is required — never omit |
| header-max-length | conventional | Title ≤ 100 chars |
| header-trim | conventional | No leading/trailing whitespace in title |
| subject-full-stop | conventional | No trailing `.` in title |
| body-max-line-length | conventional | Each body line ≤ 100 chars |
| body-leading-blank | conventional (warning only, non-blocking) | Blank line required between title and body — enforced as format in Step 2 regardless |

**Commit format:**
```
[TICKET-XXX]: <imperative summary>

- <specific change description>
- <specific change description>
```

**Title rules:**
- Pattern `[TICKET-NNN]: Summary` — prefix mandatory
- Total line ≤ 100 chars, no leading/trailing whitespace
- No trailing period
- Imperative mood: "Add", "Fix", "Remove", "Update", "Refactor" — not past tense
- Capitalize first word after colon

**Body rules:**
- Body is REQUIRED on every commit — no exceptions
- Blank line between title and body
- Each line ≤ 100 chars
- Bullets with `- ` prefix. One bullet per logical change.
- Describe WHAT changed — file/component/behavior level, specific not generic
- If only one trivial change: write a single descriptive bullet

**Example (passes commitlint):**
```
[TICKET-109]: Update styles and metadata for improved UI and SEO

- Adjusted margin in ant-menu styles for better spacing.
- Changed sidebar background color and added a border for enhanced visibility.
- Updated site description and keywords for improved SEO and platform clarity.
```

---

### Step 3 — Stage and commit

- Stage all modified/new files relevant to the change: `git add <specific files>`
- Skip: `.env`, `*.log`, `__pycache__/`, `*.pyc`, unrelated generated/build artifacts
- Commit using heredoc to preserve newlines exactly:

```bash
git commit -m "$(cat <<'EOF'
[TICKET-XXX]: Summary here

- Bullet one.
- Bullet two.
EOF
)"
```

---

### Step 4 — Push

- If no upstream tracking branch exists: `git push -u origin <current-branch>`
- Otherwise: `git push origin <current-branch>`
- If the push is rejected (diverged from remote), stop and report — do not force-push. Force-push requires the user's explicit separate request.

---

### Step 5 — Verify before reporting done

- [ ] Commit message matches the commitlint rules from Step 2 (title prefix/length/punctuation, body present with ≤100 char lines)
- [ ] `git push` succeeded — not silently rejected or skipped

Execute steps 1 → 2 → 3 → 4 → 5 in order. No explanation. No confirmation prompt. Commit and push directly — no MR is created. Report back: commit SHA.
