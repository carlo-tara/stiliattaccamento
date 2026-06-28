#!/usr/bin/env node
// optimize-images.js — genera varianti WebP responsive per la homepage

const { resolve } = require('path');
const { existsSync } = require('fs');

const PUBLIC_DIR = resolve(__dirname, '../public');
const IMAGES = [
  { input: 'images/index-hero.webp', output: 'images/index-hero-480.webp', width: 480 },
  { input: 'images/index-hero.webp', output: 'images/index-hero-700.webp', width: 700 },
  { input: 'images/index-pilastri.webp', output: 'images/index-pilastri-665.webp', width: 665 },
];

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('❌ sharp non installato. Esegui: npm install --save-dev sharp');
    process.exit(1);
  }

  for (const { input, output, width } of IMAGES) {
    const inputPath = resolve(PUBLIC_DIR, input);
    const outputPath = resolve(PUBLIC_DIR, output);

    if (!existsSync(inputPath)) {
      console.warn(`⚠️  Saltato ${input}: file non trovato`);
      continue;
    }

    await sharp(inputPath).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(outputPath);

    const inStat = require('fs').statSync(inputPath);
    const outStat = require('fs').statSync(outputPath);
    console.log(
      `✅ ${output} (${width}px) — ${(outStat.size / 1024).toFixed(1)} KiB (da ${(inStat.size / 1024).toFixed(1)} KiB)`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
