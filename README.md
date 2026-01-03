# Stili di Attaccamento Wiki

Webapp PWA statica mobile-first che presenta una wiki sugli stili di attaccamento, basata sulla teoria di Bowlby e Ainsworth.

## 📋 Panoramica

Progetto che fornisce informazioni accessibili sugli stili di attaccamento, organizzate come una wiki. Focus sulla **consapevolezza**, non sulla "guarigione", con approccio compassionevole e evidence-based.

## 🏗️ Struttura

```
stiliattaccamento/
├── docs/              # Documenti di specifica
├── jtbd/              # Personas e job stories
├── public/            # File statici (pubblicati su Cloudflare Pages)
└── scripts/           # Script di generazione contenuti
```

## 🚀 Stack Tecnologico

- **Frontend**: HTML5, CSS3, JavaScript (vanilla ES6+)
- **Hosting**: Cloudflare Pages
- **Design System**: Material Design M3 (light mode, colori pastello verde-beige)
- **PWA**: Service Worker, manifest, offline functionality
- **SEO/AI**: Schema.org structured data
- **Immagini**: Generate via Qwen Text2Image API (qwen-image-plus), processate con ImageMagick

## 📦 Setup Locale

1. Clona il repository
2. Configura `.env` da `.env.example` (per Qwen image generation API)
   - Richiede: `QWEN_API_KEY`, `QWEN_URL_IMAGE`, `QWEN_MODEL_IMAGE`
   - Vedi `scripts/ENV_SETUP.md` per dettagli
3. Installa dipendenze: `npm install`
4. Apri `public/index.html` in un browser o usa un server locale
5. (Opzionale) Genera immagini: `node scripts/generate-images.js --limit=5`

## 🛠️ Sviluppo

Vedi [CONTRIBUTING.md](./CONTRIBUTING.md) per workflow completo e standard di codice.

## 📚 Documentazione

- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Guida contributori
- **[STANDARDS.md](./STANDARDS.md)**: Standard di codice
- **[SECURITY.md](./SECURITY.md)**: Policy sicurezza
- **[docs/documentation/ARCHITECTURE.md](./docs/documentation/ARCHITECTURE.md)**: Architettura
- **[docs/documentation/DEPLOYMENT.md](./docs/documentation/DEPLOYMENT.md)**: Deploy guide
- **[.cursorrules](./.cursorrules)**: Regole AI assistant

## 🌐 Deploy

Deploy automatico su Cloudflare Pages da branch `main`. Build directory: `public/`.

## 🎯 Funzionalità

Wiki navigation, test auto-valutazione, mappa personale, 12 profili (Secure, Ansioso, Evitante, Oscillante × 3 livelli), dinamiche di coppia, guida supporto partner, quando cercare aiuto, storie reali, esercizi, approfondimenti tematici, libri, PWA, light mode, SEO optimization.

## 📄 Pagine Principali

- **Homepage**: Introduzione e navigazione
- **Test**: Auto-valutazione 12 domande
- **Mappa Personale**: Visualizzazione profilo su 5 dimensioni
- **12 Profili**: Secure, Ansioso, Evitante, Oscillante (Basso/Medio/Alto)
- **Dinamiche di Coppia**: Guide per ogni combinazione di stili
- **Come Supportare il Partner**: Guida pratica per supportare il partner
- **Quando Cercare Aiuto**: Indicazioni su terapia e supporto professionale
- **Storie Reali**: 5 storie anonimizzate di consapevolezza
- **Esercizi**: 60+ esercizi pratici organizzati per stile e livello
- **Approfondimenti**: 11 tematiche verticali (Focusing, Sessualità, Famiglia, etc.)
- **Libri**: 10 approfondimenti su libri chiave

## 🔒 Sicurezza

Vedi [SECURITY.md](./SECURITY.md). **Non committare** file `.env` con credenziali.

## 🤝 Contribuire

Contributi benvenuti! Leggi [CONTRIBUTING.md](./CONTRIBUTING.md) per iniziare.

---

**Nota**: Questo progetto promuove consapevolezza, non "guarigione".

