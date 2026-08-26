#!/usr/bin/env node
'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { redact } from './redact.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOCK_LOG_PATH = path.join(__dirname, 'block-log.jsonl');
const AUDIT_LOG_PATH = path.join(__dirname, 'tool-call-audit.jsonl');

const ENV_FILE_RE = /^\.env\b(?!\.sample$)/i;
const REASON =
  'This targets .env directly, which holds real secrets. Never read/search/write .env — use .env.sample as the template.';

const CANDIDATE_FIELDS_BY_TOOL = {
  Edit: ['file_path'],
  Glob: ['pattern', 'path'],
  Grep: ['path', 'glob'],
  MultiEdit: ['file_path'],
  NotebookEdit: ['notebook_path'],
  Read: ['file_path'],
  Write: ['file_path'],
};

function logAudit(toolName, filePath, verdict, reason) {
  const record = {
    command_preview: redact((filePath || '').slice(0, 160)),
    reason: reason || null,
    timestamp: new Date().toISOString(),
    tool_name: toolName,
    verdict,
  };
  try {
    fs.appendFileSync(AUDIT_LOG_PATH, JSON.stringify(record) + '\n');
  } catch (_error) {
    void _error;
  }
}

function logBlock(reason, filePath) {
  const record = {
    command_preview: redact((filePath || '').slice(0, 160)),
    reason,
    timestamp: new Date().toISOString(),
  };
  try {
    fs.appendFileSync(BLOCK_LOG_PATH, JSON.stringify(record) + '\n');
  } catch (_error) {
    void _error;
  }
}

async function main() {
  let raw;
  try {
    raw = await readStdin();
  } catch (error) {
    process.stderr.write(
      `[guard-env-read] Failed to read hook input, failing closed: ${error}\n`,
    );
    process.exit(1);
  }

  let input;
  try {
    input = JSON.parse(raw);
  } catch (error) {
    process.stderr.write(
      `[guard-env-read] Failed to parse hook input as JSON, failing closed: ${error}\n`,
    );
    process.exit(1);
  }

  const fields = CANDIDATE_FIELDS_BY_TOOL[input.tool_name];
  if (!fields) {
    process.exit(0);
  }

  const toolInput = input.tool_input || {};
  for (const field of fields) {
    const candidate = toolInput[field];
    if (matchesEnvFile(candidate)) {
      logBlock(REASON, candidate);
      logAudit(input.tool_name, candidate, 'blocked', REASON);
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'deny',
            permissionDecisionReason: REASON,
          },
        }),
      );
      process.exit(0);
    }
  }

  logAudit(input.tool_name, JSON.stringify(toolInput), 'allowed', null);
  process.exit(0);
}

function matchesEnvFile(candidate) {
  if (!candidate || typeof candidate !== 'string') {
    return false;
  }
  return ENV_FILE_RE.test(path.basename(candidate.replace(/\\/g, '/')));
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
