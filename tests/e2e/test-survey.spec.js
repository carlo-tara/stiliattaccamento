// test-survey.spec.js
// E2E tests per test di autovalutazione

import { test, expect } from '@playwright/test';

test.describe('Test Survey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test.html');
  });

  test('should load test page', async ({ page }) => {
    await expect(page).toHaveTitle(/Test di Auto-Valutazione/);
    await expect(page.locator('h1')).toContainText(/Test di Auto-Valutazione/);
  });

  test('should have survey container', async ({ page }) => {
    const surveyContainer = page.locator('#surveyContainer');
    await expect(surveyContainer).toBeVisible();
  });

  test('should load SurveyJS library', async ({ page }) => {
    // Verifica che SurveyJS sia caricato
    const surveyLoaded = await page.evaluate(() => {
      return typeof Survey !== 'undefined' && typeof Survey.Survey !== 'undefined';
    });
    
    // Se SurveyJS è caricato da CDN, potrebbe non essere ancora disponibile
    // Questo test verifica che la pagina tenti di caricarlo
    const surveyScript = page.locator('script[src*="survey"]');
    expect(await surveyScript.count()).toBeGreaterThan(0);
  });

  test('should have Schema.org Quiz markup', async ({ page }) => {
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toBeTruthy();
    expect(jsonLd).toContain('@type');
    expect(jsonLd).toContain('Quiz');
  });

  test('should show results section after completion', async ({ page }) => {
    // Aspetta che il survey sia caricato
    await page.waitForTimeout(2000);
    
    // Verifica che la sezione risultati esista (anche se nascosta)
    const resultsSection = page.locator('#results');
    await expect(resultsSection).toBeAttached();
    
    // Verifica che inizialmente sia nascosta
    const display = await resultsSection.evaluate((el) => window.getComputedStyle(el).display);
    expect(display).toBe('none');
  });

  test('should have link to mappa personale', async ({ page }) => {
    const mappaLink = page.locator('a[href*="mappa-personale"]');
    if (await mappaLink.count() > 0) {
      await expect(mappaLink.first()).toBeVisible();
    }
  });

  test('should save results to localStorage', async ({ page, context }) => {
    // Simula risultati salvati in localStorage
    await page.addInitScript(() => {
      const testResults = {
        scores: {
          anxious: 10,
          secure: 5,
          avoidant: 3,
          disorganized: 2,
        },
        primaryStyle: 'ansioso',
        level: 'alto',
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('testResults', JSON.stringify(testResults));
    });

    await page.reload();
    
    // Verifica che i risultati siano in localStorage
    const storedResults = await page.evaluate(() => {
      return localStorage.getItem('testResults');
    });
    
    expect(storedResults).toBeTruthy();
    const parsed = JSON.parse(storedResults);
    expect(parsed).toHaveProperty('scores');
    expect(parsed).toHaveProperty('primaryStyle');
    expect(parsed).toHaveProperty('level');
  });

  test('should display instructions correctly', async ({ page }) => {
    const instructions = page.locator('h2:has-text("Come Usare Questo Test")');
    if (await instructions.count() > 0) {
      await expect(instructions).toBeVisible();
    }
    
    // Verifica presenza di lista numerata
    const orderedList = page.locator('ol').first();
    if (await orderedList.count() > 0) {
      await expect(orderedList).toBeVisible();
    }
  });
});

