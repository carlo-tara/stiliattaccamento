# Specifiche Visual Design - Stili di Attaccamento Wiki

## Panoramica

Questo documento definisce le specifiche visual design per il sito, con focus su iconografia archetipi, colori pastello, grafici e illustrazioni tarocchi.

---

## 1. ICONOGRAFIA ARCHETIPI

### 1.1 Filosofia Iconografica

**Tema**: Gli archetipi dei Tarocchi come metafora centrale degli stili di attaccamento.

**Stile**: 
- Illustrazioni delicate e pastello
- Linee morbide e organiche
- Colori pastello coerenti con la palette
- Minimalismo con dettagli significativi
- Focus esclusivo sulle carte tarocchi come rappresentazione visiva

### 1.2 Icone Funzionali

#### Test
- **Icona**: Carta tarocchi stilizzata con punto interrogativo
- **Colore**: Viola pastello
- **Prompt LLM**: "Minimalist tarot card illustration with question mark, soft pastel purple, clean lines"

#### Esercizi
- **Icona**: Carta tarocchi con simbolo di consapevolezza/meditazione
- **Colore**: Verde pastello
- **Prompt LLM**: "Minimalist tarot card illustration with meditation/awareness symbol, soft pastel green, clean lines, peaceful"

#### Mappa Personale
- **Icona**: Carta tarocchi con bussola o mappa stilizzata
- **Colore**: Viola pastello
- **Prompt LLM**: "Minimalist tarot card illustration with compass or map symbol, soft pastel purple, clean geometric lines"

#### Storie Reali
- **Icona**: Carta tarocchi con simbolo narrativo/storia
- **Colore**: Rosa pastello
- **Prompt LLM**: "Minimalist tarot card illustration with storytelling symbol, soft pastel pink, clean lines"

---

## 2. ILLUSTRAZIONI TAROCCHI

### 2.1 Stile delle Carte Tarocchi

**Filosofia**: Carte tarocchi stilizzate e minimaliste, non tradizionali ma riconoscibili.

**Caratteristiche**:
- Formato: Verticale, proporzioni 2:3 (come carte tarocchi reali)
- Stile: Minimalista, linee pulite
- Colori: Pastello, coerenti con lo stile di attaccamento
- Elementi: Solo elementi essenziali dell'arcano

### 2.2 Prompt LLM per Ogni Arcano

#### Il Matto (0) - Ansioso Alto
**Prompt**: "Minimalist tarot card illustration of The Fool, young person walking toward cliff with backpack, eyes to sky, soft pastel pink background, clean lines, delicate style, vertical format 2:3"

#### L'Innamorato (VI) - Ansioso Medio
**Prompt**: "Minimalist tarot card illustration of The Lovers, two figures facing choice, angel above, soft pastel pink background, clean lines, delicate style, vertical format 2:3"

#### L'Eremita (IX) - Evitante Alto
**Prompt**: "Minimalist tarot card illustration of The Hermit, figure with lantern walking alone in darkness, soft pastel purple background, clean lines, delicate style, vertical format 2:3"

#### L'Imperatore (IV) - Evitante Medio
**Prompt**: "Minimalist tarot card illustration of The Emperor, figure on throne with scepter, walls around, soft pastel purple background, clean lines, delicate style, vertical format 2:3"

#### Il Mago (I) - Secure Basso
**Prompt**: "Minimalist tarot card illustration of The Magician, figure with one hand to sky one to earth, tools on table, soft pastel green background, clean lines, delicate style, vertical format 2:3"

#### La Torre (XVI) - Oscillante Alto
**Prompt**: "Minimalist tarot card illustration of The Tower, lightning striking tower, figures falling, soft pastel orange background, clean lines, delicate style, vertical format 2:3"

#### Il Pellegrino (XIII+XIX) - Oscillante Medio
**Prompt**: "Minimalist tarot card illustration combining Death and The Sun, figure walking through transformation toward light, soft pastel orange background, clean lines, delicate style, vertical format 2:3"

#### La Forza (XI) - Oscillante Basso / Secure Alto
**Prompt**: "Minimalist tarot card illustration of Strength, woman gently touching lion, soft pastel green/orange background, clean lines, delicate style, vertical format 2:3"

### 2.3 Utilizzo delle Carte

- **Hero Section**: Carta tarocchi prominente (larghezza: 200-300px su desktop, 150px su mobile)
- **Sezione Archetipo**: Carta tarocchi più piccola (larghezza: 150px)
- **Timeline Consapevolezza**: Carte tarocchi come indicatori di progressione

---

## 3. COLORI PASTELLO

### 3.1 Palette Completa

#### Dark Mode (Default)
```css
--color-accent-secure: #a8d5ba;      /* Verde pastello */
--color-accent-anxious: #f4a5ae;    /* Rosa pastello */
--color-accent-avoidant: #b8a9d4;    /* Viola pastello */
--color-accent-disorganized: #ffd3a5; /* Arancione pastello */
```

#### Light Mode
```css
--color-accent-secure: #7fb89a;      /* Verde pastello più saturo */
--color-accent-anxious: #e88a96;     /* Rosa pastello più saturo */
--color-accent-avoidant: #9d8bc4;    /* Viola pastello più saturo */
--color-accent-disorganized: #ffc085; /* Arancione pastello più saturo */
```

### 3.2 Utilizzo dei Colori

- **Card profilo**: Bordo sinistro di 4px con colore dello stile
- **Badge livello**: Background con colore pastello trasparente (20% opacity)
- **Link**: Colore accent quando link è relativo a uno stile
- **Hero section**: Background gradient con colore pastello (10% opacity)

---

## 4. GRAFICI E VISUALIZZAZIONI

### 4.1 Matrice Bidimensionale (Ansia ↔ Evitamento)

**Tipo**: Grafico scatter plot o heatmap

**Elementi**:
- Asse X: Evitamento (0-10, da sinistra a destra)
- Asse Y: Ansia (0-10, dal basso all'alto)
- 4 quadranti colorati:
  - Basso Evitamento + Bassa Ansia: Verde pastello (Secure)
  - Basso Evitamento + Alta Ansia: Rosa pastello (Ansioso)
  - Alto Evitamento + Bassa Ansia: Viola pastello (Evitante)
  - Alto Evitamento + Alta Ansia: Arancione pastello (Oscillante)
- Punto utente: Indicatore interattivo che mostra dove si trova

**Implementazione**: SVG o Canvas con JavaScript per interattività

### 4.2 Timeline Consapevolezza

**Tipo**: Timeline orizzontale con milestone

**Elementi**:
- Linea orizzontale con punti (mese 0, 3, 6, 9, 12+)
- Icone archetipo per ogni milestone
- Colore: Pastello dello stile
- Testo descrittivo sotto ogni milestone

**Esempio**:
```
[Mese 0: Il Matto] → [Mese 3: Nota il precipizio] → [Mese 6: Riconosce il desiderio] → [Mese 9: Impara che il cielo non risponde] → [Mese 12+: L'Amante Consapevole]
```

### 4.3 Grafico 5 Dimensioni (Mappa Personale)

**Tipo**: Grafico radar/spider chart

**Dimensioni**:
1. Ansia ↔ Evitamento
2. Finestra di Tolleranza (Sottoattivato ↔ Iper-attivato)
3. Coscienza dell'Attaccamento (Inconsapevole ↔ Consapevole)
4. Capacità di Integrazione (Frammentato ↔ Integrato)
5. Resilienza Relazionale (Fragile ↔ Robusta)

**Visualizzazione**:
- 5 assi che partono dal centro
- Area colorata che mostra il profilo
- Colore: Pastello dello stile prevalente
- Valori: 0-10 per ogni dimensione

### 4.4 Percorso Archetipale

**Tipo**: Diagramma di flusso verticale

**Elementi**:
- Carte tarocchi stilizzate come nodi
- Frecce che mostrano la progressione
- Colori pastello per ogni stile
- Testo descrittivo accanto a ogni carta

**Esempio**:
```
[Il Matto (0)] - Ansioso Alto
    ↓
[L'Innamorato (VI)] - Ansioso Medio
    ↓
[L'Amante Consapevole] - Ansioso Basso
    ↓
[Il Mago (I)] - Secure Basso
    ↓
[Il Saggio] - Secure Medio
    ↓
[L'Illuminato (XI)] - Secure Alto
```

---

## 5. TIPOGRAFIA PER ARCHETIPI

### 5.1 Nomi Archetipi

**Font**: Elegante, serif opzionale per nomi archetipi
**Stile**: 
- Nome archetipo: `font-size: var(--font-size-2xl)`, `font-weight: 600`, `font-style: italic`
- Arcano: `font-size: var(--font-size-xl)`, `font-weight: 500`
- Esempio: "Il Matto" in corsivo elegante, "(0)" in parentesi

### 5.2 Citazioni Archetipali

**Stile**: Blockquote con bordo sinistro colorato
**Colore**: Colore pastello dello stile
**Padding**: `var(--spacing-4)` sinistra, `var(--spacing-2)` sopra/sotto

---

## 6. LAYOUT E SPACING

### 6.1 Hero Section Profilo

- Background: Gradient con colore pastello (10% opacity)
- Padding: `var(--spacing-12)` verticale
- Border radius: `var(--radius-lg)`
- Border left: 4px solido colore pastello

### 6.2 Sezioni Profilo

- Card con background `var(--color-surface)`
- Border: 1px solid `var(--color-border)`
- Border radius: `var(--radius-lg)`
- Padding: `var(--spacing-6)`
- Margin bottom: `var(--spacing-8)` tra sezioni

### 6.3 Timeline Visuale

- Container: Flexbox orizzontale su desktop, verticale su mobile
- Milestone: Card piccola (150px larghezza) con icona archetipo
- Connessioni: Linea tratteggiata tra milestone
- Colore: Pastello dello stile

---

## 7. RESPONSIVE DESIGN

### 7.1 Mobile (< 600px)

- Carte tarocchi: 150px larghezza
- Timeline: Verticale invece di orizzontale
- Grafici: Versione semplificata o scroll orizzontale
- Typography: Font size ridotto del 10-15%

### 7.2 Tablet (600px - 960px)

- Carte tarocchi: 200px larghezza
- Timeline: Orizzontale con scroll se necessario
- Grafici: Dimensione media

### 7.3 Desktop (> 960px)

- Carte tarocchi: 300px larghezza
- Timeline: Orizzontale completa
- Grafici: Dimensione piena, interattivi

---

## 8. ANIMAZIONI E INTERAZIONI

### 8.1 Hover Effects

- Card profilo: Elevazione shadow (`--shadow-lg`)
- Link: Opacity 0.8
- Carte tarocchi: Leggera rotazione (2-3 gradi) e scale (1.05)

### 8.2 Transizioni

- Durata: 200-300ms
- Easing: `ease-in-out`
- Proprietà: `transform`, `opacity`, `box-shadow`

### 8.3 Loading States

- Skeleton screens per immagini tarocchi
- Spinner per grafici che si caricano
- Colore: Pastello dello stile

---

## 9. ACCESSIBILITÀ VISUALE

### 9.1 Contrast Ratio

- Testo su background: Minimo 4.5:1 (WCAG AA)
- Testo su colore pastello: Usa colore scuro per testo
- Icone: Almeno 3:1 contrast ratio

### 9.2 Alternative Testuali

- Tutte le immagini tarocchi: `alt` text descrittivo
- Icone: `aria-label` per screen reader
- Grafici: Testo alternativo o tabella dati

### 9.3 Focus States

- Link: Outline 2px solido colore pastello
- Button: Outline 2px solido colore accent
- Form inputs: Border 2px solido quando focus

---

## 10. IMPLEMENTAZIONE TECNICA

### 10.1 Immagini

- Formato: WebP con fallback PNG
- Lazy loading: `loading="lazy"` per immagini sotto la fold
- Responsive: `srcset` per diverse risoluzioni

### 10.2 Grafici

- Libreria: SVG nativo o Chart.js per grafici complessi
- Interattività: JavaScript vanilla (no framework)
- Animazioni: CSS transitions, no JavaScript pesante

### 10.3 Performance

- Ottimizzazione immagini: Compressione 80-85%
- Minificazione: CSS e JS minificati per produzione
- Caching: Service Worker per cache immagini

---

## 11. ESEMPI VISUALI

### 11.1 Pagina Profilo - Layout

```
┌─────────────────────────────────────┐
│  [Hero: Nome + Archetipo + Carta]   │
├─────────────────────────────────────┤
│  [Archetipo Junghiano]              │
│  - Immagine Archetipale              │
│  - Corpo Archetipale                 │
│  - Ombra                             │
├─────────────────────────────────────┤
│  [Modello a Gradienti]               │
│  - Caratteristiche                   │
│  - Nel Corpo                         │
│  - Pattern Relazionale                │
├─────────────────────────────────────┤
│  [Consapevolezza Archetipale]        │
│  - Timeline Visuale                  │
│  - Integrazione                      │
├─────────────────────────────────────┤
│  [Esercizi Specifici]                │
│  - Lista esercizi                    │
│  - Frequenza                         │
└─────────────────────────────────────┘
```

### 11.2 Homepage - Layout

```
┌─────────────────────────────────────┐
│  [Hero: Titolo + Test Rapido]       │
├─────────────────────────────────────┤
│  [3 Pilastri - Grid 3 colonne]      │
│  [Card] [Card] [Card]               │
├─────────────────────────────────────┤
│  [12 Profili Preview - Grid 4]      │
│  [Secure] [Ansioso] [Evitante]     │
│  [Oscillante]                   │
└─────────────────────────────────────┘
```

---

## 12. CHECKLIST IMPLEMENTAZIONE

- [ ] Creare illustrazioni tarocchi per tutti i 12 profili
- [ ] Creare icone funzionali basate su tarocchi
- [ ] Implementare grafico matrice bidimensionale
- [ ] Implementare timeline consapevolezza
- [ ] Implementare grafico 5 dimensioni (Mappa Personale)
- [ ] Implementare percorso archetipale
- [ ] Testare contrast ratio per accessibilità
- [ ] Ottimizzare immagini (WebP, compressione)
- [ ] Implementare lazy loading
- [ ] Testare responsive su mobile/tablet/desktop
- [ ] Verificare animazioni e transizioni
- [ ] Testare con screen reader

---

*Fine delle Specifiche Visual Design*

