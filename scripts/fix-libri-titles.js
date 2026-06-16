#!/usr/bin/env node
/** Aggiorna titoli e meta dei libri a case naturale */

const { readFileSync, writeFileSync } = require('fs');
const { join, resolve } = require('path');

const DIR = resolve(process.cwd(), 'public/libri');

const BOOKS = {
  'attached.html': {
    h1: 'Attached',
    title: 'Attached — Amir Levine & Rachel Heller | Libri',
    description:
      'Recensione di Attached: i tre stili di attaccamento nelle relazioni romantiche, con strategie pratiche per coppie.',
  },
  'polysecure.html': {
    h1: 'Polysecure',
    title: 'Polysecure — Jessica Fern | Libri',
    description:
      'Recensione di Polysecure: attaccamento e relazioni non monogame, con focus su sicurezza emotiva.',
  },
  'secure-base.html': {
    h1: 'Secure Base',
    title: 'Secure Base — John Bowlby | Libri',
    description:
      'Recensione di Secure Base: i fondamenti della teoria dell\'attaccamento di John Bowlby.',
  },
  'hold-me-tight.html': {
    h1: 'Hold Me Tight',
    title: 'Hold Me Tight — Sue Johnson | Libri',
    description:
      'Recensione di Hold Me Tight: terapia di coppia focalizzata sull\'attaccamento (EFT).',
  },
  'come-stai.html': {
    h1: 'Come stai? (Focusing)',
    title: 'Come stai? — Eugene Gendlin | Libri',
    description:
      'Recensione di Come stai?: introduzione al Focusing e all\'ascolto del corpo.',
  },
  'emotional-intelligence.html': {
    h1: 'Emotional Intelligence',
    title: 'Emotional Intelligence — Daniel Goleman | Libri',
    description:
      'Recensione di Emotional Intelligence: intelligenza emotiva e regolazione nelle relazioni.',
  },
  'the-body-keeps-the-score.html': {
    h1: 'The Body Keeps the Score',
    title: 'The Body Keeps the Score — Bessel van der Kolk | Libri',
    description:
      'Recensione di The Body Keeps the Score: trauma, corpo e percorsi di elaborazione.',
  },
  'the-body-remembers.html': {
    h1: 'The Body Remembers',
    title: 'The Body Remembers — Babette Rothschild | Libri',
    description:
      'Recensione di The Body Remembers: trauma somatico e regolazione del sistema nervoso.',
  },
  'the-gifts-of-imperfection.html': {
    h1: 'The Gifts of Imperfection',
    title: 'The Gifts of Imperfection — Brené Brown | Libri',
    description:
      'Recensione di The Gifts of Imperfection: vulnerabilità, vergogna e autenticità.',
  },
  'adult-attachment-interview.html': {
    h1: 'The Adult Attachment Interview',
    title: 'The Adult Attachment Interview | Libri',
    description:
      'Recensione dell\'Adult Attachment Interview: strumento di valutazione dell\'attaccamento negli adulti.',
  },
};

for (const [file, meta] of Object.entries(BOOKS)) {
  const path = join(DIR, file);
  let html = readFileSync(path, 'utf-8');
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${meta.description}">`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
  html = html.replace(/<h1>[^<]*<\/h1>/, `<h1>${meta.h1}</h1>`);
  html = html.replace(/"name":\s*"[^"]*"/, `"name": "${meta.h1}"`);
  html = html.replace(/"description":\s*"Approfondimento[^"]*"/, `"description": "${meta.description}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${meta.title}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${meta.description}">`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${meta.title}">`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${meta.description}">`);
  writeFileSync(path, html, 'utf-8');
  console.log(`✅ ${file}`);
}

console.log('Done.');
