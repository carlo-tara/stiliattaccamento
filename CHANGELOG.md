# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.2.0]: https://github.com/carlo-tara/stiliattaccamento/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/carlo-tara/stiliattaccamento/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/carlo-tara/stiliattaccamento/releases/tag/v1.0.0

