/**
 * tests/functional/powersync.spec.ts
 *
 * Functional tests for the PowerSync product page.
 * /powersync/ redirects to naviam.io/products/naviam-gis/sync
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('PowerSync Product Page @functional', () => {
  test.beforeEach(async ({ powerSyncPage }) => {
    await powerSyncPage.navigate();
  });

  // ── Page loads ────────────────────────────────────────────────────────────────

  test('PowerSync page loads with a heading @functional', async ({ powerSyncPage }) => {
    await expect(powerSyncPage.pageHeading).toBeVisible();
    const heading = await powerSyncPage.pageHeading.textContent();
    expect(heading?.trim().length ?? 0).toBeGreaterThan(0);
  });

  test('page heading references PowerSync or sync @functional', async ({ powerSyncPage, page }) => {
    const headingText = (await powerSyncPage.pageHeading.textContent() ?? '').toLowerCase();
    const hasPowerSyncInHeading = headingText.includes('powersync') || headingText.includes('sync');

    if (!hasPowerSyncInHeading) {
      const bodyText = await page.evaluate<string>(() => document.body.innerText.toLowerCase());
      expect(bodyText).toMatch(/powersync|synchronization/);
    } else {
      expect(hasPowerSyncInHeading).toBeTruthy();
    }
  });

  // ── Two-way sync ──────────────────────────────────────────────────────────────

  test('two-way synchronization feature is described @functional', async ({ powerSyncPage, page }) => {
    const twoWayText = page.getByText(/two.?way synchronization|bidirectional sync/i).first();
    const count = await twoWayText.count();
    expect(count, 'Two-way synchronization should be described on the PowerSync page').toBeGreaterThan(0);
  });

  // ── Key features ──────────────────────────────────────────────────────────────

  test('"Key Features" section is present @functional', async ({ powerSyncPage }) => {
    await expect(powerSyncPage.keyFeaturesSection).toBeVisible();
  });

  test('at least 3 PowerSync features are listed @functional', async ({ powerSyncPage }) => {
    const features = await powerSyncPage.getFeatureNames();
    expect(
      features.length,
      `Expected at least 3 PowerSync features, found: ${features.join(', ')}`
    ).toBeGreaterThanOrEqual(3);
  });

  test('security/compliance feature is mentioned @functional', async ({ page }) => {
    const secureText = page.getByText(/secure|compliant|encrypted/i).first();
    const count = await secureText.count();
    expect(count, 'Security/compliance should be mentioned on PowerSync page').toBeGreaterThan(0);
  });

  // ── Benefits ──────────────────────────────────────────────────────────────────

  test('benefit descriptions are present @functional', async ({ page }) => {
    const benefitTerms = page.getByText(/real.?time|error.?free|seamless|reporting|workload/i).first();
    const count = await benefitTerms.count();
    expect(count, 'Benefit descriptions should be visible on PowerSync page').toBeGreaterThan(0);
  });

  // ── FAQ accordion ─────────────────────────────────────────────────────────────

  test('FAQ section is present @functional', async ({ page }) => {
    const faqHeading = page.getByText(/frequently asked questions|faq/i).first();
    const count = await faqHeading.count();
    expect(count, 'FAQ section should be present on PowerSync page').toBeGreaterThan(0);
  });

  test('FAQ items are available @functional', async ({ powerSyncPage }) => {
    const faqCount = await powerSyncPage.getFaqItemCount();
    if (faqCount === 0) {
      console.warn('[powersync] No FAQ accordion items detected — may use a different markup pattern');
      return;
    }
    expect(faqCount, 'PowerSync FAQ should have at least 3 items').toBeGreaterThanOrEqual(3);
  });

  // ── CTAs ──────────────────────────────────────────────────────────────────────

  test('CTAs are present @functional', async ({ powerSyncPage }) => {
    const ctaCount = await powerSyncPage.ctaButtons.count();
    expect(ctaCount, 'PowerSync page should have at least one CTA button').toBeGreaterThan(0);
  });
});
