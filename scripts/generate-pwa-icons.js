#!/usr/bin/env node
// generate-pwa-icons.js
// Genera icone PWA 192x192 e 512x512 da un'immagine sorgente

const { execFileSync } = require('child_process');
const { existsSync, mkdirSync, writeFileSync, unlinkSync } = require('fs');
const { resolve } = require('path');
const { tmpdir } = require('os');

const ROOT = resolve(__dirname, '..');
const SOURCE = resolve(ROOT, 'public/images/index-hero.webp');
const OUT_DIR = resolve(ROOT, 'public/icons');
const SIZES = [192, 512];

const PYTHON_SCRIPT = `
from PIL import Image
import sys

source = sys.argv[1]
out_dir = sys.argv[2]
sizes = [int(s) for s in sys.argv[3:]]

img = Image.open(source).convert('RGBA')
width, height = img.size
side = min(width, height)
left = (width - side) // 2
top = (height - side) // 2
cropped = img.crop((left, top, left + side, top + side))

for size in sizes:
    icon = cropped.resize((size, size), Image.Resampling.LANCZOS)
    path = f"{out_dir}/icon-{size}.png"
    icon.save(path, format='PNG', optimize=True)
    print(f"OK {path}")
`;

function main() {
  if (!existsSync(SOURCE)) {
    console.error(`❌ Immagine sorgente non trovata: ${SOURCE}`);
    process.exit(1);
  }

  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  const tempScript = resolve(tmpdir(), `pwa-icons-${process.pid}.py`);
  writeFileSync(tempScript, PYTHON_SCRIPT.trim(), 'utf-8');

  try {
    execFileSync('python3', [tempScript, SOURCE, OUT_DIR, ...SIZES.map(String)], {
      stdio: 'inherit',
    });
    console.log('✅ Icone PWA generate in public/icons/');
  } catch (error) {
    console.error('❌ Generazione icone fallita. Installa Pillow: pip install Pillow');
    process.exit(1);
  } finally {
    if (existsSync(tempScript)) {
      unlinkSync(tempScript);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
