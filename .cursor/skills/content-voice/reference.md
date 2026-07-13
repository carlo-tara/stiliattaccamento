# Reference — Content Voice

Documento di supporto per la skill `content-voice`. Consultare durante riscrittura e supervisione.

## Identità comunicativa

**Chi parla**: compagno di viaggio informato, amico esperto.

**Relazione col lettore**: vicinanza senza invadenza; validazione concreta; mai paternalismo clinico.

**Pilastro filosofico (EFT)**:
- Il nemico è il **ciclo** relazionale, non il partner
- I bisogni di attaccamento sono universali e legittimi
- La vulnerabilità è coraggio, non debolezza
- Presenza emotiva (Accessibilità, Responsività, Engagement — A.R.E.) come cornice quando si parla di coppia
- **Consapevolezza, non guarigione**: nessuna promessa di "diventare Secure"

## Vocabolario preferito

| Usa | Evita |
|-----|-------|
| consapevolezza, pattern, strategia, esercizio, supporto | guarigione, cura, fixare |
| riconoscere, osservare, integrare, notare | migliorare (se implica difetto) |
| oscillante | disorganizzato |
| persona, partner, chi | lui/lei, marito/moglie |
| attivazione, sistema di allarme | controllo (come etichetta della persona) |
| panico di attaccamento | disperato/a (come identità) |

## Gerarchia teorica e integrazione

Quando un concetto esiste in più cornici, presentalo così:

1. **EFT** — bisogni, cicli, protesta, ritiro, riparazione del legame
2. **Jung** — archetipo, ombra, metafora (sempre con ponte pratico)
3. **Sistemica** — feedback loop, doppi segnali, processo primario/secondario
4. **Process Work** — edge, segnali somatici (solo dove serve, es. esercizi avanzati)

Esempio di ponte: *"In EFT questo si chiama protesta per connessione. In pratica: quando mandi messaggi ripetuti, spesso non stai 'controllando'. Stai cercando di sapere se il legame regge."*

## Rewrite HTML — scope

In riscrittura/humanize modifica **solo**:

- Testo in `<main>` (p, heading, li, figcaption, blockquote)
- `meta description`, `og:description`, `twitter:description`
- Testo in JSON-LD (FAQ, description)
- `alt` e didascalie

**Non modificare:** URL/path file, classi CSS, attributi `data-*`, struttura shell (header/nav/footer), `href` (solo testo anchor se serve).

**Oscillante:** sempre nel copy visibile; path `profili/disorganizzato-*.html` e `data-profile-stile="disorganizzato"` restano per retrocompatibilità.

## Fonti e citazioni

Cita inline quando possibile:

- Bowlby, J. — teoria dell'attaccamento
- Ainsworth, M. — stili base, Strange Situation
- Johnson, S. — EFT (*Hold Me Tight*, *The Practice of Emotionally Focused Couple Therapy*)
- Levine, A. & Heller, R. — *Attached*
- Jung, C.G. — archetipi e ombra (con cautela pop-science)
- Gendlin, E. — focusing
- Van der Kolk, B. — trauma e corpo (profili oscillante/trauma)

Formato suggerito: *(Johnson, 2008)* o link a `public/libri/` se il libro è nel sito.

Aggiungi riferimenti bibliografici in sezione "Approfondimenti" o nota a piè di sezione dove mancano.

## Anti-pattern IA (italiano)

Adattato da [humanizer](https://github.com/blader/humanizer) + `tests/validation/style-validator.js`.

### Frasi vietate (validator)

- È importante notare che…
- Vale la pena ricordare che…
- Ricorda che… (come chiusura sistematica)
- Prima di tutto, ricorda…
- Si suggerisce di… / Si consiglia di…
- Attraverso il linguaggio universale…
- Strumenti concreti per…
- permettono una comprensione più profonda
- Ogni stile ha… (ripetuto come apertura paragrafo)

### Altri pattern da evitare

| Pattern | Alternativa |
|---------|-------------|
| Enfasi eccessiva su significato/legacy ("momento cruciale", "testimonianza") | Dì cosa succede, concretamente |
| Analisi superficiali in -ando (-ando, evidenziando, sottolineando) | Verbi diretti |
| Linguaggio promozionale (vibrante, profondo, arricchente) | Descrivi senza vendere |
| Attribuzioni vaghe ("gli esperti dicono") | Fonte specifica |
| Sezioni formulaiche "Sfide e prospettive future" | Solo se serve al lettore |
| Vocabolario IA IT: inoltre, cruciale, fondamentale (ripetuto), paesaggio (astratto), tessuto, percorso (cliché) | Parafrasi semplici |
| Regola del tre forzata | Due o quattro elementi se suona più naturale |
| Variazione elegante eccessiva (sinonimi forzati) | Ripeti il termine se è il termine giusto |
| "Non solo X, ma anche Y" ripetuto | Una costruzione per sezione, max |
| Elenchi con **Titolo:** su ogni riga | Prosa o elenchi misti |
| Grassetto su ogni termine tecnico | Solo ciò che il lettore deve notare |
| Conclusioni "Ricorda che la consapevolezza è fondamentale…" | Chiudi con azione o immagine concreta |
| Voce passiva senza soggetto | "Puoi notare…", "Il corpo si attiva…" |

### Segnali di testo umano (da privilegiare)

- Frasi di lunghezza mista; alcune molto corte
- Parentesi e pause occasionali ("beh", "davvero") — senza esagerare
- Esempi situazionali ("Magari ti è capitato di…")
- Domande dirette al lettore
- Dialoghi nelle storie
- Ammissione di semplificazione ("Qui semplifichiamo…")

## Convenzioni di formattazione

### Header (HTML)

- **h1/h2/h3**: prima lettera maiuscola, resto minuscole
- **Zero em dash / en dash** (`—`, `–`) nel copy visibile: usa punto, virgola, due punti, parentesi
- ✅ `Strategie pratiche immediate`, `Quando vai in panico`
- ❌ `Strategie Pratiche Immediate`, `Quando Vai in Panico`, `ANSIOSO ALTO`
- Eccezioni: nomi propri (Bowlby, Giulia), acronimi (EFT, PWA), titoli di libri

### Storie reali — titoli

- **h1**: `Nome: profilo` (due punti), non `Nome — Profilo`
- Esempio: `Nina: ansioso alto`

### Profili — uniformazione

Sostituire hero in MAIUSCOLO con:

```html
<h1>Ansioso alto</h1>
<h2>Il Matto (0): L'ingenuità traumatizzata</h2>
```

Badge livello: `<span class="level-badge alto">Livello alto</span>` (non LIVELLO ALTO nel testo se evitabile).

### Grassetto

- Istruzioni chiave in checklist
- Prima occorrenza di termine definito (poi normale)
- Non più di 1-2 enfasi per paragrafo

### Citazioni e dialoghi

- Dialoghi: virgolette italiane « » o " " coerenti nel cluster
- Frasi da dire al partner: tono diretto, breve

### Emoji

- Solo `⚠️` per box supporto professionale / crisi
- Niente emoji decorative in titoli o bullet

### Tooltip termini

```html
<abbr title="Terapia focalizzata sulle emozioni e sui cicli di coppia (Sue Johnson)" class="wiki-term">EFT</abbr>
```

Per termini lunghi: spiegazione in linea + `abbr` opzionale su acronimo.

Aggiungere stile in CSS se manca (`.wiki-term { text-decoration: underline dotted; cursor: help; }`).

## Modulazione per persona (senza pagine separate)

| Persona | Cosa serve | Come adattare |
|---------|------------|---------------|
| Chiara | capire, validazione | tu, esempi relazionali, tono caldo |
| Marco | azioni | checklist, "passo 1-2-3", meno metafora per paragrafo |
| Luca | speranza sobria | normalizza, percorso chiaro, storie |
| Sofia | supporto partner | "cosa dire/evitare", non colpevolizzare |
| Elena/Andrea | rigore | fonti, precisione, link interni wiki |

## SEO e GEO

- **Title/meta description**: chiari, con keyword naturali (stili di attaccamento, test, profilo)
- **Primo paragrafo**: risponde alla domanda implicita della pagina
- **Schema.org**: mantieni/aggiorna JSON-LD coerente col testo
- **GEO** (ottimizzazione per AI search): definizioni esplicite, FAQ dove utile, linguaggio citabile
- **Heading hierarchy**: un solo h1, h2 per sezioni, no salti

## Accessibilità e leggibilità

- Linguaggio inclusivo (validator)
- `alt` descrittivi sulle immagini (non ripetere solo il titolo)
- Frasi lunghe: spezzare se > 25-30 parole
- Liste lunghe: introdurre con frase di contesto
- Contrasto: non affidare significato solo al colore
- Link: testo descrittivo ("Vedi esercizi per ansioso alto" non "clicca qui")

## Coerenza tra pagine correlate

Per ogni cluster verifica:

- Stesso termine per stesso concetto (oscillante, non mix)
- Stessa cornice dominante (EFT prima)
- Disclaimer allineati tra profili dello stesso livello
- Cross-link aggiornati se rinomini sezioni
- Timeline e intensità (basso/medio/alto) coerenti con `modello-gradienti.html`

## Scala di gravità (supervisione)

### 🔴 Bloccante — correggere prima della pubblicazione

- Linguaggio stigmatizzante o giudicante
- "Disorganizzato" nel testo visibile (salvo FAQ esplicativa)
- Promesse di guarigione / "diventerai Secure"
- Errori concettuali su attaccamento (es. etichette come destino fisso)
- Contenuto clinico che sembra diagnosi o prescrizione terapeutica
- Linguaggio non inclusivo
- Pattern IA vietati dal validator
- Mancanza disclaimer su pagine ad alto rischio (profilo Alto, crisi, trauma)

### 🟡 Importante — correggere nel cluster

- Gergo senza spiegazione/tooltip
- Tono incoerente tra pagine del cluster
- Title Case / MAIUSCOLO negli header
- Ripetizioni strutturali (ogni paragrafo uguale)
- Grassetto eccessivo, elenchi template
- SEO: meta deboli, heading hierarchy errata
- Fonti assenti dove il contenuto è teoria o claim scientifico

### 🟢 Suggerimento — miglioramento

- Taglio lunghezza / sintesi
- Aggiunta tooltip o esempio
- Variazione ritmo frasi
- Bibliografia aggiuntiva
- Cross-link utili
