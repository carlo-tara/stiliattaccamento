#!/usr/bin/env node
// inject-analytics.js — inlines blocco GA4/GTM nel <head> di tutte le pagine HTML

const { readFileSync, writeFileSync } = require('fs');
const { resolve, relative } = require('path');
const { getAllHTMLFiles } = require('./lib/fs-utils');

const PUBLIC_DIR = resolve(__dirname, '../public');
const TEMPLATE_PATH = resolve(PUBLIC_DIR, 'templates/analytics-head.html');

const MARKER_START = '<!-- Site analytics (auto-injected) -->';
const MARKER_END = '<!-- End Google Tag Manager -->';

function getCssPrefix(relativePath) {
  const depth = relativePath.split('/').length - 1;
  return depth > 0 ? '../'.repeat(depth) : '';
}

function removeAnalyticsBlock(html) {
  return html.replace(
    /<!-- Site analytics \(auto-injected\) -->[\s\S]*?<!-- End Google Tag Manager -->\n?/g,
    ''
  );
}

function removeFooterGtmScript(html) {
  return html.replace(
    /\s*<script src="(?:\.\.\/)*js\/gtm\.js(\?v=[^"]*)?"(?:\s+defer)?><\/script>\n?/g,
    '\n'
  );
}

function injectAnalytics(filePath, template) {
  const relativePath = relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  const original = readFileSync(filePath, 'utf-8');
  let html = removeAnalyticsBlock(original);
  html = removeFooterGtmScript(html);

  const headClose = html.indexOf('</head>');
  if (headClose === -1) {
    console.warn(`⚠️  Nessun </head> in ${relativePath}`);
    return false;
  }

  const block = `  ${template.trim()}\n`;
  html = `${html.slice(0, headClose)}${block}${html.slice(headClose)}`;

  if (html !== original) {
    writeFileSync(filePath, html, 'utf-8');
    return true;
  }
  return false;
}

function main() {
  const template = readFileSync(TEMPLATE_PATH, 'utf-8');
  const files = getAllHTMLFiles(PUBLIC_DIR);
  let count = 0;

  files.forEach((file) => {
    if (injectAnalytics(file, template)) {
      count += 1;
    }
  });

  console.log(`✅ Blocco analytics iniettato nel <head> di ${count}/${files.length} pagine`);
}

main();
