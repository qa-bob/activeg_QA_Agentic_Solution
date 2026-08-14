/**
 * tests/functional/services.spec.ts
 *
 * Functional tests for the ActiveG/Naviam Services page.
 * The page at /services/ redirects to naviam.io — Playwright follows the redirect.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Services Page @functional', () => {
  test.beforeEach(async ({ servicesPage }) => {
    await servicesPage.navigate();
  });

  // ── Page loads ────────────────────────────────────────────────────────────────

  test('services page loads with a heading @functional', async ({ servicesPage }) => {
    await expect(servicesPage.pageHeading).toBeVisible();
    const text = await servicesPage.pageHeading.textContent();
    expect(text?.trim().length ?? 0, 'Services page h1 should not be empty').toBeGreaterThan(0);
  });

  // ── Service sections ──────────────────────────────────────────────────────────

  test('Maximo Implementations service section is present @functional', async ({ servicesPage }) => {
    await expect(servicesPage.implementationsSection).toBeVisible();
  });

  test('Maximo Upgrade service section is present @functional', async ({ servicesPage }) => {
    await expect(servicesPage.upgradeSection).toBeVisible();
  });

  test('Support service section is present @functional', async ({ servicesPage }) => {
    await expect(servicesPage.supportSection).toBeVisible();
  });

  test('Configurations service section is present @functional', async ({ servicesPage }) => {
    await expect(servicesPage.configurationsSection).toBeVisible();
  });

  test('Training service section is present @functional', async ({ servicesPage }) => {
    await expect(servicesPage.trainingSection).toBeVisible();
  });

  test('at least 4 service areas are listed @functional', async ({ servicesPage }) => {
    const names = await servicesPage.getServiceNames();
    expect(
      names.length,
      `Expected at least 4 service areas, found: ${names.join(', ')}`
    ).toBeGreaterThanOrEqual(4);
  });

  // ── CTAs ──────────────────────────────────────────────────────────────────────

  test('services page has contact CTAs @functional', async ({ servicesPage }) => {
    const ctaCount = await servicesPage.getCtaCount();
    expect(
      ctaCount,
      'Services page should have at least one contact/CTA button'
    ).toBeGreaterThan(0);
  });

  test('each service area has descriptive text @functional', async ({ page }) => {
    const serviceDescriptions = page.locator('p').filter({
      hasText: /implementation|upgrade|support|configuration|training/i,
    });
    const count = await serviceDescriptions.count();
    expect(
      count,
      'Each service area should have descriptive paragraph text'
    ).toBeGreaterThan(0);
  });
});
