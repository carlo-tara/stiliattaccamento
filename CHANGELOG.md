# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-06-28

### Added
- **PageSpeed — shell inline**: `inject-shell.js` incorpora header e topbar nel markup (59 pagine)
- **PageSpeed — JS bundle**: `build-js.js` genera `site.min.js` minificato (script globali unificati)
- **PageSpeed — CSS split**: bundle per pagina (`site-profiles`, `site-mappa`, `site-wiki`) via `build-css.js`
- **Immagini responsive**: `index-hero-480.webp` e varianti ottimizzate (`optimize-images.js`)
- **Cache**: `public/_headers` e Service Worker v8 con precache aggiornato

### Changed
- Homepage: hero image prima dell’h1, `content-visibility` sulle sezioni sotto la piega, preload LCP mirato
- `inject-performance.js`: CSS per tipo pagina, script `defer`, preload stylesheet
- `template-loader.js`: footer caricato con `requestIdleCallback`
- Core CSS ridotto (~38 KiB → ~34 KiB); CSS pagina-specifica caricata solo dove serve

### Fixed
- **CLS mobile**: eliminato layout shift da fetch async di header/topbar (CLS 0 in produzione)
- **PageSpeed mobile**: Performance 99, LCP 2,0 s, TBT 0 ms (verificato su PageSpeed Insights)

## [1.3.0] - 2026-06-16

### Added
- **SEO pipeline**: `inject-seo.js`, `generate-sitemap.js`, `validate-seo.js`, `seo-config.js`
- **GEO**: `llms.txt`, `robots.txt`, `enrich-schema-geo.js`, FAQ `FAQPage` on homepage
- **Performance**: non-blocking fonts, Service Worker (`sw.js`, `pwa.js`), `inject-performance.js`
- **Accessibility**: skip link, focus trap, breadcrumb `<ol>`, axe-core tests (`inject-a11y.js`)
- **PWA**: `manifest.json` with theme colour and start URL; icone 192/512 generate da hero
- **Tests**: `inject-seo` unit tests; `loadPublicScript()` test helper; Playwright on port 8090
- **Shared**: `scripts/lib/fs-utils.js` for HTML file discovery
- **UI/UX**: `nav-highlight.js` (active nav, `aria-current`, submenu auto-open)
- **UI cleanup**: `clean-wiki-inline-styles.js`, `fix-approfondimenti-nesting.js`, `clean-approfondimenti-ui.js`
- **Script injection**: `mobile-menu.js`, `nav-highlight.js`, `cookie-banner.js` su tutte le 57 pagine
- **Mappa moduli**: `mappa-dimensions.js`, `mappa-profile-render.js` (refactor `mappa-personale.js`)

### Changed
- Homepage UX: hero CTAs, test banner, profile rows, FAQ section
- `themes.css`: inlined `light.css` (one fewer blocking request)
- Removed dead `main.js` from all pages (~9 KB saved per page); legacy in `js/archive/main.legacy.js`
- `breadcrumb-generator.js`: semantic list + HTML escaping
- `cookie-banner.js`: root-absolute policy URL, `aria-modal`, idle init
- `mappa-personale.js`: radar chart refactor, profile render estratto, slider ARIA labels
- `stili-base.html`: corrected heading hierarchy
- Approfondimenti: matryoshka cards → `.style-section`; intro `.wiki-lead`; `.content-nav`
- Footer: copyright 2024–2026, link legali
- Inline styles: pulizia su decine di pagine wiki (`wiki-html-utils.js` esteso)

### Fixed
- `mappa-personale.js`: syntax error (`try` without `catch`) breaking production
- `template-loader.js`: header/footer parsing; DOM-ready scheduling when script in `<head>`
- `inject-seo.js`: insert point before Google Fonts; meta sanitisation; duplicate block removal
- Nine `approfondimenti/` pages missing canonical/OG tags
- **39 pagine** senza `mobile-menu.js` (hamburger non funzionante)
- Link checker: exclude `templates/` partials
- Unit tests: 32 failing → 77+ passing

## [1.2.0] - 2026-01-03

### Changed
- **Menu navigation**: Menu hamburger sempre visibile su tutte le risoluzioni (mobile-first design)
  - Menu drawer-style sempre attivo su tutte le risoluzioni
  - Submenu espandibili con event delegation migliorata
  - Chiusura menu con tasto Escape
  - Overlay per bloccare scroll quando menu aperto
- **Template loader**: Rimozione codice di debug/logging (11 blocchi rimossi)
- **Documentazione**: Aggiornato `ARCHITECTURE.md` (v1.1.0) con:
  - Struttura completa file JavaScript
  - Descrizione menu navigation sempre mobile-style
  - Organizzazione corretta directory `public/js/`

### Fixed
- Codice di debug rimosso da `template-loader.js` (fetch calls a localhost rimossi)
- Menu mobile funzionante correttamente su tutte le risoluzioni

## [1.1.0] - 2024-12-27

### Added
- **Style Validator**: Nuovo validator linguistico (`tests/validation/style-validator.js`) che verifica:
  - Pattern riconoscibili da IA da evitare ("È importante notare che", "Vale la pena ricordare che", ecc.)
  - Linguaggio inclusivo (no "lui/lei", "insoddisfatto/a", uso di "partner")
  - Terminologia corretta ("oscillante" invece di "disorganizzato")
- Integrazione Style Validator nella suite di test automatici (`tests/validation/run-all.cjs`)

### Changed
- **Documentazione aggiornata**:
  - `CONTRIBUTING.md`: Aggiunta sezione dettagliata "Test di Validazione" con informazioni complete sui 5 validator disponibili
  - `docs/documentation/ARCHITECTURE.md`: Ampliata sezione 14.2 "Automated Testing" con sottosezioni per ogni validator, inclusi dettagli sul Style Validator

### Fixed
- Tutti i 56 file HTML ora passano la validazione di stile linguistico
- Conformità completa alle linee guida di tono di voce e stile linguistico umano e naturale

## [1.0.0] - 2024-12-XX

### Added
- Versione iniziale del progetto
- Webapp PWA statica mobile-first sugli stili di attaccamento
- 56 pagine HTML con contenuti completi
- Suite di validator (HTML, CSS, Link Checker, Schema.org)
- Sistema di generazione immagini via Qwen Text2Image API
- Documentazione completa (CONTRIBUTING.md, STANDARDS.md, ARCHITECTURE.md, SECURITY.md)

---

[1.3.0]: https://github.com/carlo-tara/stiliattaccamento/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/carlo-tara/stiliattaccamento/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/carlo-tara/stiliattaccamento/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/carlo-tara/stiliattaccamento/releases/tag/v1.0.0

