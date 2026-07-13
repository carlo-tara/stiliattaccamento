#!/usr/bin/env node
// inject-search.js — UI Pagefind (modal) e data-pagefind-body su <main>

const { readFileSync, writeFileSync } = require('fs');
const { resolve, relative } = require('path');
const { getAllHTMLFiles } = require('./lib/fs-utils');

const PUBLIC_DIR = resolve(__dirname, '../public');

const MARKER_HEAD_START = '<!-- Site search (auto-injected) -->';
const MARKER_HEAD_END = '<!-- /Site search -->';
const MARKER_MODAL_START = '<!-- Site search modal (auto-injected) -->';
const MARKER_MODAL_END = '<!-- /Site search modal -->';

const HEAD_BLOCK = [
  MARKER_HEAD_START,
  '  <link rel="preload" href="/pagefind/pagefind-component-ui.css" as="style">',
  '  <link rel="stylesheet" href="/pagefind/pagefind-component-ui.css">',
  '  <script src="/pagefind/pagefind-component-ui.js" type="module"></script>',
  MARKER_HEAD_END,
].join('\n');

const MODAL_BLOCK = [
  MARKER_MODAL_START,
  '  <pagefind-modal bundle-path="/pagefind/" shortcut="/"></pagefind-modal>',
  MARKER_MODAL_END,
].join('\n');

function removeSearchBlocks(html) {
  return html
    .replace(
      /<!-- Site search \(auto-injected\) -->[\s\S]*?<!-- \/Site search -->\n?/g,
      ''
    )
    .replace(
      /<!-- Site search modal \(auto-injected\) -->[\s\S]*?<!-- \/Site search modal -->\n?/g,
      ''
    );
}

function ensurePagefindBody(html) {
  return html.replace(/<main(\s[^>]*)?>/gi, (match, attrs = '') => {
    if (/data-pagefind-body/i.test(attrs)) {
      return match;
    }
    const trimmed = attrs.trim();
    return trimmed ? `<main ${trimmed} data-pagefind-body>` : '<main data-pagefind-body>';
  });
}

function injectSearch(filePath) {
  const relativePath = relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  const original = readFileSync(filePath, 'utf-8');
  let html = removeSearchBlocks(original);
  html = ensurePagefindBody(html);

  const headClose = html.indexOf('</head>');
  if (headClose === -1) {
    console.warn(`⚠️  Nessun </head> in ${relativePath}`);
    return false;
  }

  html = `${html.slice(0, headClose)}  ${HEAD_BLOCK}\n${html.slice(headClose)}`;

  const bodyClose = html.lastIndexOf('</body>');
  if (bodyClose === -1) {
    console.warn(`⚠️  Nessun </body> in ${relativePath}`);
    return false;
  }

  html = `${html.slice(0, bodyClose)}  ${MODAL_BLOCK}\n${html.slice(bodyClose)}`;

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
    if (injectSearch(file)) {
      count += 1;
    }
  });

  console.log(`✅ Ricerca Pagefind iniettata in ${count}/${files.length} pagine`);
}

main();
