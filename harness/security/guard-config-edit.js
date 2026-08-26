#!/usr/bin/env node
'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { redact } from './redact.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIT_LOG_PATH = path.join(__dirname, 'tool-call-audit.jsonl');

const ASK_FILE_PATTERNS = [
  {
    re: /(^|\/)\.claude\/settings\.json$/,
    reason:
      "Editing .claude/settings.json changes the harness's own enforcement layer. Tier 2 — ask user first.",
  },
  {
    re: /(^|\/)docker-compose\.prod\.yml$/,
    reason:
      'Editing docker-compose.prod.yml changes production deployment topology. Tier 2 — ask user first.',
  },
  {
    re: /(^|\/)Dockerfile$/,
    reason:
      'Editing Dockerfile changes the production image build. Tier 2 — ask user first.',
  },
];

const GUARDED_TOOLS = new Set(['Edit', 'MultiEdit', 'NotebookEdit', 'Write']);

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

async function main() {
  let raw;
  try {
    raw = await readStdin();
  } catch (error) {
    process.stderr.write(
      `[guard-config-edit] Failed to read hook input, failing closed: ${error}\n`,
    );
    process.exit(1);
  }

  let input;
  try {
    input = JSON.parse(raw);
  } catch (error) {
    process.stderr.write(
      `[guard-config-edit] Failed to parse hook input as JSON, failing closed: ${error}\n`,
    );
    process.exit(1);
  }

  if (!GUARDED_TOOLS.has(input.tool_name)) {
    process.exit(0);
  }

  const toolInput = input.tool_input || {};
  const filePath = toolInput.file_path || toolInput.notebook_path;
  if (!filePath || typeof filePath !== 'string') {
    process.exit(0);
  }

  const normalizedFilePath = filePath.replace(/\\/g, '/');
  const matchedPattern = ASK_FILE_PATTERNS.find((pattern) =>
    pattern.re.test(normalizedFilePath),
  );
  if (matchedPattern) {
    logAudit(input.tool_name, filePath, 'ask', matchedPattern.reason);
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'ask',
          permissionDecisionReason: matchedPattern.reason,
        },
      }),
    );
    process.exit(0);
  }

  logAudit(input.tool_name, filePath, 'allowed', null);
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
