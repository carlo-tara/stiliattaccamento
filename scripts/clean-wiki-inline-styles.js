#!/usr/bin/env node
// clean-wiki-inline-styles.js
// Rimuove inline styles ripetitivi da tutte le pagine HTML

const { readFileSync, writeFileSync } = require('fs');
const { getAllHTMLFiles } = require('./lib/fs-utils');
const { stripWikiListInlineStyles } = require('./lib/wiki-html-utils');

const PUBLIC_DIR = require('path').resolve(__dirname, '../public');

function main() {
  const files = getAllHTMLFiles(PUBLIC_DIR).filter(
    (f) => !f.includes('/templates/')
  );
  let count = 0;

  files.forEach((filePath) => {
    const original = readFileSync(filePath, 'utf-8');
    const html = stripWikiListInlineStyles(original);
    if (html !== original) {
      writeFileSync(filePath, html, 'utf-8');
      count += 1;
    }
  });

  console.log(`✅ Inline styles rimossi in ${count}/${files.length} pagine`);
}

if (require.main === module) {
  main();
}

module.exports = { main };
