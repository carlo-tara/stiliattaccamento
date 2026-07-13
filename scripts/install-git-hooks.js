#!/usr/bin/env node
// install-git-hooks.js — imposta core.hooksPath su scripts/git-hooks/

const { execSync } = require('child_process');
const { resolve } = require('path');

const root = resolve(__dirname, '..');
const hooksPath = resolve(__dirname, 'git-hooks');

try {
  execSync('git rev-parse --git-dir', { cwd: root, stdio: 'ignore' });
} catch {
  process.exit(0);
}

try {
  execSync(`git config core.hooksPath "${hooksPath}"`, { cwd: root, stdio: 'inherit' });
  console.log(`Git hooks: ${hooksPath}`);
} catch (err) {
  console.warn('Impossibile impostare core.hooksPath:', err.message);
  process.exit(0);
}
