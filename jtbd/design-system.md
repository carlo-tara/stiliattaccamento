# Design System - Stili di Attaccamento Wiki

## Panoramica

Questo documento definisce lo stile grafico, iconografico, tono di voce e impaginazione del sito, basato sull'analisi delle personas e delle job stories.

---

## 1. STILE GRAFICO (CSS)

### 1.1 Design System Base: Material Design M3

**Filosofia**: Material You (Material Design 3) con adattamenti per il tema dell'attaccamento.

### 1.2 Palette Colori

#### Dark Mode (Default)

```css
:root {
  /* Background */
  --color-bg-primary: #1a1a2e;      /* Blu scuro profondo */
  --color-bg-secondary: #16213e;     /* Blu scuro medio */
  --color-bg-tertiary: #0f3460;     /* Blu scuro chiaro */
  
  /* Surface (Cards, Sections) */
  --color-surface: #1e2749;           /* Blu scuro con sfumatura */
  --color-surface-elevated: #253450; /* Per elementi elevati */
  
  /* Text */
  --color-text-primary: #e8e8e8;     /* Bianco caldo */
  --color-text-secondary: #b8b8b8;   /* Grigio chiaro */
  --color-text-tertiary: #888888;    /* Grigio medio */
  
  /* Accent Colors (Pastello) */
  --color-accent-secure: #a8d5ba;    /* Verde pastello */
  --color-accent-anxious: #f4a5ae;   /* Rosa pastello */
  --color-accent-avoidant: #b8a9d4;  /* Viola pastello */
  --color-accent-disorganized: #ffd3a5; /* Arancione pastello */
  
  /* Status Colors */
  --color-success: #a8d5ba;          /* Verde pastello */
  --color-warning: #ffd3a5;         /* Arancione pastello */
  --color-info: #b8a9d4;            /* Viola pastello */
  
  /* Borders & Dividers */
  --color-border: rgba(184, 169, 212, 0.2); /* Viola pastello trasparente */
}
```

#### Light Mode

```css
[data-theme="light"] {
  /* Background */
  --color-bg-primary: #f8f9fa;       /* Bianco caldo */
  --color-bg-secondary: #ffffff;     /* Bianco puro */
  --color-bg-tertiary: #f0f0f0;      /* Grigio molto chiaro */
  
  /* Surface */
  --color-surface: #ffffff;           /* Bianco */
  --color-surface-elevated: #f8f9fa; /* Bianco caldo */
  
  /* Text */
  --color-text-primary: #2c3e50;     /* Blu scuro */
  --color-text-secondary: #5a6c7d;   /* Grigio scuro */
  --color-text-tertiary: #8a9ba8;    /* Grigio medio */
  
  /* Accent Colors (Pastello - stessi colori, più saturi) */
  --color-accent-secure: #7fb89a;    /* Verde pastello più saturo */
  --color-accent-anxious: #e88a96;   /* Rosa pastello più saturo */
  --color-accent-avoidant: #9d8bc4;  /* Viola pastello più saturo */
  --color-accent-disorganized: #ffc085; /* Arancione pastello più saturo */
  
  /* Status Colors */
  --color-success: #7fb89a;
  --color-warning: #ffc085;
  --color-info: #9d8bc4;
  
  /* Borders & Dividers */
  --color-border: rgba(157, 139, 196, 0.3); /* Viola pastello trasparente */
}
```

### 1.3 Typography

**Font Stack**: System fonts per performance
```css
--font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                     "Helvetica Neue", Arial, sans-serif;
--font-family-heading: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                       "Helvetica Neue", Arial, sans-serif;
--font-family-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace;
```

**Type Scale** (Material Design):
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
--font-size-5xl: 3rem;      /* 48px */
```

**Line Height**:
```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### 1.4 Spacing (4dp Grid)

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
```

### 1.5 Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Pill */
```

### 1.6 Shadows (Material Elevation)

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### 1.7 Componenti Principali

#### Cards
- Background: `--color-surface`
- Border radius: `--radius-lg`
- Shadow: `--shadow-md`
- Padding: `--spacing-6`
- Border: `1px solid var(--color-border)`

#### Buttons
- Primary: Accent color con testo contrastante
- Secondary: Bordo con colore accent, background trasparente
- Text: Solo testo, no background
- Border radius: `--radius-md`
- Padding: `--spacing-3 --spacing-6`

#### Typography Styles
- **Heading 1**: `--font-size-4xl`, `--line-height-tight`, `--color-text-primary`, bold
- **Heading 2**: `--font-size-3xl`, `--line-height-tight`, `--color-text-primary`, bold
- **Heading 3**: `--font-size-2xl`, `--line-height-normal`, `--color-text-primary`, semibold
- **Body**: `--font-size-base`, `--line-height-relaxed`, `--color-text-primary`
- **Small**: `--font-size-sm`, `--line-height-normal`, `--color-text-secondary`

---

## 2. STILE ICONOGRAFICO

### 2.1 Filosofia Iconografica

**Tema**: Gli archetipi dei Tarocchi come metafora centrale degli stili di attaccamento.

**Stile**: 
- Illustrazioni delicate e pastello
- Linee morbide e organiche
- Colori pastello coerenti con la palette
- Minimalismo con dettagli significativi
- Focus esclusivo sulle carte tarocchi come rappresentazione visiva

### 2.2 Icone Funzionali

#### Test/Auto-valutazione
- **Icona**: Foglio con checkmark o stella
- **Prompt**: "Delicate icon of a document with checkmark, soft pastel colors, minimalist line art style"

#### Esercizi
- **Icona**: Mano che tiene o cuore
- **Prompt**: "Delicate icon of a hand holding or a heart, soft pastel colors, minimalist line art style"

#### Mappa Personale
- **Icona**: Mappa o bussola
- **Prompt**: "Delicate icon of a map or compass, soft pastel colors, minimalist line art style"

#### Storie
- **Icona**: Libro aperto o stelle
- **Prompt**: "Delicate icon of an open book or stars, soft pastel colors, minimalist line art style"

#### Approfondimenti
- **Icona**: Lampadina o foglia
- **Prompt**: "Delicate icon of a lightbulb or leaf, soft pastel colors, minimalist line art style"

### 2.4 Linee Guida Generali per Prompt Immagini

**Template Base**:
```
Delicate [tipo illustrazione] of [soggetto], [descrizione dettagliata], 
soft pastel [colore principale] colors, minimalist style, organic flowing lines, 
[sentimento/atmosfera], [stile composizione]
```

**Parametri Comuni**:
- **Stile**: Minimalist, delicate, organic
- **Colori**: Soft pastel (coerenti con palette)
- **Linee**: Flowing, organic, smooth
- **Atmosfera**: Calm, compassionate, non-judgmental
- **Composizione**: Balanced, centered, spacious

---

## 3. TONO DI VOCE

### 3.1 Caratteristiche Principali

Basato sul tone & voice definito in `architettura-sito-wiki.md`:

1. **Compassionevole**: Nessun giudizio, riconosci la difficoltà
2. **Diretto e Pratico**: Va al sodo, evita fluff
3. **Accessibile**: Usa analogie, evita jargon senza spiegazione
4. **Evidence-Based**: Cita ricerca scientifica quando appropriato
5. **Empowerment**: "Puoi farcela, ecco come" (senza promettere guarigione)
6. **Inclusivo**: Valida tutte le forme di relazione/famiglia

### 3.2 Esempi di Tono

#### ✅ Buono
> "Se noti che stai inseguendo il tuo partner, fermati. Questo è il primo segno che il sistema di allarme è attivato. È OK - è una vecchia abitudine. Ora sai cosa sta accadendo."

**Perché funziona**:
- Diretto e pratico
- Non giudicante ("È OK")
- Spiega il "perché" (sistema di allarme)
- Dà potere (ora sai)

#### ❌ Cattivo
> "Gli ansiosi sono disperati e controllanti. Devi smettere di comportarti così."

**Perché non funziona**:
- Giudicante e stigmatizzante
- Non spiega il "perché"
- Non dà strumenti
- Colpevolizza

### 3.3 Linee Guida Scrittura

#### Do's
- ✅ Usa "tu" per creare connessione
- ✅ Riconosci la difficoltà ("È normale che...")
- ✅ Spiega il "perché" prima del "cosa fare"
- ✅ Usa analogie e metafore
- ✅ Sii specifico e concreto
- ✅ Valida le emozioni

#### Don'ts
- ❌ Non giudicare o stigmatizzare
- ❌ Non promettere "guarigione"
- ❌ Non usare jargon senza spiegazione
- ❌ Non essere vago o generico
- ❌ Non minimizzare le difficoltà
- ❌ Non usare linguaggio clinico freddo

### 3.4 Vocabolario Preferito

**Usa**:
- Consapevolezza (non "guarigione")
- Pattern (non "problema")
- Strategia (non "cura")
- Esercizio (non "terapia" - a meno che non sia terapia)
- Supporto (non "aiuto" - meno stigmatizzante)

**Evita**:
- "Malato", "rotto", "sbagliato"
- "Guarire", "curare", "fixare"
- "Normale" vs "anormale"
- Linguaggio diagnostico non necessario

---

## 4. STILE DI IMPAGINAZIONE

### 4.1 Layout Principale

#### Mobile First
- **Container**: Max-width 100%, padding laterale `--spacing-4`
- **Contenuto**: Single column, stack verticale
- **Spacing**: `--spacing-6` tra sezioni

#### Tablet (≥600px)
- **Container**: Max-width 90%, padding laterale `--spacing-6`
- **Contenuto**: Single column, più spazio laterale
- **Spacing**: `--spacing-8` tra sezioni

#### Desktop (≥960px)
- **Container**: Max-width 1200px, centrato
- **Contenuto**: Possibile sidebar per navigazione
- **Spacing**: `--spacing-10` tra sezioni

### 4.2 Tipografia e Leggibilità

#### Articoli Wiki
- **Max-width testo**: 65-75ch (ottimale per leggibilità)
- **Line-height**: 1.75 (rilassato per leggibilità)
- **Paragraph spacing**: `--spacing-6`
- **Heading spacing**: `--spacing-8` sopra, `--spacing-4` sotto

#### Gerarchia Visiva
1. **H1**: Titolo pagina, `--font-size-4xl`, bold, `--spacing-12` sopra
2. **H2**: Sezioni principali, `--font-size-3xl`, semibold, `--spacing-10` sopra
3. **H3**: Sottosezioni, `--font-size-2xl`, semibold, `--spacing-8` sopra
4. **H4**: Sottosottosezioni, `--font-size-xl`, medium, `--spacing-6` sopra

### 4.3 Componenti di Impaginazione

#### Hero Section (Homepage)
- Full-width con background color
- Centrato verticalmente e orizzontalmente
- CTA prominente (test)
- Immagine/illustrazione opzionale

#### Cards (Contenuti)
- Background: `--color-surface`
- Border radius: `--radius-lg`
- Shadow: `--shadow-md`
- Padding: `--spacing-6`
- Spacing tra cards: `--spacing-6`

#### Sidebar (Desktop)
- Fixed o sticky
- Navigazione sezioni
- Breadcrumbs
- Table of contents (per articoli lunghi)

#### Footer
- Background: `--color-bg-secondary`
- Padding: `--spacing-8`
- Links organizzati in colonne
- Copyright e credits

### 4.4 Spazi Bianchi

**Filosofia**: Generosi spazi bianchi per:
- Ridurre sovraccarico cognitivo
- Migliorare leggibilità
- Creare senso di calma e spazio
- Dare respiro ai contenuti

**Regola**: Spazio bianco ≥ contenuto visibile

---

## 5. PROMPT PER LOGO

### 5.1 Concept Logo

**Idee Principali**:
1. **Carta tarocchi stilizzata** che rappresenta il viaggio archetipale di consapevolezza
2. **Due cerchi che si toccano** (rappresentano connessione e attaccamento)
3. **Linea curva organica** (rappresenta il percorso, non lineare)
4. **Combinazione**: Carta tarocchi + elemento geometrico

### 5.2 Prompt LLM per Logo

#### Opzione 1: Carta Tarocchi Stilizzata
```
Create a minimalist logo design featuring a stylized tarot card, representing 
the archetypal journey of self-awareness. The card should be composed of soft, 
organic flowing lines. Use a soft pastel color palette (green, pink, purple, 
orange) with one primary accent color. The design should be simple enough to 
work at small sizes, balanced and centered. Style: delicate, compassionate, 
non-judgmental, modern minimalist. The card should suggest the archetypal 
journey and growth, not static perfection.
```

#### Opzione 2: Carta Tarocchi + Elemento Geometrico
```
Create a minimalist logo design featuring a stylized tarot card silhouette 
combined with a geometric element (circle or curved line). The card represents 
the archetypal journey of awareness, the geometric element represents 
connection and attachment. Use soft pastel colors (primary: soft green or 
soft purple). The design should be simple, balanced, and work at small sizes. 
Style: delicate, modern, compassionate, organic-meets-geometric. The overall 
feeling should be calm, supportive, and non-judgmental.
```

#### Opzione 3: Linea Organica
```
Create a minimalist logo design featuring an organic flowing line that 
suggests both a tarot card and a path/journey. The line should be smooth, 
curved, and suggest movement and growth. Use a soft pastel color (green, 
purple, or pink). The design should be extremely simple, elegant, and work 
at very small sizes. Style: delicate, modern, compassionate, abstract but 
recognizable. The feeling should be calm, supportive, and suggest a 
non-linear archetypal journey of self-awareness.
```

### 5.3 Varianti Logo

- **Full logo**: Carta tarocchi + testo "Stili di Attaccamento"
- **Icon only**: Solo carta tarocchi (per favicon, app icon)
- **Wordmark**: Solo testo stilizzato
- **Monogram**: Lettera iniziale stilizzata con elemento carta tarocchi

### 5.4 Requisiti Tecnici

- **Formato**: SVG (scalabile) + PNG (fallback)
- **Dimensioni**: 
  - Favicon: 32x32, 16x16
  - App icon: 192x192, 512x512
  - Logo header: max-height 48px
- **Colori**: Deve funzionare su dark e light background
- **Versione monocromatica**: Per uso su background colorati

---

## 6. APPLICAZIONE DEL DESIGN SYSTEM

### 6.1 File CSS Struttura

```
public/css/
├── main.css          # Stili base, layout, typography
├── themes.css        # Dark/light mode variables
├── components.css    # Cards, buttons, forms, etc.
└── utilities.css     # Utility classes (opzionale)
```

### 6.2 Naming Convention (BEM)

```css
/* Block */
.wiki-article { }

/* Element */
.wiki-article__title { }
.wiki-article__content { }

/* Modifier */
.wiki-article__title--highlighted { }
.wiki-article--featured { }
```

### 6.3 Esempio Implementazione

```css
/* Card Component */
.wiki-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-6);
  border: 1px solid var(--color-border);
}

.wiki-card__title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.wiki-card__content {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
}
```

---

## 7. CHECKLIST IMPLEMENTAZIONE

### Design System
- [ ] Definire tutte le variabili CSS
- [ ] Implementare dark/light mode toggle
- [ ] Creare componenti base (cards, buttons, etc.)
- [ ] Testare su mobile, tablet, desktop
- [ ] Verificare contrast ratio (WCAG AA)

### Iconografia
- [ ] Generare icone per 4 stili (Secure, Ansioso, Evitante, Oscillante)
- [ ] Generare icone funzionali (test, esercizi, mappa, etc.)
- [ ] Ottimizzare immagini (WebP, lazy loading)
- [ ] Creare fallback per immagini

### Logo
- [ ] Generare logo con prompt LLM
- [ ] Creare varianti (full, icon, wordmark)
- [ ] Esportare in SVG e PNG
- [ ] Testare su dark/light background
- [ ] Creare favicon e app icons

### Typography
- [ ] Implementare font stack
- [ ] Definire heading styles
- [ ] Testare leggibilità
- [ ] Verificare line-height e spacing

### Impaginazione
- [ ] Creare layout mobile-first
- [ ] Implementare breakpoints
- [ ] Testare responsive design
- [ ] Verificare spazi bianchi

---

*Documento creato: 2024*
*Versione: 1.0*

