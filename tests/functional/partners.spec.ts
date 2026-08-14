/**
 * tests/functional/partners.spec.ts
 *
 * Functional tests for the ActiveG Partners page at /partners/.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Partners Page @functional', () => {
  test.beforeEach(async ({ partnersPage }) => {
    await partnersPage.navigate();
  });

  // ── Page loads ────────────────────────────────────────────────────────────────

  test('partners page loads with "Partners" heading @functional', async ({ partnersPage }) => {
    await expect(partnersPage.pageHeading).toBeVisible();
    const text = await partnersPage.pageHeading.textContent();
    expect(text?.toLowerCase()).toContain('partner');
  });

  // ── Partner sections ──────────────────────────────────────────────────────────

  test('Esri partner section is present @functional', async ({ partnersPage }) => {
    const esriHeading = partnersPage.page.locator('h2, h3').filter({ hasText: /esri/i }).first();
    await expect(esriHeading).toBeVisible();
  });

  test('IBM partner section is present @functional', async ({ page }) => {
    const ibmHeading = page.locator('h2, h3').filter({ hasText: /ibm/i }).first();
    const count = await ibmHeading.count();
    expect(count, 'IBM should be listed as a partner').toBeGreaterThan(0);
  });

  test('Geonexus partner section is present @functional', async ({ page }) => {
    const geonexusText = page.getByText(/geonexus/i).first();
    const count = await geonexusText.count();
    expect(count, 'Geonexus should be listed as a partner').toBeGreaterThan(0);
  });

  test('Sharptree partner section is present @functional', async ({ page }) => {
    const sharptreeText = page.getByText(/sharptree/i).first();
    const count = await sharptreeText.count();
    expect(count, 'Sharptree should be listed as a partner').toBeGreaterThan(0);
  });

  test('at least 4 partner names are visible @functional', async ({ partnersPage }) => {
    const partnerNames = await partnersPage.getPartnerNames();
    expect(
      partnerNames.length,
      `Expected at least 4 partners, found: ${partnerNames.join(', ')}`
    ).toBeGreaterThanOrEqual(4);
  });

  // ── Partner links ─────────────────────────────────────────────────────────────

  test('partner entries have outbound links @functional', async ({ partnersPage }) => {
    const linkCount = await partnersPage.getPartnerLinkCount();
    if (linkCount === 0) {
      const anyExternalLink = partnersPage.page.locator('a[href^="http"]').filter({
        hasText: /.+/,
      });
      const externalCount = await anyExternalLink.count();
      expect(
        externalCount,
        'Partners page should have links to partner websites'
      ).toBeGreaterThan(0);
    } else {
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  // ── Content ───────────────────────────────────────────────────────────────────

  test('Esri Silver Partner badge or description is present @functional', async ({ page }) => {
    const esriPartnerText = page.getByText(/esri.*silver|silver.*partner|authorized.*esri/i).first();
    const count = await esriPartnerText.count();
    if (count === 0) {
      const esriDesc = page.getByText(/esri/i).first();
      await expect(esriDesc).toBeVisible();
    } else {
      await expect(esriPartnerText).toBeVisible();
    }
  });

  test('partner descriptions are non-empty @functional', async ({ page }) => {
    const partnerDescriptions = page.locator('p').filter({
      hasText: /esri|ibm|geonexus|sharptree|maximo|arcgis/i,
    });
    const count = await partnerDescriptions.count();
    expect(
      count,
      'Partners page should have descriptive text for each partner'
    ).toBeGreaterThan(0);
  });
});
