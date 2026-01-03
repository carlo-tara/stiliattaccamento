#!/usr/bin/env node

/**
 * Script per generare immagini usando Qwen Text2Image API
 * 
 * IMPORTANTE: Le immagini generate devono essere SOLO pittoriche/visuali,
 * senza testi, parole, lettere o scritte sovraimpresse.
 * 
 * Uso:
 *   node scripts/generate-images.js [--page=index.html] [--force] [--limit=N]
 * 
 * Opzioni:
 *   --page=filename    Genera solo immagini per una specifica pagina
 *   --force            Rigenera anche immagini esistenti
 *   --limit=N          Limita il numero di immagini da generare (utile per test)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const http = require('http');

// Carica variabili d'ambiente
require('dotenv').config();

const PROMPTS_FILE = path.join(__dirname, 'prompts.json');
const IMAGE_MAP_FILE = path.join(__dirname, 'image-map.json');
const GENERATED_DIR = path.join(__dirname, '..', 'docs', 'image-generated'); // Immagini generate (raw)
const PROCESSED_DIR = path.join(__dirname, '..', 'public', 'images'); // Immagini processate (finali)

// Configurazione API
const API_KEY = process.env.QWEN_API_KEY;
const API_URL = process.env.QWEN_URL_IMAGE;
const IMAGE_MODEL = process.env.QWEN_MODEL_IMAGE || 'qwen-image-plus';
// qwen-image-plus supporta solo dimensioni specifiche:
// 1664*928, 1472*1140, 1328*1328, 1140*1472, 928*1664
// Usiamo 1328*1328 (quadrata) come default per generazione
const IMAGE_WIDTH = parseInt(process.env.IMAGE_WIDTH || '1328');
const IMAGE_HEIGHT = parseInt(process.env.IMAGE_HEIGHT || '1328');
// Dimensioni finali per le immagini processate (quelle usate nel sito)
const FINAL_WIDTH = parseInt(process.env.FINAL_WIDTH || '800');
const FINAL_HEIGHT = parseInt(process.env.FINAL_HEIGHT || '600');
const IMAGE_FORMAT = process.env.IMAGE_FORMAT || 'webp';

// Verifica configurazione
if (!API_KEY) {
  console.error('❌ Errore: QWEN_API_KEY non trovata nel file .env');
  console.error('   Verifica la configurazione nel file .env');
  process.exit(1);
}

if (!API_URL) {
  console.error('❌ Errore: QWEN_URL_IMAGE non trovata nel file .env');
  console.error('   Verifica la configurazione nel file .env');
  console.error('   Dovrebbe essere: https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis');
  process.exit(1);
}

// Carica prompt
let prompts;
try {
  prompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));
} catch (error) {
  console.error('❌ Errore nel caricamento di prompts.json:', error.message);
  process.exit(1);
}

// Carica o crea image-map
let imageMap = {};
if (fs.existsSync(IMAGE_MAP_FILE)) {
  try {
    imageMap = JSON.parse(fs.readFileSync(IMAGE_MAP_FILE, 'utf8'));
  } catch (error) {
    console.warn('⚠️  Impossibile caricare image-map.json, creando nuovo file');
  }
}

// Crea directory output se non esistono
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}
if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
}

/**
 * Genera hash del prompt per identificare univocamente l'immagine (per tracking)
 */
function generateImageHash(page, position, prompt) {
  const data = `${page}-${position}-${prompt}`;
  return crypto.createHash('md5').update(data).digest('hex').substring(0, 8);
}

/**
 * Genera nome file immagine (semplificato, senza hash per facilitare l'uso)
 */
function getImageFilename(page, position, extension = null) {
  const pageName = page.replace('.html', '').replace(/\//g, '-');
  const ext = extension || IMAGE_FORMAT;
  return `${pageName}-${position}.${ext}`;
}

/**
 * Esegue una richiesta HTTP
 */
function makeRequest(url, options, payload) {
  return new Promise((resolve, reject) => {
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const response = JSON.parse(data);
            resolve({ statusCode: res.statusCode, data: response });
          } catch (error) {
            reject(new Error(`Errore parsing risposta: ${error.message}\nRisposta: ${data.substring(0, 500)}`));
          }
        } else {
          let errorMsg = `API error ${res.statusCode}`;
          if (data) {
            try {
              const errorData = JSON.parse(data);
              errorMsg += `: ${JSON.stringify(errorData)}`;
            } catch {
              errorMsg += `: ${data.substring(0, 500)}`;
            }
          }
          reject(new Error(errorMsg));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

/**
 * Crea un task asincrono per generare immagine
 */
async function createImageTask(prompt) {
  const url = new URL(API_URL);
  
  // Costruisci il payload della richiesta DashScope
  // Per chiamate asincrone, aggiungi callback o task_mode
  const payload = JSON.stringify({
    model: IMAGE_MODEL,
    input: {
      prompt: prompt
    },
    parameters: {
      size: `${IMAGE_WIDTH}*${IMAGE_HEIGHT}`, // DashScope usa asterisco invece di x
      n: 1
    }
  });

  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'X-DashScope-Async': 'enable', // Abilita modalità asincrona
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const response = await makeRequest(url, options, payload);
  
  // DashScope restituisce task_id nella risposta quando si crea un task asincrono
  // Il task_id può essere in response.data.output.task_id o response.data.task_id
  if (response.data.output && response.data.output.task_id) {
    return response.data.output.task_id;
  }
  
  if (response.data.task_id) {
    return response.data.task_id;
  }
  
  // Se la risposta contiene già i risultati (caso sincrono - raro ma possibile)
  if (response.data.output && response.data.output.results && response.data.output.results.length > 0) {
    return { completed: true, results: response.data.output.results };
  }
  
  // Log della risposta per debug
  console.log('⚠️  Risposta API inattesa:', JSON.stringify(response.data).substring(0, 300));
  throw new Error(`Risposta inattesa: nessun task_id o risultato trovato`);
}

/**
 * Verifica lo stato di un task
 */
async function getTaskStatus(taskId) {
  // Endpoint corretto per DashScope: /api/v1/tasks/{task_id}
  // Costruiamo l'URL completo basandoci sull'hostname dell'API_URL originale
  const baseUrl = new URL(API_URL);
  const taskUrl = new URL(`https://${baseUrl.hostname}/api/v1/tasks/${taskId}`);
  
  const options = {
    hostname: taskUrl.hostname,
    port: taskUrl.port || 443,
    path: taskUrl.pathname,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return await makeRequest(taskUrl, options);
}

/**
 * Chiama API Qwen per generare immagine (con supporto async)
 */
async function generateImage(prompt, width = null, height = null) {
  try {
    // Prova prima a creare un task asincrono
    const taskResult = await createImageTask(prompt, width, height);
    
    // Se il task è già completato, restituisci il risultato
    if (taskResult.completed && taskResult.results) {
      const result = taskResult.results[0];
      if (result.url) return result.url;
      if (result.image_url) return result.image_url;
      throw new Error('Risultato non contiene URL immagine');
    }
    
    // Altrimenti fai polling del task
    const taskId = taskResult;
    let attempts = 0;
    const maxAttempts = 60; // 60 tentativi = 5 minuti max (5 secondi tra tentativi)
    const pollInterval = 5000; // 5 secondi
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;
      
      const statusResponse = await getTaskStatus(taskId);
      const taskData = statusResponse.data;
      
      // Log progresso solo ogni 5 tentativi per non intasare l'output
      if (attempts % 5 === 1) {
        console.log(`  Verifica status task (tentativo ${attempts}/${maxAttempts})...`);
      }
      
      // DashScope può restituire task_status in diversi punti
      const taskStatus = taskData.task_status || 
                        taskData.output?.task_status || 
                        taskData.status ||
                        taskData.output?.status;
      
      if (taskStatus === 'SUCCEEDED') {
        // La risposta contiene output.results con le immagini generate
        const results = taskData.output?.results || 
                       taskData.results || 
                       taskData.output?.output?.results;
        if (results && results[0]) {
          const result = results[0];
          // L'URL dell'immagine può essere in result.url o result.image_url
          if (result.url) return result.url;
          if (result.image_url) return result.image_url;
        }
        // Se non trova results, prova a loggare la struttura per debug
        console.log('⚠️  Struttura risposta task:', JSON.stringify(taskData).substring(0, 500));
        throw new Error('Task completato ma risultato non contiene URL immagine');
      } else if (taskStatus === 'FAILED') {
        const errorMsg = taskData.message || taskData.error || taskData.output?.message || 'Errore sconosciuto';
        throw new Error(`Task fallito: ${errorMsg}`);
      } else if (taskStatus === 'PENDING' || taskStatus === 'RUNNING') {
        // Continua a fare polling
        if (attempts % 5 === 0) {
          console.log(`  Task ancora in elaborazione... (${attempts}/${maxAttempts})`);
        }
        continue;
      } else if (!taskStatus) {
        // Se task_status non è definito, logga la struttura per capire il problema
        console.log('⚠️  Risposta task senza task_status:', JSON.stringify(taskData).substring(0, 500));
        throw new Error(`Risposta API inattesa: task_status non trovato nella risposta`);
      } else {
        throw new Error(`Stato task sconosciuto: ${taskStatus}`);
      }
    }
    
    throw new Error('Timeout: task non completato dopo 5 minuti');
    
  } catch (error) {
    // Se l'header X-DashScope-Async non funziona, prova senza
    // (alcune API potrebbero gestire automaticamente)
    if (error.message.includes('403') || error.message.includes('AccessDenied')) {
      throw new Error(`Errore API: ${error.message}. Verifica che l'API key supporti chiamate asincrone o usa un endpoint diverso.`);
    }
    throw error;
  }
}

/**
 * Scarica immagine da URL e salva su disco
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        fileStream.on('error', reject);
      } else {
        reject(new Error(`HTTP ${res.statusCode} durante download`));
      }
    }).on('error', reject);
  });
}

/**
 * Processa immagine: converte in webp, ridimensiona e ritaglia se necessario
 * Usa ImageMagick per la manipolazione
 */
async function processImageFile(inputPath, outputPath, targetWidth = FINAL_WIDTH, targetHeight = FINAL_HEIGHT) {
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process');
    
    // Comando ImageMagick: converti, ridimensiona mantenendo aspect ratio, ritaglia al centro se necessario
    // -resize mantiene aspect ratio, poi -gravity center -crop per centrare e ritagliare
    const command = `convert "${inputPath}" -resize ${targetWidth}x${targetHeight}^ -gravity center -crop ${targetWidth}x${targetHeight}+0+0 +repage -quality 85 -format webp "${outputPath}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Errore ImageMagick: ${error.message}\n${stderr}`));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Processa una singola immagine
 */
async function processImage(page, position, imageData, force = false) {
  const hash = generateImageHash(page, position, imageData.prompt);
  const generatedFilename = getImageFilename(page, position, 'png'); // Immagini generate spesso in PNG
  const processedFilename = getImageFilename(page, position, 'webp'); // Immagini finali in webp
  const generatedPath = path.join(GENERATED_DIR, generatedFilename);
  const processedPath = path.join(PROCESSED_DIR, processedFilename);
  
  // Controlla se l'immagine deve essere verticale (per carte tarocchi)
  const isVertical = imageData.vertical === true;
  const finalWidth = isVertical ? parseInt(process.env.FINAL_WIDTH_VERTICAL || '600') : FINAL_WIDTH;
  const finalHeight = isVertical ? parseInt(process.env.FINAL_HEIGHT_VERTICAL || '800') : FINAL_HEIGHT;
  
  // Controlla se immagine processata esiste già
  if (!force && fs.existsSync(processedPath)) {
    console.log(`✓ ${processedFilename} già esistente (usa --force per rigenerare)`);
    return {
      page,
      position,
      filename: processedFilename,
      hash,
      exists: true
    };
  }

  console.log(`Generando immagine per ${page} - ${position}...`);
  console.log(`  Prompt: ${imageData.prompt.substring(0, 80)}...`);

  try {
    // Genera immagine
    const imageUrl = await generateImage(imageData.prompt);
    
    // Scarica immagine raw
    await downloadImage(imageUrl, generatedPath);
    console.log(`  ✓ Immagine raw salvata in ${generatedFilename}`);
    
    // Processa immagine (converti, ridimensiona, ritaglia)
    await processImageFile(generatedPath, processedPath, finalWidth, finalHeight);
    console.log(`✓ Processata: ${processedFilename} (${finalWidth}x${finalHeight}px, webp)`);
    
    return {
      page,
      position,
      filename: processedFilename,
      hash,
      url: imageUrl,
      exists: false
    };
  } catch (error) {
    console.error(`❌ Errore generando ${processedFilename}:`, error.message);
    throw error;
  }
}

/**
 * Processa tutte le immagini
 */
async function processAllImages(filterPage = null, force = false, limit = null) {
  const results = [];
  const errors = [];
  let processedCount = 0;

  for (const [page, positions] of Object.entries(prompts)) {
    // Filtra per pagina se specificato
    if (filterPage && page !== filterPage) {
      continue;
    }

    console.log(`\n📄 Elaborando ${page}...`);

    for (const [position, imageData] of Object.entries(positions)) {
      // Limita il numero di immagini se specificato
      if (limit && processedCount >= limit) {
        console.log(`\n⚠️  Limite di ${limit} immagini raggiunto. Interruzione.`);
        break;
      }

      try {
        const result = await processImage(page, position, imageData, force);
        results.push(result);
        processedCount++;
        
        // Aggiorna image-map
        if (!imageMap[page]) {
          imageMap[page] = {};
        }
        imageMap[page][position] = {
          filename: result.filename,
          alt: imageData.alt,
          figcaption: imageData.figcaption || '',
          hash: result.hash
        };

        // Piccola pausa per non sovraccaricare l'API
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        errors.push({ page, position, error: error.message });
      }
    }
    
    // Se abbiamo raggiunto il limite, esci dal loop principale
    if (limit && processedCount >= limit) {
      break;
    }
  }

  // Salva image-map
  fs.writeFileSync(IMAGE_MAP_FILE, JSON.stringify(imageMap, null, 2));
  console.log(`\n✓ Image map salvato in ${IMAGE_MAP_FILE}`);

  // Riepilogo
  console.log(`\n📊 Riepilogo:`);
  console.log(`   Immagini generate e processate: ${results.filter(r => !r.exists).length}`);
  console.log(`   Immagini già esistenti: ${results.filter(r => r.exists).length}`);
  console.log(`   Errori: ${errors.length}`);
  console.log(`   Directory raw: ${GENERATED_DIR}`);
  console.log(`   Directory processate: ${PROCESSED_DIR}`);

  if (errors.length > 0) {
    console.log(`\n❌ Errori:`);
    errors.forEach(e => {
      console.log(`   ${e.page} - ${e.position}: ${e.error}`);
    });
  }

  return { results, errors };
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const filterPage = args.find(arg => arg.startsWith('--page='))?.split('=')[1];
  const force = args.includes('--force');
  const limitArg = args.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;

  console.log('🎨 Generatore Immagini Qwen Text2Image\n');
  console.log(`   Directory immagini raw: ${GENERATED_DIR}`);
  console.log(`   Directory immagini processate: ${PROCESSED_DIR}`);
  console.log(`   Dimensioni generazione: ${IMAGE_WIDTH}x${IMAGE_HEIGHT}px`);
  console.log(`   Dimensioni finali: ${FINAL_WIDTH}x${FINAL_HEIGHT}px`);
  console.log(`   Formato finale: ${IMAGE_FORMAT}`);
  if (filterPage) {
    console.log(`   Filtro pagina: ${filterPage}`);
  }
  if (limit) {
    console.log(`   Limite: ${limit} immagini`);
  }
  if (force) {
    console.log(`   Modalità: FORCE (rigenera tutto)`);
  }
  console.log('');

  try {
    await processAllImages(filterPage, force, limit);
    console.log('\n✅ Completato!');
  } catch (error) {
    console.error('\n❌ Errore fatale:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { processImage, processAllImages };
