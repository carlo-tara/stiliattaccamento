# Report di revisione — rigenerazione sito (giugno 2026)

Revisione doppia **content-voice** + **uiux-designer** per cluster. Scala: 🔴 bloccante · 🟡 importante · 🟢 suggerimento.

---

## Cluster 1 — Percorso (index, da-dove-inizi, il-tuo-percorso, test, mappa)

### Sintesi
Architettura journey-first consolidata; copy compagno; immagini Qwen dedicate generate.

### Content-voice
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Tono umano, CTA verso test | OK |
| 🟢 | Consapevolezza non guarigione | OK |
| 🟡 | `test.html` ha solo 2 immagini (minimo rispettato) | OK |

### UI/UX
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Una CTA primaria per pagina | OK |
| 🟢 | Immagini dedicate (`da-dove-inizi-*`, `il-tuo-percorso-*`, `test-*`) | Rigenerate |
| 🟢 | Nav highlight post-test | OK |

---

## Cluster 2 — Profili (12 pagine)

### Sintesi
Template uniforme: strategie → cosa succede → archetipo → journey-next-step.

### Content-voice
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Oscillante nel testo visibile | OK |
| 🟢 | Hero maiuscole naturali | OK |
| 🟢 | Disclaimer livello alto / oscillante | OK |

### UI/UX
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Classi `profile-hero--*`, niente inline style | OK |
| 🟢 | `profile-page-init.js` su tutti i profili | OK |
| 🟢 | Immagini tarocchi rigenerate (`--force`) | In corso / completato |

---

## Cluster 3 — Wiki (fondamenti, stili-base, modello-gradienti, archetipi, mazzo-tarocchi)

### Content-voice
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Box «In pratica» | OK |
| 🟢 | Anchor `#oscillante` su stili-base | OK |
| 🟡 | Alcuni blocchi teorici ancora densi (fondamenti) | Accettabile wiki |

### UI/UX
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Tabelle → classe `wiki-table` | OK |
| 🟢 | Immagini wiki rigenerate (13 asset) | OK |
| 🟢 | Token Cloud Dancer | OK |

---

## Cluster 4 — Nella relazione (dinamiche, supporto partner, esercizi)

### Content-voice
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Esercizi: passata editoriale profonda, tono «puoi provare» | OK |
| 🟢 | Badge «Livello basso» naturali | OK |
| 🟢 | EFT prima di Process Work in `details#avanzato` | OK |
| 🟢 | Zero «guarigione» nel visibile (esercizi) | OK |

### UI/UX
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | `#due-minuti` in `card--accent` | OK |
| 🟢 | Inline styles rimossi (dinamiche, supporto) | OK |
| 🟡 | `esercizi.html` molto lunga — navigazione filtri aiuta | Monitorare |

---

## Cluster 5 — Storie reali (5 storie + indice)

### Content-voice
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Narrativa umanizzata, capitoli scansionabili | OK |
| 🟢 | Marco → oscillante medio, link profilo | OK |
| 🟢 | Niente lieto fine forzato | OK |
| 🟢 | CTA test + il-tuo-percorso | OK |

### UI/UX
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | `wiki-lead`, `card--accent-soft` | OK |
| 🟢 | Zero inline style sulle storie | OK |

---

## Cluster 6 — Approfondimenti (13 pagine)

### Content-voice
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Box «In pratica» in cima | OK |
| 🟢 | Oscillante, consapevolezza | OK |

### UI/UX
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Immagini per pagina rigenerate | In corso |
| 🟢 | Prompt aggiunti per focusing + sessualità | OK |

---

## Cluster 7 — Libri e risorse

### Content-voice
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Schede «perché leggerlo sul sito» | OK |
| 🟢 | Glossario Oscillante | OK |

### UI/UX
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Card uniformi | OK |
| 🟢 | Tabelle glossario → `wiki-table` | OK |

---

## Cluster 8 — Legal e supporto

### Content-voice
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | quando-cercare-aiuto tono compagno | OK |
| 🟢 | Legal: struttura leggibile | OK |

### UI/UX
| Livello | Issue | Stato |
|---------|-------|-------|
| 🟢 | Sommario navigabile | OK |
| 🟢 | `card--anxious-accent` su box urgenza | OK |

---

## Pulizia inline styles (sito)

| Prima | Dopo | Note |
|-------|------|------|
| ~100+ `style=` | **2 funzionali** | `test.html` e `mappa-personale.html` (`display:none` per JS) |

Estensioni: `wiki-table`, `wiki-list--indented`, `card--elevated-spaced`, script `clean-wiki-inline-styles`.

---

## Validazione

- `npm run test:validation` — da rieseguire post-immagini
- `npm run test:unit` — 92 test
- Style validator — 63/63 HTML

---

## Prossimi passi opzionali

- 🟢 Rigenerare immagini `esercizi.html` e `risorse.html` se si aggiornano i prompt
- 🟢 Accorciare meta description dove > 155 char (monitoraggio SEO)
