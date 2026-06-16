#!/usr/bin/env node
// fix-approfondimenti-nesting.js
// Corregge card annidate (effetto matrioska) nelle pagine approfondimenti

const { readFileSync, writeFileSync, readdirSync } = require('fs');
const { resolve, join } = require('path');

const APPROFONDIMENTI_DIR = resolve(__dirname, '../public/approfondimenti');

const STYLE_CARD_PATTERN = /<div class="card mb-6"><h3>([^<]+)<\/h3>/g;

/**
 * @param {string} title
 * @returns {'secure'|'anxious'|'avoidant'|'disorganized'|'default'}
 */
function detectStyleModifier(title) {
  const upper = title.trim().toUpperCase();
  if (upper.startsWith('SECURE')) return 'secure';
  if (upper.startsWith('ANSIOSO')) return 'anxious';
  if (upper.startsWith('EVITANTE')) return 'avoidant';
  if (upper.startsWith('OSCILLANTE')) return 'disorganized';
  return 'default';
}

/**
 * @param {string} html
 * @returns {{ html: string, fixed: boolean, sectionCount: number }}
 */
function fixApprofondimentiNesting(html) {
  if (!STYLE_CARD_PATTERN.test(html)) {
    return { html, fixed: false, sectionCount: 0 };
  }

  STYLE_CARD_PATTERN.lastIndex = 0;
  let sectionCount = 0;

  let result = html.replace(STYLE_CARD_PATTERN, (match, title) => {
    sectionCount += 1;
    const modifier = detectStyleModifier(title);
    const prefix = sectionCount > 1 ? '</article>\n\n        ' : '';
    return (
      `${prefix}<article class="style-section style-section--${modifier} mb-6">` +
      `\n          <h3 class="style-section__title">${title}</h3>`
    );
  });

  if (sectionCount === 0) {
    return { html, fixed: false, sectionCount: 0 };
  }

  result = result.replace(
    /\s*<\/div>\s*(\n\s*<!-- Navigazione -->)/,
    '\n        </article>$1'
  );

  if (!result.includes('</article>\n        \n        <!-- Navigazione -->') &&
      !result.includes('</article>\n        <!-- Navigazione -->')) {
    result = result.replace(/(\n)(\s*<!-- Navigazione -->)/, '\n        </article>$2');
  }

  return { html: result, fixed: result !== html, sectionCount };
}

function main() {
  const files = readdirSync(APPROFONDIMENTI_DIR).filter((f) => f.endsWith('.html'));
  let fixedCount = 0;

  files.forEach((file) => {
    const filePath = join(APPROFONDIMENTI_DIR, file);
    const original = readFileSync(filePath, 'utf-8');
    const { html, fixed, sectionCount } = fixApprofondimentiNesting(original);

    if (fixed) {
      writeFileSync(filePath, html, 'utf-8');
      fixedCount += 1;
      console.log(`✅ ${file} — ${sectionCount} sezioni stile`);
    }
  });

  console.log(`\n✅ Corrette ${fixedCount} pagine approfondimenti`);
}

module.exports = {
  detectStyleModifier,
  fixApprofondimentiNesting,
};

if (require.main === module) {
  main();
}
