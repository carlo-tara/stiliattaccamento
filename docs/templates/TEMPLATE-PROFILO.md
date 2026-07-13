# Template per i 12 profili

Struttura standard allineata a content-voice (pratica prima, teoria semplificata).

## Ordine sezioni

1. **Hero** — `Ansioso alto` (no MAIUSCOLO), sottotitolo archetipo, badge `Livello alto`
2. **Oggi puoi iniziare da qui** (`id="strategie-pratiche"`) — strategie immediate, checklist
3. **Cosa sta succedendo** (`id="cosa-succede"`) — cornice EFT + modello a gradienti
4. **Nel corpo** — sensazioni, trigger (può stare in sezione 3)
5. **L'archetipo in breve** — max 1 paragrafo poetico + ponte pratico («In pratica…»); non sezione lunga prima delle strategie
6. **Ombra e integrazione** — Jung, sezione condensata
7. **Esercizi per te** — link a `esercizi.html`
8. **Se il disagio è forte** — disclaimer compagno (livello alto / oscillante)
9. **Prossimo passo** — componente journey (`journey-next-step`)
10. **Navigazione** — livelli stesso stile + link wiki

## Hero (esempio)

```html
<h1 class="color-anxious">Ansioso alto</h1>
<h2>Il Matto (0): L'ingenuità traumatizzata</h2>
<span class="level-badge alto">Livello alto</span>
```

## Prossimo passo (JS)

```html
<aside class="card journey-next-step mt-8" id="journey-next-step">
  <h2>Prossimo passo</h2>
  <div id="journey-next-step-content"></div>
</aside>
```

Script: `journey-config.js`, `journey-hub.js`, `utils.js` + init con `stile` e `livello`.

## Mappatura profili

### Ansioso
- `ansioso-alto.html` — Il Matto
- `ansioso-medio.html` — L'Innamorato
- `ansioso-basso.html` — L'Amante consapevole

### Evitante
- `evitante-alto.html`, `evitante-medio.html`, `evitante-basso.html`

### Secure
- `secure-alto.html`, `secure-medio.html`, `secure-basso.html`

### Oscillante
- `disorganizzato-alto.html`, `disorganizzato-medio.html`, `disorganizzato-basso.html`

## Note

- File URL restano `disorganizzato-*.html`; testo visibile: **Oscillante**
- Archetipi da `docs/archetipi-junghiani.md`; gradienti da `docs/stili-attaccamento-gradienti-3livelli.md`
