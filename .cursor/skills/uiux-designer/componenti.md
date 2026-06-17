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
  - `.card--elevated`: `background: var(--color-surface-elevated)`
  - `.card--accent-primary`: bordo sinistro accento primario
  - `.card--mono`: testo monospace (citazioni/codice)
  - `.card--spaced-top` / `--spaced-top-tight`: margine superiore
- **Vietato**: card dentro card. Per blocchi interni usa `.style-section` (vedi sotto).

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
| `.wiki-list--compact`, `.wiki-list-item--spaced` | Liste |
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

## CookieBanner (`.cookie-banner`)

Banner consenso (gestito da `js/cookie-banner.js`, abilita `gtm.js` post-consenso). Overlay fisso in basso, superficie chiara.

```html
<div class="cookie-banner" role="dialog" aria-live="polite" aria-label="Consenso cookie">
  <div class="cookie-banner__content">
    <p class="cookie-banner__text">Usiamo i cookie… <a class="cookie-banner__link" href="cookie-policy.html">Dettagli</a></p>
    <div class="cookie-banner__actions">
      <button class="cookie-banner__button cookie-banner__button--accept">Accetta</button>
      <button class="cookie-banner__button">Rifiuta</button>
    </div>
  </div>
</div>
```

- `background: var(--color-surface)`; bottone "accept" near-black con testo bianco (testo su scuro = ok).

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
| Richiamo/CTA secondaria | `.banner-horizontal` / `.banner-vertical` |
| Griglia di card | `.section` + `.grid-2`/`.grid-3` |
| Archivio approfondimenti | `.blog-card` + `.blog-archive__grid` |
| Correlati / prev-next | `.content-nav` |
