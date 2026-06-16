#!/usr/bin/env node
// enrich-schema-geo.js
// Arricchisce JSON-LD con campi utili per motori generativi (GEO)

const { readFileSync, writeFileSync, statSync } = require('fs');
const { resolve, relative } = require('path');
const { JSDOM } = require('jsdom');
const { getAllHTMLFiles } = require('./lib/fs-utils');
const { toIsoDate } = require('./lib/seo-utils');
const { SITE_URL, SITE_NAME, SITE_LAUNCH_DATE } = require('./seo-config');

const PUBLIC_DIR = resolve(__dirname, '../public');
const PUBLISHER = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
};
const WEBSITE_REF = {
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
};

function toCanonicalUrl(relativePath) {
  if (relativePath === 'index.html') {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}/${relativePath}`;
}

function enrichSchema(schema, canonical, filePath) {
  const type = schema['@type'];
  const enrichable = ['Article', 'Quiz', 'WebPage'];

  if (!enrichable.includes(type)) {
    return schema;
  }

  const enriched = { ...schema };
  const fileModDate = toIsoDate(statSync(filePath).mtime);

  if (!enriched.inLanguage) {
    enriched.inLanguage = 'it-IT';
  }
  if (!enriched.publisher) {
    enriched.publisher = PUBLISHER;
  }
  if (!enriched.isPartOf) {
    enriched.isPartOf = WEBSITE_REF;
  }
  if (!enriched.mainEntityOfPage) {
    enriched.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': canonical,
    };
  }
  if (type === 'Article') {
    if (!enriched.url) {
      enriched.url = canonical;
    }
    if (!enriched.datePublished) {
      enriched.datePublished = SITE_LAUNCH_DATE;
    }
    if (!enriched.dateModified) {
      enriched.dateModified = fileModDate;
    }
    if (!enriched.about) {
      enriched.about = {
        '@type': 'Thing',
        name: 'Stili di attaccamento',
        description: 'Pattern relazionali nella teoria dell\'attaccamento di Bowlby e Ainsworth',
      };
    }
  }
  if (type === 'WebPage' && !enriched.dateModified) {
    enriched.dateModified = fileModDate;
  }

  return enriched;
}

function processFile(filePath) {
  const relativePath = relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  const canonical = toCanonicalUrl(relativePath);
  let html = readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(html);
  const scripts = dom.window.document.querySelectorAll('script[type="application/ld+json"]');
  let changed = false;

  scripts.forEach((script) => {
    try {
      const original = JSON.parse(script.textContent);
      if (original['@type'] === 'FAQPage' || original['@graph']) {
        return;
      }
      const enriched = enrichSchema(original, canonical, filePath);
      const newJson = JSON.stringify(enriched, null, 2);
      const oldJson = JSON.stringify(original, null, 2);
      if (newJson !== oldJson) {
        html = html.replace(script.textContent, `\n  ${newJson}\n  `);
        changed = true;
      }
    } catch {
      // skip invalid JSON-LD
    }
  });

  if (changed) {
    writeFileSync(filePath, html, 'utf-8');
  }
  return changed;
}

function main() {
  const files = getAllHTMLFiles(PUBLIC_DIR);
  let count = 0;
  files.forEach((file) => {
    if (processFile(file)) {
      count += 1;
    }
  });
  console.log(`✅ Schema GEO arricchiti in ${count}/${files.length} pagine`);
}

main();
