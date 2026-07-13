#!/usr/bin/env node
// inject-performance.js
// Inietta resource hints, font locali, CSS per pagina e registrazione SW

const { readFileSync, writeFileSync } = require('fs');
const { resolve, relative } = require('path');
const { getAllHTMLFiles } = require('./lib/fs-utils');
const { CSS_VERSION, JS_VERSION } = require('./lib/asset-version');

const PUBLIC_DIR = resolve(__dirname, '../public');
const PERF_MARKER = '<!-- Performance: resource hints -->';
const APP_SCRIPT_VERSION = JS_VERSION;

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700&display=swap';

function getStylesheets(relativePath) {
  const sheets = ['site.min.css'];
  if (relativePath.startsWith('profili/')) {
    sheets.push('site-profiles.min.css');
  }
  if (relativePath === 'mappa-personale.html') {
    sheets.push('site-mappa.min.css');
  }
  if (
    relativePath.startsWith('approfondimenti/') ||
    relativePath === 'approfondimenti.html' ||
    relativePath === 'stili-base.html'
  ) {
    sheets.push('site-wiki.min.css');
  }
  return sheets;
}

function buildPerfBlock({ cssPrefix, heroPreload, stylesheets }) {
  const lines = [PERF_MARKER];

  stylesheets.forEach((sheet, index) => {
    const href = `${cssPrefix}css/${sheet}?v=${CSS_VERSION}`;
    if (index === 0) {
      lines.push(`  <link rel="preload" href="${href}" as="style">`);
    }
    lines.push(`  <link rel="stylesheet" href="${href}">`);
  });

  if (heroPreload) {
    lines.push(
      '  <link rel="preload" href="/fonts/lato-400-latin.woff2" as="font" type="font/woff2" crossorigin>',
      '  <link rel="preload" href="/fonts/playfair-700-latin.woff2" as="font" type="font/woff2" crossorigin>',
      '  <link rel="preload" href="/images/index-hero-480.webp" as="image" type="image/webp" fetchpriority="high">'
    );
  } else {
    lines.push(
      '  <link rel="preload" href="/fonts/lato-400-latin.woff2" as="font" type="font/woff2" crossorigin>',
      '  <link rel="preload" href="/fonts/playfair-700-latin.woff2" as="font" type="font/woff2" crossorigin>'
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
    /\s*<!-- Performance: resource hints -->[\s\S]*?(?=\n\s*<\/head>|\n\s*<link rel="stylesheet"|\n\s*<body)/g,
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
    /\s*<link rel="preload" href="(\.\.\/|\/)*fonts\/[^"]+\.woff2"[^>]*>\n?/g,
    '\n'
  );
  result = result.replace(
    /\s*<link rel="preload" href="(\.\.\/)*css\/[^"]+\.css[^"]*" as="style">\n?/g,
    '\n'
  );
  result = result.replace(
    /\s*<link rel="preload" href="(\.\.\/|\/)*images\/index-hero[^"]*"[^>]*>\n?/g,
    '\n'
  );
  result = result.replace(/\s*<noscript>\s*<\/noscript>\n?/g, '\n');
  return result;
}

function removeLegacyStylesheets(html) {
  return html
    .replace(/\s*<link rel="stylesheet" href="(\.\.\/)*css\/main\.css">\n?/g, '\n')
    .replace(/\s*<link rel="stylesheet" href="(\.\.\/)*css\/themes\.css">\n?/g, '\n')
    .replace(
      /\s*<link rel="stylesheet" href="(\.\.\/)*css\/site(?:-profiles|-mappa|-wiki)?\.min\.css[^"]*">\n?/g,
      '\n'
    );
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

const GLOBAL_SCRIPT_FILES = [
  'constants.js',
  'theme.js',
  'mobile-menu.js',
  'breadcrumb-generator.js',
  'nav-highlight.js',
  'template-loader.js',
];

const DEFER_SCRIPT_FILES = ['cookie-banner.js'];

function removeFooterGtmScript(html) {
  return html.replace(
    /\s*<script src="(?:\.\.\/)*js\/gtm\.js(\?v=[^"]*)?"(?:\s+defer)?><\/script>\n?/g,
    '\n'
  );
}

function removeLegacyGlobalScripts(html) {
  let result = html;
  GLOBAL_SCRIPT_FILES.forEach((file) => {
    result = result.replace(
      new RegExp(`\\s*<script src="(?:\\.\\./)*js/${file}(\\?v=[^"]*)?"><\\/script>\\n?`, 'g'),
      '\n'
    );
  });
  return result.replace(/\n{3,}/g, '\n\n');
}

function ensureSiteScripts(html, cssPrefix) {
  let result = removeLegacyGlobalScripts(html);

  const bundleTag = `  <script src="${cssPrefix}js/site.min.js?v=${APP_SCRIPT_VERSION}" defer></script>\n`;
  if (!result.includes('js/site.min.js')) {
    const footerPlaceholder = result.indexOf('footer-placeholder');
    if (footerPlaceholder !== -1) {
      const insertAt = result.lastIndexOf('\n', footerPlaceholder);
      result = `${result.slice(0, insertAt + 1)}${bundleTag}${result.slice(insertAt + 1)}`;
    } else {
      result = result.replace('</body>', `${bundleTag}</body>`);
    }
  }

  DEFER_SCRIPT_FILES.forEach((file) => {
    if (result.includes(`js/${file}`)) {
      return;
    }
    const tag = `  <script src="${cssPrefix}js/${file}?v=${APP_SCRIPT_VERSION}" defer></script>\n`;
    const inserted = insertScriptAfter(result, 'js/site.min.js', tag);
    result = inserted || result.replace('</body>', `${tag}</body>`);
  });

  return result;
}

function ensureDeferOnGlobalScripts(html) {
  return html
    .replace(
      /(<script\s+src="(?:\.\.\/)*js\/site\.min\.js\?v=[^"]+")(?!\s+defer)(>)/g,
      '$1 defer$2'
    )
    .replace(
      /(<script\s+src="(?:\.\.\/)*js\/cookie-banner\.js\?v=[^"]+")(?!\s+defer)(>)/g,
      '$1 defer$2'
    );
}

function ensureScriptCacheBust(html) {
  return html.replace(
    /(<script\s+src="(?:\.\.\/)*js\/[^"?]+\.js)(\?v=[^"]*)?(")/g,
    `$1?v=${APP_SCRIPT_VERSION}$3`
  );
}

function ensureSwRegistration(html, cssPrefix) {
  const swPath = `${cssPrefix}js/pwa.js`;
  const tag = `<script src="${swPath}?v=${APP_SCRIPT_VERSION}" defer></script>`;

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
  const stylesheets = getStylesheets(relativePath);

  html = removePerfBlock(html);
  html = removeOrphanPerfHints(html);
  html = removeLegacyStylesheets(html);
  html = removeDeadMainScript(html);
  html = removeFooterGtmScript(html);
  html = removeLegacyGlobalScripts(html);
  html = ensureManifestLink(html);
  html = ensureSiteScripts(html, cssPrefix);
  html = ensureDeferOnGlobalScripts(html);
  html = ensureScriptCacheBust(html);
  html = ensureSwRegistration(html, cssPrefix);

  const headClose = html.indexOf('</head>');
  if (headClose === -1) {
    console.warn(`⚠️  Nessun </head> in ${relativePath}`);
    return false;
  }

  const perfBlock = buildPerfBlock({ cssPrefix, heroPreload, stylesheets });
  html = `${html.slice(0, headClose)}${perfBlock}${html.slice(headClose)}`;

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
