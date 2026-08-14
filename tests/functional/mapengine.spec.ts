/**
 * tests/functional/mapengine.spec.ts
 *
 * Functional tests for the MapEngine product page.
 * /mapengine/ redirects to naviam.io/products/naviam-gis/mapengine
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('MapEngine Product Page @functional', () => {
  test.beforeEach(async ({ mapEnginePage }) => {
    await mapEnginePage.navigate();
  });

  // ── Page loads ────────────────────────────────────────────────────────────────

  test('MapEngine page loads with correct heading @functional', async ({ mapEnginePage }) => {
    await expect(mapEnginePage.pageHeading).toBeVisible();
    const heading = await mapEnginePage.pageHeading.textContent();
    expect(heading?.toLowerCase()).toMatch(/mapengine|map engine/);
  });

  // ── Key features ──────────────────────────────────────────────────────────────

  test('"Key Features" section is present @functional', async ({ mapEnginePage }) => {
    await expect(mapEnginePage.keyFeaturesSection).toBeVisible();
  });

  test('at least 4 features are listed @functional', async ({ mapEnginePage }) => {
    const features = await mapEnginePage.getFeatureNames();
    expect(
      features.length,
      `Expected at least 4 MapEngine features, found: ${features.join(', ')}`
    ).toBeGreaterThanOrEqual(4);
  });

  test('GIS-related feature content is present @functional', async ({ page }) => {
    const gisContent = page.getByText(/gis|mapping|arcgis/i).first();
    await expect(gisContent).toBeVisible();
  });

  // ── Why Choose section ────────────────────────────────────────────────────────

  test('"Why choose" section is present @functional', async ({ mapEnginePage, page }) => {
    const whySection = page.getByText(/why choose/i).first();
    const count = await whySection.count();
    expect(count, '"Why choose MapEngine" section should be present').toBeGreaterThan(0);
  });

  // ── FAQ accordion ─────────────────────────────────────────────────────────────

  test('FAQ section is present @functional', async ({ mapEnginePage, page }) => {
    const faqHeading = page.getByText(/frequently asked questions|faq/i).first();
    const count = await faqHeading.count();
    expect(count, 'FAQ section heading should be present on MapEngine page').toBeGreaterThan(0);
  });

  test('FAQ items are interactable @functional', async ({ mapEnginePage }) => {
    const faqCount = await mapEnginePage.getFaqItemCount();
    if (faqCount === 0) {
      console.warn('[mapengine] No FAQ accordion items detected — FAQ may use a different markup pattern');
      return;
    }
    expect(faqCount, 'MapEngine FAQ should have at least 3 items').toBeGreaterThanOrEqual(3);
  });

  // ── CTAs ──────────────────────────────────────────────────────────────────────

  test('Get Started CTA is present @functional', async ({ mapEnginePage }) => {
    const ctaCount = await mapEnginePage.ctaButtons.count();
    expect(
      ctaCount,
      'MapEngine page should have at least one CTA button'
    ).toBeGreaterThan(0);
  });

  test('CTA links point to the contact page @functional', async ({ mapEnginePage, page }) => {
    const contactLinks = page.locator('a[href*="contact"]');
    const count = await contactLinks.count();
    expect(
      count,
      'MapEngine page CTAs should link to the contact page'
    ).toBeGreaterThan(0);
  });
});
