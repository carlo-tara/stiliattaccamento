#!/usr/bin/env node
// minify-static.js — minifica HTML, template e asset statici testuali (ultimo step di npm run perf)

const { readFileSync, writeFileSync, readdirSync, statSync, existsSync } = require('fs');
const { resolve, join, extname } = require('path');
const { minify } = require('html-minifier-terser');
const { getAllHTMLFiles } = require('./lib/fs-utils');
const { HTML_MINIFY_OPTIONS } = require('./lib/minify-options');

const PUBLIC_DIR = resolve(__dirname, '../public');
const TEMPLATES_DIR = join(PUBLIC_DIR, 'templates');

const JSON_FILES = [
  'manifest.json',
  'js/test-survey.json',
];

const XML_FILES = ['sitemap.xml'];

/**
 * @param {string} dir
 * @returns {string[]}
 */
function getTemplateHtmlFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir)
    .filter((name) => extname(name) === '.html')
    .map((name) => join(dir, name));
}

/**
 * @param {string} filePath
 * @returns {Promise<{ before: number, after: number }>}
 */
async function minifyHtmlFile(filePath) {
  const original = readFileSync(filePath, 'utf-8');
  const minified = await minify(original, HTML_MINIFY_OPTIONS);
  const after = Buffer.byteLength(minified, 'utf-8');
  const before = Buffer.byteLength(original, 'utf-8');

  if (minified !== original) {
    writeFileSync(filePath, minified, 'utf-8');
  }

  return { before, after };
}

/**
 * @param {string} filePath
 * @returns {{ before: number, after: number }}
 */
function minifyJsonFile(filePath) {
  const original = readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(original);
  const minified = `${JSON.stringify(parsed)}\n`;
  const before = Buffer.byteLength(original, 'utf-8');
  const after = Buffer.byteLength(minified, 'utf-8');

  if (minified !== original) {
    writeFileSync(filePath, minified, 'utf-8');
  }

  return { before, after };
}

/**
 * @param {string} filePath
 * @returns {{ before: number, after: number }}
 */
function minifyXmlFile(filePath) {
  const original = readFileSync(filePath, 'utf-8');
  const minified = `${original.replace(/\r\n/g, '\n').replace(/>\s+</g, '><').trim()}\n`;
  const before = Buffer.byteLength(original, 'utf-8');
  const after = Buffer.byteLength(minified, 'utf-8');

  if (minified !== original) {
    writeFileSync(filePath, minified, 'utf-8');
  }

  return { before, after };
}

/**
 * @param {{ before: number, after: number }} acc
 * @param {{ before: number, after: number }} item
 */
function accumulateBytes(acc, item) {
  acc.before += item.before;
  acc.after += item.after;
  return acc;
}

async function main() {
  const htmlFiles = getAllHTMLFiles(PUBLIC_DIR);
  const templateFiles = getTemplateHtmlFiles(TEMPLATES_DIR);
  const allHtml = [...htmlFiles, ...templateFiles];

  let htmlStats = { before: 0, after: 0, count: 0 };
  for (const filePath of allHtml) {
    const stats = await minifyHtmlFile(filePath);
    accumulateBytes(htmlStats, stats);
    htmlStats.count += 1;
  }

  let jsonStats = { before: 0, after: 0, count: 0 };
  JSON_FILES.forEach((relPath) => {
    const filePath = join(PUBLIC_DIR, relPath);
    if (!existsSync(filePath)) {
      return;
    }
    accumulateBytes(jsonStats, minifyJsonFile(filePath));
    jsonStats.count += 1;
  });

  let xmlStats = { before: 0, after: 0, count: 0 };
  XML_FILES.forEach((relPath) => {
    const filePath = join(PUBLIC_DIR, relPath);
    if (!existsSync(filePath)) {
      return;
    }
    accumulateBytes(xmlStats, minifyXmlFile(filePath));
    xmlStats.count += 1;
  });

  const totalBefore = htmlStats.before + jsonStats.before + xmlStats.before;
  const totalAfter = htmlStats.after + jsonStats.after + xmlStats.after;
  const savedKb = ((totalBefore - totalAfter) / 1024).toFixed(1);
  const pct = totalBefore > 0 ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1) : '0';

  console.log(`✅ HTML minificati: ${htmlStats.count} file (${(htmlStats.before / 1024).toFixed(1)} → ${(htmlStats.after / 1024).toFixed(1)} KiB)`);
  if (jsonStats.count) {
    console.log(`✅ JSON compattati: ${jsonStats.count} file (${(jsonStats.before / 1024).toFixed(1)} → ${(jsonStats.after / 1024).toFixed(1)} KiB)`);
  }
  if (xmlStats.count) {
    console.log(`✅ XML compattati: ${xmlStats.count} file (${(xmlStats.before / 1024).toFixed(1)} → ${(xmlStats.after / 1024).toFixed(1)} KiB)`);
  }
  console.log(`   Risparmio totale: ${savedKb} KiB (−${pct}%)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
