#!/usr/bin/env node
// inject-a11y.js
// Inietta skip link e landmark main in tutte le pagine HTML

const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const { getAllHTMLFiles } = require('./lib/fs-utils');

const PUBLIC_DIR = resolve(__dirname, '../public');
const SKIP_LINK =
  '  <a href="#main-content" class="skip-link">Salta al contenuto principale</a>\n';

function injectA11y(filePath) {
  let html = readFileSync(filePath, 'utf-8');
  const original = html;

  if (!html.includes('class="skip-link"')) {
    html = html.replace(/(<body[^>]*>)/i, `$1\n${SKIP_LINK}`);
  }

  if (!html.includes('id="main-content"')) {
    html = html.replace(/<main(?![^>]*\bid=)/i, '<main id="main-content"');
  }

  if (html !== original) {
    writeFileSync(filePath, html, 'utf-8');
    return true;
  }
  return false;
}

function main() {
  const files = getAllHTMLFiles(PUBLIC_DIR);
  let count = 0;

  files.forEach((file) => {
    if (injectA11y(file)) {
      count += 1;
    }
  });

  console.log(`✅ Accessibilità iniettata in ${count}/${files.length} pagine`);
}

main();
