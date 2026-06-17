#!/usr/bin/env node
// inject-seo.js
// Inietta/aggiorna canonical, Open Graph e Twitter Card in tutte le pagine HTML

const { readFileSync, writeFileSync, statSync } = require('fs');
const { resolve, relative } = require('path');
const { JSDOM } = require('jsdom');
const { getAllHTMLFiles } = require('./lib/fs-utils');
const { sanitizeMetaText, toIsoDate } = require('./lib/seo-utils');
const {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_WIDTH,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_LOCALE,
} = require('./seo-config');

const { getMetaKeywords } = require('./lib/meta-keywords');

const PUBLIC_DIR = resolve(__dirname, '../public');

function toCanonicalUrl(relativePath) {
  if (relativePath === 'index.html') {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}/${relativePath}`;
}

function escapeAttr(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function getOgType(document) {
  const ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of ldScripts) {
    try {
      const data = JSON.parse(script.textContent);
      if (data['@type'] === 'Article' || data['@type'] === 'Quiz') {
        return 'article';
      }
    } catch {
      // ignore invalid JSON-LD
    }
  }
  return 'website';
}

function getPageImage(document, relativePath) {
  const img =
    document.querySelector('.wiki-image__img') ||
    document.querySelector('.profile-image') ||
    document.querySelector('main img[src]');

  if (!img) {
    return { url: DEFAULT_OG_IMAGE, alt: DEFAULT_OG_IMAGE_ALT };
  }

  const src = img.getAttribute('src');
  const alt = img.getAttribute('alt')?.trim() || DEFAULT_OG_IMAGE_ALT;

  if (!src) {
    return { url: DEFAULT_OG_IMAGE, alt: DEFAULT_OG_IMAGE_ALT };
  }

  if (src.startsWith('http')) {
    return { url: src, alt };
  }

  if (src.startsWith('../')) {
    const parts = relativePath.split('/');
    parts.pop();
    const resolved = [];
    for (const segment of [...parts, ...src.split('/')]) {
      if (segment === '..') {
        resolved.pop();
      } else if (segment && segment !== '.') {
        resolved.push(segment);
      }
    }
    return { url: `${SITE_URL}/${resolved.join('/')}`, alt };
  }

  const base = relativePath.includes('/')
    ? relativePath.split('/').slice(0, -1).join('/')
    : '';
  const url = base
    ? `${SITE_URL}/${base}/${src.replace(/^\.\//, '')}`
    : `${SITE_URL}/${src.replace(/^\.\//, '')}`;

  return { url, alt };
}

function buildSeoBlock({ title, description, canonical, ogType, image, imageAlt, modifiedTime, keywords }) {
  const safeTitle = sanitizeMetaText(title, 70);
  const safeDesc = sanitizeMetaText(description, 160);
  const escapedTitle = escapeAttr(safeTitle);
  const escapedDesc = escapeAttr(safeDesc);
  const escapedAlt = escapeAttr(imageAlt);
  const escapedKeywords = escapeAttr(keywords || '');
  const articleModified =
    ogType === 'article' && modifiedTime
      ? `\n  <meta property="article:modified_time" content="${modifiedTime}">`
      : '';

  return `  <!-- SEO: canonical, Open Graph, Twitter Card -->
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="it" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">
  <meta name="keywords" content="${escapedKeywords}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#3c6e55">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:locale" content="${DEFAULT_LOCALE}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${escapedTitle}">
  <meta property="og:description" content="${escapedDesc}">
  <meta property="og:url" content="${canonical}">${articleModified}
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:type" content="image/webp">
  <meta property="og:image:width" content="${DEFAULT_OG_IMAGE_WIDTH}">
  <meta property="og:image:height" content="${DEFAULT_OG_IMAGE_HEIGHT}">
  <meta property="og:image:alt" content="${escapedAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapedTitle}">
  <meta name="twitter:description" content="${escapedDesc}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${escapedAlt}">`;
}

function stripAllSeoTags(html) {
  let result = html;

  result = result.replace(/\s*<meta name="keywords" content="[^"]*">\n?/g, '\n');

  // Blocchi con commento marker (formato nuovo e precedente)
  result = result.replace(
    /\s*<!-- SEO: canonical, Open Graph, Twitter Card -->[\s\S]*?<meta name="twitter:image:alt"[^>]*>\n?/g,
    '\n'
  );
  result = result.replace(
    /\s*<!-- SEO: canonical, Open Graph, Twitter Card -->[\s\S]*?<meta name="twitter:image"[^>]*>\n?/g,
    '\n'
  );

  // Blocchi legacy senza commento (canonical → twitter:image)
  result = result.replace(
    /\s*<link rel="canonical" href="[^"]*">\n(?:\s*<(?:link|meta)[^>]*>\n)*\s*<meta name="twitter:image"[^>]*>\n?/g,
    '\n'
  );

  return result;
}

function removeExistingSeoBlock(html) {
  return stripAllSeoTags(html);
}

function findInsertPoint(html) {
  const markers = [
    '<!-- Performance: resource hints -->',
    '<link rel="stylesheet" href="../../css/main.css"',
    '<link rel="stylesheet" href="../css/main.css"',
    '<link rel="stylesheet" href="css/main.css"',
    '<link rel="stylesheet"',
  ];

  for (const marker of markers) {
    const idx = html.indexOf(marker);
    if (idx !== -1) {
      return idx;
    }
  }
  return -1;
}

function syncMetaDescription(html, safeDesc) {
  if (!safeDesc) {
    return html;
  }
  const escaped = escapeAttr(safeDesc);
  if (html.includes('name="description"')) {
    return html.replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${escaped}">`
    );
  }
  return html.replace(
    /<meta name="viewport"[^>]*>/,
    (match) => `${match}\n  <meta name="description" content="${escaped}">`
  );
}

function syncTitle(html, safeTitle) {
  if (!safeTitle) {
    return html;
  }
  const escaped = escapeAttr(safeTitle);
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${escaped}</title>`);
}

function injectSeo(filePath) {
  const relativePath = relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  let html = readFileSync(filePath, 'utf-8');
  const original = html;
  html = removeExistingSeoBlock(html);

  const dom = new JSDOM(html);
  const { document } = dom.window;

  const title = document.querySelector('title')?.textContent?.trim() || SITE_NAME;
  const rawDescription =
    document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ||
    'Wiki sugli stili di attaccamento: consapevolezza, non guarigione.';
  const safeTitle = sanitizeMetaText(title, 70);
  const safeDesc = sanitizeMetaText(rawDescription, 160);
  const canonical = toCanonicalUrl(relativePath);
  const ogType = getOgType(document);
  const { url: image, alt: imageAlt } = getPageImage(document, relativePath);
  const modifiedTime = toIsoDate(statSync(filePath).mtime);
  const keywords = getMetaKeywords(relativePath);

  html = syncTitle(html, safeTitle);
  html = syncMetaDescription(html, safeDesc);

  const seoBlock = buildSeoBlock({
    title,
    description: rawDescription,
    canonical,
    ogType,
    image,
    imageAlt,
    modifiedTime,
    keywords,
  });

  const insertPoint = findInsertPoint(html);
  if (insertPoint === -1) {
    console.warn(`⚠️  Nessun punto di inserimento in ${relativePath}`);
    return false;
  }

  html = `${html.slice(0, insertPoint)}${seoBlock}\n  \n  ${html.slice(insertPoint)}`;

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
    if (injectSeo(file)) {
      count += 1;
    }
  });

  console.log(`✅ SEO meta aggiornati in ${count}/${files.length} pagine`);
}

module.exports = {
  escapeAttr,
  sanitizeMetaText,
  stripAllSeoTags,
  findInsertPoint,
  buildSeoBlock,
  injectSeo,
};

if (require.main === module) {
  main();
}
