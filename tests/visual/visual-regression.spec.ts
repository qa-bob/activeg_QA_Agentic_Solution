/**
 * tests/visual/visual-regression.spec.ts
 *
 * Visual regression tests — compare screenshots against stored baselines.
 * Run `npm run baseline` to capture new baselines after intentional design changes.
 *
 * Tag: @visual
 */

import { test, expect } from '@fixtures/site.fixture';
import { dismissCookieBanner } from '@utils/visual-helper';

const SCREENSHOT_OPTIONS = {
  maxDiffPixels: 500,
  animations: 'disabled',
  caret: 'hide',
  fullPage: true,
} as const;

test.describe('Visual Regression @visual', () => {
  test.beforeEach(async ({ siteConfig }) => {
    if (siteConfig.skipVisual) {
      test.skip(true, `Visual regression skipped for "${siteConfig.name}" (skipVisual: true)`);
    }
  });

  // ── Homepage ──────────────────────────────────────────────────────────────────

  test('homepage visual regression - desktop @visual', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });
    await dismissCookieBanner(page);
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('homepage-desktop.png', { ...SCREENSHOT_OPTIONS });
  });

  test('homepage visual regression - mobile @visual', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });
    await dismissCookieBanner(page);
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('homepage-mobile.png', { ...SCREENSHOT_OPTIONS });
  });

  test('homepage visual regression - tablet @visual', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });
    await dismissCookieBanner(page);
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('homepage-tablet.png', { ...SCREENSHOT_OPTIONS });
  });

  // ── Partners page ─────────────────────────────────────────────────────────────

  test('partners page visual regression - desktop @visual', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url + '/partners/', { waitUntil: 'networkidle' });
    await dismissCookieBanner(page);
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('partners-desktop.png', { ...SCREENSHOT_OPTIONS });
  });

  // ── Blog page ─────────────────────────────────────────────────────────────────

  test('blog page visual regression - desktop @visual', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url + '/agblog/', { waitUntil: 'networkidle' });
    await dismissCookieBanner(page);
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('blog-desktop.png', { ...SCREENSHOT_OPTIONS });
  });

  // ── MapEngine page ────────────────────────────────────────────────────────────

  test('MapEngine page visual regression - desktop @visual', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url + '/mapengine/', { waitUntil: 'networkidle' });
    await dismissCookieBanner(page);
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('mapengine-desktop.png', { ...SCREENSHOT_OPTIONS });
  });

  // ── Contact page ──────────────────────────────────────────────────────────────

  test('contact page visual regression - desktop @visual', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url + '/contact/', { waitUntil: 'networkidle' });
    await dismissCookieBanner(page);
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('contact-desktop.png', { ...SCREENSHOT_OPTIONS });
  });
});
