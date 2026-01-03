# Script di Generazione Immagini

Questo script genera automaticamente immagini usando l'API Qwen Text2Image per il sito.

## Prerequisiti

1. Node.js >= 16.0.0
2. File `.env` nella root del progetto con le credenziali Qwen:
   ```env
   QWEN_API_KEY=your_api_key_here
   QWEN_URL_IMAGE=https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis
   QWEN_MODEL_IMAGE=qwen-image-plus
   ```
   
   Vedi `scripts/ENV_SETUP.md` per dettagli completi sulla configurazione.

## Installazione Dipendenze

```bash
npm install
```

## Uso

### Generare tutte le immagini

```bash
npm run generate-images
```

### Generare immagini per una pagina specifica

```bash
node scripts/generate-images.js --page=index.html
```

### Rigenerare tutte le immagini (anche esistenti)

```bash
node scripts/generate-images.js --force
```

## Output

- Immagini generate: `public/images/`
- Mappa immagini: `scripts/image-map.json` (generato automaticamente)

## Formato File

Le immagini vengono salvate con il nome:
```
{pagina}-{posizione}.webp
```

Esempio: `index-hero.webp`, `fondamenti-attaccamento.webp`

I nomi corrispondono esattamente a quelli usati nelle pagine HTML.

## Note

- **IMPORTANTE**: Le immagini generate sono SOLO pittoriche/visuali, senza testi, parole o lettere sovraimpresse
- Lo script evita di rigenerare immagini già esistenti (usa `--force` per forzare)
- Gestisce automaticamente rate limiting con pausa di 1 secondo tra richieste
- Se un'immagine fallisce, lo script continua con le altre e mostra un riepilogo errori alla fine
- Le immagini raw vengono salvate in `docs/image-generated/` (PNG)
- Le immagini processate (convertite in webp, ridimensionate) vengono salvate in `public/images/`
