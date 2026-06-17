# Mappa del Sito - Stili di Attaccamento Wiki

## Struttura organica (percorso + wiki)

```
HOME (index.html)
├── Da dove inizi (da-dove-inizi.html) ⭐ ingresso umano
├── Il tuo percorso (il-tuo-percorso.html) ⭐ hub dinamico post-test
├── Test (test.html) → localStorage.testResults
│
├── CAPIRE
│   ├── Fondamenti (fondamenti.html)
│   ├── I 4 stili base (stili-base.html)
│   ├── Modello a gradienti (modello-gradienti.html)
│   ├── Archetipi (archetipi.html)
│   └── Mappa personale (mappa-personale.html)
│
├── NELLA RELAZIONE
│   ├── Dinamiche di coppia (dinamiche-coppia.html)
│   ├── Come supportare il partner (come-supportare-partner.html)
│   └── Esercizi (esercizi.html)
│
├── RISORSE
│   ├── Storie reali (storie-reali/)
│   ├── Quando cercare aiuto (quando-cercare-aiuto.html)
│   ├── Risorse / glossario (risorse.html)
│   ├── Libri (libri.html)
│   └── Approfondimenti (approfondimenti/)
│
└── I 12 PROFILI (profili/)
    └── Cluster: ansioso, evitante, secure, oscillante × basso/medio/alto
```

## Flusso Chiara (persona prioritaria)

1. Home o **Da dove inizi** → Test
2. Risultati test → **Il tuo percorso** (3 passi cliccabili)
3. Profilo specifico → Esercizi / Storie / Dinamiche coppia
4. Wiki opzionale: fondamenti, archetipi

## Moduli percorso

- `public/js/modules/journey-config.js` — 12 configurazioni
- `public/js/modules/journey-hub.js` — render hub e banner

## Relazioni tra pagine

- **Test** → `il-tuo-percorso.html` + profilo
- **Mappa** → `il-tuo-percorso.html` + profilo
- **Fondamenti** → 4 stili → 12 profili
- **Profili** → esercizi, storie (via journey config)

## Documentazione IA

Vedi `.cursor/skills/content-voice/architecture.md`
