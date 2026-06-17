# Architettura informativa — Content Voice

Documento master per IA, navigazione e percorso utente. Allineato alla skill `content-voice`.

## Principio: doppio livello

| Livello | Pubblico | Obiettivo |
|---------|----------|-----------|
| **Percorso** | Chiara, Luca, Marco | Cosa fare ora, 3 passi, link concreti |
| **Wiki** | Elena, Andrea, approfondimento | Tassonomia completa, teoria, archetipi |

## Flusso utente

```
Home → Da dove inizi → Test → Il tuo percorso (hub dinamico)
                              ↘ Mappa personale → Il tuo percorso
```

### Hub dinamico (`il-tuo-percorso.html`)

- Legge `localStorage.testResults` (`primaryStyle`, `level`)
- Moduli: `journey-config.js`, `journey-hub.js`
- 12 configurazioni stile×livello
- 3 passi: immediato → comprensione EFT → connessione (storia/coppia/wiki)
- Fallback senza test → invito + link `da-dove-inizi.html`

### Ingresso statico (`da-dove-inizi.html`)

4 card per persona/job story — non tassonomia wiki.

## Navigazione (header)

| Voce | Contenuto |
|------|-----------|
| Inizia qui | `da-dove-inizi.html` |
| Il tuo percorso | `il-tuo-percorso.html` |
| Capire | fondamenti, 4 stili, gradienti, archetipi, test, mappa |
| Nella relazione | dinamiche, supporto partner, esercizi |
| Risorse | storie, aiuto, glossario, libri, approfondimenti |

Label: maiuscole naturali, tono umano.

## Homepage

1. Hero
2. Da dove vuoi partire (4 card)
3. Test rapido
4. Pilastri wiki
5. 12 profili in `<details>` (collassati)
6. Non sei solo + consapevolezza + FAQ

## Template profilo

Vedi [`public/profili/TEMPLATE-PROFILO.md`](../../public/profili/TEMPLATE-PROFILO.md).

Ordine: hero uniformato → strategie (`#strategie-pratiche`) → cosa succede (`#cosa-succede`) → archetipo → esercizi → prossimo passo journey.

## Esercizi

1. Due minuti adesso (apertura)
2. Filtri e contenuti per livello/stile
3. Teoria avanzata in `<details id="avanzato">`

## Componenti JS

| File | Ruolo |
|------|------|
| `journey-config.js` | Dati 12 percorsi |
| `journey-hub.js` | Render hub, banner, next steps |
| `template-loader.js` | Carica banner su pagine wiki |
| `test-surveyjs.js` | CTA percorso post-test |
| `mappa-profile-render.js` | Link percorso da mappa |

## Banner continua percorso

`initJourneyBanner()` — inserito dopo header se `testResults` presente. Escluso: test, il-tuo-percorso, da-dove-inizi.

## Gerarchia teorica nei contenuti

1. EFT (Johnson) — ciclo, protesta, ritiro, A.R.E.
2. Jung — archetipi, ombra (con ponte pratico)
3. Sistemica — feedback loop, doppi segnali
4. Process Work — edge, segnali (solo sezione avanzata)

## Filosofia copy

- Consapevolezza, non guarigione — nessuna eccezione
- Oscillante nel testo visibile
- Disclaimer compagno su livello alto / oscillante medio-alto

## SEO / sitemap

Aggiornare `public/sitemap.xml` con `il-tuo-percorso.html` e `da-dove-inizi.html` quando si rigenera sitemap.

## Priorità implementazione cluster profili

1. Ansioso (fatto — pilota)
2. Evitante
3. Oscillante
4. Secure
