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

test.describe.configure({ mode: 'serial' });

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('cookie_consent', 'accepted');
    });
  });

  for (const pagePath of PAGES_TO_TEST) {
    test(`should have no accessibility violations on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector('#navLinks', { state: 'attached', timeout: 10000 });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
        .analyze();

      const violations = accessibilityScanResults.violations;

      if (violations.length > 0) {
        console.log(`\n❌ Accessibility violations on ${pagePath}:`);
        violations.forEach((violation) => {
          console.log(`  - ${violation.id}: ${violation.description}`);
          console.log(`    Impact: ${violation.impact}`);
          violation.nodes.forEach((node) => {
            console.log(`    HTML: ${node.html}`);
          });
        });
      }

      expect(violations).toEqual([]);
    });
  }
});
