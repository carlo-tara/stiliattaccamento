# Checklist UI/UX — Stili di Attaccamento

Passa questa checklist prima di consegnare una pagina o un intervento di design. Usa la scala di gravita' per il report.

## Scala di gravita'

| Livello | Significato |
|---------|-------------|
| 🔴 Bloccante | Rompe accessibilita', leggibilita', responsive o brand (es. bianco puro, contrasto < AA, CTA multiple in competizione, testo < 16px su mobile) |
| 🟡 Importante | Incoerenza con design system o cluster, componente duplicato, spaziatura fuori scala |
| 🟢 Suggerimento | Rifinitura, micro-ottimizzazione, miglior gerarchia |

---

## 1. Sistema visuale (Cloud Dancer)

- [ ] Sfondo pagina/hero/topbar = `--color-bg-primary` (Cloud Dancer), **nessun `#fff`/`rgb(255 255 255)` come sfondo**
- [ ] Card/header/footer su `--color-surface` (staccano dallo sfondo)
- [ ] Colori solo via token Material 3 / variabili di progetto (no hex hardcoded nei nuovi stili)
- [ ] Accenti corretti per stile: secure=verde, anxious=rosso, avoidant=blu-verde, disorganized/Oscillante=beige
- [ ] Un solo colore accento dominante per blocco; nessuna competizione cromatica

## 2. Tipografia

- [ ] Heading in Playfair Display, body in Lato
- [ ] Maiuscole naturali negli heading (no ANSIOSO ALTO)
- [ ] Body ≥16px su mobile; line-height rilassato (1.75) sui testi lunghi
- [ ] Blocchi di testo max ~65-75ch
- [ ] Grassetto solo su parole chiave funzionali

## 3. Layout e componenti

- [ ] Riusati i componenti esistenti (`wiki-*`, `card`, `style-section`, `nav-*`) — nessuna duplicazione CSS
- [ ] Nessuna card annidata (usa `.style-section` dentro le card)
- [ ] Spaziature dalla scala 4dp (`--spacing-*`), radius dalla scala shape
- [ ] Template corretto per il tipo di pagina (vedi `template-pagine.md`)
- [ ] Coerenza con le pagine sorelle del cluster (struttura, ritmo, componenti)

## 4. Esperienza utente

- [ ] Persona prioritaria della pagina identificata e servita
- [ ] Una sola CTA primaria (le altre azioni come secondarie)
- [ ] Above-the-fold chiaro (cosa e' / cosa fare)
- [ ] Nessun dead-end: passo successivo presente (`.content-nav`)
- [ ] Tono visivo rassicurante (niente allarmismo grafico, specie su profili Alto/Oscillante)

## 5. Accessibilita' (WCAG 2.1 AA)

- [ ] Contrasto testo/sfondo ≥4.5:1 (body) / ≥3:1 (large)
- [ ] `:focus-visible` evidente su tutti gli elementi interattivi
- [ ] Navigabile da tastiera (menu, submenu, form, drawer); ordine di tab logico
- [ ] `aria-label`/`aria-expanded`/`aria-current` su nav, hamburger, breadcrumb
- [ ] Skip link presente e funzionante
- [ ] Area tocco ≥44×44px sui controlli
- [ ] `alt` descrittivo su tutte le immagini; decorative con `aria-hidden`
- [ ] `prefers-reduced-motion` rispettato (nessuna animazione forzata)
- [ ] HTML semantico (`header`, `nav`, `main`, `article`, `section`, `footer`), un solo `h1`

## 6. Responsive (mobile-first)

- [ ] Progettato prima per mobile, poi esteso con media query (600/960/1280)
- [ ] Nessun overflow orizzontale; immagini fluide
- [ ] Menu hamburger/drawer funziona su mobile; nav desktop su ≥960px
- [ ] Griglie collassano correttamente (`.grid-2`, `.grid-3`)

## 7. Performance

- [ ] Immagini WebP, `loading="lazy"` (eccetto hero above-the-fold)
- [ ] Hero image con `fetchpriority="high"` + preload
- [ ] CSS preload, font non bloccanti
- [ ] Nessuna libreria/asset esterno superfluo
- [ ] Consenso cookie in `site.min.js` (`site-notice.js`); nessun script separato con `cookie` nel path

## 7b. PWA e triage console

- [ ] `sw.js`: precache best-effort; nessun `cache.addAll()` su script consent/analytics; `CACHE_NAME` bumpato se modificato
- [ ] Post-deploy SW: unregister in DevTools prima del test
- [ ] `ERR_BLOCKED_BY_CLIENT` su script → probabile ad blocker; verificare con incognito senza estensioni prima di debug server
- [ ] Messaggi da estensioni browser (es. content script, CSP `connect-src 'none'` report-only) ≠ bug del sito

## 8. Immagini obbligatorie (regola `.cursorrules`)

- [ ] ≥2 immagini `.wiki-image` per ogni nuova pagina di contenuto
- [ ] Prompt aggiunti in `scripts/prompts.json` e generati via Qwen
- [ ] `figure` completo: `img` + `figcaption` quando utile
- [ ] Stile coerente: astratto, surrealista, pastello, accogliente

## 9. SEO / dati strutturati

- [ ] `<title>` ≤~60 char, `meta description` ≤~155 char
- [ ] Schema.org coerente con il tipo (Article/FAQPage/HowTo/Book/BreadcrumbList)
- [ ] Canonical, Open Graph, Twitter Card presenti
- [ ] Gerarchia heading corretta (h1 → h2 → h3)

## 10. Contenuto e tono (rimando a `content-voice`)

- [ ] Microcopy/CTA/label verificati con `content-voice`
- [ ] Terminologia: "Oscillante" (non Disorganizzato); linguaggio inclusivo
- [ ] Disclaimer clinici dove servono (profili Alto, Oscillante, crisi), tono compagno di viaggio
- [ ] Filosofia: consapevolezza, non guarigione

---

## Verifiche operative

- [ ] Eseguito `npm run test:validation` se hai toccato HTML (validator stile/pattern del progetto)
- [ ] Controllo visivo su mobile e desktop
- [ ] Nessun errore in console JavaScript
