/**
 * tests/visual/visual-regression.spec.ts
 *
 * Visual regression tests — compare screenshots against stored baselines.
 * Run `npm run baseline` to capture new baselines after intentional design changes.
 *
 * Each test runs only in the Playwright project whose viewport it targets, and
 * is skipped (not failed) until a baseline has been captured for it.
 *
 * Tag: @visual
 */

import * as fs from 'fs';
import type { TestInfo } from '@playwright/test';
import { test, expect } from '@fixtures/site.fixture';
import { dismissCookieBanner } from '@utils/visual-helper';

const SCREENSHOT_OPTIONS = {
  maxDiffPixels: 500,
  animations: 'disabled',
  caret: 'hide',
  fullPage: true,
} as const;

/**
 * Skip unless running in `project`, and skip (not fail) until a baseline exists.
 * Only `--update-snapshots` (all/changed) should create a missing baseline.
 */
function skipUnlessBaseline(testInfo: TestInfo, project: string, snapshot: string): void {
  test.skip(testInfo.project.name !== project, `Runs only in the "${project}" project`);
  const isUpdating = ['all', 'changed'].includes(testInfo.config.updateSnapshots);
  const baselinePath = testInfo.snapshotPath(snapshot, { kind: 'screenshot' });
  test.skip(
    !isUpdating && !fs.existsSync(baselinePath),
    `No baseline at ${baselinePath} — run "npm run baseline" to capture one`
  );
}

test.describe('Visual Regression @visual', () => {
  test.beforeEach(async ({ siteConfig }) => {
    if (siteConfig.skipVisual) {
      test.skip(true, `Visual regression skipped for "${siteConfig.name}" (skipVisual: true)`);
    }
  });

  // ── Homepage ──────────────────────────────────────────────────────────────────

  test('homepage visual regression - desktop @visual', async ({ page, siteConfig }, testInfo) => {
    skipUnlessBaseline(testInfo, 'chromium-desktop', 'homepage-desktop.png');

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url, { waitUntil: 'load' });
    await dismissCookieBanner(page);
    await expect(page).toHaveScreenshot('homepage-desktop.png', { ...SCREENSHOT_OPTIONS });
  });

  test('homepage visual regression - mobile @visual', async ({ page, siteConfig }, testInfo) => {
    skipUnlessBaseline(testInfo, 'mobile-chrome', 'homepage-mobile.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url, { waitUntil: 'load' });
    await dismissCookieBanner(page);
    await expect(page).toHaveScreenshot('homepage-mobile.png', { ...SCREENSHOT_OPTIONS });
  });

  test('homepage visual regression - tablet @visual', async ({ page, siteConfig }, testInfo) => {
    skipUnlessBaseline(testInfo, 'tablet', 'homepage-tablet.png');

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(siteConfig.url, { waitUntil: 'load' });
    await dismissCookieBanner(page);
    await expect(page).toHaveScreenshot('homepage-tablet.png', { ...SCREENSHOT_OPTIONS });
  });

  // ── Partners page ─────────────────────────────────────────────────────────────

  test('partners page visual regression - desktop @visual', async ({ page, siteConfig }, testInfo) => {
    skipUnlessBaseline(testInfo, 'chromium-desktop', 'partners-desktop.png');

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url + '/partners/', { waitUntil: 'load' });
    await dismissCookieBanner(page);
    await expect(page).toHaveScreenshot('partners-desktop.png', { ...SCREENSHOT_OPTIONS });
  });

  // ── Blog page ─────────────────────────────────────────────────────────────────

  test('blog page visual regression - desktop @visual', async ({ page, siteConfig }, testInfo) => {
    skipUnlessBaseline(testInfo, 'chromium-desktop', 'blog-desktop.png');

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url + '/agblog/', { waitUntil: 'load' });
    await dismissCookieBanner(page);
    await expect(page).toHaveScreenshot('blog-desktop.png', { ...SCREENSHOT_OPTIONS });
  });

  // ── MapEngine page ────────────────────────────────────────────────────────────

  test('MapEngine page visual regression - desktop @visual', async ({ page, siteConfig }, testInfo) => {
    skipUnlessBaseline(testInfo, 'chromium-desktop', 'mapengine-desktop.png');

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url + '/mapengine/', { waitUntil: 'load' });
    await dismissCookieBanner(page);
    await expect(page).toHaveScreenshot('mapengine-desktop.png', { ...SCREENSHOT_OPTIONS });
  });

  // ── Contact page ──────────────────────────────────────────────────────────────

  test('contact page visual regression - desktop @visual', async ({ page, siteConfig }, testInfo) => {
    skipUnlessBaseline(testInfo, 'chromium-desktop', 'contact-desktop.png');

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url + '/contact/', { waitUntil: 'load' });
    await dismissCookieBanner(page);
    await expect(page).toHaveScreenshot('contact-desktop.png', { ...SCREENSHOT_OPTIONS });
  });
});
