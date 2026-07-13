#!/usr/bin/env node
// build-search.js — indicizza le pagine HTML con Pagefind (ultimo step di npm run perf)

const { execSync } = require('child_process');
const { resolve } = require('path');
const { existsSync } = require('fs');

const ROOT = resolve(__dirname, '..');
const CONFIG_PATH = resolve(ROOT, 'pagefind.yml');

function main() {
  if (!existsSync(CONFIG_PATH)) {
    console.error('❌ pagefind.yml non trovato');
    process.exit(1);
  }

  console.log('🔍 Indicizzazione Pagefind…');

  execSync('npx pagefind', {
    stdio: 'inherit',
    cwd: ROOT,
  });

  console.log('✅ Indice di ricerca Pagefind generato in public/pagefind/');
}

main();
