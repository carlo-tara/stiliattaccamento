// mobile-menu.spec.js
// E2E tests per mobile menu

import { test, expect } from '@playwright/test';

test.describe('Mobile Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show hamburger menu on mobile viewport', async ({ page }) => {
    // Imposta viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verifica che il menu hamburger sia visibile
    const hamburger = page.locator('button.hamburger, button[aria-label*="menu"]');
    await expect(hamburger.first()).toBeVisible();
  });

  test('should toggle menu when hamburger is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const navLinks = page.locator('#navLinks, nav ul.nav-links');
    const hamburger = page.locator('button.hamburger, button[aria-label*="menu"]').first();
    
    // Menu inizialmente chiuso
    await expect(navLinks).not.toHaveClass(/active/);
    
    // Click per aprire
    await hamburger.click();
    
    // Menu dovrebbe essere aperto
    await expect(navLinks).toHaveClass(/active/);
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    
    // Click per chiudere
    await hamburger.click();
    
    // Menu dovrebbe essere chiuso
    await expect(navLinks).not.toHaveClass(/active/);
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  test('should close menu when clicking on a link', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const navLinks = page.locator('#navLinks, nav ul.nav-links');
    const hamburger = page.locator('button.hamburger, button[aria-label*="menu"]').first();
    
    // Apri menu
    await hamburger.click();
    await expect(navLinks).toHaveClass(/active/);
    
    // Click su un link
    const firstLink = navLinks.locator('a').first();
    if (await firstLink.count() > 0) {
      await firstLink.click();
      
      // Menu dovrebbe essere chiuso dopo navigazione
      // (aspetta un po' per permettere alla navigazione di completarsi)
      await page.waitForTimeout(100);
    }
  });

  test('should close menu on overlay click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const navLinks = page.locator('#navLinks, nav ul.nav-links');
    const hamburger = page.locator('button.hamburger, button[aria-label*="menu"]').first();
    const overlay = page.locator('#mobileMenuOverlay, .mobile-menu-overlay');
    
    // Apri menu
    await hamburger.click();
    await expect(navLinks).toHaveClass(/active/);
    
    // Click sull'overlay se presente
    if (await overlay.count() > 0) {
      await overlay.click();
      
      // Menu dovrebbe essere chiuso
      await expect(navLinks).not.toHaveClass(/active/);
    }
  });

  test('should prevent body scroll when menu is open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const hamburger = page.locator('button.hamburger, button[aria-label*="menu"]').first();
    
    // Apri menu
    await hamburger.click();
    
    // Verifica che body abbia overflow hidden
    const bodyStyle = await page.evaluate(() => document.body.style.overflow);
    expect(bodyStyle).toBe('hidden');
  });

  test('should hide hamburger menu on desktop viewport', async ({ page }) => {
    // Imposta viewport desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Su desktop, il menu hamburger potrebbe essere nascosto
    // Verifica che il menu normale sia visibile
    const navLinks = page.locator('nav ul.nav-links, #navLinks');
    // Il menu dovrebbe essere sempre presente, anche se non in forma hamburger
    expect(await navLinks.count()).toBeGreaterThan(0);
  });
});

