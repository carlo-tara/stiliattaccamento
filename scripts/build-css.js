#!/usr/bin/env node
// build-css.js — concatena e minifica CSS per produzione

const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const CSS_DIR = resolve(__dirname, '../public/css');
const CSS_VERSION = '1.3.1';

const SOURCE_FILES = ['themes.css', 'fonts.css', 'main.css'];

function buildCss() {
  const combined = SOURCE_FILES.map((file) => {
    const path = resolve(CSS_DIR, file);
    return `/* === ${file} === */\n${readFileSync(path, 'utf-8')}`;
  }).join('\n');

  writeFileSync(resolve(CSS_DIR, 'site.css'), combined, 'utf-8');

  let minified = combined;
  try {
    const CleanCSS = require('clean-css');
    minified = new CleanCSS({ level: 1 }).minify(combined).styles;
  } catch {
    minified = combined.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
  }

  writeFileSync(resolve(CSS_DIR, 'site.min.css'), minified, 'utf-8');

  console.log(`✅ site.css e site.min.css generati (v${CSS_VERSION})`);
  console.log(`   Sorgenti: ${SOURCE_FILES.join(', ')}`);
  console.log(`   Dimensione minificata: ${(Buffer.byteLength(minified) / 1024).toFixed(1)} KiB`);
}

buildCss();
