# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.1.0]: https://github.com/yourusername/stiliattaccamento/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/yourusername/stiliattaccamento/releases/tag/v1.0.0

