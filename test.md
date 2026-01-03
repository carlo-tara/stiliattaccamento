# Test Suite - Stili di Attaccamento Wiki

## Panoramica

Questa suite di test completa verifica la qualità, funzionalità, accessibilità e validità del codice della web app statica.

## Tipi di Test

### 1. Unit Test (Vitest)

Test unitari per le funzioni JavaScript core del progetto.

**Location**: `tests/unit/`

**File test**:
- `utils.test.js` - Funzioni utility (sanitizeHTML, validazioni, createSafeElement)
- `theme.test.js` - Gestione tema (light mode forzato)
- `mappa-personale.test.js` - Logica calcolo dimensioni mappa
- `mobile-menu.test.js` - Toggle menu mobile

**Eseguire**:
```bash
npm run test:unit
```

**Watch mode**:
```bash
npm run test:watch
```

### 2. Test End-to-End (Playwright)

Test che verificano il comportamento completo dell'applicazione in browser reali.

**Location**: `tests/e2e/`

**File test**:
- `navigation.spec.js` - Navigazione base, link, Schema.org
- `test-survey.spec.js` - Test di autovalutazione (SurveyJS)
- `mappa-personale.spec.js` - Mappa personale interattiva
- `mobile-menu.spec.js` - Menu hamburger e responsive design

**Eseguire**:
```bash
npm run test:e2e
```

**UI mode** (interattivo):
```bash
npm run test:e2e:ui
```

**Browser supportati**:
- Chromium (Desktop Chrome)
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### 3. Validation Scripts

Script per validare HTML, CSS, link e Schema.org markup.

**Location**: `tests/validation/`

**Script disponibili**:
- `html-validator.js` - Validazione W3C HTML
- `css-validator.js` - Validazione sintassi CSS
- `link-checker.js` - Verifica link interni rotti
- `schema-org-checker.js` - Validazione Schema.org JSON-LD
- `run-all.js` - Esegue tutti gli script di validazione

**Eseguire singoli script**:
```bash
npm run test:html
npm run test:css
npm run test:links
```

**Eseguire tutti**:
```bash
npm run test:validation
```

### 4. Accessibility Tests (axe-core)

Test di accessibilità WCAG AA compliance usando axe-core.

**Location**: `tests/accessibility/`

**File test**:
- `axe-core.test.js` - Test accessibility su pagine principali

**Eseguire**:
```bash
npm run test:accessibility
```

**Pagine testate**:
- `/` (homepage)
- `/test.html`
- `/mappa-personale.html`
- `/fondamenti.html`
- `/stili-base.html`

## Comandi NPM Disponibili

```bash
# Test unitari
npm run test              # Esegue tutti i test unitari
npm run test:watch        # Watch mode per sviluppo
npm run test:unit         # Solo unit test

# Test E2E
npm run test:e2e          # Esegue tutti i test E2E
npm run test:e2e:ui       # UI interattiva Playwright

# Validazione
npm run test:validation   # Esegue tutti gli script di validazione
npm run test:html         # Solo validazione HTML
npm run test:css          # Solo validazione CSS
npm run test:links        # Solo link checker

# Accessibility
npm run test:accessibility # Test accessibility

# Tutti i test
npm run test:all          # Unit + E2E + Validation
```

## Struttura Directory

```
tests/
├── unit/                    # Test unitari (Vitest)
│   ├── utils.test.js
│   ├── theme.test.js
│   ├── mappa-personale.test.js
│   └── mobile-menu.test.js
├── e2e/                     # Test end-to-end (Playwright)
│   ├── navigation.spec.js
│   ├── test-survey.spec.js
│   ├── mappa-personale.spec.js
│   └── mobile-menu.spec.js
├── validation/              # Script di validazione
│   ├── html-validator.js
│   ├── css-validator.js
│   ├── link-checker.js
│   ├── schema-org-checker.js
│   └── run-all.js
├── accessibility/           # Test accessibility
│   └── axe-core.test.js
├── fixtures/                # Dati di test
│   ├── test-results.json
│   └── survey-responses.json
└── helpers/                 # Utility per test
    ├── test-utils.js
    └── mock-dom.js
```

## Configurazione

### Vitest

Configurazione in `vitest.config.js`:
- Ambiente: `jsdom` (simula DOM per test browser)
- Setup file: `tests/helpers/test-utils.js`
- Coverage: v8 provider

### Playwright

Configurazione in `playwright.config.js`:
- Base URL: `http://localhost:8080`
- Web server: avvia automaticamente server HTTP su porta 8080
- Browser: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

## Come Aggiungere Nuovi Test

### Unit Test

1. Crea un nuovo file in `tests/unit/` (es. `nuovo-modulo.test.js`)
2. Importa le funzioni da testare (usa `eval` per caricare file JS non-moduli)
3. Scrivere test usando Vitest API (`describe`, `it`, `expect`)

Esempio:
```javascript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const modulePath = resolve(__dirname, '../../public/js/nuovo-modulo.js');
const moduleCode = readFileSync(modulePath, 'utf-8');
eval(moduleCode);

describe('nuovo-modulo.js', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(expected);
  });
});
```

### E2E Test

1. Crea un nuovo file in `tests/e2e/` (es. `nuova-feature.spec.js`)
2. Usa Playwright API per interagire con la pagina
3. Verifica comportamento e stato

Esempio:
```javascript
import { test, expect } from '@playwright/test';

test.describe('Nuova Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/nuova-pagina.html');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Validation Script

1. Crea un nuovo script in `tests/validation/`
2. Usa Node.js filesystem API per leggere file
3. Implementa logica di validazione
4. Aggiungi script a `package.json` e `run-all.js`

## Troubleshooting

### Errori "Cannot find module"

Se i test falliscono con errori di moduli mancanti:
- Verifica che tutte le dependencies siano installate: `npm install`
- Per test unitari, assicurati che i file JS siano caricati correttamente con `eval()`

### Playwright browser non trovato

Esegui:
```bash
npx playwright install
```

### Test E2E falliscono per timeout

- Verifica che il server HTTP locale funzioni (Playwright lo avvia automaticamente)
- Controlla che le pagine HTML esistano nel percorso corretto
- Aumenta il timeout in `playwright.config.js` se necessario

### HTML Validator richiede connessione internet

Il validator W3C richiede connessione internet per validare. Se non disponibile, i test HTML falliranno.

### Coverage non generato

Esegui:
```bash
npm run test:unit -- --coverage
```

Il report sarà disponibile in `coverage/`

## Best Practices

1. **Prima di commit**: Esegui `npm run test:all` per verificare tutto
2. **Durante sviluppo**: Usa `npm run test:watch` per feedback immediato
3. **Prima di push**: Esegui anche `npm run test:e2e` per verificare integrazione
4. **CI/CD**: Considera aggiungere questi test al pipeline CI/CD

## CI/CD Integration (Opzionale)

Esempio workflow GitHub Actions (`.github/workflows/test.yml`):

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:unit
      - run: npm run test:e2e
      - run: npm run test:validation
      - run: npm run test:accessibility
```

## Tecnologie Utilizzate

- **Vitest**: Framework unit testing (veloce, compatibile Jest API)
- **Playwright**: E2E testing con browser reali
- **jsdom**: Ambiente DOM per Vitest
- **axe-core**: Engine per accessibility testing
- **w3c-html-validator**: Validazione HTML W3C
- **@axe-core/playwright**: Integrazione axe-core con Playwright

## Supporto

Per problemi o domande sui test:
1. Verifica questa documentazione
2. Controlla la sezione Troubleshooting
3. Consulta la documentazione ufficiale delle tecnologie utilizzate

