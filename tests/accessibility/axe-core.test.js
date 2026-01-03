// axe-core.test.js
// Accessibility tests usando axe-core con Playwright

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES_TO_TEST = [
  '/',
  '/test.html',
  '/mappa-personale.html',
  '/fondamenti.html',
  '/stili-base.html',
];

test.describe('Accessibility', () => {
  for (const pagePath of PAGES_TO_TEST) {
    test(`should have no accessibility violations on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath);
      
      // Aspetta che la pagina sia completamente caricata
      await page.waitForLoadState('networkidle');
      
      // Esegui test accessibility con axe-core
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
        .analyze();

      // Filtra solo errori (non warnings)
      const violations = accessibilityScanResults.violations;

      if (violations.length > 0) {
        console.log(`\n❌ Accessibility violations on ${pagePath}:`);
        violations.forEach((violation) => {
          console.log(`  - ${violation.id}: ${violation.description}`);
          console.log(`    Impact: ${violation.impact}`);
          console.log(`    Nodes affected: ${violation.nodes.length}`);
        });
      }

      expect(violations).toEqual([]);
    });
  }
});

