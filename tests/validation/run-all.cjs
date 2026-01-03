// run-all.cjs
// Esegue tutti gli script di validazione

const { spawn } = require('child_process');
const { resolve, dirname } = require('path');

const VALIDATION_SCRIPTS = [
  'html-validator.js',
  'css-validator.js',
  'link-checker.js',
  'schema-org-checker.js',
  'style-validator.js',
];

async function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: false,
      cwd: process.cwd(), // Use project root, not script directory
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptPath} exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  console.log('🚀 Running all validation scripts...\n');

  // __dirname is automatically available in CommonJS
  const scriptsDir = dirname(__filename);

  let hasErrors = false;

  for (const script of VALIDATION_SCRIPTS) {
    const scriptPath = resolve(scriptsDir, script);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Running: ${script}`);
    console.log('='.repeat(60) + '\n');

    try {
      await runScript(scriptPath);
    } catch (error) {
      console.error(`\n❌ Error running ${script}:`, error.message);
      hasErrors = true;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  if (hasErrors) {
    console.log('❌ Some validations failed');
    process.exit(1);
  } else {
    console.log('✅ All validations passed!');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
