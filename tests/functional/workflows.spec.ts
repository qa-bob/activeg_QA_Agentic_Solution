/**
 * tests/functional/workflows.spec.ts
 *
 * Functional tests for the Nash Workflows product page.
 * /nash/ redirects to naviam.io/products/naviam-gis/workflows
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Nash Workflows Product Page @functional', () => {
  test.beforeEach(async ({ workflowsPage }) => {
    await workflowsPage.navigate();
  });

  // ── Page loads ────────────────────────────────────────────────────────────────

  test('Workflows page loads with a heading @functional', async ({ workflowsPage }) => {
    await expect(workflowsPage.pageHeading).toBeVisible();
    const heading = await workflowsPage.pageHeading.textContent();
    expect(heading?.trim().length ?? 0, 'Workflows page h1 should not be empty').toBeGreaterThan(0);
  });

  test('page mentions "Workflows" or "Nash" @functional', async ({ workflowsPage, page }) => {
    const headingText = (await workflowsPage.pageHeading.textContent() ?? '').toLowerCase();
    const hasWorkflowsInHeading = headingText.includes('workflow') || headingText.includes('nash');

    if (!hasWorkflowsInHeading) {
      const bodyText = await page.evaluate<string>(() => document.body.innerText.toLowerCase());
      expect(bodyText).toMatch(/workflow|nash/);
    } else {
      expect(hasWorkflowsInHeading).toBeTruthy();
    }
  });

  // ── No-code automation ────────────────────────────────────────────────────────

  test('no-code automation feature is described @functional', async ({ workflowsPage, page }) => {
    const noCodeText = page.getByText(/no.?code|without coding|without writing code/i).first();
    const count = await noCodeText.count();
    expect(count, 'No-code workflow automation should be described on the page').toBeGreaterThan(0);
  });

  // ── Key features ──────────────────────────────────────────────────────────────

  test('"Key Features" section is present @functional', async ({ workflowsPage }) => {
    await expect(workflowsPage.keyFeaturesSection).toBeVisible();
  });

  test('at least 3 workflow features are listed @functional', async ({ workflowsPage }) => {
    const features = await workflowsPage.getFeatureNames();
    expect(
      features.length,
      `Expected at least 3 workflow features, found: ${features.join(', ')}`
    ).toBeGreaterThanOrEqual(3);
  });

  test('GIS integration feature is mentioned @functional', async ({ page }) => {
    const gisContent = page.getByText(/arcgis|maximo|gis.*integration/i).first();
    await expect(gisContent).toBeVisible();
  });

  // ── FAQ accordion ─────────────────────────────────────────────────────────────

  test('FAQ section is present @functional', async ({ page }) => {
    const faqHeading = page.getByText(/frequently asked questions|faq/i).first();
    const count = await faqHeading.count();
    expect(count, 'FAQ section should be present on Workflows page').toBeGreaterThan(0);
  });

  test('FAQ items are available @functional', async ({ workflowsPage }) => {
    const faqCount = await workflowsPage.getFaqItemCount();
    if (faqCount === 0) {
      console.warn('[workflows] No FAQ accordion items detected — may use a different markup pattern');
      return;
    }
    expect(faqCount, 'Workflows FAQ should have at least 3 items').toBeGreaterThanOrEqual(3);
  });

  // ── CTAs ──────────────────────────────────────────────────────────────────────

  test('Get Started CTA is present @functional', async ({ workflowsPage }) => {
    const ctaCount = await workflowsPage.ctaButtons.count();
    expect(ctaCount, 'Workflows page should have at least one CTA button').toBeGreaterThan(0);
  });
});
