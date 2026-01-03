# Setup Variabili d'Ambiente per Generazione Immagini

## Configurazione .env

Crea un file `.env` nella root del progetto con il seguente contenuto:

```env
# Qwen Text2Image API Configuration
QWEN_API_KEY=your_api_key_here
# URL endpoint per generazione immagini con qwen-image-plus
QWEN_URL_IMAGE=https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis
# Modello da usare per generazione immagini
QWEN_MODEL_IMAGE=qwen-image-plus

# Image Generation Settings (opzionali)
# NOTA: qwen-image-plus supporta solo dimensioni specifiche:
# 1664*928, 1472*1140, 1328*1328, 1140*1472, 928*1664
# Default: 1328*1328 (quadrata)
IMAGE_WIDTH=1328
IMAGE_HEIGHT=1328
IMAGE_FORMAT=webp
```

## Note

- Il file `.env` è già incluso in `.gitignore` e non verrà committato
- Sostituisci `your_api_key_here` con la tua vera API key DashScope/Qwen
- **`QWEN_URL_IMAGE`**: URL endpoint completo per generazione immagini con qwen-image-plus
- **`QWEN_MODEL_IMAGE`**: Modello da usare (default: `qwen-image-plus`)
- Le dimensioni e il formato possono essere modificate secondo necessità tramite variabili opzionali

## Verifica Configurazione

Dopo aver creato il file `.env`, puoi verificare che lo script lo legga correttamente:

```bash
node -e "require('dotenv').config(); console.log('API URL:', process.env.QWEN_URL_IMAGE); console.log('Model:', process.env.QWEN_MODEL_IMAGE || 'qwen-image-plus');"
```

Se vedi l'URL stampato, la configurazione è corretta.
