# Componenti UI — Stili di Attaccamento

Libreria dei componenti **reali** del sito (definiti in `public/css/main.css`). Naming BEM esistente: `wiki-*`, `card`, `style-section`, `nav-*`, `breadcrumb`, `site-footer`. **Riusa questi componenti**, non crearne di paralleli. Tutti usano i token in [design-system.md](design-system.md).

Header, topbar/breadcrumb e footer sono iniettati via `js/template-loader.js` dai parziali in `public/templates/`.

---

## SiteHeader (`header` + `.nav-links`)

Barra sticky con logo, hamburger (mobile) e nav con submenu. Sorgente: `public/templates/header.html`.

```html
<header>
  <nav class="container" aria-label="Navigazione principale">
    <div class="logo"><a href="index.html">Stili di Attaccamento</a></div>
    <button type="button" class="hamburger" aria-label="Apri menu di navigazione"
            aria-expanded="false" aria-controls="navLinks" onclick="toggleMobileMenu()">
      <span class="hamburger-line" aria-hidden="true"></span>
      <span class="hamburger-line" aria-hidden="true"></span>
      <span class="hamburger-line" aria-hidden="true"></span>
    </button>
    <ul class="nav-links" id="navLinks">
      <li class="nav-item"><a href="test.html">Test</a></li>
      <li class="nav-item nav-item--has-submenu">
        <a href="fondamenti.html" class="nav-link--parent">Fondamenti</a>
        <button type="button" class="nav-submenu-toggle" aria-expanded="false"
                aria-controls="submenu-fondamenti" aria-label="Espandi sottomenu Fondamenti">
          <span class="nav-submenu-toggle-icon" aria-hidden="true">▶</span>
        </button>
        <ul class="nav-submenu" id="submenu-fondamenti"> … </ul>
      </li>
    </ul>
  </nav>
  <button type="button" class="mobile-menu-overlay" id="mobileMenuOverlay"
          aria-label="Chiudi menu di navigazione" aria-hidden="true" tabindex="-1"
          onclick="toggleMobileMenu()"></button>
</header>
```

- **CSS**: `header { background: var(--color-surface); border-bottom: 1px solid var(--color-border-soft); position: sticky; top: 0; z-index: 100; }`. Su Cloud Dancer la superficie piu' chiara stacca dallo sfondo pagina.
- **JS** (`mobile-menu.js`): `toggleMobileMenu()` apre il drawer (`.nav-links.active`), gestisce overlay e `aria-expanded`. `nav-highlight.js` aggiunge `.nav-link--active` con `aria-current="page"`.
- **ARIA**: `aria-expanded` su hamburger e toggle submenu; `aria-controls`; area tocco hamburger ≥44×44px.

---

## Topbar + Breadcrumb (`.topbar`, `.breadcrumb`)

Barra sotto l'header con il percorso. Sorgente: `public/templates/topbar.html`; generata da `js/breadcrumb-generator.js`. Schema.org `BreadcrumbList`.

```html
<div class="topbar" id="topbar">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol class="breadcrumb__list" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li class="breadcrumb__item" itemprop="itemListElement" itemscope
            itemtype="https://schema.org/ListItem">
          <a href="/" itemprop="item"><span itemprop="name">Home</span></a>
          <meta itemprop="position" content="1">
        </li>
        <li class="breadcrumb__item" aria-current="page" itemprop="itemListElement"
            itemscope itemtype="https://schema.org/ListItem">
          <span itemprop="name">Pagina corrente</span>
          <meta itemprop="position" content="2">
        </li>
      </ol>
    </nav>
  </div>
</div>
```

- **CSS**: `.topbar { background: var(--color-bg-primary); border-bottom: 1px solid var(--color-border); }` — stessa base Cloud Dancer della pagina. Su mobile la lista scrolla orizzontalmente senza wrap.

---

## Hero (`.hero`)

Intestazione della homepage / landing. Sfondo Cloud Dancer con decorazioni radiali tenui.

```html
<section class="hero">
  <div class="container">
    <span class="hero-tag">Consapevolezza, non guarigione</span>
    <h1>Dall'indipendenza solitaria alla <span class="accent-text">connessione sicura</span></h1>
    <p>Lead breve e accogliente.</p>
    <div class="btn-group">
      <a href="test.html" class="btn btn-primary">Fai il test</a>
      <a href="fondamenti.html" class="btn btn-secondary">Parti dalle basi</a>
    </div>
  </div>
</section>
```

- **CSS**: `.hero { background: var(--color-bg-primary); }` + `.hero::before` con gradienti `--color-bg-accent-*` (opacity 0.4). Testo centrato, `h1` max-width 900px.
- **Regola**: una sola CTA *primaria* (`btn-primary`); l'eventuale seconda azione e' `btn-secondary`.

---

## Bottoni (`.btn`)

```html
<a href="test.html" class="btn btn-primary">Fai il test</a>
<a href="fondamenti.html" class="btn btn-secondary">Scopri di piu'</a>
```

- `.btn`: pill (`--radius-full`), padding `--spacing-3 --spacing-8`, `font-weight: 500`.
- `.btn-primary`: `background: var(--color-accent-primary)`, `color: var(--color-on-accent-primary)` (bianco su verde — testo, non sfondo), `--shadow-md`.
- `.btn-secondary`: `background: var(--color-surface)`, testo near-black, bordo scuro `2px` per visibilita' su Cloud Dancer.
- **Focus**: `outline: 2px solid var(--color-accent-primary); outline-offset: 2px` (gia' globale).

---

## Card (`.card` e modificatori)

Contenitore principale dei contenuti. Card piu' chiare dello sfondo → elevation.

```html
<article class="card">
  <h3 class="card__title">Titolo</h3>
  <p class="card__lead">Riga di apertura piu' grande.</p>
  <p>Contenuto.</p>
  <a href="#" class="btn btn-primary">Azione</a>
</article>
```

- **CSS base**: `background: var(--color-surface); color: var(--color-text-primary); border-radius: var(--radius-xl); padding: var(--spacing-6); border: 1px solid var(--color-border-soft); box-shadow: var(--shadow-md);`
- **Hover**: `box-shadow: var(--shadow-lg)` + leggero `transform` (transizione breve).
- **Modificatori**:
  - `.card--accent` / `.card--accent-soft`: gradiente verde tenue + bordo sinistro `--color-accent-secure`
  - `.card--secure-accent` / `.card--elevated-spaced`: callout interno (sfondo elevato, bordo sinistro); `margin-top` + `margin-bottom` `--spacing-6`
  - `.card--elevated`: `background: var(--color-surface-elevated)`
  - `.card--accent-primary`: bordo sinistro accento primario
  - `.card--mono`: testo monospace (citazioni/codice)
  - `.card--spaced-top` / `--spaced-top-tight`: margine superiore
- **Spaziatura verso il blocco successivo:** regola globale `.card + h2/h3/…` (vedi [design-system.md](design-system.md) § Spacing).
- **Preferito per callout:** `.style-section` dentro una card. Se serve una `.card` annidata per enfasi (es. `card--secure-accent`), rispetta la spaziatura sopra; evita matrioska oltre un livello.

---

## StyleSection (`.style-section--*`)

Riquadro morbido per i 4 stili di attaccamento, da usare **dentro** una card o in colonna (evita la matrioska di card). Bordo sinistro colorato per stile.

```html
<div class="style-section style-section--secure">
  <h3 class="style-section__title">Attaccamento secure</h3>
  <p>…</p>
  <strong>Cosa noti</strong>
  <ul>
    <li>…</li>
  </ul>
</div>
```

- **CSS**: `background: var(--color-surface-soft); border-radius: var(--radius-lg); border: 1px solid var(--color-border-soft); border-left-width: 4px;`
- **Modificatori** (colore bordo sinistro):
  - `--secure` → verde (`--color-accent-secure`)
  - `--anxious` → rosso (`--color-accent-anxious`)
  - `--avoidant` → blu-verde scuro (`--color-accent-avoidant`)
  - `--disorganized` → beige (`--color-accent-disorganized`, lo stile **Oscillante**)
  - `--default` → accento primario
- Titolo in Playfair (`--font-family-heading`).

---

## Tipografia wiki (`.wiki-*`)

Classi per articoli e approfondimenti:

| Classe | Uso |
|--------|-----|
| `.wiki-lead` | Paragrafo di apertura (font-lg, max 42rem) |
| `.wiki-subheading` / `--tight` / `--section` / `--flush` | Sottotitoli in Playfair con spaziatura variabile |
| `.wiki-paragraph--spaced` / `--compact` / `--bottom-spaced` | Spaziatura paragrafi |
| `.wiki-list--compact`, `.wiki-list-item--spaced` | Liste (indentazione da regola base `ul`/`ol` in `main.css`) |
| `.wiki-note` / `--italic` | Note a font ridotto |
| `.wiki-indent` | Rientro |
| `.wiki-term` | Termine tecnico con `abbr` (sottolineatura punteggiata, `cursor: help`) |

Termine tecnico accessibile:

```html
<abbr title="Spiegazione breve in italiano" class="wiki-term">termine</abbr>
```

---

## WikiImage (`.wiki-image`)

Figura standard del sito. **Obbligatorie ≥2 immagini per nuova pagina** (regola `.cursorrules`).

```html
<figure class="wiki-image">
  <img src="images/pagina-posizione-1.webp"
       alt="Descrizione accessibile in italiano"
       width="800" height="600" loading="lazy" class="wiki-image__img">
  <figcaption class="wiki-image__caption">Didascalia opzionale.</figcaption>
</figure>
```

- Immagini WebP 800×600, `loading="lazy"` (tranne hero above-the-fold → `fetchpriority="high"` + preload).
- `alt` obbligatorio, descrittivo, in italiano.

---

## Banner (`.banner-horizontal`, `.banner-vertical`)

Richiami a contenuti/azioni con titolo, testo, eventuale tempo e CTA.

```html
<aside class="banner-horizontal">
  <div class="banner-horizontal__content">
    <h3 class="banner-horizontal__title">Titolo</h3>
    <p class="banner-horizontal__text">Testo.</p>
    <span class="banner-horizontal__time">5 min</span>
  </div>
  <a href="#" class="banner-horizontal__cta btn btn-primary">Vai</a>
</aside>
```

---

## BlogCard (`.blog-card`)

Card per archivio approfondimenti, con thumbnail 16:9.

```html
<article class="blog-card card">
  <img class="blog-card__thumbnail" src="images/x.webp" alt="…" loading="lazy">
  <h3 class="blog-card__title"><a href="approfondimenti/x.html">Titolo</a></h3>
  <p class="blog-card__excerpt">Estratto.</p>
  <a href="approfondimenti/x.html" class="blog-card__link btn btn-secondary">Leggi</a>
</article>
```

Usa `.blog-archive__grid` (grid) come contenitore.

---

## Grid e sezioni (`.section`, `.grid-2`, `.grid-3`)

```html
<section class="section">
  <h2 class="section-title">Titolo sezione</h2>
  <div class="grid grid-3">
    <article class="card">…</article>
    <article class="card">…</article>
    <article class="card">…</article>
  </div>
</section>
```

- `.grid` gap `--spacing-6`; `.grid-2` → 2 col da 600px; `.grid-3` → 2 col da 600px, 3 col da 960px.
- `.section` padding verticale `--spacing-12`; `.section--compact` riduce.

---

## ContentNav (`.content-nav`)

Navigazione prev/next o link correlati a fine pagina.

```html
<nav class="content-nav" aria-label="Contenuti correlati">
  <a href="#" class="content-nav__link">Pagina successiva →</a>
</nav>
```

---

## SiteFooter (`footer` / `.site-footer`)

Sorgente: `public/templates/footer.html`. Iniettato via template-loader.

```html
<footer class="site-footer" role="contentinfo">
  <div class="container site-footer__inner">
    <p class="site-footer__copy">Stili di Attaccamento — consapevolezza, non guarigione</p>
    <nav class="site-footer__legal" aria-label="Link legali">
      <a href="privacy-policy.html">Privacy</a>
      <a href="cookie-policy.html">Cookie</a>
      <a href="termini-condizioni.html">Termini</a>
    </nav>
  </div>
</footer>
```

- **CSS**: `background: var(--color-surface); border-top: 1px solid var(--color-border-soft);` padding con `env(safe-area-inset-bottom)`.

---

## WikiTable (`.wiki-table`)

Tabelle dati in articoli wiki (`fondamenti.html`, `modello-gradienti.html`).

```html
<div class="wiki-table-scroll">
  <table class="wiki-table wiki-table--flush">
    <thead>
      <tr class="wiki-table__head">
        <th>Colonna</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Etichetta</strong></td>
        <td>Testo</td>
      </tr>
    </tbody>
  </table>
</div>
```

- **Wrapper** `.wiki-table-scroll`: scroll orizzontale su mobile; bordo arrotondato.
- **Header**: sfondo `--md-sys-color-primary-container`, testo `--md-sys-color-on-primary-container`.
- **Body**: righe alternate (`--color-surface-soft`); prima colonna in grassetto.
- **Varianti**: `.wiki-table--grid` (griglia completa); `.wiki-table--center` (celle centrate); `.wiki-table--flush` (senza `margin-top` dentro lo scroll wrapper).
- **Hover** righe: solo desktop (`pointer: fine`).

---

## WikiTabs (`.wiki-tabs`) — pagine lunghe a schede

Progressive enhancement per wiki/guide con molte sezioni: una scheda per blocco, intro e footer fuori dalle schede. Modulo `public/js/modules/wiki-tabs.js`; abilitazione via `scripts/inject-wiki-tabs.js` + `scripts/wiki-tabs-config.json` (incluso in `npm run perf`).

**Markup atteso** (iniettato su `main > .container`):

```html
<div class="container"
     data-wiki-tabs
     data-wiki-tabs-section="article.card.mb-8, div.card.mb-8"
     data-wiki-tabs-min="5"
     data-wiki-tabs-pin-start=".card.card--accent-primary, .profile-hero"
     data-wiki-tabs-pin-end="section.section--compact, nav.content-nav, .card:not(.mb-8):not(.mb-6)">
  <!-- intro pin-start -->
  <article class="card mb-8"><h2>Sezione</h2>…</article>
  <!-- footer pin-end -->
</div>
<script src="js/modules/wiki-tabs.js?v=…" defer></script>
```

**Comportamento JS:** sezioni = figli diretti del container che matchano `data-wiki-tabs-section`; minimo `data-wiki-tabs-min` (default 5). Inserire il root `.wiki-tabs` **prima** di spostare le sezioni nei panel (ordine DOM critico). Deep link `#slug-h2`. ARIA tablist + frecce ←/→.

**UI (leggibilita'):**
- Heading `.wiki-tabs__heading`: «Sezioni in questa pagina»
- Griglia responsive (2 → 3 → 4 colonne), etichette H2 **complete** (no troncamento JS), `title` per tooltip
- Tab attiva: `--color-accent-primary` + `--color-on-accent-primary` (contrasto netto)
- Pannello nav: sfondo `--color-surface-soft`, bordo `--color-border-soft`

**Selettori per tipo pagina** (override in `wiki-tabs-config.json`):

| Tipo | `sectionSelector` tipico |
|------|--------------------------|
| Wiki | `article.card.mb-8, div.card.mb-8` |
| Profilo | `article.card.strategie-pratiche, article.card.mb-8` + `pin-start: .profile-hero` |
| Approfondimento | `div.card.mb-6, div.card.mb-8, article.card.mb-8` |
| Esercizi | `section.card.mb-8, section.mb-8, div.card.mb-8, details.card.mb-8` |

Senza JS: tutte le sezioni restano visibili (scroll unico).

---

## SiteNotice (`.site-notice`)

Informativa consenso cookie/analytics. Sorgente `js/site-notice.js`, **bundlata in `site.min.js`** (ultimo file in `build-js.js`); nessun `<script>` separato in HTML. Al consenso (`localStorage.cookie_consent` + scadenza `cookie_consent_date`) dispatch evento `cookie-consent-accepted` e `window.initAnalyticsIfConsented()` — GA4 solo via snippet inline in `<head>` (`templates/analytics-head.html`, `npm run inject-analytics`). Overlay fisso in basso, superficie chiara.

**Naming:** non usare `cookie-banner` in path file, id o classi CSS (liste ad blocker).

```html
<div class="site-notice" id="site-notice" role="dialog" aria-modal="true" aria-label="Informativa sui cookie">
  <div class="site-notice__content">
    <p class="site-notice__text" id="site-notice-text">
      Questo sito usa cookie tecnici…
      <a href="/cookie-policy.html" class="site-notice__link">Maggiori informazioni</a>
    </p>
    <div class="site-notice__actions">
      <button type="button" class="site-notice__button site-notice__button--accept" id="site-notice-accept">Accetta</button>
      <button type="button" class="site-notice__button site-notice__button--close" id="site-notice-close" aria-label="Chiudi">✕</button>
    </div>
  </div>
</div>
```

- `background: var(--color-surface)`; bottone "accept" near-black con testo bianco (testo su scuro = ok).
- localStorage wrappato in try/catch (modalità privata).
- **Nota:** `googletagmanager.com/gtag/js?id=G-…` e' il CDN ufficiale di gtag/GA4, non il container GTM.

---

## Utility

```css
.sr-only { /* solo screen reader */ }
.skip-link { /* visibile al focus da tastiera */ }
.text-center { text-align: center; }
.mt-1..8 / .mb-1..8 { /* margini verticali */ }
.color-secure / .color-anxious / .color-avoidant / .color-disorganized { /* colore testo per stile */ }
```

---

## Mappa modulo contenuto → componente

| Contenuto | Componente |
|-----------|------------|
| Intestazione homepage | `.hero` + `.hero-tag` + `.btn-group` |
| Percorso/breadcrumb | `.topbar` + `.breadcrumb` |
| Blocco contenuto | `.card` (+ modificatori) |
| Profilo/sezione stile | `.style-section--{secure,anxious,avoidant,disorganized}` |
| Articolo wiki | `.wiki-lead`, `.wiki-subheading`, `.wiki-note`, `.wiki-term` |
| Immagine | `.wiki-image` + `figcaption` |
| Tabella dati | `.wiki-table-scroll` + `.wiki-table` |
| Pagine lunghe (≥5 sezioni) | `.wiki-tabs` + `data-wiki-tabs*` |
| Richiamo/CTA secondaria | `.banner-horizontal` / `.banner-vertical` |
| Griglia di card | `.section` + `.grid-2`/`.grid-3` |
| Archivio approfondimenti | `.blog-card` + `.blog-archive__grid` |
| Correlati / prev-next | `.content-nav` |
| Consenso cookie/analytics | `.site-notice` (JS in `site.min.js`) |
