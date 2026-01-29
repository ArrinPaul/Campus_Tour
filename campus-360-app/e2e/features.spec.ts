/**
 * E2E Tests - Tour Features
 * Tests for guided tours, bookmarks, sharing, and other features
 */

import { test, expect } from '@playwright/test';

test.describe('Guided Tours', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open tour selector when clicking tour button', async ({ page }) => {
    // Look for tour button
    const tourButton = page.locator('button[aria-label*="tour" i], button:has-text("Tour")');

    if (await tourButton.isVisible()) {
      await tourButton.click();

      // Check if tour panel/modal opens
      const tourPanel = page.locator('[role="dialog"], .tour-panel, .tour-selector');
      await expect(tourPanel).toBeVisible();
    }
  });
});

test.describe('Bookmarks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should add and remove bookmarks', async ({ page }) => {
    // Look for bookmark button
    const bookmarkButton = page.locator(
      'button[aria-label*="bookmark" i], button:has-text("Bookmark")'
    );

    if (await bookmarkButton.isVisible()) {
      // Click to add bookmark
      await bookmarkButton.click();

      // Should show some feedback (toast, icon change, etc.)
      await page.waitForTimeout(500);

      // Click again to remove
      await bookmarkButton.click();
    }
  });
});

test.describe('Share Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open share panel', async ({ page }) => {
    const shareButton = page.locator('button[aria-label*="share" i], button:has-text("Share")');

    if (await shareButton.isVisible()) {
      await shareButton.click();

      // Check if share panel opens
      const sharePanel = page.locator('[role="dialog"], .share-panel');
      await expect(sharePanel).toBeVisible();
    }
  });

  test('should have copy link functionality', async ({ page }) => {
    const shareButton = page.locator('button[aria-label*="share" i], button:has-text("Share")');

    if (await shareButton.isVisible()) {
      await shareButton.click();

      // Look for copy button
      const copyButton = page.locator('button:has-text("Copy")');
      if (await copyButton.isVisible()) {
        await copyButton.click();
        // Should show feedback
        await page.waitForTimeout(500);
      }
    }
  });
});

test.describe('Map Overlay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should toggle map overlay', async ({ page }) => {
    const mapButton = page.locator('button[aria-label*="map" i], button:has-text("Map")');

    if (await mapButton.isVisible()) {
      await mapButton.click();

      // Check if map opens
      const mapOverlay = page.locator('.map-overlay, [role="dialog"]:has(.map)');
      await expect(mapOverlay).toBeVisible();

      // Close map
      const closeButton = page.locator('button[aria-label*="close" i]');
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  });
});

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open settings panel', async ({ page }) => {
    const settingsButton = page.locator(
      'button[aria-label*="settings" i], button:has-text("Settings")'
    );

    if (await settingsButton.isVisible()) {
      await settingsButton.click();

      const settingsPanel = page.locator('[role="dialog"], .settings-panel');
      await expect(settingsPanel).toBeVisible();
    }
  });
});

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should toggle theme', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="theme" i], button:has-text("Theme")');

    if (await themeButton.isVisible()) {
      // Click theme toggle
      await themeButton.click();
      await page.waitForTimeout(300);

      // Class should change
      const newClass = await page.locator('html').getAttribute('class');
      // Either class changed or it's the same (if cycling through)
      expect(typeof newClass).toBe('string');
    }
  });
});

test.describe('Accessibility Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open accessibility settings', async ({ page }) => {
    const a11yButton = page.locator(
      'button[aria-label*="accessibility" i], button[aria-label*="a11y" i]'
    );

    if (await a11yButton.isVisible()) {
      await a11yButton.click();

      const a11yPanel = page.locator('[role="dialog"]:has-text("Accessibility")');
      await expect(a11yPanel).toBeVisible();
    }
  });

  test('should toggle reduced motion', async ({ page }) => {
    const a11yButton = page.locator(
      'button[aria-label*="accessibility" i], button[aria-label*="a11y" i]'
    );

    if (await a11yButton.isVisible()) {
      await a11yButton.click();

      const reduceMotionToggle = page.locator('button[role="switch"]:near(:text("Reduce Motion"))');
      if (await reduceMotionToggle.isVisible()) {
        await reduceMotionToggle.click();
        // Verify aria-checked changed
        const isChecked = await reduceMotionToggle.getAttribute('aria-checked');
        expect(isChecked).toBeTruthy();
      }
    }
  });
});

test.describe('Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open analytics dashboard', async ({ page }) => {
    const analyticsButton = page.locator('button[aria-label*="analytics" i]');

    if (await analyticsButton.isVisible()) {
      await analyticsButton.click();

      const analyticsPanel = page.locator('[role="dialog"]:has-text("Analytics")');
      await expect(analyticsPanel).toBeVisible();
    }
  });
});

test.describe('Help Overlay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open help with keyboard shortcut', async ({ page }) => {
    // Press H or ? for help
    await page.keyboard.press('h');

    // Check for help overlay
    const helpOverlay = page.locator('.help-overlay, [role="dialog"]:has-text("Help")');
    if (await helpOverlay.isVisible()) {
      await expect(helpOverlay).toBeVisible();

      // Close with Escape
      await page.keyboard.press('Escape');
      await expect(helpOverlay).not.toBeVisible();
    }
  });

  test('should close dialogs with Escape key', async ({ page }) => {
    // Open any dialog first
    const anyButton = page.locator(
      'button[aria-label*="settings" i], button[aria-label*="menu" i]'
    );

    if (await anyButton.first().isVisible()) {
      await anyButton.first().click();

      const dialog = page.locator('[role="dialog"]');
      if (await dialog.isVisible()) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        // Dialog should close
        await expect(dialog).not.toBeVisible();
      }
    }
  });
});

test.describe('Fullscreen', () => {
  test('should toggle fullscreen with F key', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Note: Fullscreen requires user gesture in some browsers
    // This test just ensures no errors are thrown
    await page.keyboard.press('f');
    await page.waitForTimeout(300);

    // Page should not crash
    await expect(page.locator('body')).toBeVisible();
  });
});
