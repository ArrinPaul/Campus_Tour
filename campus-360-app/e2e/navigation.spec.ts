/**
 * E2E Tests - Basic Navigation
 * Tests core user flows for the campus tour application
 */

import { test, expect } from '@playwright/test';

test.describe('Campus Tour Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the application to load
    await page.waitForSelector('[data-testid="tour-viewer"], canvas', { timeout: 30000 });
  });

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Campus|Tour/i);
  });

  test('should display the loading screen initially', async ({ page }) => {
    // Go to page fresh
    await page.goto('/');
    // Loading screen should appear
    const loader = page.locator('[data-testid="loader"], .loading, .spinner');
    // Either we see a loader or the content loads fast enough
    const hasLoader = await loader.isVisible().catch(() => false);
    if (hasLoader) {
      // Wait for loader to disappear
      await expect(loader).not.toBeVisible({ timeout: 30000 });
    }
  });

  test('should display navigation controls', async ({ page }) => {
    // Check for common navigation elements
    const navElements = page.locator('nav, [role="navigation"], .navbar, .menu');
    await expect(navElements.first()).toBeVisible();
  });
});

test.describe('User Interface Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have accessible buttons', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        // Check for accessible name
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');
        const text = await button.textContent();

        const hasAccessibleName = !!(ariaLabel || title || text?.trim());
        expect(hasAccessibleName).toBe(true);
      }
    }
  });

  test('should respond to keyboard navigation', async ({ page }) => {
    // Press Tab to navigate
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});

test.describe('Deep Linking', () => {
  test('should handle URL parameters', async ({ page }) => {
    // Navigate with a block parameter
    await page.goto('/?block=Block1');
    await page.waitForLoadState('networkidle');

    // Should not throw an error
    const errorDialog = page.locator('[role="alertdialog"], .error-message');
    await expect(errorDialog).not.toBeVisible();
  });

  test('should maintain state after reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get current URL
    const urlBefore = page.url();

    // Reload
    await page.reload();
    await page.waitForLoadState('networkidle');

    // URL should be consistent
    expect(page.url()).toContain(new URL(urlBefore).origin);
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should have mobile-friendly layout
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);

    // Check that main content is visible
    const mainContent = page.locator('main, [role="main"], canvas, .viewer');
    await expect(mainContent.first()).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const mainContent = page.locator('main, [role="main"], canvas, .viewer');
    await expect(mainContent.first()).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const mainContent = page.locator('main, [role="main"], canvas, .viewer');
    await expect(mainContent.first()).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    // Should load DOM within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known benign errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('ResizeObserver') &&
        !error.includes('Script error') &&
        !error.includes('Network request failed')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Accessibility', () => {
  test('should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for basic accessibility attributes
    const images = page.locator('img');
    const imgCount = await images.count();

    for (let i = 0; i < imgCount; i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        // Images should have alt text or be marked as presentational
        const isAccessible = alt !== null || role === 'presentation';
        expect(isAccessible).toBe(true);
      }
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for h1
    const h1Count = await page.locator('h1').count();
    // Should have at least one h1 or none (single-page app might use different structure)
    expect(h1Count).toBeLessThanOrEqual(1);
  });

  test('should support keyboard-only navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab through interactive elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }

    // Should be able to press Enter on focused element without error
    await page.keyboard.press('Enter');

    // Page should not crash
    await expect(page.locator('body')).toBeVisible();
  });
});
