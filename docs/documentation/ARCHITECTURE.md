ARCHITETTURA DEL PROGETTO - STILI DI ATTACCAMENTO WIKI
========================================================

Versione: 1.1.0
Data: 2025-01-03

Questo documento descrive l'architettura tecnica e concettuale del progetto.

================================================================================
1. PANORAMICA
================================================================================

1.1 Descrizione
  Webapp PWA statica mobile-first che presenta una wiki sugli stili di 
  attaccamento (teoria di Bowlby e Ainsworth). Il sito è organizzato come 
  una wiki con homepage e navigazione gerarchica.

1.2 Obiettivi
  - Fornire informazioni accessibili sugli stili di attaccamento
  - Promuovere consapevolezza (non "guarigione")
  - Essere ottimizzato per SEO e AI
  - Essere accessibile e mobile-first
  - Funzionare offline (PWA)

1.3 Principi Architetturali
  - Semplicità: vanilla HTML/CSS/JS, dipendenze minime (SurveyJS, Chart.js via CDN)
  - Performance: bundle size minimo, lazy loading
  - Accessibilità: WCAG 2.1 AA compliance
  - Mobile-first: design responsive
  - Offline-first: PWA con Service Worker
  - Linguaggio inclusivo: termini neutri, terminologia "Oscillante" invece di "Disorganizzato"
  - Personas-driven: contenuti allineati alle esigenze delle personas

================================================================================
2. STACK TECNOLOGICO
================================================================================

2.1 Frontend
  - HTML5: Markup semantico, Schema.org structured data
  - CSS3: Vanilla CSS, Material Design M3, light mode (default)
  - JavaScript: ES6+ vanilla, modulare, Service Worker
  - Librerie esterne (CDN): SurveyJS (quiz), Chart.js (visualizzazioni)

2.2 Hosting e Deploy
  - Cloudflare Pages: hosting statico, HTTPS automatico
  - GitHub: version control, CI/CD automatico
  - Deploy: automatico da branch main

2.3 Design System
  - Material Design M3 (Material You)
  - Light mode: default e unico, colori pastello naturali verde-beige
  - Contrasti ottimizzati per WCAG AA compliance

2.4 External Services
  - Qwen Text2Image API: generazione immagini (DashScope, credenziali in .env)
  - ImageMagick: processamento immagini (convert, installato su sistema)
  - SurveyJS: libreria per quiz interattivi (CDN)
  - Chart.js: libreria per visualizzazioni dati (CDN)

================================================================================
3. STRUTTURA PROGETTO
================================================================================

3.1 Directory Tree
  stiliattaccamento/
  ├── docs/                    # Documenti di specifica
  │   ├── *.md                 # Documenti markdown
  │   └── *.pdf                # Documenti PDF
  │
  ├── jtbd/                    # Jobs-to-be-Done
  │   └── *.md                 # Personas e job stories
  │
  ├── public/                  # File statici (pubblicati)
  │   ├── index.html           # Homepage wiki
  │   ├── css/
  │   │   ├── main.css         # Stili principali
  │   │   ├── themes.css       # Dark/light mode
  │   │   └── components.css   # Componenti riutilizzabili
  │   ├── js/
  │   │   ├── main.js          # Entry point
  │   │   ├── theme.js         # Theme toggle
  │   │   ├── mobile-menu.js   # Menu hamburger mobile
  │   │   ├── template-loader.js # Caricamento template HTML
  │   │   ├── breadcrumb-generator.js # Generazione breadcrumb
  │   │   ├── cookie-banner.js # Gestione cookie banner
  │   │   ├── test-surveyjs.js # Integrazione SurveyJS quiz
  │   │   ├── mappa-personale.js # Visualizzazione radar chart
  │   │   ├── constants.js     # Costanti centralizzate
  │   │   ├── logger.js        # Utility logging
  │   │   ├── utils.js         # Utility functions
  │   │   ├── config-surveyjs.js # Config SurveyJS
  │   │   └── config-chartjs.js # Config Chart.js
  │   ├── images/              # Immagini statiche
  │   ├── icons/               # PWA icons (192x192, 512x512)
  │   ├── manifest.json        # PWA manifest
  │   └── sw.js                # Service Worker
  │
  ├── scripts/                 # Script di generazione
  │   ├── generate-images.js   # Generazione immagini Qwen
  │   ├── prompts.json         # Prompt per immagini
  │   └── README.md            # Documentazione script
  ├── docs/
  │   └── image-generated/     # Immagini raw generate (PNG)
  ├── .env.example             # Template variabili ambiente
  ├── CONTRIBUTING.md          # Guida contributori
  ├── .cursorrules             # Regole AI assistant
  ├── STANDARDS.md             # Standard di codice
  ├── SECURITY.md              # Policy sicurezza
  └── [altri file doc root]

3.2 File Statici (public/)
  La directory public/ contiene TUTTI i file che verranno pubblicati su 
  Cloudflare Pages. Nessun file di build o configurazione deve essere 
  in public/.

================================================================================
4. ARCHITETTURA FRONTEND
================================================================================

4.1 Struttura HTML
  Ogni pagina HTML segue questa struttura:
  
  <!DOCTYPE html>
  <html lang="it">
  <head>
    <!-- Meta tags, Schema.org, CSS -->
  </head>
  <body>
    <header>...</header>
    <nav>...</nav>
    <main>
      <article>
        <!-- Contenuto wiki -->
      </article>
    </main>
    <footer>...</footer>
    <!-- JavaScript -->
  </body>
  </html>

4.2 Organizzazione CSS
  - main.css: Layout, typography, base styles
  - themes.css: Dark/light mode variables e overrides
  - components.css: Componenti riutilizzabili (cards, buttons, etc.)

4.3 Organizzazione JavaScript
  - main.js: Inizializzazione, event listeners globali
  - theme.js: Dark/light mode toggle logic
  - test-surveyjs.js: Integrazione SurveyJS per quiz
  - mappa-personale.js: Logica visualizzazione radar chart (Chart.js)
  - mobile-menu.js: Gestione menu hamburger mobile (sempre visibile su tutte le risoluzioni)
  - template-loader.js: Caricamento dinamico template HTML (header, footer, topbar)
  - breadcrumb-generator.js: Generazione breadcrumb navigation con Schema.org markup
  - cookie-banner.js: Gestione cookie banner e consenso
  - constants.js: Costanti centralizzate
  - logger.js: Utility logging centralizzata
  - utils.js: Utility functions (sanitizzazione, validazione)
  - config-surveyjs.js: Configurazione tema SurveyJS
  - config-chartjs.js: Configurazione Chart.js

4.4 Moduli JavaScript
  - test-surveyjs.js: Gestione quiz con SurveyJS
  - mappa-personale.js: Visualizzazione profilo con Chart.js radar chart
  - mobile-menu.js: Menu hamburger con submenu, event delegation, gestione Escape key
  - template-loader.js: Caricamento asincrono template HTML con correzione percorsi relativi
  - breadcrumb-generator.js: Generazione breadcrumb dinamici con Schema.org BreadcrumbList
  - utils.js: Utility functions (sanitizzazione XSS, validazione)

================================================================================
5. DESIGN SYSTEM
================================================================================

5.1 Material Design M3
  - Segue linee guida Material You
  - Type scale: Material Design typography
  - Spacing scale: 4dp grid system
  - Componenti: Cards, Buttons, Navigation, etc.

5.2 Theming
  - Light mode: default e unico, colori pastello naturali verde-beige
  - CSS custom properties per colori
  - Contrasti ottimizzati per WCAG AA compliance

5.3 Responsive Design
  - Mobile-first: default per mobile (< 600px)
  - Breakpoints:
    * Tablet: 600px
    * Desktop: 960px
    * Large desktop: 1280px

5.4 Typography
  - Font: System fonts stack (performance)
  - Scale: Material Design type scale
  - Line height: 1.5 per leggibilità

================================================================================
6. PWA ARCHITECTURE
================================================================================

6.1 Manifest (manifest.json)
  - Metadata app (name, description, icons)
  - Display mode: standalone
  - Theme colors: pastello
  - Start URL: /

6.2 Service Worker (sw.js)
  - Cache strategy:
    * Assets (CSS/JS/images): Cache First
    * HTML: Network First, fallback cache
  - Offline fallback: pagina offline.html
  - Update mechanism: check for updates on load

6.3 Icons
  - Formati: PNG
  - Dimensioni: 192x192, 512x512
  - Posizione: public/icons/

6.4 Offline Functionality
  - Tutte le pagine visitate sono cached
  - Funziona offline dopo prima visita
  - Fallback graceful per risorse non cached

================================================================================
7. SEO E AI OPTIMIZATION
================================================================================

7.1 Schema.org Structured Data
  Ogni pagina wiki include:
  - @type: Article
  - headline, description, author
  - datePublished, dateModified
  - articleBody, mainEntityOfPage

7.2 Meta Tags
  - description: 150-160 caratteri
  - og:title, og:description, og:image
  - twitter:card (se applicabile)

7.3 Semantic HTML
  - Uso corretto di heading hierarchy (h1 → h2 → h3)
  - Elementi semantici (article, section, nav)
  - Alt text per immagini
  - ARIA labels quando necessario

7.4 AI-Friendly Content
  - Linguaggio chiaro e strutturato
  - Paragrafi brevi e focalizzati
  - Liste per informazioni strutturate
  - Glossario per termini tecnici

================================================================================
8. NAVIGAZIONE E ROUTING
================================================================================

8.1 Struttura Wiki
  Homepage (index.html)
  ├── Fondamenti
  ├── I 4 Stili Base
  │   ├── Secure
  │   ├── Ansioso-Preoccupato
  │   ├── Evitante-Dismissivo
  │   └── Oscillante (Fearful-Avoidant)
  ├── 12 Profili (4 stili × 3 livelli)
  ├── Test Auto-Valutazione
  ├── Mappa Personale
  ├── Dinamiche di Coppia
  ├── Come Supportare il Partner
  ├── Quando Cercare Aiuto
  ├── Esercizi Pratici
  ├── Storie Reali
  ├── Approfondimenti Tematici (11 temi)
  ├── Libri (10 approfondimenti)
  └── Risorse

8.2 Routing
  - Static routing: ogni pagina = file HTML
  - Nessun routing client-side (sito statico)
  - URL structure: /page-name.html
  - Nuove pagine principali:
    * /dinamiche-coppia.html
    * /come-supportare-partner.html
    * /quando-cercare-aiuto.html
    * /checklist-rapide.html (se creata)

8.3 Breadcrumbs
  - Implementati via JavaScript (navigation.js)
  - Schema.org BreadcrumbList markup
  - Navigazione gerarchica visibile

8.4 Navigation Menu
  - Menu hamburger sempre visibile su tutte le risoluzioni (mobile-first design)
  - Menu drawer-style che scorre da destra su tutte le risoluzioni
  - Submenu espandibili con event delegation
  - Chiusura menu con tasto Escape
  - Overlay per bloccare scroll quando menu aperto
  - Highlight pagina corrente
  - Accessibilità: ARIA labels, keyboard navigation completa

================================================================================
9. GESTIONE STATO
================================================================================

9.1 Local Storage
  - Theme preference (light mode)
  - Quiz results: punteggi test, stile primario, livello (chiave: 'testResults')
  - Mappa personale: punteggi 5 dimensioni (chiave: 'mappaPersonale')
  - Nessun dato sensibile

9.2 Session Storage
  - Stato temporaneo (es. form non inviato)
  - Clear on tab close

9.3 State Management
  - Nessun framework state management
  - Event-driven architecture
  - Custom events per comunicazione tra moduli

================================================================================
10. PERFORMANCE
================================================================================

10.1 Optimization Strategies
  - Minifica CSS/JS per produzione
  - Ottimizza immagini (WebP quando possibile)
  - Lazy loading immagini
  - Preload risorse critiche
  - Service Worker caching

10.2 Bundle Size Targets
  - CSS: < 50KB (gzipped)
  - JS: < 100KB (gzipped)
  - Immagini: < 200KB ciascuna (quando possibile)

10.3 Lighthouse Goals
  - Performance: > 90
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 90

================================================================================
11. ACCESSIBILITÀ
================================================================================

11.1 WCAG 2.1 AA Compliance
  - Contrast ratio: minimo 4.5:1 per testo
  - Keyboard navigation: completa
  - Screen reader: ARIA labels, semantic HTML
  - Focus indicators: visibili

11.2 Implementation
  - Semantic HTML5
  - ARIA attributes quando necessario
  - Alt text per immagini
  - Form labels associati
  - Skip links per navigazione

================================================================================
12. IMMAGINI E MEDIA
================================================================================

12.1 Immagini Statiche
  - Formato: WebP (con fallback PNG)
  - Lazy loading: attributo loading="lazy"
  - Responsive: srcset per diverse risoluzioni
  - Alt text: sempre presente

12.2 Immagini LLM-Generated
  - Generate via Qwen Text2Image API (qwen-image-plus)
  - Credenziali in .env: QWEN_API_KEY, QWEN_URL_IMAGE, QWEN_MODEL_IMAGE
  - Processo di generazione:
    * API chiamata via script Node.js (scripts/generate-images.js)
    * Chiamate asincrone con polling del task status
    * Immagini raw salvate in docs/image-generated/ (PNG, 1328x1328px)
    * Processamento automatico con ImageMagick:
      - Conversione in WebP
      - Ridimensionamento a 800x600px
      - Ritaglio centrato se necessario
    * Immagini finali salvate in public/images/ (WebP, 800x600px)
  - **OBBLIGATORIO**: Ogni nuova pagina HTML deve includere almeno 2 immagini
  - Prompt in scripts/prompts.json (SOLO pittoriche/visuali, no testo sovraimpresso)
  - Vedi scripts/README.md e scripts/ENV_SETUP.md per dettagli

12.3 Icons
  - SVG quando possibile (scalabili)
  - PNG per PWA icons (192x192, 512x512)
  - Icon font (opzionale, se necessario)

================================================================================
13. DEPLOY E CI/CD
================================================================================

13.1 Cloudflare Pages
  - Build command: nessuno (file statici)
  - Output directory: public/
  - Deploy automatico da branch main
  - Preview deployments per PR

13.2 GitHub Workflow
  1. Push to main → Cloudflare Pages deploy automatico
  2. PR → Preview deployment
  3. Merge → Production deploy

13.3 Environment Variables
  - Configurate in Cloudflare Pages dashboard
  - LLM API keys solo in env vars
  - Non committate nel repository

================================================================================
14. TESTING STRATEGY
================================================================================

14.1 Manual Testing
  - Browser testing (Chrome, Firefox, Safari)
  - Mobile testing (iOS, Android)
  - Responsive design testing
  - Accessibility testing (keyboard, screen reader)
  - PWA testing (install, offline)

14.2 Automated Testing

14.2.1 Validation Scripts
  Il progetto include una suite di script di validazione in `tests/validation/`:
  
  - **html-validator.js**: Verifica sintassi HTML base, DOCTYPE, meta tags
  - **css-validator.js**: Verifica sintassi CSS
  - **link-checker.js**: Verifica link interni validi
  - **schema-org-checker.js**: Verifica presenza e validità Schema.org markup
  - **style-validator.js**: Verifica conformità linee guida stile linguistico
  
  Esegui tutti i validator:
  ```bash
  node tests/validation/run-all.cjs
  ```

14.2.2 Style Validator
  Il validator di stile linguistico (`style-validator.js`) verifica:
  
  - **Pattern da IA**: Rileva frasi riconoscibili da IA come "È importante notare che",
    "Vale la pena ricordare che", "Si suggerisce di", ecc.
  - **Linguaggio inclusivo**: Verifica uso di termini neutri (no "lui/lei", "insoddisfatto/a"),
    uso corretto di "partner" invece di riferimenti di genere
  - **Terminologia**: Verifica che "oscillante" sia usato invece di "disorganizzato"
    (tranne nomi file per retrocompatibilità)
  
  Questo garantisce che tutti i contenuti rispettino le linee guida di tono di voce
  e stile linguistico definite in `.cursorrules` e `CONTRIBUTING.md`.

14.2.3 Unit Tests
  - Unit test in `tests/unit/` usando Vitest
  - Test di utilità, moduli JS, componenti interattivi
  
14.2.4 Other Tools
  - (Opzionale) Lighthouse CI
  - (Opzionale) Accessibility testing tools

14.3 Performance Testing
  - Lighthouse audits
  - Network throttling tests
  - Bundle size monitoring

================================================================================
15. FUTURE ENHANCEMENTS
================================================================================

15.1 Possibili Aggiunte
  - Search functionality (client-side)
  - Checklist rapide pagina (in sviluppo)
  - User accounts (se necessario)
  - Comments system (se necessario)
  - Analytics (privacy-first)
  - Newsletter signup
  - Filtri per storie reali per stile di attaccamento

15.2 Scalability Considerations
  - Attualmente: sito statico, scala automaticamente
  - Se aggiungi backend: considerare architettura serverless
  - CDN: Cloudflare fornisce CDN globale

================================================================================
16. DIAGRAMMI ARCHITETTURALI
================================================================================

16.1 Component Architecture
  ┌─────────────────────────────────────┐
  │         HTML Pages (Static)         │
  │  index.html, stili/*.html, etc.     │
  └──────────────┬──────────────────────┘
                 │
  ┌─────────────┴─────────────┐
  │                           │
  ▼                           ▼
  ┌──────────────┐    ┌──────────────┐
  │   CSS Files  │    │   JS Files   │
  │  main.css    │    │  main.js     │
  │  themes.css  │    │  theme.js    │
  │  components  │    │  mobile-menu.js │
  └──────────────┘    │  template-loader.js │
                      │  ... (altri moduli) │
                      └──────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │ Service Worker│
                      │    (sw.js)    │
                      └──────────────┘

16.2 Data Flow
  User Request
      │
      ▼
  Cloudflare Pages (CDN)
      │
      ▼
  Static Files (HTML/CSS/JS)
      │
      ▼
  Browser
      │
      ├──► Service Worker (Cache)
      ├──► Local Storage (Theme)
      └──► LLM API (Images, if needed)

================================================================================
17. DECISIONI ARCHITETTURALI
================================================================================

17.1 Perché Vanilla JS/CSS?
  - Bundle size minimo
  - Performance migliore
  - Dipendenze minime (solo SurveyJS e Chart.js via CDN per funzionalità specifiche)
  - Semplicità di manutenzione

17.5 Perché SurveyJS e Chart.js?
  - SurveyJS: Quiz interattivi complessi senza dover costruire form da zero
  - Chart.js: Visualizzazioni dati professionali (radar chart per mappa personale)
  - Entrambi via CDN: nessuna dipendenza nel bundle, aggiornamenti automatici

17.2 Perché Cloudflare Pages?
  - Hosting statico gratuito
  - HTTPS automatico
  - CDN globale
  - Deploy automatico da GitHub

17.3 Perché PWA?
  - Offline functionality
  - Installabile su mobile/desktop
  - Migliore UX
  - Performance migliorata (caching)

17.4 Perché Material Design M3?
  - Design system completo
  - Accessibilità built-in
  - Dark/light mode support
  - Familiarità utenti

================================================================================
18. DOCUMENTAZIONE CORRELATA
================================================================================

18.1 File di Riferimento
  - CONTRIBUTING.md: Come contribuire
  - STANDARDS.md: Standard di codice
  - SECURITY.md: Policy sicurezza
  - .cursorrules: Regole AI assistant

18.2 Documenti Contenuto
  - docs/: Documenti di specifica (contenuti wiki, approfondimenti)
  - jtbd/: Personas e job stories (user research)
  
18.3 Note Importanti
  - **Terminologia**: Usa sempre "Oscillante" invece di "Disorganizzato"
  - **Linguaggio inclusivo**: Termini neutri (persona, partner, chi)
  - **Personas-driven**: Contenuti allineati a personas.md e job-stories.md

================================================================================
FINE ARCHITETTURA
================================================================================

Questo documento è un documento vivente e sarà aggiornato quando l'architettura 
evolve. Per domande o chiarimenti, consulta CONTRIBUTING.md o apri una issue.

