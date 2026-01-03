// css-validator.js
// Valida sintassi CSS (base, controlli limitati senza CSS validator esterno)

const { readFileSync, readdirSync, statSync } = require('fs');
const { join, resolve, extname } = require('path');

const PUBLIC_DIR = resolve(process.cwd(), 'public');
const CSS_DIR = resolve(PUBLIC_DIR, 'css');

/**
 * Recupera tutti i file CSS
 */
function getAllCSSFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      getAllCSSFiles(filePath, fileList);
    } else if (extname(file) === '.css') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Valida base sintassi CSS (controlli limitati)
 */
function validateCSS(filePath, content) {
  const relativePath = filePath.replace(PUBLIC_DIR + '/', '');
  const errors = [];
  const warnings = [];

  // Controlla parentesi bilanciate
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
  }

  // Controlla parentesi tonde bilanciate (in calc(), var(), etc.)
  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    warnings.push(`Unbalanced parentheses: ${openParens} open, ${closeParens} close`);
  }

  // Controlla che non ci siano caratteri strani (non-ASCII in selettori/proprietà)
  // (questo è un controllo molto base)

  return {
    file: relativePath,
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Validating CSS files...\n');
  
  const cssFiles = getAllCSSFiles(CSS_DIR);
  console.log(`Found ${cssFiles.length} CSS files\n`);

  const results = [];

  cssFiles.forEach((file) => {
    const content = readFileSync(file, 'utf-8');
    const result = validateCSS(file, content);
    results.push(result);
  });

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
        console.log(`    ❌ ${err}`);
      });
      warnings.forEach(warn => {
        console.log(`    ⚠️  ${warn}`);
      });
      console.log('');
    });
    process.exit(1);
  } else {
    console.log('✅ All CSS files passed basic validation!\n');
    
    // Mostra warnings se presenti
    const filesWithWarnings = results.filter(r => r.warnings.length > 0);
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

