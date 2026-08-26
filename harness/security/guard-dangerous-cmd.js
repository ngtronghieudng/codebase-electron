#!/usr/bin/env node
'use strict';

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { redact } from './redact.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOCK_LOG_PATH = path.join(__dirname, 'block-log.jsonl');
const AUDIT_LOG_PATH = path.join(__dirname, 'tool-call-audit.jsonl');

function logBlock(reason, command) {
  const record = {
    command_preview: redact(command.slice(0, 160)),
    reason,
    timestamp: new Date().toISOString(),
  };
  try {
    fs.appendFileSync(BLOCK_LOG_PATH, JSON.stringify(record) + '\n');
  } catch (error) {
    process.stderr.write(
      `[guard-dangerous-cmd] Failed to write block log: ${error}\n`,
    );
  }
}

const GIT_FLAGS =
  '(?:-[A-Za-z](?:=\\S+|\\s+\\S+)?\\s+|--[A-Za-z][\\w-]*(?:=\\S+)?\\s+)*';

function isDangerousRmRf(command) {
  return command.split(/[;&|\n]/).some(isDangerousRmRfSegment);
}

function isDangerousRmRfSegment(segment) {
  const rmIndex = segment.search(/\brm\b/);
  if (rmIndex === -1) {
    return false;
  }
  const beforeRm = segment.slice(0, rmIndex);
  const isGitRm = /\bgit\s+(?:-\S+\s+)*$/.test(beforeRm);
  const afterRm = segment.slice(rmIndex + 2);
  const tokens = afterRm.trim().split(/\s+/).filter(Boolean);
  if (isGitRm && tokens.includes('--cached')) {
    return false;
  }

  let hasRecursive = false;
  let hasForce = false;
  const pathTokens = [];
  for (const token of tokens) {
    if (token === '--recursive') {
      hasRecursive = true;
    } else if (token === '--force') {
      hasForce = true;
    } else if (/^-[a-zA-Z]+$/.test(token)) {
      if (/[rR]/.test(token)) {
        hasRecursive = true;
      }
      if (/f/.test(token)) {
        hasForce = true;
      }
    } else if (token.startsWith('-')) {
      continue;
    } else {
      pathTokens.push(token);
    }
  }

  if (!hasRecursive || !hasForce || pathTokens.length === 0) {
    return false;
  }
  return !pathTokens.every(isSafeTmpPath);
}

function isSafeTmpPath(target) {
  const resolved = path.resolve(process.cwd(), target);
  return /^(\/private)?\/tmp\//.test(resolved);
}

function logAudit(verdict, command, reason) {
  const record = {
    command_preview: redact(command.slice(0, 160)),
    reason: reason || null,
    timestamp: new Date().toISOString(),
    tool_name: 'Bash',
    verdict,
  };
  try {
    fs.appendFileSync(AUDIT_LOG_PATH, JSON.stringify(record) + '\n');
  } catch (error) {
    process.stderr.write(
      `[guard-dangerous-cmd] Failed to write audit log: ${error}\n`,
    );
  }
}

const DENY_PATTERNS = [
  {
    reason:
      'git push --force. Force-push overwrites remote history. Ask user first.',
    test: isForcePush,
  },
  {
    reason:
      'git push --force-with-lease still overwrites shared history. Ask user first.',
    test: isForceWithLeasePush,
  },
  {
    re: new RegExp(`\\bgit\\s+${GIT_FLAGS}reset\\s+--hard\\b`),
    reason:
      'git reset --hard discards uncommitted work. Stash or confirm with user first.',
  },
  {
    re: new RegExp(
      `\\bgit\\s+${GIT_FLAGS}(checkout|restore)\\s+${GIT_FLAGS}(--\\s+)?\\.\\/?(?=[\\s;&|]|$)`,
    ),
    reason:
      'git checkout/restore . discards all uncommitted changes. Confirm with user first.',
  },
  {
    re: new RegExp(`\\bgit\\s+${GIT_FLAGS}clean\\s+(-[a-zA-Z]*f|--force\\b)`),
    reason:
      'git clean -f deletes untracked files irreversibly. Confirm with user first.',
  },
  {
    re: new RegExp(
      `\\bgit\\s+${GIT_FLAGS}branch\\s+(-D\\b|-[a-zA-Z]*d[a-zA-Z]*\\s+-[a-zA-Z]*f\\b|-[a-zA-Z]*f[a-zA-Z]*\\s+-[a-zA-Z]*d\\b|--delete\\b[^|;&]*--force\\b|--force\\b[^|;&]*--delete\\b)`,
    ),
    reason: 'git branch -D force-deletes a branch. Confirm with user first.',
  },
  {
    re: new RegExp(
      `\\bgit\\s+${GIT_FLAGS}(commit|push|merge|rebase|cherry-pick|am)\\b[^\\n|;&]*--no-verify\\b`,
    ),
    reason:
      '--no-verify skips pre-commit/pre-push hooks (lint-staged, validate-branch-name, commitlint). Not allowed without explicit user request.',
  },
  {
    re: new RegExp(
      `\\bgit\\s+${GIT_FLAGS}(commit|merge|rebase|cherry-pick|tag)\\b[^\\n|;&]*--no-gpg-sign\\b`,
    ),
    reason:
      '--no-gpg-sign bypasses commit signing. Not allowed without explicit user request.',
  },
  {
    re: new RegExp(
      `\\bgit\\s+${GIT_FLAGS}commit\\s+.*-c\\s+commit\\.gpgsign=false`,
    ),
    reason:
      'Bypassing commit.gpgsign via -c is not allowed without explicit user request.',
  },
  {
    reason:
      'rm -rf outside a scratch/tmp path. Confirm exact target with user first.',
    test: isDangerousRmRf,
  },
  {
    reason:
      'git push targets develop/main/master directly, bypassing MR review. Already blocked server-side by GitLab protected branches and locally by validate-branch-name — this hook adds a third, agent-facing layer. Never allowed, not even with user confirmation.',
    test: isPushingProtectedBranch,
  },
  {
    reason:
      'Command touches a .env file. Environment secrets must never be read, printed, or written by the agent. Never allowed, not even with user confirmation.',
    test: touchesEnvFile,
  },
];

const PROTECTED_BRANCHES = ['develop', 'main', 'master'];

function extractRefName(token) {
  const refPart = token.includes(':') ? token.split(':').pop() : token;
  return refPart.replace(/^refs\/heads\//, '');
}

const PUSH_INVOCATION_RE = new RegExp(
  `\\bgit\\s+${GIT_FLAGS}push\\b([^\\n|;&]*)`,
);

function getPushInvocation(command) {
  const match = command.match(PUSH_INVOCATION_RE);
  if (!match) {
    return null;
  }
  return match[1].trim().split(/\s+/).filter(Boolean);
}

function getPushTargetInfo(command) {
  const tokens = getPushInvocation(command);
  if (!tokens) {
    return null;
  }
  const nonFlagTokens = tokens.filter((token) => !token.startsWith('-'));
  const explicitBranch = nonFlagTokens.find((token) =>
    PROTECTED_BRANCHES.includes(extractRefName(token)),
  );
  const pushesAllRefs = tokens.includes('--all') || tokens.includes('--mirror');
  return { explicitBranch, nonFlagTokens, pushesAllRefs };
}

function hasForceFlag(tokens) {
  return tokens.some((token) => {
    if (token === '--force') {
      return true;
    }
    return /^-[A-Za-z]+$/.test(token) && /f/.test(token.slice(1));
  });
}

function hasForceWithLeaseFlag(tokens) {
  return tokens.some(
    (token) =>
      token === '--force-with-lease' || token.startsWith('--force-with-lease='),
  );
}

function isForcePush(command) {
  const tokens = getPushInvocation(command);
  if (!tokens) {
    return false;
  }
  return hasForceFlag(tokens) && !hasForceWithLeaseFlag(tokens);
}

function isForceWithLeasePush(command) {
  const tokens = getPushInvocation(command);
  if (!tokens) {
    return false;
  }
  return hasForceWithLeaseFlag(tokens);
}

function isPushingProtectedBranch(command) {
  const info = getPushTargetInfo(command);
  if (!info) {
    return false;
  }
  if (info.pushesAllRefs) {
    return true;
  }
  if (info.explicitBranch) {
    return true;
  }
  if (info.nonFlagTokens.length > 0) {
    return false;
  }
  try {
    const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    }).trim();
    return PROTECTED_BRANCHES.includes(branch);
  } catch {
    return false;
  }
}

const UNSAFE_HEREDOC_SINK_RE =
  /\|\s*(?:sudo\s+)?(?:bash|sh|zsh|dash|ksh|python3?|node|ruby|perl|eval|source)\b/;

function stripCatHeredocBodies(command) {
  return command.replace(
    /\bcat\b[^\n;&|]*<<[-~]?[ \t]*(['"])(\w+)\1[^\n]*\n([\s\S]*?)\n[ \t]*\2\b/g,
    (full, _quote, _tag, body) => {
      if (UNSAFE_HEREDOC_SINK_RE.test(full)) {
        return full;
      }
      return full.replace(body, '');
    },
  );
}

function touchesEnvFile(command) {
  const match = stripCatHeredocBodies(command).match(
    /(^|[\s/"'])\.env(\.[\w-]+)?(?=[\s"';&|]|$)/,
  );
  if (!match) {
    return false;
  }
  return !/\.env\.(example|sample)$/.test(match[0]);
}

const ASK_PATTERNS = [
  {
    re: /\bpnpm\s+(add|remove)\b/,
    reason:
      'pnpm add/remove changes project dependencies. Tier 2 — ask user first and state why.',
  },
  {
    re: /\b(npm|pnpm|yarn)\s+publish\b/,
    reason:
      'Publishing a package is public and hard to undo. Tier 2 — ask user first.',
  },
  {
    re: /\bnpx\b/,
    reason:
      'npx downloads and executes a package on the fly, often unreviewed. Tier 2 — ask user first.',
  },
  {
    re: /\bnpm\b/,
    reason:
      'This project uses pnpm exclusively (npm/yarn are blocked by the preinstall hook). Tier 2 — ask user first and confirm pnpm cannot do this instead.',
  },
  {
    re: /\bclaude\s+mcp\s+(add|remove)\b/,
    reason:
      'claude mcp add/remove changes the MCP server configuration. Tier 2 — ask user first.',
  },
  {
    re: /\bsudo\b/,
    reason: 'sudo escalates privileges. Tier 2 — ask user first.',
  },
  {
    re: /\b(curl|wget)\b[^|;&\n]*\|\s*(sudo\s+)?(sh|bash|zsh)\b/,
    reason:
      'Piping a remote download straight into a shell executes unreviewed code. Tier 2 — ask user first.',
  },
  {
    re: /\bdocker\s+(system\s+prune|volume\s+rm|network\s+prune)\b[^|;&\n]*(-f\b|--force\b)/,
    reason:
      'Force-pruning/removing Docker resources is destructive. Tier 2 — ask user first.',
  },
  {
    re: /\b(kill|pkill|killall)\b/,
    reason:
      "Killing a process/port may stop the user's own running dev server. Confirm with the user first instead of killing it unilaterally.",
  },
];

function emitAllowDecision(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'allow',
        permissionDecisionReason: reason,
      },
    }),
  );
}

function emitAskDecision(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: reason,
      },
    }),
  );
}

async function main() {
  let raw;
  try {
    raw = await readStdin();
  } catch (error) {
    process.stderr.write(
      `[guard-dangerous-cmd] Failed to read hook input, failing closed: ${error}\n`,
    );
    process.exit(2);
  }

  let input;
  try {
    input = JSON.parse(raw);
  } catch (error) {
    process.stderr.write(
      `[guard-dangerous-cmd] Failed to parse hook input as JSON, failing closed: ${error}\n`,
    );
    process.exit(2);
  }

  if (input.tool_name !== 'Bash') {
    process.exit(0);
  }

  const command = input.tool_input && input.tool_input.command;
  if (!command || typeof command !== 'string') {
    process.exit(0);
  }

  const commandForMatching = stripCatHeredocBodies(command);

  for (const pattern of DENY_PATTERNS) {
    const matched = pattern.re
      ? pattern.re.test(commandForMatching)
      : pattern.test(commandForMatching);
    if (matched) {
      logBlock(pattern.reason, command);
      logAudit('blocked', command, pattern.reason);
      process.stderr.write(
        `[guard-dangerous-cmd] Blocked: ${pattern.reason}\nCommand: ${command}\n` +
          `If this is genuinely needed, ask the user to run it manually or explicitly confirm the override.\n`,
      );
      process.exit(2);
    }
  }

  for (const pattern of ASK_PATTERNS) {
    const matched = pattern.re
      ? pattern.re.test(commandForMatching)
      : pattern.test(commandForMatching);
    if (matched) {
      logAudit('ask', command, pattern.reason);
      emitAskDecision(pattern.reason);
      process.exit(0);
    }
  }

  logAudit('allowed', command, null);
  emitAllowDecision(
    'Not on the deny/ask list — auto-approved by guard-dangerous-cmd.',
  );
  process.exit(0);
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', (error) => reject(error));
  });
}

main();
