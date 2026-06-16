#!/usr/bin/env node
/**
 * Allinea gli approfondimenti tematici (tranne focusing e crescita):
 * titoli naturali, meta descrittive, HTML liste unificate, lessico coerente.
 */

const { readFileSync, writeFileSync } = require('fs');
const { join, resolve } = require('path');

const DIR = resolve(process.cwd(), 'public/approfondimenti');
const BASE = 'https://stiliattaccamento.it';

const PAGES = {
  'sessualita.html': {
    h1: 'Attaccamento e sessualità',
    title: 'Attaccamento e sessualità | Stili di Attaccamento',
    description:
      'Come gli stili di attaccamento si manifestano nell\'intimità: sessualità, vulnerabilità e fiducia per Secure, Ansioso, Evitante e Oscillante.',
    image: 'approfondimenti-sessualita.webp',
  },
  'famiglia.html': {
    h1: 'Attaccamento e famiglia adulta',
    title: 'Attaccamento e famiglia adulta | Stili di Attaccamento',
    description:
      'Relazioni con i genitori da adulti: pattern di attaccamento, dinamiche familiari e consapevolezza intergenerazionale.',
    image: 'approfondimenti-famiglia.webp',
  },
  'amicizie.html': {
    h1: 'Attaccamento e amicizie',
    title: 'Attaccamento e amicizie | Stili di Attaccamento',
    description:
      'Come gli stili di attaccamento si manifestano nelle amicizie: lealtà, reciprocità e dinamiche di gruppo.',
    image: 'approfondimenti-amicizie.webp',
  },
  'genitorialita.html': {
    h1: 'Attaccamento e genitorialità',
    title: 'Attaccamento e genitorialità | Stili di Attaccamento',
    description:
      'Attaccamento e genitorialità: come i propri pattern influenzano la relazione con i figli e la co-regolazione emotiva.',
    image: 'approfondimenti-genitorialita.webp',
  },
  'lavoro.html': {
    h1: 'Attaccamento e lavoro',
    title: 'Attaccamento e lavoro | Stili di Attaccamento',
    description:
      'Come lo stile di attaccamento si manifesta al lavoro: autonomia, bisogno di riconoscimento e dinamiche di team.',
    image: 'approfondimenti-lavoro.webp',
  },
  'finanze.html': {
    h1: 'Attaccamento e finanze',
    title: 'Attaccamento e finanze | Stili di Attaccamento',
    description:
      'Attaccamento e denaro: dipendenza, autonomia economica e pattern relazionali con le risorse materiali.',
    image: 'approfondimenti-finanze.webp',
  },
  'lutto.html': {
    h1: 'Attaccamento e lutto',
    title: 'Attaccamento e lutto | Stili di Attaccamento',
    description:
      'Come gli stili di attaccamento influenzano l\'elaborazione della perdita e il processo di lutto.',
    image: 'approfondimenti-lutto.webp',
  },
  'separazione.html': {
    h1: 'Attaccamento e separazione',
    title: 'Attaccamento e separazione | Stili di Attaccamento',
    description:
      'Separazione e divorzio: come ogni stile di attaccamento vive la fine di una relazione e cosa aiuta.',
    image: 'approfondimenti-separazione.webp',
  },
  'tradimento.html': {
    h1: 'Attaccamento e tradimento',
    title: 'Attaccamento e tradimento | Stili di Attaccamento',
    description:
      'Tradimento e infedeltà: reazioni per stile di attaccamento, fiducia rotta e possibili percorsi di consapevolezza.',
    image: 'approfondimenti-tradimento.webp',
  },
};

function mergeBrokenLists(html) {
  let prev;
  let current = html;
  const pattern =
    /<\/li><\/ul>\s*<ul style="margin-left: var\(--spacing-6\); margin-top: var\(--spacing-4\);">/g;
  do {
    prev = current;
    current = current.replace(pattern, '</li>');
  } while (current !== prev);
  return current;
}

function fixIntroCards(html) {
  return html.replace(
    /(<div class="card mb-6"><p>[\s\S]*?<\/p>)\s*\n+\s*(<div class="card mb-6">)/g,
    '$1\n</div>\n\n$2'
  );
}

function removeConclusionBlock(html) {
  return html.replace(
    /<div class="card mb-6"><h3>La Paradosso[\s\S]*?<\/div>\s*<div class="card mb-6"><h3>Esercizio Finale[\s\S]*?<\/div>\s*/gi,
    ''
  ).replace(
    /<h1>[^<]*<\/h1>[\s\S]*?# CONCLUSIONE[\s\S]*?(?=<!-- Navigazione -->)/i,
    (match) => match.replace(/# CONCLUSIONE[\s\S]*/i, '')
  ).replace(
    /<strong>Questi possono essere presentati[\s\S]*?<\/div>\s*(?=<!-- Navigazione -->)/i,
    ''
  );
}

function applyTextFixes(html) {
  return html
    .replace(/\bfacilitare la guarigione\b/gi, 'favorire la consapevolezza')
    .replace(/\bgraduale guarigione\b/gi, 'graduale elaborazione')
    .replace(/\bbrava\/o\b/g, 'bravo')
    .replace(/\bstanco\/a\b/g, 'stanco')
    .replace(/\bmalato\/a\b/g, 'malato')
    .replace(/\bte stesso\/a\b/g, 'te stesso')
    .replace(/\bCaro\/a\b/g, 'Caro')
    .replace(/# CONCLUSIONE[\s\S]*$/i, '')
    .replace(/<strong>In ognuno di questi ambiti, puoi guarire\.<\/strong>/g, '')
    .replace(/10\. <strong>Guarigione<\/strong>/g, '10. <strong>Crescita personale</strong>');
}

function updateHead(html, meta, filename) {
  const canonical = `${BASE}/approfondimenti/${filename}`;
  const img = `${BASE}/images/${meta.image}`;

  let out = html;
  out = out.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${meta.description}">`
  );
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
  out = out.replace(
    /"headline":\s*"[^"]*"/,
    `"headline": "${meta.h1}"`
  );
  out = out.replace(
    /"description":\s*"Approfondimento[^"]*"/,
    `"description": "${meta.description}"`
  );
  out = out.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${meta.title}">`
  );
  out = out.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${meta.description}">`
  );
  out = out.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${meta.title}">`
  );
  out = out.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${meta.description}">`
  );
  out = out.replace(
    /<h1>[^<]*<\/h1>/,
    `<h1>${meta.h1}</h1>`
  );

  if (meta.image) {
    out = out.replace(
      /<meta property="og:image" content="[^"]*">/,
      `<meta property="og:image" content="${img}">`
    );
    out = out.replace(
      /<meta name="twitter:image" content="[^"]*">/,
      `<meta name="twitter:image" content="${img}">`
    );
  }

  return out;
}

for (const [filename, meta] of Object.entries(PAGES)) {
  const filePath = join(DIR, filename);
  let html = readFileSync(filePath, 'utf-8');
  html = updateHead(html, meta, filename);
  html = mergeBrokenLists(html);
  html = applyTextFixes(html);
  html = fixIntroCards(html);
  html = removeConclusionBlock(html);
  writeFileSync(filePath, html, 'utf-8');
  console.log(`✅ Fixed ${filename}`);
}

console.log('Done.');
