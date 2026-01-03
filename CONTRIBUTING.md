# Contributing Guide - Stili di Attaccamento Wiki

## Benvenuto! 🎉

Grazie per il tuo interesse a contribuire a questo progetto. Questo documento fornisce le linee guida per contribuire in modo efficace.

## 📋 Indice

- [Codice di Condotta](#codice-di-condotta)
- [Come Contribuire](#come-contribuire)
- [Struttura del Progetto](#struttura-del-progetto)
- [Standard di Codice](#standard-di-codice)
- [Processo di Pull Request](#processo-di-pull-request)
- [Commit Messages](#commit-messages)
- [Testing](#testing)
- [Documentazione](#documentazione)
- [Creazione di Nuove Pagine HTML](#creazione-di-nuove-pagine-html)

## Codice di Condotta

### I Nostri Valori

Questo progetto si basa su principi di:
- **Compassione**: Nessun giudizio, riconosciamo la difficoltà
- **Consapevolezza**: Focus sulla comprensione, non sulla "guarigione"
- **Accessibilità**: Linguaggio chiaro, inclusivo, evidence-based
- **Rispetto**: Per tutte le forme di relazione e famiglia

### Comportamento Atteso

- Usa un linguaggio inclusivo e rispettoso
- Accetta critiche costruttive con grazia
- Focalizzati su ciò che è meglio per la comunità
- Mostra empatia verso altri membri della comunità

## Come Contribuire

### Segnalare Bug

1. Verifica che il bug non sia già stato segnalato nelle [Issues](https://github.com/your-repo/issues)
2. Crea una nuova issue con:
   - Titolo descrittivo
   - Descrizione dettagliata del problema
   - Passi per riprodurre il bug
   - Comportamento atteso vs. comportamento osservato
   - Screenshot se applicabile
   - Browser e versione OS

### Proporre Nuove Funzionalità

1. Apri una issue con tag `enhancement`
2. Descrivi la funzionalità proposta
3. Spiega perché sarebbe utile
4. Proponi una possibile implementazione

### Contribuire al Codice

1. Fai fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Pusha al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Struttura del Progetto

```
stiliattaccamento/
├── docs/              # Documenti di specifica (.md e .pdf)
├── jtbd/              # Personas e job stories (.md)
├── public/            # File statici del sito (HTML, CSS, JS)
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── images/
│   └── manifest.json
├── .env.example       # Template per variabili d'ambiente
├── CONTRIBUTING.md    # Questo file
├── .cursorrules       # Regole per AI assistant
├── STANDARDS.md       # Standard di codice
├── SECURITY.md        # Policy di sicurezza
└── docs/documentation/ARCHITECTURE.md  # Documentazione architetturale
```

### Cartelle Principali

- **`docs/`**: Contiene tutti i documenti di specifica e contenuti
- **`jtbd/`**: Contiene file .md descrittivi delle personas e delle job stories
- **`public/`**: Contiene esclusivamente i file statici del sito che verranno pubblicati su Cloudflare Pages

## Standard di Codice

### HTML5

- Usa HTML5 semantico (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`)
- Aggiungi attributi `lang` appropriati
- Usa attributi ARIA quando necessario per accessibilità
- Schema.org markup per SEO e AI optimization
- Validazione HTML5: tutti i file devono passare il validator W3C

**⚠️ OBBLIGATORIO per Nuove Pagine HTML:**
- Ogni nuova pagina HTML DEVE includere almeno 2 immagini generate via Qwen API
- Le immagini devono essere astratte, surrealiste, non fotorealistiche, con colori pastello
- Segui il processo documentato in [Creazione di Nuove Pagine HTML](#creazione-di-nuove-pagine-html)

### CSS3

- Mobile-first approach: scrivi prima per mobile, poi usa media queries per desktop
- Usa CSS custom properties (variabili) per colori e spacing
- Segui Material Design M3 (Material You) guidelines
- Supporta dark mode (default) e light mode con colori pastello
- Usa `rem` e `em` invece di `px` quando possibile
- Organizza CSS con metodologia BEM o simili
- Nessun framework CSS esterno (solo vanilla CSS3)

### JavaScript

- Vanilla JavaScript ES6+ (nessun framework)
- Usa `const` e `let`, evita `var`
- Funzioni arrow quando appropriato
- Codice modulare e riutilizzabile
- Service Worker per PWA
- Gestione errori appropriata
- Commenti JSDoc per funzioni complesse

### Naming Conventions

- **File**: kebab-case (`my-file.html`)
- **Classi CSS**: BEM (`block__element--modifier`)
- **Variabili JS**: camelCase (`myVariable`)
- **Costanti JS**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Formattazione

- Indentazione: 2 spazi (no tab)
- Fine riga: LF (Unix)
- Encoding: UTF-8
- Rimuovi trailing whitespace
- Max lunghezza riga: 100 caratteri

## Processo di Pull Request

### Prima di Inviare

1. Assicurati che il codice segua gli standard
2. **Se hai aggiunto/modificato pagine HTML**: Verifica che le immagini siano state generate e incluse (vedi [Creazione di Nuove Pagine HTML](#creazione-di-nuove-pagine-html))
3. Testa localmente su più browser
4. Verifica che non ci siano errori di linting
5. Aggiorna la documentazione se necessario
6. Assicurati che i commit siano atomici e ben descritti

### Template Pull Request

```markdown
## Descrizione
Breve descrizione delle modifiche

## Tipo di Modifica
- [ ] Bug fix
- [ ] Nuova funzionalità
- [ ] Breaking change
- [ ] Documentazione

## Checklist
- [ ] Il codice segue gli standard del progetto
- [ ] **Se nuova/modificata pagina HTML: almeno 2 immagini generate e incluse** (vedi [Creazione di Nuove Pagine HTML](#creazione-di-nuove-pagine-html))
- [ ] Ho eseguito test locali
- [ ] Ho aggiornato la documentazione
- [ ] Le modifiche sono retrocompatibili
- [ ] Ho aggiunto test se applicabile

## Screenshots (se applicabile)
```

## Commit Messages

Usa il formato Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipi

- `feat`: Nuova funzionalità
- `fix`: Bug fix
- `docs`: Solo documentazione
- `style`: Formattazione, semicolons, etc.
- `refactor`: Refactoring codice
- `test`: Aggiunta/modifica test
- `chore`: Task di build, configurazione, etc.

### Esempi

```
feat(quiz): aggiungi test auto-valutazione 12 domande

fix(navigation): correggi menu mobile su iOS

docs(readme): aggiorna istruzioni installazione
```

## Testing

### Test di Validazione

Il progetto include una suite di script di validazione che verificano la conformità del codice alle linee guida del progetto. Esegui tutti i test di validazione con:

```bash
node tests/validation/run-all.cjs
```

Questo esegue i seguenti validator:

1. **HTML Validator** (`html-validator.js`)
   - Verifica sintassi HTML base
   - Controlla presenza di DOCTYPE, tag head/body, meta tags
   - Valida struttura base degli elementi

2. **CSS Validator** (`css-validator.js`)
   - Verifica sintassi CSS
   - Controlla validità dei file CSS

3. **Link Checker** (`link-checker.js`)
   - Verifica che tutti i link interni siano validi
   - Controlla link rotti

4. **Schema.org Checker** (`schema-org-checker.js`)
   - Verifica presenza e validità di Schema.org structured data
   - Controlla che ogni pagina abbia markup appropriato

5. **Style Validator** (`style-validator.js`) ⭐ **NUOVO**
   - Verifica conformità alle linee guida di stile linguistico
   - Controlla pattern riconoscibili da IA da evitare
   - Verifica linguaggio inclusivo
   - Verifica terminologia corretta ("oscillante" invece di "disorganizzato")

#### Style Validator - Dettagli

Il validator di stile linguistico verifica:

**Pattern da IA da evitare:**
- "È importante notare che"
- "Vale la pena ricordare che"
- "Ricorda che" (come conclusione sistematica)
- "Prima di tutto, ricorda"
- "Si suggerisce di" / "Si consiglia di"
- "Comprendiamo le tue difficoltà" (empatia generica)

**Linguaggio inclusivo:**
- Nessun uso di "lui/lei" - usa "chi" o riformula
- Nessun uso di "insoddisfatto/a" - usa "insoddisfatto"
- Nessun uso di "per lui" / "per lei" - usa "per chi"
- Usa "partner" invece di riferimenti di genere specifici

**Terminologia:**
- "disorganizzato" deve essere sostituito con "oscillante" (tranne nei nomi file per retrocompatibilità)

Per eseguire solo il validator di stile:

```bash
node tests/validation/style-validator.js
```

### Test Manuali

Prima di ogni commit, testa:
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode e light mode
- [ ] PWA funzionalità (offline, install)
- [ ] Accessibilità (screen reader, keyboard navigation)
- [ ] Performance (Lighthouse score > 90)

### Browser Support

- Chrome/Edge (ultime 2 versioni)
- Firefox (ultime 2 versioni)
- Safari (ultime 2 versioni)
- Mobile browsers (iOS Safari, Chrome Android)

## Documentazione

### Commenti nel Codice

- Commenta il "perché", non il "cosa"
- Usa JSDoc per funzioni JavaScript
- Mantieni commenti aggiornati con il codice

### Documentazione Utente

- Tutti i contenuti in italiano
- **Linguaggio inclusivo**: Usa sempre termini neutri (persona, partner, chi) invece di riferimenti di genere
- **Terminologia**: Usa sempre "Oscillante" invece di "Disorganizzato" in tutti i contenuti
- Linguaggio chiaro e accessibile
- Evita jargon senza spiegazione
- Include esempi pratici quando possibile

### Tono di Voce Umano e Naturale

**OBBLIGATORIO**: Tutti i contenuti devono sembrare scritti da una persona reale, non da un'intelligenza artificiale.

#### Checklist Prima di Scrivere:

- [ ] Le frasi variano in lunghezza e struttura?
- [ ] Ho evitato pattern riconoscibili da IA (es. "È importante notare che..." ripetuto)?
- [ ] Sto scrivendo come parlerei a un amico, non come in un manuale?
- [ ] Gli header usano maiuscole naturali (prima lettera + minuscole, non Title Case forzato)?
- [ ] Ho usato esempi concreti e specifici invece di generici?
- [ ] L'empatia è espressa in modo concreto, non generico?

#### Errori Comuni da Evitare:

1. **Maiuscole eccessive negli header**:
   - ❌ "Gli Stili di Attaccamento Base"
   - ✅ "Gli stili di attaccamento base"
   - ❌ "Dall'Indipendenza Solitaria alla Connessione Sicura"
   - ✅ "Dall'indipendenza solitaria alla connessione sicura"

2. **Pattern riconoscibili da IA**:
   - ❌ "È importante notare che l'attaccamento sicuro è fondamentale perché permette di..."
   - ✅ "L'attaccamento sicuro ti permette di..."

3. **Ripetizioni strutturali**:
   - ❌ Ogni paragrafo inizia con "L'attaccamento [X] è caratterizzato da..."
   - ✅ Varia gli inizi: "Se hai questo stile...", "Quando senti...", "Capita che..."

4. **Linguaggio troppo formale**:
   - ❌ "Si suggerisce di implementare le seguenti strategie..."
   - ✅ "Puoi provare questo. Funziona per molte persone."

5. **Empatia generica**:
   - ❌ "Comprendiamo le tue difficoltà"
   - ✅ "Probabilmente ti senti sopraffatto. È normale, capita."

#### Esempi di Testo Umano vs Testo da IA:

**❌ Testo da IA (da evitare)**:
> "È importante notare che l'attaccamento sicuro è caratterizzato da una serie di comportamenti specifici. Vale la pena ricordare che questo stile permette di sviluppare relazioni sane. Ricorda che la consapevolezza è fondamentale per il cambiamento."

**✅ Testo Umano (da preferire)**:
> "Se hai un attaccamento sicuro, probabilmente ti viene naturale cercare vicinanza quando ne hai bisogno. Non è perfetto - nessuno lo è - ma ti permette di stare in relazione senza costante ansia. E se non ce l'hai? Nessun problema. La consapevolezza è il primo passo, non la meta finale."

---

Quando modifichi contenuti esistenti, applica queste linee guida per rendere i testi più umani e naturali, riducendo l'uso eccessivo di maiuscole negli header e evitando pattern che fanno sembrare i testi generati automaticamente.

### Schema.org Markup

Tutti i contenuti devono includere markup Schema.org appropriato:
- `Article` per articoli wiki
- `FAQPage` per FAQ
- `BreadcrumbList` per navigazione
- `Person` per autori (se applicabile)
- `WebSite` per metadata sito

## Workflow Git

1. **Main branch**: sempre deployabile
2. **Feature branches**: `feature/nome-feature`
3. **Hotfix branches**: `hotfix/nome-fix`
4. **Release branches**: `release/v1.0.0`

## Creazione di Nuove Pagine HTML

**⚠️ OBBLIGATORIO**: Quando crei una nuova pagina HTML, devi OBBLIGATORIAMENTE includere almeno 2 immagini generate via Qwen Text2Image API.

### Processo Obbligatorio

#### 1. Pianifica le Immagini (OBBLIGATORIO)

Per ogni nuova pagina HTML, identifica almeno 2 sezioni chiave dove inserire immagini:
- Sezioni principali (dopo `<h1>` o `<h2>` importanti)
- Card o articoli significativi
- Sezioni che beneficiano di supporto visivo

**Requisiti immagini:**
- **Stile**: Astratte, surrealiste, NON fotorealistiche
- **Palette**: Colori pastello, accoglienti
- **Dimensioni**: 800x600px, formato WebP
- **Tema**: Deve essere coerente con il contenuto della pagina

#### 2. Crea i Prompt (OBBLIGATORIO)

Aggiungi i prompt in `scripts/prompts.json` seguendo questo formato:

```json
{
  "nuova-pagina.html": {
    "nome-posizione-1": {
      "prompt": "Abstract surrealist composition, soft pastel colors, welcoming atmosphere, non-photorealistic, dreamlike quality, representing [concetto chiave]",
      "position": "after-h2-sezione-principale",
      "alt": "Descrizione accessibile dell'immagine in italiano",
      "figcaption": "Didascalia opzionale che descrive l'immagine"
    },
    "nome-posizione-2": {
      "prompt": "...",
      "position": "in-card-importante",
      "alt": "...",
      "figcaption": "..."
    }
  }
}
```

**Linee guida prompt:**
- Inizia sempre con "Abstract surrealist" o "Abstract"
- Includi "soft pastel colors"
- Includi "non-photorealistic"
- Includi "welcoming" o "embracing" o "comforting"
- Descrivi il concetto chiave in modo astratto
- Usa termini come "flowing shapes", "dreamlike quality", "gentle gradients"

**Esempi di prompt efficaci:**
```json
"Abstract surrealist landscape with soft pastel gradients, flowing shapes like gentle waves, warm welcoming atmosphere, dreamlike quality, soft pinks and blues, non-photorealistic, cozy and embracing"

"Abstract mystical composition, symbolic flowing forms, soft ethereal pastels with hints of gold, dreamlike archetypal imagery, surreal but profound, welcoming the unconscious"
```

#### 3. Genera le Immagini (OBBLIGATORIO)

Dopo aver aggiunto i prompt in `scripts/prompts.json`:

```bash
# Installa dipendenze se non ancora fatto
npm install

# Genera immagini per la nuova pagina
node scripts/generate-images.js --page=nuova-pagina.html
```

Le immagini verranno salvate in `public/images/` con il formato:
```
{page-name}-{position}.webp
```

Esempio: `nuova-pagina-nome-posizione-1.webp`

#### 4. Inserisci le Immagini nell'HTML (OBBLIGATORIO)

Per ogni immagine, usa questo pattern HTML:

```html
<figure class="wiki-image">
  <img src="images/{page-name}-{position}.webp" 
       alt="{alt text dal prompts.json}" 
       loading="lazy"
       class="wiki-image__img">
  <figcaption class="wiki-image__caption">{figcaption dal prompts.json}</figcaption>
</figure>
```

**Posizionamento:**
- Immagini dopo `<h1>` o `<h2>` principali: usa `loading="eager"` (solo per la prima immagine above-the-fold)
- Immagini in sezioni successive: usa `loading="lazy"`
- Inserisci le immagini prima o dopo il contenuto testuale rilevante

**Esempio completo:**

```html
<article class="card mb-8">
  <h2>Sezione Principale</h2>
  <figure class="wiki-image">
    <img src="images/nuova-pagina-sezione-principale.webp" 
         alt="Rappresentazione astratta del concetto chiave" 
         loading="lazy"
         class="wiki-image__img">
    <figcaption class="wiki-image__caption">Didascalia descrittiva</figcaption>
  </figure>
  <p>Contenuto testuale dopo l'immagine...</p>
</article>
```

#### 5. Verifica (OBBLIGATORIO)

Prima di committare:
- [ ] Almeno 2 immagini aggiunte in `scripts/prompts.json`
- [ ] Immagini generate correttamente con lo script
- [ ] Immagini inserite nell'HTML con tag `<figure>` e `<img>` appropriati
- [ ] Alt text presente e descrittivo per ogni immagine
- [ ] Figcaption presente quando appropriato
- [ ] Attributo `loading="lazy"` per immagini below-the-fold
- [ ] Test visuale: immagini visibili e correttamente posizionate
- [ ] Validazione HTML: nessun errore

### Checklist Completa per Nuova Pagina HTML

Prima di aprire una Pull Request con una nuova pagina HTML:

- [ ] Pagina HTML creata con struttura semantica corretta
- [ ] Schema.org markup presente
- [ ] Navigazione aggiornata (se necessario)
- [ ] **ALMENO 2 prompt aggiunti in `scripts/prompts.json`**
- [ ] **Immagini generate eseguendo lo script**
- [ ] **Immagini inserite nell'HTML con markup completo**
- [ ] Alt text accessibile per ogni immagine
- [ ] CSS responsive verificato
- [ ] Dark/light mode testato
- [ ] Validazione HTML5 passata
- [ ] Test su mobile e desktop

### Note Importanti

- **NON committare immagini mancanti**: Se le immagini non sono ancora generate, genera prima le immagini prima di aprire la PR
- **NON usare immagini placeholder**: Usa sempre immagini reali generate via API
- **NON modificare immagini esistenti senza aggiornare**: Se modifichi una pagina esistente, verifica che le immagini siano ancora appropriate
- **Coerenza visiva**: Le nuove immagini devono essere coerenti con lo stile esistente (astratte, pastello, surrealiste)

### Documentazione Correlata

- Vedi `scripts/README.md` per dettagli sullo script di generazione
- Vedi `scripts/ENV_SETUP.md` per configurazione API Qwen
- Esempi di prompt in `scripts/prompts.json`

### Domande sulle Immagini?

Se non sei sicuro su:
- Quale sezione necessita un'immagine
- Come formulare un prompt efficace
- Dove posizionare l'immagine nell'HTML

Consulta le pagine esistenti come riferimento o apri una issue con tag `question`.

## Domande?

Se hai domande:
1. Controlla la documentazione esistente
2. Cerca nelle issues esistenti
3. Apri una nuova issue con tag `question`

## Licenza

Contribuendo, accetti che le tue modifiche siano rilasciate sotto la stessa licenza del progetto.

---

**Grazie per il tuo contributo!** 🙏

Ogni contributo, grande o piccolo, aiuta a rendere questo progetto migliore per tutti.

