# Scripts

Utility Node.js per build, SEO, performance, accessibilità e generazione immagini del sito statico.

## Prerequisiti

1. Node.js >= 16.0.0
2. Per le immagini Qwen: file `.env` in root (vedi `ENV_SETUP.md`)
3. Per le icone PWA: Python 3 con Pillow (`pip install Pillow`)

```bash
npm install
```

---

## Pipeline SEO / GEO

Esegue in sequenza inject meta tag, sitemap e validazione.

```bash
npm run seo
```

| Script | Comando | Ruolo |
|--------|---------|-------|
| `inject-seo.js` | `npm run inject-seo` | Canonical, Open Graph, Twitter Card, `hreflang`, `article:modified_time` |
| `generate-sitemap.js` | `npm run generate-sitemap` | `public/sitemap.xml` da tutte le pagine HTML |
| `validate-seo.js` | `npm run validate-seo` | Verifica meta obbligatori su ogni pagina |
| `enrich-schema-geo.js` | `npm run enrich-schema-geo` | Schema.org GEO, `llms.txt` |

Configurazione centralizzata in `scripts/seo-config.js` e `scripts/lib/seo-utils.js`.

**Dominio canonico:** `https://stiliattaccamento.com` (unico; non usare `.it`). Workflow SEO/GEO e hub money: `.cursor/skills/seozoom-stiliattaccamento/SKILL.md`.

---

## Pipeline performance e PWA

```bash
npm run perf
```

| Script | Ruolo |
|--------|-------|
| `build-css.js` | Genera `site.min.css` (core) + bundle per pagina (`site-profiles`, `site-mappa`, `site-wiki`) |
| `build-js.js` | Genera `site.min.js` bundle minificato degli script globali |
| `inject-shell.js` | Inlines `header.html` e `topbar.html` (idempotente anche su HTML minificato; marker `Site shell:`) |
| `inject-analytics.js` | Blocco GA4 nel `<head>` |
| `inject-wiki-tabs.js` | Attributi `data-wiki-tabs*` da `wiki-tabs-config.json` |
| `inject-performance.js` | Preload, CSS per pagina, `site.min.js` defer, SW, manifest |
| `inject-search.js` | UI ricerca Pagefind nel markup |
| `minify-static.js` | Minifica HTML, template, manifest, sitemap, JSON (`html-minifier-terser`) — **ultimo** step inject prima di `build:search` |
| `build-search.js` | Indice Pagefind in `public/pagefind/` |
| `optimize-images.js` | Varianti WebP responsive (`index-hero-480/700.webp`) |
| `generate-pwa-icons.js` | Icone 192×192 e 512×512 in `public/icons/` da `index-hero.webp` |

**Git hooks:** `npm install` imposta `core.hooksPath` su `scripts/git-hooks/` (pre-commit + pre-push eseguono `npm run perf`).

Dopo `generate-pwa-icons`, aggiorna `public/manifest.json` se cambi i path delle icone.

---

## Pipeline accessibilità

```bash
npm run inject-a11y
```

| Script | Ruolo |
|--------|-------|
| `inject-a11y.js` | Skip link verso `#main-content`, id su `<main>` |

---

## Pulizia UI / HTML wiki

Script idempotenti (sicuri da rieseguire):

```bash
npm run fix-approfondimenti-nesting   # Card annidate → .style-section
npm run clean-approfondimenti-ui      # Lead, content-nav, titoli umanizzati
npm run clean-wiki-inline-styles      # Rimuove style= ripetitivi → classi BEM
```

Logica condivisa in `scripts/lib/wiki-html-utils.js`.

---

## Generazione immagini (Qwen Text2Image)

### Configurazione `.env`

```env
QWEN_API_KEY=your_api_key_here
QWEN_URL_IMAGE=https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis
QWEN_MODEL_IMAGE=qwen-image-plus
```

Vedi `scripts/ENV_SETUP.md` per i dettagli.

### Uso

```bash
npm run generate-images
node scripts/generate-images.js --page=index.html
node scripts/generate-images.js --page=profili/ansioso-alto.html --position=tarocchi --force
node scripts/generate-images.js --force   # rigenera anche esistenti
node scripts/generate-images.js --limit=2 # utile per test
```

| Flag | Descrizione |
|------|-------------|
| `--page=` | Solo una pagina (es. `profili/secure-alto.html`) |
| `--position=` | Solo una posizione in `prompts.json` (es. `tarocchi`, `archetipo`) |
| `--force` | Rigenera anche se il file webp esiste già |
| `--limit=N` | Massimo N immagini per esecuzione |

### Output

- Immagini: `public/images/{pagina}-{posizione}.webp`
- Mappa: `scripts/image-map.json`
- Raw PNG: `docs/image-generated/`

### Dimensioni

| Tipo | API (Qwen) | Output finale |
|------|------------|---------------|
| Default | 1328×1328 | 800×600 webp |
| Verticale (`vertical: true`, es. tarocchi) | 928×1664 | 600×800 webp |

### Carte tarocchi (12 profili)

- Asset: `public/images/profili-{stile}-{livello}-tarocchi.webp`
- Style file: `.cursor/illustration-styles/stiliattaccamento-tarocchi.md`
- Skill L2: `.cursor/skills/illustrator-stiliattaccamento/SKILL.md`
- **Vincolo:** nessun testo, numeri o cornici nell'immagine; titoli arcana solo in HTML (`figcaption`)
- **Anti-pattern prompt:** evitare «tarot card», «Marseille style», «card layout» — usare illustrazioni full-bleed verticale
- Per `position: tarocchi` lo script applica automaticamente style anchor, `negative_prompt`, `prompt_extend: false`, `watermark: false`

### Note immagini

- Stile astratto/surrealista, colori pastello, **senza testo** nell'immagine
- Rate limit: pausa 1 s tra richieste
- Prompt in `scripts/prompts.json` — obbligatori per nuove pagine HTML (min. 2 immagini)

---

## Ordine consigliato dopo modifiche HTML

```bash
npm run fix-approfondimenti-nesting   # se tocchi approfondimenti
npm run clean-approfondimenti-ui
npm run clean-wiki-inline-styles
npm run seo
npm run optimize-images   # se tocchi immagini hero/pilastri homepage
npm run perf
npm run inject-a11y
npm test
npm run test:validation
```

---

## Moduli condivisi

| File | Uso |
|------|-----|
| `lib/fs-utils.js` | Scoperta file HTML in `public/` |
| `lib/seo-utils.js` | Truncation meta, path canonical |
| `lib/wiki-html-utils.js` | Sostituzione inline styles → classi CSS |

---

## Archivio manutenzione

Gli script una tantum non richiamati da `package.json` sono conservati in
`scripts/archive/maintenance/`. Prima di riusarli, controlla il diff che producono:
sono strumenti storici, non parte della pipeline corrente.
