// html-validator.js
// Valida tutti i file HTML nel progetto
// Nota: Esegue validazione base senza richiedere connessione internet

const { readFileSync, readdirSync, statSync } = require('fs');
const { join, resolve, extname } = require('path');

const PUBLIC_DIR = resolve(process.cwd(), 'public');

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
 * Valida base sintassi HTML (controlli limitati senza validator esterno)
 */
function validateFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const relativePath = filePath.replace(PUBLIC_DIR + '/', '');
    const errors = [];
    const warnings = [];

    // Controlli base
    // Verifica DOCTYPE
    if (!content.includes('<!DOCTYPE')) {
      warnings.push('Missing DOCTYPE declaration');
    }

    // Verifica tag HTML chiusi (base check)
    const openHtml = (content.match(/<html/gi) || []).length;
    const closeHtml = (content.match(/<\/html>/gi) || []).length;
    if (openHtml !== closeHtml) {
      errors.push(`Unbalanced <html> tags: ${openHtml} open, ${closeHtml} close`);
    }

    // Verifica tag head e body
    if (!content.includes('<head') || !content.includes('</head>')) {
      warnings.push('Missing or incomplete <head> tag');
    }
    if (!content.includes('<body') || !content.includes('</body>')) {
      warnings.push('Missing or incomplete <body> tag');
    }

    // Verifica charset meta tag
    if (!content.includes('charset') && !content.includes('charset')) {
      warnings.push('Missing charset meta tag');
    }

    // Verifica viewport meta tag (importante per mobile)
    if (!content.includes('viewport')) {
      warnings.push('Missing viewport meta tag');
    }

    return {
      file: relativePath,
      valid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      file: filePath.replace(PUBLIC_DIR + '/', ''),
      valid: false,
      errors: [{ message: error.message }],
      warnings: [],
    };
  }
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Validating HTML files...\n');
  console.log('Note: This performs basic validation. For full W3C validation, use an online validator.\n');
  
  const htmlFiles = getAllHTMLFiles(PUBLIC_DIR);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  const results = [];
  
  for (const file of htmlFiles) {
    const result = validateFile(file);
    results.push(result);
  }

  // Report
  const validFiles = results.filter(r => r.valid);
  const invalidFiles = results.filter(r => !r.valid);

  console.log(`✅ Valid: ${validFiles.length}`);
  console.log(`❌ Invalid: ${invalidFiles.length}\n`);

  if (invalidFiles.length > 0) {
    console.log('❌ Files with errors:\n');
    invalidFiles.forEach(({ file, errors, warnings }) => {
      console.log(`  ${file}:`);
      errors.forEach(err => {
        console.log(`    ❌ ${err.message || err}`);
      });
      warnings.forEach(warn => {
        console.log(`    ⚠️  ${warn}`);
      });
      console.log('');
    });
    process.exit(1);
  } else {
    console.log('✅ All HTML files passed basic validation!\n');
    
    // Mostra warnings se presenti
    const filesWithWarnings = results.filter(r => r.warnings && r.warnings.length > 0);
    if (filesWithWarnings.length > 0) {
      console.log('⚠️  Files with warnings:\n');
      filesWithWarnings.forEach(({ file, warnings }) => {
        console.log(`  ${file}:`);
        warnings.forEach(warn => {
          console.log(`    ⚠️  ${warn}`);
        });
        console.log('');
      });
    }
    
    process.exit(0);
  }
}

main();

