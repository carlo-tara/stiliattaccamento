#!/usr/bin/env node
// build-css.js — concatena e minifica CSS per produzione (core + bundle per pagina)

const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const CSS_DIR = resolve(__dirname, '../public/css');
const { CSS_VERSION } = require('./lib/asset-version');

const CORE_SOURCE_FILES = ['themes.css', 'fonts.css', 'main.css'];

const PAGE_BUNDLES = [
  { output: 'site-profiles.min.css', sources: ['pages-profiles.css'] },
  { output: 'site-mappa.min.css', sources: ['pages-mappa.css'] },
  { output: 'site-wiki.min.css', sources: ['pages-wiki.css'] },
];

function minifyCss(combined) {
  try {
    const CleanCSS = require('clean-css');
    return new CleanCSS({ level: 1 }).minify(combined).styles;
  } catch {
    return combined.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
  }
}

function buildBundle(outputName, sourceFiles) {
  const combined = sourceFiles
    .map((file) => {
      const path = resolve(CSS_DIR, file);
      return `/* === ${file} === */\n${readFileSync(path, 'utf-8')}`;
    })
    .join('\n');

  const unminifiedName = outputName.replace('.min.css', '.css');
  writeFileSync(resolve(CSS_DIR, unminifiedName), combined, 'utf-8');
  writeFileSync(resolve(CSS_DIR, outputName), minifyCss(combined), 'utf-8');

  return Buffer.byteLength(minifyCss(combined));
}

function buildCss() {
  const coreCombined = CORE_SOURCE_FILES.map((file) => {
    const path = resolve(CSS_DIR, file);
    return `/* === ${file} === */\n${readFileSync(path, 'utf-8')}`;
  }).join('\n');

  writeFileSync(resolve(CSS_DIR, 'site.css'), coreCombined, 'utf-8');
  const coreMin = minifyCss(coreCombined);
  writeFileSync(resolve(CSS_DIR, 'site.min.css'), coreMin, 'utf-8');

  console.log(`✅ site.min.css (core) v${CSS_VERSION} — ${(Buffer.byteLength(coreMin) / 1024).toFixed(1)} KiB`);

  PAGE_BUNDLES.forEach(({ output, sources }) => {
    const size = buildBundle(output, sources);
    console.log(`✅ ${output} — ${(size / 1024).toFixed(1)} KiB`);
  });
}

buildCss();
