// link-checker.js
// Verifica che tutti i link interni siano validi

const { readFileSync, readdirSync, statSync, existsSync } = require('fs');
const { join, resolve, extname, dirname } = require('path');
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
 * Estrae tutti i link da un file HTML
 */
function extractLinks(filePath, htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const links = Array.from(document.querySelectorAll('a[href]'));
  const baseDir = dirname(filePath);

  return links.map(link => {
    const href = link.getAttribute('href');
    return {
      href,
      text: link.textContent.trim(),
      file: filePath.replace(PUBLIC_DIR + '/', ''),
      resolvedPath: resolveInternalLink(href, baseDir),
    };
  });
}

/**
 * Risolve un link interno in un percorso assoluto
 */
function resolveInternalLink(href, baseDir) {
  if (!href) return null;
  
  // Ignora link esterni, mailto, tel, anchor solo
  if (href.startsWith('http://') || href.startsWith('https://') || 
      href.startsWith('mailto:') || href.startsWith('tel:') || 
      href.startsWith('#') || href === '') {
    return null;
  }

  // Rimuovi anchor
  const [path, anchor] = href.split('#');
  if (!path) return null;

  // Risolvi percorso relativo
  const absolutePath = resolve(PUBLIC_DIR, baseDir, path);
  
  // Se non ha estensione, prova .html
  if (!extname(absolutePath) && !existsSync(absolutePath)) {
    return absolutePath + '.html';
  }
  
  return absolutePath;
}

/**
 * Verifica se un file esiste
 */
function checkLink(linkInfo) {
  if (!linkInfo.resolvedPath) {
    return { valid: true, reason: 'external_or_anchor' };
  }

  if (existsSync(linkInfo.resolvedPath)) {
    return { valid: true, reason: 'exists' };
  }

  // Controlla se è una directory (potrebbe essere un link a directory/index.html)
  const dirPath = linkInfo.resolvedPath.replace(/\.html$/, '');
  if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
    const indexPath = join(dirPath, 'index.html');
    if (existsSync(indexPath)) {
      return { valid: true, reason: 'directory_index' };
    }
  }

  return { valid: false, reason: 'not_found' };
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Checking internal links...\n');
  
  const htmlFiles = getAllHTMLFiles(PUBLIC_DIR);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  const allLinks = [];
  const brokenLinks = [];

  htmlFiles.forEach((file) => {
    const content = readFileSync(file, 'utf-8');
    const links = extractLinks(file, content);
    allLinks.push(...links);
  });

  console.log(`Found ${allLinks.length} total links\n`);

  allLinks.forEach((link) => {
    const check = checkLink(link);
    if (!check.valid) {
      brokenLinks.push({ ...link, check });
    }
  });

  // Report
  console.log(`✅ Valid links: ${allLinks.length - brokenLinks.length}`);
  console.log(`❌ Broken links: ${brokenLinks.length}\n`);

  if (brokenLinks.length > 0) {
    console.log('❌ Broken links:\n');
    brokenLinks.forEach((link) => {
      console.log(`  File: ${link.file}`);
      console.log(`    Link: ${link.href}`);
      console.log(`    Text: ${link.text || '(empty)'}`);
      console.log(`    Expected: ${link.resolvedPath}`);
      console.log('');
    });
    process.exit(1);
  } else {
    console.log('✅ All internal links are valid!\n');
    process.exit(0);
  }
}

main();

