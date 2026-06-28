#!/usr/bin/env node
// generate-sitemap.js
// Genera public/sitemap.xml da tutte le pagine HTML pubbliche

const { writeFileSync, statSync } = require('fs');
const { join, resolve, relative } = require('path');
const { getAllHTMLFiles } = require('./lib/fs-utils');
const { toIsoDate } = require('./lib/seo-utils');
const {
  SITE_URL,
  SITEMAP_PRIORITY,
  PROFILE_PRIORITY,
  SUBSECTION_PRIORITY,
} = require('./seo-config');

const PUBLIC_DIR = resolve(__dirname, '../public');
const OUTPUTS = [
  join(PUBLIC_DIR, 'sitemap.xml'),
  join(PUBLIC_DIR, 'com-sitemap.xml'),
];

function getPriority(relativePath) {
  if (SITEMAP_PRIORITY[relativePath]) {
    return SITEMAP_PRIORITY[relativePath];
  }
  if (relativePath.startsWith('profili/')) {
    return PROFILE_PRIORITY;
  }
  if (
    relativePath.startsWith('approfondimenti/') ||
    relativePath.startsWith('libri/') ||
    relativePath.startsWith('storie-reali/')
  ) {
    return SUBSECTION_PRIORITY;
  }
  return 0.6;
}

function getChangefreq(relativePath) {
  if (
    relativePath === 'privacy-policy.html' ||
    relativePath === 'cookie-policy.html' ||
    relativePath === 'termini-condizioni.html'
  ) {
    return 'yearly';
  }
  if (relativePath === 'test.html' || relativePath === 'index.html') {
    return 'weekly';
  }
  if (relativePath.startsWith('profili/') || relativePath.startsWith('storie-reali/')) {
    return 'monthly';
  }
  return 'monthly';
}

function toLoc(relativePath) {
  if (relativePath === 'index.html') {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}/${relativePath}`;
}

function generateSitemap() {
  const files = getAllHTMLFiles(PUBLIC_DIR).sort();

  const urls = files.map((filePath) => {
    const relativePath = relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
    const lastmod = toIsoDate(statSync(filePath).mtime);
    return `  <url>
    <loc>${toLoc(relativePath)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${getChangefreq(relativePath)}</changefreq>
    <priority>${getPriority(relativePath).toFixed(2)}</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  for (const output of OUTPUTS) {
    writeFileSync(output, xml, 'utf-8');
    console.log(`✅ Sitemap generata: ${output} (${files.length} URL)`);
  }
}

generateSitemap();
