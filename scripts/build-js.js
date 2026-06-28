#!/usr/bin/env node
// build-js.js — concatena e minifica gli script globali del sito

const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const JS_DIR = resolve(__dirname, '../public/js');
const JS_VERSION = '1.3.0';

/** Ordine di esecuzione: dipendenze prima di template-loader */
const SOURCE_FILES = [
  'constants.js',
  'theme.js',
  'mobile-menu.js',
  'breadcrumb-generator.js',
  'nav-highlight.js',
  'template-loader.js',
];

async function buildJs() {
  const combined = SOURCE_FILES.map((file) => {
    const path = resolve(JS_DIR, file);
    return `/* === ${file} === */\n${readFileSync(path, 'utf-8')}`;
  }).join('\n');

  let minified = combined.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n{3,}/g, '\n').trim();

  try {
    const { minify } = require('terser');
    const result = await minify(combined, {
      compress: { passes: 2, drop_console: true },
      mangle: true,
      format: { comments: false },
    });
    if (result.code) {
      minified = result.code;
    }
  } catch (error) {
    console.warn('⚠️  Terser non disponibile, bundle non minificato:', error.message);
  }

  writeFileSync(resolve(JS_DIR, 'site.min.js'), minified, 'utf-8');

  const rawKb = (Buffer.byteLength(combined) / 1024).toFixed(1);
  const minKb = (Buffer.byteLength(minified) / 1024).toFixed(1);
  console.log(`✅ site.min.js generato (v${JS_VERSION})`);
  console.log(`   Sorgenti: ${SOURCE_FILES.join(', ')}`);
  console.log(`   Dimensione: ${rawKb} KiB → ${minKb} KiB minificato`);
}

buildJs().catch((error) => {
  console.error(error);
  process.exit(1);
});
