---
name: stiliattaccamento
domain: stiliattaccamento.it
language: it
register: tu
tone_skill: content-voice
---

# Brand brief — Stili di Attaccamento

**Tono di voce:** guida canonica in [`docs/design/tone-of-voice.md`](../../docs/design/tone-of-voice.md). Per riscrittura operativa: `.cursor/skills/content-voice/SKILL.md` (skill L2 che eredita `a-copywriter`). Questo file è il brand brief sintetico.

---

## Identità

- **Settore / prodotto:** Wiki PWA sugli stili di attaccamento (teoria Bowlby/Ainsworth, approccio EFT)
- **Pubblico target:** Persone curiose o in difficoltà relazionale che vogliono capirsi senza sentirsi sbagliate; partner che cercano supporto; lettori con background vario (da curiosi a esperti)
- **Promessa in una frase:** Capire il proprio stile di attaccamento con chiarezza e compassione, con strumenti pratici — non una promessa di guarigione

---

## Tono (3–5 aggettivi)

Compassionevole, vicino, chiaro, non giudicante, pratico.

> Come un compagno di viaggio informato: caldo ma concreto. Teoria sì, ma sempre ancorata a cosa notare e cosa fare.

---

## Registro e persona

| Campo | Valore |
|-------|--------|
| Trattamento | tu (prevalente); noi ok per inclusione («vediamo insieme») |
| Persona | Compagno di viaggio informato / amico esperto |
| Umorismo | no (contesto sensibile) |
| Brand in 1ª persona | no (competenza empatica, non clinica) |

---

## Lessico preferito / da evitare

| Usa | Evita |
|-----|-------|
| riconoscere, osservare, integrare, notare, esplorare | guarire, curare, fixare |
| persona, partner, chi | lui/lei, marito/moglie |
| **Oscillante** | Disorganizzato (salvo FAQ che spiega la scelta) |
| consapevolezza, ciclo, pattern | malato, rotto, sbagliato, normale vs anormale |
| «In parole semplici…», «Senza entrare nei dettagli tecnici…» | filler AI, tono da manuale clinico |

---

## Struttura chiusura brand

- Nessuna chiusura formula — chiudi sul fatto o sul passo successivo concreto
- CTA soft verso test, percorso o risorse correlate
- Disclaimer clinico sobrio dove serve (profili Alto, trauma, crisi) — non ripetere in ogni paragrafo

---

## Esempi buoni

### Esempio 1 — invito (homepage)

> Se ti è capitato di pensare «ok, questa volta funzionerà» e poi ritrovarti nella stessa dinamica, non sei solo. Qui puoi capire cosa succede — senza etichette che giudicano.

### Esempio 2 — profilo (tono direttivo + empatico)

> Quando il partner si allontana, il corpo reagisce prima della testa. Non è debolezza: è il sistema di attaccamento che cerca sicurezza. Puoi iniziare notando cosa senti nei primi minuti.

---

## Anti-pattern brand

- Promesse di guarigione o «fix» dello stile
- Tono da terapeuta freddo o da guru
- Linguaggio stigmatizzante o binario normale/anormale
- Pattern riconoscibili da IA («È importante notare che…», elenchi tutti uguali)
- Header in MAIUSCOLO forzato (es. ANSIOSO ALTO)

---

## SEO (opzionale)

| Campo | Valore |
|-------|--------|
| Pattern title | `[Argomento] — Stili di Attaccamento` o naturale con keyword |
| Pattern meta | Beneficio concreto + invito soft (≤155 car.) |
| Keyword cluster principali | stili di attaccamento, test attaccamento, ansioso, evitante, oscillante, secure |
| Link interni tipici | test, stili-base, profili, esercizi, fondamenti |
| Limiti | title ≤60, meta ≤155; Schema.org su ogni pagina wiki |

---

## Note aggiuntive

- Filosofia EFT: il nemico è il ciclo, non la persona
- Gerarchia teorica in contenuti: EFT → Jung → Sistemica → Process Work
- Bilanciamento ~70% pratico / ~30% teorico
- Validator progetto: `npm run test:validation` dopo modifiche HTML
