# Public Directory - Stili di Attaccamento Wiki

Questa directory contiene tutti i file statici del sito che verranno pubblicati su Cloudflare Pages.

## Struttura

```
public/
├── index.html              # Homepage
├── fondamenti.html         # Fondamenti teoria attaccamento
├── modello-gradienti.html   # Modello distintivo a gradienti
├── archetipi.html          # Archetipi Junghiani (cardinale)
├── stili-base.html         # I 4 stili base
├── test.html              # Test auto-valutazione
├── esercizi.html           # Esercizi pratici
├── css/
│   ├── main.css           # Stili principali
│   └── themes.css         # Stili tema-specifici
├── js/
│   ├── main.js            # JavaScript principale
│   └── theme.js          # Toggle dark/light mode
├── profili/
│   ├── ansioso-alto.html  # Esempio profilo completo
│   └── TEMPLATE-PROFILO.md # Template per altri 11 profili
├── sitemap.md             # Mappa del sito
└── visual-design-specs.md # Specifiche visual design
```

## File Creati

### Pagine Principali
- ✅ `index.html` - Homepage con hero, test rapido, preview 3 pilastri
- ✅ `fondamenti.html` - Cos'è attaccamento, 4 bisogni Bowlby, IWM
- ✅ `modello-gradienti.html` - Modello distintivo: due assi, 3 livelli
- ✅ `archetipi.html` - Archetipi Junghiani: Jung, tarocchi, viaggio eroe
- ✅ `stili-base.html` - I 4 stili: Secure, Ansioso, Evitante, Oscillante
- ✅ `test.html` - Test 12 domande (struttura base, 3 domande esempio)
- ✅ `esercizi.html` - Esercizi per livello, stile, quotidiani

### Profili
- ✅ `profili/ansioso-alto.html` - Profilo completo esempio (template per altri 11)
- ✅ `profili/TEMPLATE-PROFILO.md` - Documentazione template

### CSS e JavaScript
- ✅ `css/main.css` - Stili principali Material Design M3
- ✅ `css/themes.css` - Stili tema-specifici e colori pastello
- ✅ `js/main.js` - JavaScript principale (test, navigazione)
- ✅ `js/theme.js` - Toggle dark/light mode

### Documentazione
- ✅ `sitemap.md` - Mappa del sito completa
- ✅ `visual-design-specs.md` - Specifiche visual design dettagliate

## Prossimi Step

### Da Completare
1. **Test Completo**: Aggiungere le rimanenti 9 domande al test (attualmente 3 esempio)
2. **11 Profili Rimanenti**: Creare gli altri 11 profili usando il template
3. **Immagini**: Generare illustrazioni tarocchi via LLM
4. **Grafici Interattivi**: Implementare matrice bidimensionale e grafico 5 dimensioni
5. **PWA**: Aggiungere manifest.json e service worker
6. **Approfondimenti**: Creare pagina approfondimenti.html

### Note Implementazione

- Tutti i file HTML seguono HTML5 semantico
- Schema.org markup incluso in ogni pagina
- Mobile-first responsive design
- Dark mode default, light mode toggle
- Colori pastello per ogni stile
- Material Design M3 come base

## Deployment

I file in questa directory sono pronti per essere pubblicati su Cloudflare Pages tramite GitHub.

