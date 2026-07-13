#!/usr/bin/env node
// inject-wiki-tabs.js — abilita schede wiki su pagine lunghe

const { readFileSync, writeFileSync } = require('fs');
const { resolve, relative } = require('path');
const { getAllHTMLFiles } = require('./lib/fs-utils');
const { JS_VERSION } = require('./lib/asset-version');

const PUBLIC_DIR = resolve(__dirname, '../public');
const CONFIG_PATH = resolve(__dirname, 'wiki-tabs-config.json');
const SCRIPT_MARKER = 'js/modules/wiki-tabs.js';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function removeWikiTabsScript(html, cssPrefix) {
  const pattern = new RegExp(
    `\\s*<script src="${escapeRegExp(cssPrefix)}js/modules/wiki-tabs\\.js\\?v=[^"]+"(?: defer)?><\\/script>\\n?`,
    'g'
  );
  return html.replace(pattern, '\n');
}

function removeWikiTabsAttrs(html) {
  return html
    .replace(/\s*data-wiki-tabs-section="[^"]*"/g, '')
    .replace(/\s*data-wiki-tabs-min="[^"]*"/g, '')
    .replace(/\s*data-wiki-tabs-pin-start="[^"]*"/g, '')
    .replace(/\s*data-wiki-tabs-pin-end="[^"]*"/g, '')
    .replace(/\s*data-wiki-tabs(?:="[^"]*")?/g, '');
}

function buildAttrs(pageConfig, defaults, config) {
  const profileDefaults = config.profileDefaults || {};
  const approfondimentiDefaults = config.approfondimentiDefaults || {};
  const merged = { ...defaults };

  if (pageConfig.useProfileDefaults) {
    Object.assign(merged, profileDefaults);
  }
  if (pageConfig.useApprofondimentiDefaults) {
    Object.assign(merged, approfondimentiDefaults);
  }

  const attrs = ['data-wiki-tabs'];
  const section = pageConfig.sectionSelector || merged.sectionSelector;
  const min = pageConfig.minSections ?? merged.minSections;
  const pinStart = pageConfig.pinStart ?? merged.pinStart;
  const pinEnd = pageConfig.pinEnd ?? merged.pinEnd;

  attrs.push(`data-wiki-tabs-section="${section}"`);
  attrs.push(`data-wiki-tabs-min="${min}"`);
  if (pinStart) {
    attrs.push(`data-wiki-tabs-pin-start="${pinStart}"`);
  }
  if (pinEnd) {
    attrs.push(`data-wiki-tabs-pin-end="${pinEnd}"`);
  }
  return attrs.join(' ');
}

function injectContainerAttrs(html, attrs) {
  const containerRegex = /(<main[\s\S]*?<div class="container")([^>]*>)/;
  const match = html.match(containerRegex);
  if (!match) {
    return null;
  }

  return html.replace(containerRegex, `$1 ${attrs}$2`);
}

function injectScript(html, cssPrefix, scriptVersion) {
  let result = removeWikiTabsScript(html, cssPrefix);
  const tag = `  <script src="${cssPrefix}js/modules/wiki-tabs.js?v=${scriptVersion}" defer></script>\n`;
  if (result.includes(SCRIPT_MARKER)) {
    return result;
  }
  const pwaIdx = result.lastIndexOf(`${cssPrefix}js/pwa.js`);
  if (pwaIdx !== -1) {
    const insertAt = result.lastIndexOf('\n', pwaIdx);
    return `${result.slice(0, insertAt + 1)}${tag}${result.slice(insertAt + 1)}`;
  }
  return result.replace('</body>', `${tag}</body>`);
}

function main() {
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
  const pageMap = new Map(config.pages.map((page) => [page.file, page]));
  let updated = 0;

  getAllHTMLFiles(PUBLIC_DIR).forEach((filePath) => {
    const rel = relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
    const pageConfig = pageMap.get(rel);
    if (!pageConfig) {
      return;
    }

    const cssPrefix = rel.includes('/') ? '../'.repeat(rel.split('/').length - 1) : '';
    let html = readFileSync(filePath, 'utf-8');
    const original = html;

    html = removeWikiTabsAttrs(html);
    const attrs = buildAttrs(pageConfig, config.defaults, config);
    const withAttrs = injectContainerAttrs(html, attrs);
    if (!withAttrs) {
      console.warn(`⚠️  Container non trovato in ${rel}`);
      return;
    }
    html = withAttrs;
    html = injectScript(html, cssPrefix, config.scriptVersion || JS_VERSION);

    if (html !== original) {
      writeFileSync(filePath, html, 'utf-8');
      updated += 1;
    }
  });

  console.log(`✅ Wiki tabs abilitati su ${updated}/${config.pages.length} pagine configurate`);
}

main();
