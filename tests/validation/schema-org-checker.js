// schema-org-checker.js
// Verifica che le pagine abbiano Schema.org markup valido

const { readFileSync, readdirSync, statSync } = require('fs');
const { join, resolve, extname } = require('path');
const { JSDOM } = require('jsdom');

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
 * Estrae e valida Schema.org markup da un file HTML
 */
function checkSchemaMarkup(filePath, htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  const relativePath = filePath.replace(PUBLIC_DIR + '/', '');

  const schemas = [];

  scripts.forEach((script, index) => {
    try {
      const jsonContent = script.textContent;
      if (!jsonContent || jsonContent.trim() === '') {
        schemas.push({
          valid: false,
          error: 'Empty JSON-LD script',
          index,
        });
        return;
      }

      const schema = JSON.parse(jsonContent);

      // Validazioni base
      if (!schema['@context']) {
        schemas.push({
          valid: false,
          error: 'Missing @context',
          index,
          schema,
        });
        return;
      }

      if (!schema['@type']) {
        schemas.push({
          valid: false,
          error: 'Missing @type',
          index,
          schema,
        });
        return;
      }

      if (schema['@context'] !== 'https://schema.org') {
        schemas.push({
          valid: false,
          error: `Invalid @context: ${schema['@context']}`,
          index,
          schema,
        });
        return;
      }

      schemas.push({
        valid: true,
        schema,
        index,
      });
    } catch (error) {
      schemas.push({
        valid: false,
        error: `JSON parse error: ${error.message}`,
        index,
      });
    }
  });

  return {
    file: relativePath,
    schemas,
    hasSchema: schemas.length > 0,
    allValid: schemas.length > 0 && schemas.every(s => s.valid),
  };
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Checking Schema.org markup...\n');
  
  const htmlFiles = getAllHTMLFiles(PUBLIC_DIR);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  const results = [];

  htmlFiles.forEach((file) => {
    const content = readFileSync(file, 'utf-8');
    const result = checkSchemaMarkup(file, content);
    results.push(result);
  });

  // Report
  const filesWithSchema = results.filter(r => r.hasSchema);
  const filesWithValidSchema = results.filter(r => r.allValid);
  const filesWithoutSchema = results.filter(r => !r.hasSchema);
  const filesWithInvalidSchema = results.filter(r => r.hasSchema && !r.allValid);

  console.log(`✅ Files with valid Schema.org: ${filesWithValidSchema.length}`);
  console.log(`⚠️  Files without Schema.org: ${filesWithoutSchema.length}`);
  console.log(`❌ Files with invalid Schema.org: ${filesWithInvalidSchema.length}\n`);

  if (filesWithInvalidSchema.length > 0) {
    console.log('❌ Files with invalid Schema.org markup:\n');
    filesWithInvalidSchema.forEach(({ file, schemas }) => {
      console.log(`  ${file}:`);
      schemas.forEach(schema => {
        if (!schema.valid) {
          console.log(`    - ${schema.error}`);
        }
      });
      console.log('');
    });
  }

  if (filesWithoutSchema.length > 0 && filesWithoutSchema.length < 20) {
    console.log('⚠️  Files without Schema.org markup:\n');
    filesWithoutSchema.forEach(({ file }) => {
      console.log(`  ${file}`);
    });
    console.log('');
  }

  // Exit con errore solo se ci sono markup invalidi
  if (filesWithInvalidSchema.length > 0) {
    process.exit(1);
  } else {
    console.log('✅ All Schema.org markup is valid!\n');
    process.exit(0);
  }
}

main();

