#!/usr/bin/env node
/**
 * Ripara le pagine storie-reali: rimuove markdown duplicato da head/h1,
 * ricostruisce meta/title/schema coerenti.
 */

const { readFileSync, writeFileSync } = require('fs');
const { join, resolve } = require('path');

const STORIES_DIR = resolve(process.cwd(), 'public/storie-reali');
const BASE_URL = 'https://stiliattaccamento.com';

const STORIES = {
  marco: {
    h1: 'Marco — Ansioso/evitante instabile',
    title: 'Marco — Ansioso/evitante instabile | Storie Reali',
    description:
      'Storia anonimizzata di Marco: oscillava fra ansioso ed evitante e imparò a vedere il proprio ciclo relazionale senza esserne travolto.',
  },
  giulia: {
    h1: 'Giulia — Evitante/secure con tratti ansioso',
    title: 'Giulia — Evitante/secure con tratti ansioso | Storie Reali',
    description:
      'Storia anonimizzata di Giulia: prevalentemente evitante, imparò a riconoscere il panico di abbandono quando arrivava.',
  },
  lorenzo: {
    h1: 'Lorenzo — Oscillante medio',
    title: 'Lorenzo — Oscillante medio | Storie Reali',
    description:
      'Storia anonimizzata di Lorenzo: cicli di vicinanza e ritiro. Imparò a mappare il pattern invece di sentirsi vittima.',
  },
  nina: {
    h1: 'Nina — Ansioso alto',
    title: 'Nina — Ansioso alto | Storie Reali',
    description:
      'Storia anonimizzata di Nina: panico di abbandono costante. Imparò a osservare il panico invece di esserne consumata.',
  },
  andrea: {
    h1: 'Andrea — Evitante alto',
    title: 'Andrea — Evitante alto | Storie Reali',
    description:
      'Storia anonimizzata di Andrea: paura della vicinanza mascherata da bisogno di spazio. Imparò a vederla mentre accade.',
  },
};

function extractBodyContent(html) {
  const startMarker = '<p class="text-center mb-6"';
  const endMarker = '<!-- Navigazione -->';
  const start = html.indexOf(startMarker);
  const end = html.lastIndexOf(endMarker);
  if (start === -1 || end === -1) {
    throw new Error('Could not find body markers');
  }
  return html.slice(start, end).trim();
}

function buildPage(slug, meta, bodyContent) {
  const filename = `${slug}.html`;
  const canonical = `${BASE_URL}/storie-reali/${filename}`;

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${meta.description}">
  <title>${meta.title}</title>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${meta.h1}",
    "description": "${meta.description}",
    "author": {
      "@type": "Organization",
      "name": "Stili di Attaccamento Wiki"
    },
    "inLanguage": "it-IT",
    "publisher": {
      "@type": "Organization",
      "name": "Stili di Attaccamento Wiki",
      "url": "${BASE_URL}"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${canonical}"
    }
  }
  </script>

  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index, follow">
  <meta property="og:site_name" content="Stili di Attaccamento Wiki">
  <meta property="og:locale" content="it_IT">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${BASE_URL}/images/index-hero.webp">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${BASE_URL}/images/index-hero.webp">

  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/themes.css">
</head>
<body>
  <div id="header-placeholder"></div>
  <div id="topbar-placeholder"></div>

  <main>
    <section class="section">
      <div class="container">

        <h1>${meta.h1}</h1>
        ${bodyContent}

        <!-- Navigazione -->
        <div class="card mt-8">
          <h3>Altre storie</h3>
          <p><a href="../storie-reali.html">← Torna all'indice delle Storie Reali</a></p>
        </div>
      </div>
    </section>
  </main>

  <div id="footer-placeholder"></div>
  <script src="../js/template-loader.js"></script>
  <script src="../js/breadcrumb-generator.js"></script>
  <script src="../js/theme.js"></script>
</body>
</html>
`;
}

for (const [slug, meta] of Object.entries(STORIES)) {
  const filePath = join(STORIES_DIR, `${slug}.html`);
  const html = readFileSync(filePath, 'utf-8');
  let bodyContent = extractBodyContent(html);

  // andrea.html: rimuovi contenuto indice iniettato erroneamente
  if (slug === 'andrea') {
    const cutMarkers = [
      '### 1. **La Consapevolezza Non È GUARIGIONE**',
      '<h2>Lezioni comuni',
      '<h2>Come usare queste storie',
    ];
    for (const cut of cutMarkers) {
      const idx = bodyContent.indexOf(cut);
      if (idx !== -1) {
        bodyContent = bodyContent.slice(0, idx).trim();
      }
    }
  }

  const fixed = buildPage(slug, meta, bodyContent);
  writeFileSync(filePath, fixed, 'utf-8');
  console.log(`✅ Fixed ${slug}.html`);
}

console.log('Done.');
