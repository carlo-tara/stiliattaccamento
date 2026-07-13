#!/usr/bin/env node
// inject-shell.js — inlines header e topbar nel markup HTML (zero CLS da fetch async)

const { readFileSync, writeFileSync } = require('fs');
const { resolve, relative } = require('path');
const { JSDOM } = require('jsdom');
const { getAllHTMLFiles } = require('./lib/fs-utils');

const PUBLIC_DIR = resolve(__dirname, '../public');
const TEMPLATES_DIR = resolve(PUBLIC_DIR, 'templates');

const MARKER_HEADER_START = '<!-- Site shell: header (auto-injected) -->';
const MARKER_HEADER_END = '<!-- /Site shell: header -->';
const MARKER_TOPBAR_START = '<!-- Site shell: topbar (auto-injected) -->';
const MARKER_TOPBAR_END = '<!-- /Site shell: topbar -->';

function getDepth(relativePath) {
  return relativePath.split('/').length - 1;
}

function adjustTemplatePaths(root, depth) {
  if (depth === 0) {
    return;
  }

  const prefix = '../'.repeat(depth);
  root.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('http') &&
      !href.startsWith('#') &&
      !href.startsWith('../') &&
      !href.startsWith('/')
    ) {
      link.setAttribute('href', prefix + href);
    }
  });

  const logo = root.querySelector('.logo a[href]');
  if (logo) {
    const logoHref = logo.getAttribute('href');
    if (
      logoHref &&
      !logoHref.startsWith('http') &&
      !logoHref.startsWith('#') &&
      !logoHref.startsWith('../') &&
      logoHref !== '/'
    ) {
      logo.setAttribute('href', prefix + logoHref);
    }
  }
}

function prepareTemplate(templateHtml, selector, depth) {
  const dom = new JSDOM(`<body>${templateHtml.trim()}</body>`);
  const element = dom.window.document.querySelector(selector);
  if (!element) {
    throw new Error(`Selector "${selector}" not found in template`);
  }
  adjustTemplatePaths(element, depth);
  return element.outerHTML;
}

function removeExistingShell(html) {
  return html
    .replace(
      /<!-- Site shell: header \(auto-injected\) -->[\s\S]*?<!-- \/Site shell: header -->\n?/g,
      ''
    )
    .replace(
      /<!-- Site shell: topbar \(auto-injected\) -->[\s\S]*?<!-- \/Site shell: topbar -->\n?/g,
      ''
    )
    .replace(
      /\s*<!-- Placeholder per header -->[\s\S]*?<div id="header-placeholder"><\/div>\n?/g,
      '\n'
    )
    .replace(
      /\s*<!-- Placeholder per topbar \(breadcrumb\) -->[\s\S]*?<div id="topbar-placeholder"><\/div>\n?/g,
      '\n'
    )
    .replace(/\s*<div id="header-placeholder"><\/div>\n?/g, '\n')
    .replace(/\s*<div id="topbar-placeholder"><\/div>\n?/g, '\n');
}

function findInsertPoint(html) {
  const skipMatch = html.match(
    /<a href="#main-content" class="skip-link">[\s\S]*?<\/a>/
  );
  if (skipMatch) {
    return skipMatch.index + skipMatch[0].length;
  }

  const bodyMatch = html.match(/<body[^>]*>/);
  if (bodyMatch) {
    return bodyMatch.index + bodyMatch[0].length;
  }

  return -1;
}

function buildShellBlock(headerHtml, topbarHtml) {
  return [
    '  ' + MARKER_HEADER_START,
    '  ' + headerHtml,
    '  ' + MARKER_HEADER_END,
    '',
    '  ' + MARKER_TOPBAR_START,
    '  ' + topbarHtml,
    '  ' + MARKER_TOPBAR_END,
    '',
  ].join('\n');
}

function replaceOrInsertShell(html, shellBlock) {
  const shellPattern =
    /<!-- Site shell: header \(auto-injected\) -->[\s\S]*?<!-- \/Site shell: topbar -->/;
  if (shellPattern.test(html)) {
    return html.replace(shellPattern, shellBlock.trim());
  }

  const cleaned = removeExistingShell(html);
  const insertAt = findInsertPoint(cleaned);
  if (insertAt === -1) {
    return null;
  }
  return `${cleaned.slice(0, insertAt)}${shellBlock}${cleaned.slice(insertAt)}`;
}

function injectShell(filePath, headerTemplate, topbarTemplate) {
  const relativePath = relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  const original = readFileSync(filePath, 'utf-8');
  const depth = getDepth(relativePath);

  const headerHtml = prepareTemplate(headerTemplate, 'header', depth);
  const topbarHtml = prepareTemplate(topbarTemplate, '.topbar', depth);
  const shellBlock = buildShellBlock(headerHtml, topbarHtml);

  const html = replaceOrInsertShell(original, shellBlock);
  if (html === null) {
    console.warn(`⚠️  Punto di inserimento non trovato in ${relativePath}`);
    return false;
  }

  if (html !== original) {
    writeFileSync(filePath, html, 'utf-8');
    return true;
  }
  return false;
}

function main() {
  const headerTemplate = readFileSync(resolve(TEMPLATES_DIR, 'header.html'), 'utf-8');
  const topbarTemplate = readFileSync(resolve(TEMPLATES_DIR, 'topbar.html'), 'utf-8');
  const files = getAllHTMLFiles(PUBLIC_DIR);
  let count = 0;

  files.forEach((file) => {
    if (injectShell(file, headerTemplate, topbarTemplate)) {
      count += 1;
    }
  });

  console.log(`✅ Header e topbar inlined in ${count}/${files.length} pagine`);
}

main();
