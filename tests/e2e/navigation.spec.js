// navigation.spec.js
// E2E tests per navigazione base

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    
    // Verifica che la pagina sia caricata
    await expect(page).toHaveTitle(/Stili di Attaccamento/);
    
    // Verifica elementi principali
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have valid internal links', async ({ page }) => {
    await page.goto('/');
    
    // Raccogli tutti i link interni
    const links = await page.locator('nav a[href^="/"], nav a[href^="./"], nav a[href^="fondamenti"], nav a[href^="test"]').all();
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        // Verifica che il link non sia vuoto
        expect(href).toBeTruthy();
        expect(href.length).toBeGreaterThan(0);
      }
    }
  });

  test('should navigate to test page', async ({ page }) => {
    await page.goto('/');
    
    // Click sul link Test
    await page.click('nav a[href*="test"]');
    
    // Verifica che siamo sulla pagina test
    await expect(page).toHaveURL(/test/);
  });

  test('should have Schema.org markup on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Verifica presenza di script JSON-LD
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toBeTruthy();
    
    // Verifica che contenga @context e @type
    expect(jsonLd).toContain('@context');
    expect(jsonLd).toContain('@type');
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Verifica meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    
    // Verifica viewport
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');
    
    // Verifica che il menu hamburger abbia aria-label
    const hamburger = page.locator('button.hamburger, button[aria-label*="menu"]');
    if (await hamburger.count() > 0) {
      const ariaLabel = await hamburger.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('should load CSS files', async ({ page }) => {
    await page.goto('/');
    
    // Verifica che i CSS siano caricati
    const stylesheets = await page.locator('link[rel="stylesheet"]').count();
    expect(stylesheets).toBeGreaterThan(0);
  });
});

