#!/usr/bin/env node
'use strict';

const SECRET_PATTERNS = [
  /AKIA[0-9A-Z]{16}/g,
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
  /\b(?:[A-Za-z0-9+/]{40,}={0,2})/g,
  /\b(?:sk|pk|rk)-[A-Za-z0-9]{16,}\b/gi,
  /\bBearer\s+[A-Za-z0-9._-]{10,}\b/gi,
  /\b(?:api[_-]?key|secret|password|token|passwd)\s*[:=]\s*\S+/gi,
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
];

function redact(text) {
  if (typeof text !== 'string') {
    return text;
  }
  let result = text;
  for (const pattern of SECRET_PATTERNS) {
    result = result.replace(pattern, '[REDACTED]');
  }
  return result;
}

export { redact, SECRET_PATTERNS };
