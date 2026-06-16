#!/usr/bin/env node
// validate-seo.js
// Verifica che ogni pagina HTML abbia meta SEO essenziali

const { readFileSync } = require('fs');
const { resolve, relative } = require('path');
const { JSDOM } = require('jsdom');
const { getAllHTMLFiles } = require('./lib/fs-utils');
const { SITE_URL } = require('./seo-config');

const PUBLIC_DIR = resolve(__dirname, '../public');

function expectedCanonical(relativePath) {
  return relativePath === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${relativePath}`;
}

function validateFile(filePath) {
  const relativePath = relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  const html = readFileSync(filePath, 'utf-8');
  const { document } = new JSDOM(html).window;
  const issues = [];

  const title = document.querySelector('title')?.textContent?.trim();
  if (!title) {
    issues.push('title mancante');
  } else if (title.length > 70) {
    issues.push(`title troppo lungo (${title.length} caratteri)`);
  }

  const description = document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();
  if (!description) {
    issues.push('meta description mancante');
  } else if (description.length > 160) {
    issues.push(`description troppo lunga (${description.length} caratteri)`);
  }

  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const expected = expectedCanonical(relativePath);
  if (!canonical) {
    issues.push('canonical mancante');
  } else if (canonical !== expected) {
    issues.push(`canonical errato: ${canonical}`);
  }

  if (!document.querySelector('meta[property="og:title"]')) {
    issues.push('og:title mancante');
  }
  if (!document.querySelector('meta[property="og:image"]')) {
    issues.push('og:image mancante');
  }
  if (!document.querySelector('meta[name="twitter:card"]')) {
    issues.push('twitter:card mancante');
  }

  if (!document.querySelector('link[rel="alternate"][hreflang="it"]')) {
    issues.push('hreflang="it" mancante');
  }
  if (!document.querySelector('link[rel="alternate"][hreflang="x-default"]')) {
    issues.push('hreflang="x-default" mancante');
  }
  if (!document.querySelector('meta[property="og:image:alt"]')) {
    issues.push('og:image:alt mancante');
  }

  const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
  if (ogDesc.length > 160) {
    issues.push(`og:description troppo lunga (${ogDesc.length} caratteri)`);
  }

  return { relativePath, issues };
}

function main() {
  const files = getAllHTMLFiles(PUBLIC_DIR);
  const failures = files.map(validateFile).filter((r) => r.issues.length > 0);

  if (failures.length === 0) {
    console.log(`✅ SEO valido su ${files.length} pagine\n`);
    process.exit(0);
  }

  console.log(`❌ ${failures.length} pagine con problemi SEO:\n`);
  failures.forEach(({ relativePath, issues }) => {
    console.log(`  ${relativePath}:`);
    issues.forEach((issue) => console.log(`    - ${issue}`));
  });
  console.log('');
  process.exit(1);
}

main();
