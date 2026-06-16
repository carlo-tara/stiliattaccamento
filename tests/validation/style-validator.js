// style-validator.js
// Verifica che i contenuti HTML rispettino le linee guida di stile linguistico
// - Linguaggio inclusivo
// - Nessun pattern riconoscibile da IA
// - Terminologia corretta (oscillante invece di disorganizzato)
// - Maiuscole naturali negli header
// - Testi umani e naturali

const { readFileSync, readdirSync, statSync } = require('fs');
const { join, resolve, extname } = require('path');
const { JSDOM } = require('jsdom');

const PUBLIC_DIR = resolve(process.cwd(), 'public');

/**
 * Pattern da evitare (riconoscibili da IA)
 */
const AI_PATTERNS = [
  {
    pattern: /\bÈ importante notare che\b/gi,
    message: "Pattern da IA: 'È importante notare che' - usa linguaggio più diretto",
  },
  {
    pattern: /\bVale la pena ricordare che\b/gi,
    message: "Pattern da IA: 'Vale la pena ricordare che' - usa linguaggio più diretto",
  },
  {
    pattern: /\bRicorda che\b(?!.*(?:è normale|capita|succede))/gi,
    message: "Pattern da IA: 'Ricorda che' usato come conclusione sistematica - varia il linguaggio",
    exclude: /(?:è normale|capita|succede)/, // Permetti "Ricorda che è normale"
  },
  {
    pattern: /\bPrima di tutto, ricorda\b/gi,
    message: "Pattern da IA: 'Prima di tutto, ricorda' - usa variazioni più naturali",
  },
  {
    pattern: /\bSi suggerisce di\b/gi,
    message: "Pattern troppo formale: 'Si suggerisce di' - usa 'Puoi provare' o linguaggio più diretto",
  },
  {
    pattern: /\bSi consiglia di\b/gi,
    message: "Pattern troppo formale: 'Si consiglia di' - usa linguaggio più diretto",
  },
  {
    pattern: /\bAttraverso il linguaggio universale\b/gi,
    message: "Pattern da IA/manuale: 'Attraverso il linguaggio universale' - usa un tono più diretto",
  },
  {
    pattern: /\bStrumenti concreti per\b/gi,
    message: "Ripetizione tipica da template: 'Strumenti concreti per' - varia il linguaggio",
  },
  {
    pattern: /\bpermettono una comprensione più profonda\b/gi,
    message: "Pattern da IA: 'permettono una comprensione più profonda' - sii più specifico e diretto",
  },
  {
    pattern: /\bDurante la prima sessione, è importante\b/gi,
    message: "Pattern formale: 'è importante' come apertura - usa 'conviene', 'puoi chiedere', ecc.",
  },
  {
    pattern: /\bOgni stile ha\b/gi,
    message: "Ripetizione strutturale: 'Ogni stile ha' - varia l'inizio dei paragrafi",
    exclude: /FAQPage|application\/ld\+json/, // Permetti in JSON-LD se necessario
  },
];

/**
 * Pattern di linguaggio non inclusivo
 */
const NON_INCLUSIVE_PATTERNS = [
  {
    pattern: /\b(?:lui|lei)\/(?:lui|lei)\b/gi,
    message: "Linguaggio non inclusivo: 'lui/lei' - usa 'chi', 'la persona', o riformula",
  },
  {
    pattern: /\b(?:insoddisfatto|frustrato|soddisfatto)\/(?:a)\b/gi,
    message: "Linguaggio non inclusivo: 'insoddisfatto/a' - usa forma neutra 'insoddisfatto'",
  },
  {
    pattern: /\bper lui\b(?!.*partner)/gi,
    message: "Linguaggio non inclusivo: 'per lui' - usa 'per chi' o riformula",
    exclude: /partner/, // Permetti "per il partner" se necessario
  },
  {
    pattern: /\bper lei\b(?!.*partner)/gi,
    message: "Linguaggio non inclusivo: 'per lei' - usa 'per chi' o riformula",
    exclude: /partner/,
  },
  {
    pattern: /\b(?:il marito|la moglie|il ragazzo|la ragazza|il fidanzato|la fidanzata)\b/gi,
    message: "Linguaggio non inclusivo: usa 'partner' invece di riferimenti di genere",
  },
];

/**
 * Terminologia corretta (oscillante invece di disorganizzato)
 */
const TERMINOLOGY_PATTERNS = [
  {
    pattern: /\b(?:disorganizzato|Disorganizzato|DISORGANIZZATO|disorganizzati|disorganizzate|disorganizzata)\b/gi,
    message: "Terminologia: usa 'oscillante' invece di 'disorganizzato' nel testo visibile",
  },
];

/**
 * Pattern di title case eccessivo negli header
 */
const EXCESSIVE_TITLE_CASE = [
  {
    pattern: /<h[1-6][^>]*>.*[A-Z][a-z]+ [A-Z][a-z]+(?: [A-Z][a-z]+)*.*<\/h[1-6]>/g,
    message: "Title case eccessivo: usa maiuscole naturali (prima lettera + minuscole, tranne nomi propri)",
    // Questo è più complesso, lo gestiamo separatamente
  },
];

/**
 * Pattern specifici di title case eccessivo da verificare
 * Nota: Questi pattern verificano solo casi molto specifici e comuni di title case eccessivo
 * I pattern devono matchare SOLO versioni ERRATE (con maiuscole eccessive), non quelle corrette
 * 
 * ATTENZIONE: I pattern per title case sono difficili da gestire con regex perché
 * devono distinguere tra versioni corrette e errate. Per ora manteniamo solo pattern
 * da IA, linguaggio inclusivo e terminologia che sono più critici.
 */
const EXCESSIVE_CAPITALIZATION_EXAMPLES = [
  // Rimuoviamo i pattern specifici perché troppo difficili da gestire correttamente
  // I controlli per pattern da IA, linguaggio inclusivo e terminologia sono più importanti
];

/**
 * Recupera ricorsivamente tutti i file HTML
 */
function getAllHTMLFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      getAllHTMLFiles(filePath, fileList);
    } else if (extname(file) === '.html') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Estrae il testo da un elemento HTML (escludendo script, style, etc.)
 */
function extractTextContent(htmlContent, bodyOnly = false) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const scripts = document.querySelectorAll('script, style, noscript');
  scripts.forEach(el => el.remove());

  const bodyText = document.body ? document.body.textContent || '' : '';
  if (bodyOnly) {
    return bodyText;
  }

  const headText = document.head ? document.head.textContent || '' : '';
  return bodyText + ' ' + headText;
}

/**
 * Estrae tutti gli header (h1-h6) dal contenuto HTML
 */
function extractHeaders(htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const headers = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));

  return headers.map(h => ({
    tag: h.tagName.toLowerCase(),
    text: h.textContent.trim(),
    html: h.outerHTML,
  }));
}

/**
 * Verifica pattern in un testo
 */
function checkPatterns(text, patterns, context = '') {
  const issues = [];

  patterns.forEach(({ pattern, message, exclude }) => {
    const matches = text.match(pattern);
    if (matches) {
      // Se c'è un exclude pattern, verifica che non matchi
      if (exclude && exclude.test(context || text)) {
        return; // Salta questo match perché ha un exclude
      }

      matches.forEach(match => {
        issues.push({
          pattern: pattern.toString(),
          match: match.substring(0, 100), // Limita lunghezza per output
          message,
        });
      });
    }
  });

  return issues;
}

/**
 * Verifica un singolo file HTML
 */
function validateFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const relativePath = filePath.replace(PUBLIC_DIR + '/', '');
    const textContent = extractTextContent(content);
    const bodyText = extractTextContent(content, true);
    const headers = extractHeaders(content);
    const issues = [];

    // Verifica pattern da IA nel testo
    const aiIssues = checkPatterns(textContent, AI_PATTERNS, content);
    aiIssues.forEach(issue => {
      issues.push({
        type: 'ai-pattern',
        ...issue,
      });
    });

    // Verifica linguaggio inclusivo
    const inclusiveIssues = checkPatterns(textContent, NON_INCLUSIVE_PATTERNS, content);
    inclusiveIssues.forEach(issue => {
      issues.push({
        type: 'non-inclusive',
        ...issue,
      });
    });

    // Verifica terminologia (oscillante vs disorganizzato)
    // Controlla solo il testo visibile, non href/url/nomi file
    const terminologyIssues = checkPatterns(bodyText, TERMINOLOGY_PATTERNS, content);
    terminologyIssues.forEach(issue => {
      const idx = bodyText.toLowerCase().indexOf((issue.match || '').toLowerCase());
      const snippet = idx >= 0
        ? bodyText.slice(Math.max(0, idx - 100), idx + (issue.match || '').length + 100)
        : '';
      // Consente "disorganizzato" solo in spiegazioni esplicite del termine (FAQ)
      if (/letteratura|perché.*oscillante|non.*disorganizzato/i.test(snippet)) {
        return;
      }
      issues.push({
        type: 'terminology',
        ...issue,
      });
    });

    // Verifica title case eccessivo negli header
    // Nota: I pattern per title case sono disabilitati perché troppo difficili da gestire
    // correttamente con regex. I controlli per pattern da IA, linguaggio inclusivo e
    // terminologia sono più critici e affidabili.
    // TODO: Implementare controllo title case più sofisticato se necessario

    return {
      file: relativePath,
      valid: issues.length === 0,
      issues,
    };
  } catch (error) {
    return {
      file: filePath.replace(PUBLIC_DIR + '/', ''),
      valid: false,
      issues: [{ type: 'error', message: `Error reading file: ${error.message}` }],
    };
  }
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Validating style and linguistic guidelines...\n');
  console.log('Checking for:');
  console.log('  - AI-recognizable patterns');
  console.log('  - Non-inclusive language');
  console.log('  - Terminology consistency (oscillante vs disorganizzato)\n');

  const htmlFiles = getAllHTMLFiles(PUBLIC_DIR);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  const results = [];

  htmlFiles.forEach((file) => {
    const result = validateFile(file);
    results.push(result);
  });

  // Report
  const validFiles = results.filter(r => r.valid);
  const invalidFiles = results.filter(r => !r.valid);

  console.log(`✅ Valid: ${validFiles.length}`);
  console.log(`❌ Invalid: ${invalidFiles.length}\n`);

  if (invalidFiles.length > 0) {
    console.log('❌ Files with style issues:\n');

    invalidFiles.forEach(({ file, issues }) => {
      console.log(`  ${file}:`);

      // Raggruppa per tipo
      const byType = {};
      issues.forEach(issue => {
        const type = issue.type || 'other';
        if (!byType[type]) {
          byType[type] = [];
        }
        byType[type].push(issue);
      });

      Object.keys(byType).forEach(type => {
        const typeIssues = byType[type];
        console.log(`    ${type.toUpperCase()}:`);
        typeIssues.forEach(issue => {
          console.log(`      - ${issue.message}`);
          if (issue.match) {
            console.log(`        Found: "${issue.match}"`);
          }
          if (issue.header) {
            console.log(`        Header: <${issue.header}>`);
          }
        });
      });

      console.log('');
    });

    process.exit(1);
  } else {
    console.log('✅ All files passed style validation!\n');
    process.exit(0);
  }
}

main();

