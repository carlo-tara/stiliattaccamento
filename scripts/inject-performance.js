#!/usr/bin/env node
// inject-performance.js
// Inietta resource hints, font non-bloccanti e registrazione SW in tutte le pagine HTML

const { readFileSync, writeFileSync } = require('fs');
const { resolve, relative } = require('path');
const { getAllHTMLFiles } = require('./lib/fs-utils');
const { findInsertPoint } = require('./inject-seo.js');

const PUBLIC_DIR = resolve(__dirname, '../public');
const PERF_MARKER = '<!-- Performance: resource hints -->';
const APP_SCRIPT_VERSION = '1.3.0';

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700&display=swap';

function buildPerfBlock({ cssPrefix, heroPreload }) {
  const lines = [
    PERF_MARKER,
    '  <link rel="preconnect" href="https://fonts.googleapis.com">',
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `  <link rel="stylesheet" href="${FONTS_URL}" media="print" onload="this.media='all'">`,
    `  <noscript><link rel="stylesheet" href="${FONTS_URL}"></noscript>`,
    `  <link rel="preload" href="${cssPrefix}css/main.css" as="style">`,
    `  <link rel="preload" href="${cssPrefix}css/themes.css" as="style">`,
  ];

  if (heroPreload) {
    lines.push(
      `  <link rel="preload" href="${cssPrefix}images/index-hero.webp" as="image" type="image/webp" fetchpriority="high">`
    );
  }

  return `  ${lines.join('\n  ')}\n`;
}

function getCssPrefix(relativePath) {
  const depth = relativePath.split('/').length - 1;
  return depth > 0 ? '../'.repeat(depth) : '';
}

function removePerfBlock(html) {
  return html.replace(
    /\s*<!-- Performance: resource hints -->[\s\S]*?(?=\n\s*<link rel="stylesheet")/g,
    '\n'
  );
}

function removeOrphanPerfHints(html) {
  let result = html;
  result = result.replace(
    /\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\n?/g,
    '\n'
  );
  result = result.replace(
    /\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\n?/g,
    '\n'
  );
  const fontsPattern = FONTS_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  result = result.replace(
    new RegExp(`\\s*<link rel="stylesheet" href="${fontsPattern}"[^>]*>\\n?`, 'g'),
    '\n'
  );
  result = result.replace(
    new RegExp(
      `\\s*<noscript><link rel="stylesheet" href="${fontsPattern}"><\\/noscript>\\n?`,
      'g'
    ),
    '\n'
  );
  result = result.replace(
    /\s*<link rel="preload" href="(\.\.\/)*css\/main\.css" as="style">\n?/g,
    '\n'
  );
  result = result.replace(
    /\s*<link rel="preload" href="(\.\.\/)*css\/themes\.css" as="style">\n?/g,
    '\n'
  );
  result = result.replace(
    /\s*<link rel="preload" href="(\.\.\/)*images\/index-hero\.webp"[^>]*>\n?/g,
    '\n'
  );
  result = result.replace(/\s*<noscript>\s*<\/noscript>\n?/g, '\n');
  return result;
}

function removeDeadMainScript(html) {
  return html
    .replace(/\s*<script src="(\.\.\/)*js\/main\.js"><\/script>\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
}

function insertScriptAfter(html, afterFile, newScriptTag) {
  const idx = html.indexOf(afterFile);
  if (idx === -1) {
    return null;
  }
  const endTag = html.indexOf('</script>', idx);
  if (endTag === -1) {
    return null;
  }
  return `${html.slice(0, endTag + 9)}\n${newScriptTag}${html.slice(endTag + 9)}`;
}

function ensureSiteScripts(html, cssPrefix) {
  const scripts = [
    { file: 'mobile-menu.js', after: ['theme.js', 'breadcrumb-generator.js'] },
    { file: 'nav-highlight.js', after: ['mobile-menu.js', 'theme.js', 'breadcrumb-generator.js'] },
    { file: 'cookie-banner.js', after: ['nav-highlight.js', 'mobile-menu.js', 'theme.js'] },
    { file: 'gtm.js', after: ['cookie-banner.js'] },
  ];

  let result = html;
  scripts.forEach(({ file, after }) => {
    if (result.includes(`js/${file}`)) {
      return;
    }
    const tag = `  <script src="${cssPrefix}js/${file}"></script>\n`;
    let inserted = null;
    for (const anchor of after) {
      inserted = insertScriptAfter(result, `js/${anchor}`, tag);
      if (inserted) {
        break;
      }
    }
    result = inserted || result.replace('</body>', `${tag}</body>`);
  });
  return result;
}

function ensureScriptCacheBust(html) {
  return html.replace(
    /(<script\s+src="(?:\.\.\/)*js\/[^"?]+\.js)(\?v=[^"]*)?(")/g,
    `$1?v=${APP_SCRIPT_VERSION}$3`
  );
}

function ensureSwRegistration(html, cssPrefix) {
  const swPath = `${cssPrefix}js/pwa.js`;
  const tag = `<script src="${swPath}" defer></script>`;

  if (html.includes('js/pwa.js')) {
    return html;
  }

  const cookieBanner = html.lastIndexOf('js/cookie-banner.js');
  if (cookieBanner !== -1) {
    const endTag = html.indexOf('</script>', cookieBanner);
    if (endTag !== -1) {
      return `${html.slice(0, endTag + 9)}\n  ${tag}${html.slice(endTag + 9)}`;
    }
  }

  return html.replace('</body>', `  ${tag}\n</body>`);
}

function ensureManifestLink(html) {
  if (html.includes('rel="manifest"')) {
    return html;
  }
  const tag = '  <link rel="manifest" href="/manifest.json">\n';
  const seoIdx = html.indexOf('<!-- SEO:');
  if (seoIdx !== -1) {
    return `${html.slice(0, seoIdx)}${tag}${html.slice(seoIdx)}`;
  }
  const perfIdx = html.indexOf(PERF_MARKER);
  if (perfIdx !== -1) {
    return `${html.slice(0, perfIdx)}${tag}${html.slice(perfIdx)}`;
  }
  const insertPoint = html.indexOf('<link rel="stylesheet"');
  if (insertPoint === -1) {
    return html;
  }
  return `${html.slice(0, insertPoint)}${tag}${html.slice(insertPoint)}`;
}

function injectPerformance(filePath) {
  const relativePath = relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  let html = readFileSync(filePath, 'utf-8');
  const original = html;
  const cssPrefix = getCssPrefix(relativePath);
  const heroPreload = relativePath === 'index.html';

  html = removePerfBlock(html);
  html = removeOrphanPerfHints(html);
  html = removeDeadMainScript(html);
  html = ensureManifestLink(html);
  html = ensureSiteScripts(html, cssPrefix);
  html = ensureScriptCacheBust(html);
  html = ensureSwRegistration(html, cssPrefix);

  const insertPoint = findInsertPoint(html);
  if (insertPoint === -1) {
    console.warn(`⚠️  Nessun stylesheet in ${relativePath}`);
    return false;
  }
  const perfBlock = buildPerfBlock({ cssPrefix, heroPreload });
  html = `${html.slice(0, insertPoint)}${perfBlock}\n  ${html.slice(insertPoint)}`;

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
    if (injectPerformance(file)) {
      count += 1;
    }
  });

  console.log(`✅ Performance hints iniettati in ${count}/${files.length} pagine`);
}

main();
