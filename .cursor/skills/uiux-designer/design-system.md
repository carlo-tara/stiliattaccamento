# Design System — Stili di Attaccamento

Sistema basato su **Material 3 tokens** implementati come CSS custom properties. Nessun framework, nessun bundler. Tema **light-only forzato**. Base visuale: **Cloud Dancer**.

File CSS caricati in produzione (in ogni pagina, in quest'ordine):

1. `public/css/main.css` — reset, layout, tipografia, componenti, utility
2. `public/css/themes.css` — token Material 3 + mapping verso le variabili di progetto

> `light.css`, `dark.css`, `*-hc.css` esistono ma **non sono linkati**: sono fonti documentali/legacy. La fonte di verita' dei token attivi e' `themes.css`. Mantieni `light.css` allineato per coerenza.

---

## Palette Cloud Dancer

**Cloud Dancer** (PANTONE 11-4201 TCX) = off-white caldo, `#F0EEE9` → `rgb(240 238 233)`.

Filosofia colore:

| Ruolo | Scelta | Motivo |
|-------|--------|--------|
| Sfondo pagina | Cloud Dancer `rgb(240 238 233)` | Caldo, riposante, meno abbagliante del bianco puro |
| Superfici / card | Quasi-bianco `rgb(248 247 243)` | Piu' chiare dello sfondo → elevation morbida |
| Testo | Near-black `rgb(0 0 0)` / `rgb(10 10 10)` | Contrasto massimo (AAA) sul caldo |
| Accento primario | Verde naturale `rgb(60 110 85)` | Brand, CTA, link |
| Accenti stili | verde / rosso / blu-verde / beige | 4 stili di attaccamento |

### Scala superfici (token `--md-sys-color-*`)

```css
--md-sys-color-background: rgb(240 238 233);            /* Cloud Dancer — sfondo pagina */
--md-sys-color-surface: rgb(248 247 243);               /* card, header, footer */
--md-sys-color-surface-variant: rgb(244 242 236);
--md-sys-color-surface-dim: rgb(235 232 225);
--md-sys-color-surface-bright: rgb(250 249 246);
--md-sys-color-surface-container-lowest: rgb(251 250 247);
--md-sys-color-surface-container-low: rgb(247 245 240);  /* style-section, bg-secondary */
--md-sys-color-surface-container: rgb(243 241 235);
--md-sys-color-surface-container-high: rgb(238 236 229); /* surface-elevated */
--md-sys-color-surface-container-highest: rgb(233 230 223);
--md-sys-color-on-surface: rgb(0 0 0);
--md-sys-color-on-surface-variant: rgb(10 10 10);
```

### Colori brand e di stato (invariati)

```css
--md-sys-color-primary: rgb(60 110 85);             /* verde naturale */
--md-sys-color-on-primary: rgb(255 255 255);        /* bianco SOLO come testo sull'accento */
--md-sys-color-primary-container: rgb(210 230 220); /* verde pastello chiaro */
--md-sys-color-secondary: rgb(50 85 70);
--md-sys-color-secondary-container: rgb(245 242 237); /* beige caldo */
--md-sys-color-tertiary: rgb(130 115 95);           /* beige/tortora */
--md-sys-color-tertiary-container: rgb(235 228 215);
--md-sys-color-error: rgb(186 26 26);               /* solo errori reali */
--md-sys-color-outline: rgb(60 65 55);
--md-sys-color-outline-variant: rgb(200 200 200);
```

> `--md-sys-color-on-primary: #fff` e simili `on-*` restano bianco: sono **testo sopra l'accento**, non superfici. Il bianco puro come *sfondo* e' vietato.

### Mapping verso le variabili di progetto (in `themes.css`)

```css
--color-bg-primary:     var(--md-sys-color-background);             /* Cloud Dancer */
--color-bg-secondary:   var(--md-sys-color-surface-container-low);
--color-bg-tertiary:    var(--md-sys-color-surface-container);
--color-surface:        var(--md-sys-color-surface);
--color-surface-elevated: var(--md-sys-color-surface-container-high);
--color-surface-soft:   var(--md-sys-color-surface-container-low);
--color-text-primary:   rgb(0 0 0);
--color-accent-primary: var(--md-sys-color-primary);
--color-accent-secure:  var(--md-sys-color-primary);   /* verde */
--color-accent-anxious: var(--md-sys-color-error);     /* rosso */
--color-accent-avoidant: var(--md-sys-color-secondary);/* blu-verde scuro */
--color-accent-disorganized: var(--md-sys-color-tertiary); /* beige (Oscillante) */
--color-border:         var(--md-sys-color-outline-variant);
--color-border-soft:    var(--md-sys-color-outline-variant);
--color-border-strong:  var(--md-sys-color-outline);
```

### Accenti decorativi sfondo (hero)

```css
--color-bg-accent-1: rgba(75, 120, 100, 0.08); /* verde tenue */
--color-bg-accent-2: rgba(150, 135, 115, 0.06); /* beige tenue */
--color-bg-accent-3: rgba(60, 90, 75, 0.05);
```

### Regola d'uso del colore

- Sfondo pagina, hero, topbar → `--color-bg-primary` (Cloud Dancer)
- Card, header sticky, footer, cookie banner → `--color-surface` (piu' chiaro → stacca)
- Riquadri morbidi (`.style-section`, blocchi nota) → `--color-surface-soft`
- Mai `#fff`/`rgb(255 255 255)` come sfondo: solo come `on-*` (testo su accento)

---

## Tipografia

Font caricati via `<link>` Google Fonts (non bloccante):

```css
--font-family-base: 'Lato', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-family-heading: 'Playfair Display', Georgia, serif;
--font-family-mono: "SF Mono", Monaco, "Cascadia Code", monospace;
```

- **Body**: Lato 400 (700 per grassetto) — caldo, leggibile, umano
- **Heading (h1–h3, titoli card/sezione)**: Playfair Display — serif elegante, dà un tono editoriale e accogliente
- Pesi disponibili: Lato 400/700; Playfair 400/600/700

### Type scale

```css
--font-size-xs: 0.75rem;   --font-size-sm: 0.875rem;  --font-size-base: 1rem;
--font-size-lg: 1.125rem;  --font-size-xl: 1.25rem;   --font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem; --font-size-4xl: 2.25rem;  --font-size-5xl: 3rem;

--line-height-tight: 1.25; --line-height-normal: 1.5; --line-height-relaxed: 1.75;
```

### Regole tipografiche

- Body a `--line-height-relaxed` (1.75) per leggibilita' rilassata
- Blocchi di testo wiki max ~65-75ch (`.wiki-lead` usa `max-width: 42rem`)
- Heading: maiuscole naturali (prima lettera + minuscole), mai ANSIOSO ALTO — vedi `content-voice`
- Grassetto solo su parole chiave funzionali, non interi paragrafi
- Body mobile mai sotto 16px (`html { font-size: 16px }`)

### Liste (`ul`, `ol`)

Il reset globale (`* { padding: 0 }`) azzera l'indentazione nativa. In `main.css` le liste hanno sempre:

- `padding-inline-start: var(--spacing-6)`
- `list-style-position: outside` (righe a capo allineate al testo, non sotto il bullet)

Non reintrodurre `margin-left` ridondante su `.wiki-list--compact` — l'indentazione e' ereditata dalla regola base.

---

## Spacing (griglia 4dp)

```css
--spacing-1: 0.25rem; --spacing-2: 0.5rem;  --spacing-3: 0.75rem; --spacing-4: 1rem;
--spacing-5: 1.25rem; --spacing-6: 1.5rem;  --spacing-8: 2rem;    --spacing-10: 2.5rem;
--spacing-12: 3rem;   --spacing-16: 4rem;   --spacing-20: 5rem;
```

Convenzioni: gap tra card `--spacing-6`; padding card `--spacing-6`; spazio tra sezioni `--spacing-12`; padding laterale container `--spacing-4` (mobile) → `--spacing-8` (desktop).

**Dopo box/card verso contenuto successivo:** `.card + :is(h2, h3, h4, h5, h6, p, ul, ol, .wiki-table-scroll) { margin-top: var(--spacing-6) }`. Le callout annidate (`.card--secure-accent`, `.card--elevated-spaced`) hanno anche `margin-bottom: var(--spacing-6)`.

---

## Shape (border radius)

```css
--radius-sm: 0.25rem; --radius-md: 0.5rem; --radius-lg: 0.75rem;
--radius-xl: 1rem;    --radius-full: 9999px; /* pill: bottoni, chip, hero-tag */
```

Card: `--radius-xl`. Sezioni morbide: `--radius-lg`. Bottoni/chip: `--radius-full`.

---

## Elevation (ombre morbide)

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.08);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.12);
```

Su base Cloud Dancer l'elevazione nasce dal **contrasto superficie/sfondo** (card piu' chiare) + ombra leggera. Evita ombre pesanti. Hover card: passa da `--shadow-md` a `--shadow-lg` con transizione breve.

---

## Motion

- Transizioni solo su `color`, `background-color`, `box-shadow`, `transform`
- Durata breve (~0.2–0.3s), `ease`
- Rispetta sempre `prefers-reduced-motion: reduce` (gia' gestito globalmente in `main.css`)

---

## Breakpoint (mobile-first)

```css
/* default: mobile < 600px */
@media (min-width: 600px)  { /* tablet */ }
@media (min-width: 960px)  { /* desktop */ }
@media (min-width: 1280px) { /* large desktop */ }
```

- `.container` max-width 1200px, centrato
- `.grid-2`: 1 colonna → 2 (≥600px)
- `.grid-3`: 1 → 2 (≥600px) → 3 (≥960px)
- Menu: hamburger + drawer su mobile, nav orizzontale su desktop

---

## Stati interattivi (accessibilita')

```css
:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
}
```

- Contrasto minimo **WCAG AA**: 4.5:1 body, 3:1 large text (qui near-black su Cloud Dancer → AAA)
- Area tocco minima 44×44px (hamburger, bottoni cookie)
- `:hover` su link/nav: leggero cambio background; mai solo colore per stato
- Skip link `.skip-link` presente; `:focus-visible` globale attivo

---

## Icone

SVG inline minimali con `currentColor` (hamburger, frecce, chevron). Nessun icon font esterno. Iconografia illustrativa (immagini): astratta, surrealista, pastello, coerente con i prompt in `scripts/prompts.json` (vedi `.cursorrules`). **Carte tarocchi profili:** surrealista painterly full-bleed, palette per stile attaccamento — vedi `.cursor/illustration-styles/stiliattaccamento-tarocchi.md` e skill `illustrator-stiliattaccamento`.
