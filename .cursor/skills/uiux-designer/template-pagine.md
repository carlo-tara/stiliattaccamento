# Template pagine — Stili di Attaccamento

Layout per tipo di pagina. Tutti seguono la stessa intelaiatura base; cambia il contenuto della `<main>`. Componenti in [componenti.md](componenti.md); colore/spacing in [design-system.md](design-system.md). Cluster e priorita' allineati a `content-voice`.

## Intelaiatura comune (ogni pagina)

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="… max ~155 char">
  <title>… max ~60 char</title>

  <!-- Schema.org: WebSite/Article/FAQPage/BreadcrumbList secondo il tipo -->
  <script type="application/ld+json"> … </script>

  <link rel="manifest" href="/manifest.json">
  <link rel="canonical" href="https://stiliattaccamento.com/…">
  <meta name="theme-color" content="#3c6e55">
  <!-- Open Graph / Twitter -->

  <!-- Fonts non bloccanti + preload CSS + preload hero image -->
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/themes.css">
</head>
<body data-theme="light">
  <a href="#main-content" class="skip-link">Salta al contenuto principale</a>
  <div id="header-placeholder"></div>   <!-- header.html via template-loader.js -->
  <div id="topbar-placeholder"></div>   <!-- topbar/breadcrumb -->

  <main id="main-content">
    <!-- CONTENUTO SPECIFICO DEL TIPO -->
  </main>

  <div id="footer-placeholder"></div>   <!-- footer.html -->
  <!-- script: template-loader, mobile-menu, breadcrumb-generator, theme, pwa, … -->
</body>
</html>
```

Regole trasversali:

- `data-theme="light"` fisso (no toggle)
- Schema.org coerente con il tipo (vedi sotto)
- ≥2 immagini `.wiki-image` per ogni pagina di contenuto (regola `.cursorrules`)
- Una sola CTA primaria per pagina (di norma verso il Test)
- Sfondo pagina = Cloud Dancer via token (mai `#fff`)

---

## Home

`index.html`. Obiettivo: orientare in pochi secondi e portare al Test. Personas: Chiara + Luca.

Layout **journey-first** (percorso prima, wiki in secondo piano):

```
main
├── .hero            → hero-tag, h1, lead, btn-group (CTA primaria: Test)
│   └── .wiki-image  → immagine hero (preload, fetchpriority=high)
├── .section "Da dove vuoi partire" → 4 .card (personas / job stories → da-dove-inizi.html)
├── .section "Test rapido"            → CTA secondaria verso test.html
├── .section "Pilastri wiki"        → fondamenti, stili, gradienti, archetipi
├── details "I 12 profili"          → collassato di default; link a profili/*.html
├── .section "Non sei solo"         → tono compagno, consapevolezza
└── .section FAQ                    → Schema.org FAQPage
```

Schema.org: `WebSite` + `FAQPage`. Una CTA primaria (Test); le altre azioni come `btn-secondary` o link card. Nav header: **Inizia qui** | **Il tuo percorso** | Capire | Nella relazione | Risorse.

---

## Test / strumento

`test.html`, `mappa-personale.html`. Strumenti interattivi (SurveyJS / Chart.js). Personas: Chiara, Marco.

```
main > .container
├── h1 + .wiki-lead (cosa otterrai, quanto dura)
├── .wiki-image
├── #quiz-container (SurveyJS)  oppure  radar chart (mappa)
├── nota: ⚠️ "non e' una diagnosi" (disclaimer, tono content-voice)
└── .content-nav → prossimi passi (profili, esercizi)
```

- Form accessibile: label esplicite, focus visibile, `aria-live` per i risultati.
- Risultato collega ai profili (`profili/*.html`).
- Schema.org: `WebPage` (eventuale `Quiz`/`HowTo` se pertinente).

---

## Profilo stile

`profili/{ansioso,evitante,disorganizzato,secure}-{basso,medio,alto}.html`. 12 profili. Personas: Chiara, Luca; disclaimer rafforzato su profili "Alto" e Oscillante.

```
main > .container
├── h1 (es. "Ansioso medio") — maiuscole naturali
├── .wiki-lead (archetipo poetico BREVE, poi pratico)
├── .wiki-image
├── .style-section--{stile} "Cosa noti"        → strategie immediate
├── .style-section--{stile} "Perche' succede"  → comprensione (30% teoria)
├── .style-section--{stile} "Esercizi"         → cosa fare
├── .wiki-image (seconda immagine)
├── ⚠️ disclaimer clinico (su Alto/Oscillante)
└── .content-nav → profili correlati, test, esercizi
```

- Colore dello stile coerente: `--secure` verde, `--anxious` rosso, `--avoidant` blu-verde, `--disorganized` beige (Oscillante).
- Schema.org: `Article`.
- Coerenza di cluster: stessa struttura tra i 3 livelli (basso/medio/alto) della stessa famiglia.

---

## Fondamenti / articolo wiki

`fondamenti.html`, `stili-base.html`, `modello-gradienti.html`, `archetipi.html`. Personas: tutte; Elena/Andrea per profondita'.

```
main > .container
├── h1 + .wiki-lead
├── .wiki-image
├── .wiki-subheading + paragrafi (.wiki-paragraph--spaced)
├── .style-section / .card per blocchi concettuali
├── .wiki-term per i termini tecnici (abbr)
├── .wiki-image (seconda)
└── .content-nav
```

- Max ~65-75ch per i blocchi di testo.
- Schema.org: `Article` (+ eventuale `FAQPage`).
- 70% pratico / 30% teoria (regola `content-voice`).

---

## Approfondimento

`approfondimenti.html` (indice) + `approfondimenti/*.html`. Personas: Chiara, Sofia, Elena.

- **Indice**: `.section` + `.blog-archive__grid` di `.blog-card` (thumbnail + estratto + link).
- **Singolo**: stesso schema dell'articolo wiki, con tema specifico (famiglia, lavoro, sessualita', lutto, ...).
- Schema.org: `Article`; l'indice puo' usare `CollectionPage`.

---

## Storia reale

`storie-reali.html` (indice) + `storie-reali/*.html`. Personas: Luca (validazione), Chiara.

```
main > .container
├── h1 (nome di fantasia)
├── .wiki-lead (situazione iniziale)
├── .wiki-image
├── narrazione in terza persona + dialoghi (paragrafi, eventuale .card--mono per citazioni)
├── consapevolezza → viaggio (senza "guarire")
├── .wiki-image (seconda)
└── .content-nav → altre storie, profili collegati
```

- Tono narrativo, terza persona; collega allo stile pertinente.
- Schema.org: `Article`.

---

## Esercizi

`esercizi.html`. Personas: Marco (pratico), Chiara.

```
main > .container
├── h1 + .wiki-lead
├── .wiki-image
├── per esercizio: .card / .style-section
│     ├── titolo (Playfair)
│     ├── durata + cosa serve
│     ├── passi numerati (ol)
│     └── cosa aspettarsi
└── .content-nav
```

- Step chiari e numerati; durata visibile (badge tempo / `.banner-horizontal__time`).
- Schema.org: `HowTo` quando appropriato.

---

## Libro / risorsa

`libri.html` (indice) + `libri/*.html`, `risorse.html`. Personas: Elena, Andrea, Chiara.

```
main > .container
├── h1 + .wiki-lead
├── .wiki-image (copertina/illustrazione)
├── descrizione + perche' e' utile, per quale stile
├── eventuale .card con dati (autore, anno) — .card--mono per citazione
└── .content-nav → altri libri/risorse
```

- Tono neutro-informativo; cita fonti.
- Schema.org: `Book` / `Review` (singolo), `CollectionPage` (indice).

---

## Relazioni / partner

`dinamiche-coppia.html`, `come-supportare-partner.html`, `quando-cercare-aiuto.html`. Personas: Sofia, Marco.

```
main > .container
├── h1 + .wiki-lead
├── .wiki-image
├── "Cosa capire" → "Cosa dire / evitare" → "Cosa fare" (.style-section o .card)
├── (quando-cercare-aiuto) ⚠️ quando rivolgersi a un professionista
└── .content-nav
```

- Tono calmo, non colpevolizzante; nessuna colpa sul partner.
- Schema.org: `Article`.

---

## Legale

`privacy-policy.html`, `cookie-policy.html`, `termini-condizioni.html`. Personas: tutte.

```
main > .container
├── h1
├── testo strutturato (h2/h3 + paragrafi), nessuna immagine obbligatoria
└── data ultimo aggiornamento
```

- Layout sobrio, leggibile, niente CTA marketing.
- Schema.org: `WebPage`.

---

## Coerenza di cluster

Quando crei/modifichi una pagina che appartiene a un gruppo (es. i 3 livelli di un profilo, l'indice + i singoli approfondimenti), **allinea template, componenti e spaziature** alle pagine sorelle. Verifica con la [checklist.md](checklist.md).
