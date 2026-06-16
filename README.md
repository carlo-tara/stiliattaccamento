# Stili di Attaccamento Wiki

Webapp PWA statica mobile-first che presenta una wiki sugli stili di attaccamento, basata sulla teoria di Bowlby e Ainsworth.

## Panoramica

Progetto che fornisce informazioni accessibili sugli stili di attaccamento, organizzate come una wiki. Focus sulla **consapevolezza**, non sulla "guarigione", con approccio compassionevole e evidence-based.

## Struttura

```
stiliattaccamento/
├── docs/              # Documenti di specifica
│   └── documentation/ # Architettura, deploy, API
├── jtbd/              # Personas e job stories
├── public/            # File statici (pubblicati su Cloudflare Pages)
├── scripts/           # Pipeline SEO, performance, immagini
└── tests/             # Unit, E2E, validazione, accessibilità
```

## Stack tecnologico

- **Frontend**: HTML5, CSS3, JavaScript (vanilla ES6+)
- **Hosting**: Cloudflare Pages
- **Design System**: Material Design M3 (light mode, colori pastello verde-beige)
- **PWA**: Service Worker (`sw.js`), manifest, icone 192/512
- **SEO/AI**: Schema.org, `sitemap.xml`, `robots.txt`, `llms.txt`
- **Immagini**: Generate via Qwen Text2Image API, processate con ImageMagick

## Setup locale

1. Clona il repository
2. Configura `.env` da `.env.example` (per Qwen image generation API)
   - Richiede: `QWEN_API_KEY`, `QWEN_URL_IMAGE`, `QWEN_MODEL_IMAGE`
   - Vedi `scripts/ENV_SETUP.md` per dettagli
3. Installa dipendenze: `npm install`
4. Apri `public/index.html` in un browser o usa un server locale (porta 8090 per i test E2E)
5. (Opzionale) Genera immagini: `npm run generate-images -- --limit=5`

## Script npm principali

| Comando | Descrizione |
|---------|-------------|
| `npm run seo` | Inject meta tag, sitemap, validazione SEO |
| `npm run perf` | Font non bloccanti, preload, script globali |
| `npm run inject-a11y` | Skip link e id su `<main>` |
| `npm run generate-images` | Immagini Qwen per le pagine wiki |
| `npm test` | Unit test (Vitest) |
| `npm run test:e2e` | Test E2E (Playwright) |
| `npm run test:validation` | HTML, CSS, link, schema, stile linguistico |
| `npm run test:accessibility` | Test axe-core (Playwright) |
| `npm run test:all` | Suite completa |

Vedi `scripts/README.md` per la pipeline completa e l'ordine consigliato dopo modifiche HTML.

## Sviluppo

Vedi [CONTRIBUTING.md](./CONTRIBUTING.md) per workflow completo e standard di codice.

Dopo modifiche alle pagine HTML:

```bash
npm run seo && npm run perf && npm run inject-a11y
npm run test:all
```

## Documentazione

- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Guida contributori
- **[STANDARDS.md](./STANDARDS.md)**: Standard di codice
- **[SECURITY.md](./SECURITY.md)**: Policy sicurezza
- **[docs/documentation/ARCHITECTURE.md](./docs/documentation/ARCHITECTURE.md)**: Architettura
- **[docs/documentation/DEPLOYMENT.md](./docs/documentation/DEPLOYMENT.md)**: Deploy guide
- **[docs/documentation/API.md](./docs/documentation/API.md)**: API esterne
- **[docs/documentation/STANDARD_PROJECT_FILES.md](./docs/documentation/STANDARD_PROJECT_FILES.md)**: Riferimento file standard
- **[.cursorrules](./.cursorrules)**: Regole AI assistant

## Deploy

Deploy automatico su Cloudflare Pages da branch `main`. Build directory: `public/`. Nessun build step.

## Funzionalità

Wiki navigation, test auto-valutazione (SurveyJS), mappa personale (Chart.js), 12 profili (Secure, Ansioso, Evitante, Oscillante × 3 livelli), dinamiche di coppia, guida supporto partner, quando cercare aiuto, storie reali, esercizi, approfondimenti tematici, libri, PWA offline, SEO optimisation.

## Sicurezza

Vedi [SECURITY.md](./SECURITY.md). **Non committare** file `.env` con credenziali.

## Contribuire

Contributi benvenuti! Leggi [CONTRIBUTING.md](./CONTRIBUTING.md) per iniziare.

---

**Nota**: Questo progetto promuove consapevolezza, non "guarigione".
