#!/usr/bin/env node
// clean-approfondimenti-ui.js
// Pulisce inline styles e migliora layout pagine approfondimenti

const { readFileSync, writeFileSync, readdirSync } = require('fs');
const { resolve, join } = require('path');

const APPROFONDIMENTI_DIR = resolve(__dirname, '../public/approfondimenti');

const STYLE_LABELS = {
  SECURE: 'Secure',
  ANSIOSO: 'Ansioso',
  EVITANTE: 'Evitante',
  OSCILLANTE: 'Oscillante',
};

/**
 * @param {string} title
 * @returns {string}
 */
function humanizeStyleTitle(title) {
  const match = title.match(
    /^(SECURE|ANSIOSO|EVITANTE|OSCILLANTE|Secure|Ansioso|Evitante|Oscillante)\s*[-–—]\s*(.+)$/i
  );
  if (!match) {
    return title;
  }
  const label = STYLE_LABELS[match[1].toUpperCase()];
  const subtitle = match[2].toLowerCase();
  return `${label} — ${subtitle}`;
}

const { stripWikiListInlineStyles } = require('./lib/wiki-html-utils');

/**
 * @param {string} html
 * @returns {string}
 */
function convertIntroLeadCard(html) {
  return html.replace(
    /<div class="card mb-6"><p>([^<]+)<\/p>\s*<\/div>/,
    '<p class="wiki-lead mb-8">$1</p>'
  );
}

/**
 * @param {string} html
 * @returns {string}
 */
function humanizeStyleSectionTitles(html) {
  return html.replace(
    /<h3 class="style-section__title">([^<]+)<\/h3>/g,
    (match, title) => `<h3 class="style-section__title">${humanizeStyleTitle(title)}</h3>`
  );
}

/**
 * @param {string} html
 * @returns {string}
 */
function replaceNavigationCard(html) {
  return html.replace(
    /\s*<!-- Navigazione -->\s*<div class="card mt-8">\s*<h3>Altri Approfondimenti<\/h3>\s*<p><a href="([^"]+)">← Torna all'indice degli Approfondimenti<\/a><\/p>\s*<\/div>/i,
    '\n        <nav class="content-nav mt-8" aria-label="Navigazione articolo">\n          <a href="$1" class="content-nav__link">← Torna all\'indice degli approfondimenti</a>\n        </nav>'
  );
}

/**
 * @param {string} html
 * @returns {{ html: string, changed: boolean }}
 */
function cleanApprofondimentiUi(html) {
  const original = html;
  let result = html;
  result = stripWikiListInlineStyles(result);
  result = convertIntroLeadCard(result);
  result = humanizeStyleSectionTitles(result);
  result = replaceNavigationCard(result);
  return { html: result, changed: result !== original };
}

function main() {
  const files = readdirSync(APPROFONDIMENTI_DIR).filter((f) => f.endsWith('.html'));
  let count = 0;

  files.forEach((file) => {
    const filePath = join(APPROFONDIMENTI_DIR, file);
    const original = readFileSync(filePath, 'utf-8');
    const { html, changed } = cleanApprofondimentiUi(original);
    if (changed) {
      writeFileSync(filePath, html, 'utf-8');
      count += 1;
      console.log(`✅ ${file}`);
    }
  });

  console.log(`\n✅ UI pulita in ${count}/${files.length} pagine approfondimenti`);
}

module.exports = {
  humanizeStyleTitle,
  stripWikiListInlineStyles,
  cleanApprofondimentiUi,
};

if (require.main === module) {
  main();
}
