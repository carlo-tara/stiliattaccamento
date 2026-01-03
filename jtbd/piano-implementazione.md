# Piano di Implementazione - HTML/CSS/JavaScript

## Panoramica

Questo documento descrive il piano per generare i file HTML, CSS e JavaScript nella cartella `public/`, partendo dalle personas, job stories e design system definiti.

---

## 1. STRUTTURA FILE DA CREARE

### 1.1 Struttura Directory `public/`

```
public/
├── index.html              # Homepage wiki
├── css/
│   ├── main.css           # Stili principali, layout, typography
│   ├── themes.css         # Dark/light mode variables
│   └── components.css     # Componenti riutilizzabili
├── js/
│   ├── main.js            # Entry point, inizializzazione
│   ├── pwa.js             # Service Worker registration
│   ├── theme.js           # Dark/light mode toggle
│   └── modules/
│       ├── quiz.js        # Logica test auto-valutazione
│       ├── navigation.js  # Navigazione wiki, breadcrumbs
│       └── utils.js       # Utility functions
├── images/
│   ├── icons/             # Icone per stili e funzionalità
│   └── illustrations/     # Illustrazioni per articoli
├── icons/
│   ├── icon-192.png       # PWA icon 192x192
│   └── icon-512.png       # PWA icon 512x512
├── manifest.json          # PWA manifest
└── sw.js                  # Service Worker
```

### 1.2 Pagine HTML da Creare

#### Fase 1: MVP (Must Have)
1. **index.html** - Homepage con:
   - Hero section con CTA test
   - Overview stili di attaccamento
   - Link a sezioni principali

2. **test.html** - Test di auto-valutazione:
   - 12 domande interattive
   - Calcolo risultato
   - Mostra risultato personalizzato

3. **risultato.html** - Pagina risultato test:
   - Stile identificato + livello
   - Metafora corrispondente
   - Link a mappa personale
   - Link a profilo completo

4. **mappa-personale.html** - Mappa multidimensionale:
   - 5 dimensioni visualizzate
   - Profilo dettagliato
   - Link a esercizi specifici

5. **stili/** - Directory per ogni stile:
   - `secure.html`
   - `ansioso.html`
   - `evitante.html`
   - `disorganizzato.html`

#### Fase 2: Contenuti Principali
6. **fondamenti.html** - Teoria base
7. **esercizi.html** - Esercizi quotidiani
8. **relazioni.html** - Dinamiche di coppia
9. **approfondimenti/** - Directory approfondimenti tematici
10. **storie.html** - Storie reali di consapevolezza

---

## 2. PRIORITÀ IMPLEMENTAZIONE

### 2.1 Fase 1: Foundation (Settimane 1-2)

**Obiettivo**: Creare struttura base e funzionalità core.

#### Task 1.1: Setup Base
- [ ] Creare struttura directory `public/`
- [ ] Creare `index.html` base con struttura semantica
- [ ] Implementare CSS base (`main.css`, `themes.css`)
- [ ] Implementare dark/light mode toggle
- [ ] Testare responsive design base

**Job Stories soddisfatte**: 3.1 (navigazione), 6.3 (struttura)

#### Task 1.2: Design System CSS
- [ ] Implementare variabili CSS (colori, spacing, typography)
- [ ] Creare componenti base (cards, buttons)
- [ ] Implementare typography scale
- [ ] Testare contrast ratio (WCAG AA)

**Job Stories soddisfatte**: Tutte (base visiva)

#### Task 1.3: PWA Setup
- [ ] Creare `manifest.json`
- [ ] Implementare Service Worker base (`sw.js`)
- [ ] Creare PWA icons (192x192, 512x512)
- [ ] Testare installabilità PWA

**Job Stories soddisfatte**: N/A (infrastruttura)

### 2.2 Fase 2: Core Features (Settimane 3-4)

**Obiettivo**: Implementare funzionalità essenziali per personas principali.

#### Task 2.1: Test Auto-Valutazione
- [ ] Creare `test.html` con 12 domande
- [ ] Implementare logica quiz (`js/modules/quiz.js`)
- [ ] Calcolo punteggi e identificazione stile
- [ ] Creare `risultato.html` con risultato personalizzato
- [ ] Collegare test a homepage

**Job Stories soddisfatte**: 
- 1.1 (Chiara: scoprire stile)
- 4.5 (Luca: capire perché relazioni falliscono)

#### Task 2.2: Mappa Personale
- [ ] Creare `mappa-personale.html`
- [ ] Implementare visualizzazione 5 dimensioni
- [ ] Mostrare profilo dettagliato basato su risultato test
- [ ] Collegare a risultato test

**Job Stories soddisfatte**:
- 1.2 (Chiara: capire significato risultato)
- 4.2 (Luca: capire se c'è speranza)

#### Task 2.3: Pagine Stili
- [ ] Creare `stili/secure.html`
- [ ] Creare `stili/ansioso.html`
- [ ] Creare `stili/evitante.html`
- [ ] Creare `stili/disorganizzato.html`
- [ ] Includere per ogni stile:
  - Profilo (infanzia + adulto)
  - Strategie pratiche
  - Esercizi specifici
  - Metafora corrispondente

**Job Stories soddisfatte**:
- 1.3 (Chiara: strategie pratiche)
- 2.1 (Marco: capire comportamento partner)
- 2.3 (Marco: capire ruolo)

### 2.3 Fase 3: Contenuti e Funzionalità (Settimane 5-6)

**Obiettivo**: Aggiungere contenuti principali e funzionalità avanzate.

#### Task 3.1: Navigazione e Struttura
- [ ] Implementare menu navigazione (`js/modules/navigation.js`)
- [ ] Creare breadcrumbs
- [ ] Implementare ricerca (opzionale, client-side)
- [ ] Creare indice generale

**Job Stories soddisfatte**:
- 3.1 (Elena: navigare per argomento)
- 6.3 (Andrea: navigare sistematicamente)

#### Task 3.2: Storie Reali
- [ ] Creare `storie.html`
- [ ] Mostrare storie per stile identificato
- [ ] Filtrare storie per stile
- [ ] Collegare da risultato test

**Job Stories soddisfatte**:
- 1.4 (Chiara: leggere storie simili)
- 4.2 (Luca: vedere speranza)

#### Task 3.3: Dinamiche di Coppia
- [ ] Creare `relazioni.html`
- [ ] Sezione "Ansioso + Evitante"
- [ ] Sezione "Come supportare il partner"
- [ ] Esempi pratici di comunicazione

**Job Stories soddisfatte**:
- 1.5 (Chiara: capire dinamica coppia)
- 2.3 (Marco: capire ruolo)
- 5.2 (Sofia: supportare partner)
- 5.4 (Sofia: capire dinamica)

#### Task 3.4: Esercizi Pratici
- [ ] Creare `esercizi.html`
- [ ] Lista esercizi per ogni stile
- [ ] Step-by-step per ogni esercizio
- [ ] Collegare da pagine stili

**Job Stories soddisfatte**:
- 1.3 (Chiara: strategie pratiche)
- 2.4 (Marco: esercizi pratici)
- 4.3 (Luca: primo passo)

### 2.4 Fase 4: Approfondimenti (Settimane 7-8)

**Obiettivo**: Aggiungere contenuti avanzati per personas esperti.

#### Task 4.1: Fondamenti Teorici
- [ ] Creare `fondamenti.html`
- [ ] Sezione "Cos'è l'Attaccamento"
- [ ] Sezione "Internal Working Models"
- [ ] Riferimenti bibliografici

**Job Stories soddisfatte**:
- 6.1 (Andrea: approfondire teoria)
- 3.2 (Elena: verificare fonti)

#### Task 4.2: Approfondimenti Tematici
- [ ] Creare directory `approfondimenti/`
- [ ] Implementare almeno 3 approfondimenti principali:
  - Attaccamento e Sessualità
  - Attaccamento e Famiglia
  - Attaccamento e Lavoro
- [ ] Collegare da menu principale

**Job Stories soddisfatte**:
- 3.3 (Elena: approfondire tematiche)
- 6.4 (Andrea: approfondire tematiche)

#### Task 4.3: Schema.org e SEO
- [ ] Aggiungere Schema.org markup a tutte le pagine
- [ ] Meta tags SEO appropriati
- [ ] Sitemap.xml
- [ ] robots.txt

**Job Stories soddisfatte**: N/A (SEO/accessibilità)

---

## 3. IMPLEMENTAZIONE TECNICA

### 3.1 HTML Structure Template

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Titolo Pagina | Stili di Attaccamento</title>
  
  <!-- Meta SEO -->
  <meta name="description" content="...">
  
  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "...",
    "description": "..."
  }
  </script>
  
  <!-- CSS -->
  <link rel="stylesheet" href="/css/main.css">
  <link rel="stylesheet" href="/css/themes.css">
  <link rel="stylesheet" href="/css/components.css">
  
  <!-- PWA -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#1a1a2e">
</head>
<body>
  <header>
    <!-- Navigation -->
  </header>
  
  <main>
    <article class="wiki-article">
      <!-- Content -->
    </article>
  </main>
  
  <footer>
    <!-- Footer -->
  </footer>
  
  <!-- JavaScript -->
  <script src="/js/main.js"></script>
  <script src="/js/theme.js"></script>
</body>
</html>
```

### 3.2 JavaScript Modules Pattern

```javascript
// js/modules/quiz.js
export class Quiz {
  constructor() {
    this.questions = [...];
    this.answers = [];
  }
  
  calculateResult() {
    // Logica calcolo
  }
  
  showResult() {
    // Mostra risultato
  }
}

// js/main.js
import { Quiz } from './modules/quiz.js';

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.quiz-container')) {
    const quiz = new Quiz();
    quiz.init();
  }
});
```

### 3.3 CSS Organization

```css
/* main.css */
@import './themes.css';

/* Base styles */
* { ... }
body { ... }

/* Layout */
.container { ... }
.grid { ... }

/* Typography */
h1, h2, h3 { ... }

/* components.css */
@import './themes.css';

/* Components */
.wiki-card { ... }
.button { ... }
```

---

## 4. CONTENUTI DA INTEGRARE

### 4.1 Fonti Contenuti

I contenuti provengono da:
- `docs/stili-attaccamento-wiki.md` - Contenuti principali
- `docs/mappa-personale.md` - Mappa e profili
- `docs/metafore-attaccamento.md` - Metafore
- `docs/storie-reali-consapevolezza.md` - Storie
- `docs/test-autovalutazione.md` - Test
- `docs/10-approfondimenti-tematici.md` - Approfondimenti

### 4.2 Processo Conversione Markdown → HTML

1. **Leggere file markdown** da `docs/`
2. **Convertire a HTML** mantenendo struttura
3. **Aggiungere Schema.org markup**
4. **Aggiungere classi CSS appropriate**
5. **Collegare a navigazione**
6. **Testare responsive**

### 4.3 Esempio Conversione

**Markdown** (`docs/stili-attaccamento-wiki.md`):
```markdown
## 1️⃣ ATTACCAMENTO SICURO

### Profilo Infantile
- Esplora liberamente...
```

**HTML** (`public/stili/secure.html`):
```html
<section class="wiki-section">
  <h2>1️⃣ Attaccamento Sicuro</h2>
  
  <h3>Profilo Infantile</h3>
  <ul class="wiki-list">
    <li>Esplora liberamente...</li>
  </ul>
</section>
```

---

## 5. TESTING E QUALITY ASSURANCE

### 5.1 Checklist Pre-Deploy

#### HTML
- [ ] Validazione W3C HTML Validator (nessun error)
- [ ] Schema.org markup presente e valido
- [ ] Meta tags SEO completi
- [ ] Attributi ARIA per accessibilità

#### CSS
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark/light mode funzionante
- [ ] Contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Nessun CSS non utilizzato

#### JavaScript
- [ ] Nessun error in console
- [ ] Funzionalità testate su più browser
- [ ] Service Worker funzionante
- [ ] PWA installabile

#### Performance
- [ ] Lighthouse score > 90 (tutte le categorie)
- [ ] Immagini ottimizzate (WebP, lazy loading)
- [ ] CSS/JS minificati (produzione)
- [ ] Bundle size < target

#### Accessibilità
- [ ] Keyboard navigation funzionante
- [ ] Screen reader friendly
- [ ] Focus indicators visibili
- [ ] Alt text per immagini

### 5.2 Browser Testing

**Browser da testare**:
- Chrome (ultime 2 versioni)
- Firefox (ultime 2 versioni)
- Safari (ultime 2 versioni)
- Edge (ultime 2 versioni)
- Mobile: iOS Safari, Chrome Android

---

## 6. TIMELINE REALISTICA

### Settimana 1-2: Foundation
- Setup struttura base
- Design system CSS
- PWA setup
- Homepage base

### Settimana 3-4: Core Features
- Test auto-valutazione
- Mappa personale
- Pagine 4 stili base

### Settimana 5-6: Contenuti
- Navigazione completa
- Storie reali
- Dinamiche di coppia
- Esercizi pratici

### Settimana 7-8: Approfondimenti
- Fondamenti teorici
- Approfondimenti tematici
- SEO e Schema.org
- Testing completo

### Settimana 9: Polish e Deploy
- Bug fixes
- Performance optimization
- Final testing
- Deploy su Cloudflare Pages

---

## 7. RISORSE E RIFERIMENTI

### 7.1 Documenti di Riferimento
- `jtbd/personas.md` - Personas
- `jtbd/job-stories.md` - Job stories
- `jtbd/design-system.md` - Design system
- `docs/` - Contenuti markdown
- `ARCHITECTURE.txt` - Architettura tecnica
- `STANDARD.TXT` - Standard di codice

### 7.2 Tools e Risorse
- **HTML Validator**: https://validator.w3.org/
- **Lighthouse**: Chrome DevTools
- **Color Contrast**: https://webaim.org/resources/contrastchecker/
- **Schema.org Validator**: https://validator.schema.org/
- **PWA Builder**: https://www.pwabuilder.com/

---

## 8. NOTE FINALI

### 8.1 Priorità Assoluta
1. **Test auto-valutazione** - Entry point principale
2. **Risultato personalizzato** - Prima impressione
3. **Pagine stili base** - Contenuti core
4. **Mappa personale** - Funzionalità unica

### 8.2 Approccio Incrementale
- Implementare feature per feature
- Testare ogni feature prima di passare alla successiva
- Deploy incrementale su branch separati
- Feedback continuo durante sviluppo

### 8.3 Focus Personas
- **MVP**: Focus su "La Curiosa" (Chiara) e "Il Disperato" (Luca)
- **Fase 2**: Aggiungere supporto per "Il Pratico" (Marco) e "La Partner Supportiva" (Sofia)
- **Fase 3**: Contenuti avanzati per "La Consapevole" (Elena) e "Il Ricercatore" (Andrea)

---

*Documento creato: 2024*
*Versione: 1.0*

