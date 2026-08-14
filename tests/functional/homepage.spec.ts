/**
 * tests/functional/homepage.spec.ts
 *
 * Functional tests for the ActiveG homepage.
 * Verifies hero content, product card links, feature sections, and footer.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Functional @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  // ── Hero ──────────────────────────────────────────────────────────────────────

  test('hero heading contains expected integration text @functional', async ({ homePage }) => {
    const heading = await homePage.getHeroText();
    expect(heading.length, 'Hero heading should not be empty').toBeGreaterThan(0);
    expect(heading.toLowerCase()).toMatch(/maximo|arcgis|integration|gis/);
  });

  test('h1 is present and non-empty @functional', async ({ homePage }) => {
    await expect(homePage.heroHeading).toBeVisible();
    const text = await homePage.heroHeading.textContent();
    expect(text?.trim().length ?? 0).toBeGreaterThan(0);
  });

  // ── Product cards ─────────────────────────────────────────────────────────────

  test('MapEngine product link is present on homepage @functional', async ({ homePage, page }) => {
    const mapEngineLink = page.locator('a[href*="mapengine"]').first();
    const count = await mapEngineLink.count();
    expect(count, 'A link to MapEngine should be present on the homepage').toBeGreaterThan(0);
  });

  test('Nash Workflows product link is present on homepage @functional', async ({ page }) => {
    const nashLink = page.locator('a[href*="nash"]').first();
    const count = await nashLink.count();
    expect(count, 'A link to Nash Workflows should be present on the homepage').toBeGreaterThan(0);
  });

  test('PowerSync product link is present on homepage @functional', async ({ page }) => {
    const powerSyncLink = page.locator('a[href*="powersync"]').first();
    const count = await powerSyncLink.count();
    expect(count, 'A link to PowerSync should be present on the homepage').toBeGreaterThan(0);
  });

  test('all three product card links are present @functional', async ({ homePage }) => {
    const productLinks = await homePage.getProductCardLinks();
    expect(
      productLinks.length,
      `Expected at least 3 product links (MapEngine, Nash, PowerSync), found ${productLinks.length}`
    ).toBeGreaterThanOrEqual(3);
  });

  // ── Feature sections ──────────────────────────────────────────────────────────

  test('Sync/Visualize/Automate sections are present @functional', async ({ page }) => {
    const syncText = page.getByText('Sync', { exact: true }).first();
    const visualizeText = page.getByText('Visualize', { exact: true }).first();
    const automateText = page.getByText('Automate', { exact: true }).first();

    const syncCount = await syncText.count();
    const vizCount = await visualizeText.count();
    const autoCount = await automateText.count();

    const presentCount = [syncCount, vizCount, autoCount].filter((c) => c > 0).length;
    expect(
      presentCount,
      'At least 2 of the Sync/Visualize/Automate section headings should be present'
    ).toBeGreaterThanOrEqual(2);
  });

  test('company history section mentions 1997 @functional', async ({ page }) => {
    const historyText = page.getByText(/1997/i).first();
    const count = await historyText.count();
    expect(count, 'Homepage should reference the company\'s founding year 1997').toBeGreaterThan(0);
  });

  // ── CTAs ──────────────────────────────────────────────────────────────────────

  test('at least one CTA link or button is present on homepage @functional', async ({ homePage }) => {
    const ctas = await homePage.getCTAButtons();
    expect(
      ctas.length,
      'Homepage should have at least one call-to-action link or button'
    ).toBeGreaterThan(0);
  });

  // ── Footer ────────────────────────────────────────────────────────────────────

  test('footer section is present @functional', async ({ homePage }) => {
    await expect(homePage.footerSection).toBeVisible();
  });

  test('footer contains a phone number @functional', async ({ page }) => {
    const footerPhone = page.locator('footer, [class*="footer"]')
      .getByText(/\+?1[\s.-]?\(?480\)?[\s.-]?610[\s.-]?0839|480.*610.*0839/i)
      .first();
    const count = await footerPhone.count();

    if (count === 0) {
      const anyPhone = page.locator('footer').getByText(/\+?\d[\d\s().+-]{9,}/);
      const phoneCount = await anyPhone.count();
      expect(
        phoneCount,
        'Footer should contain a phone number'
      ).toBeGreaterThan(0);
    } else {
      await expect(footerPhone).toBeVisible();
    }
  });

  test('footer social media links are present @functional', async ({ homePage }) => {
    const facebookCount = await homePage.footerFacebookLink.count();
    const twitterCount = await homePage.footerTwitterLink.count();

    expect(
      facebookCount + twitterCount,
      'At least one social media link (Facebook or Twitter/X) should be in the footer'
    ).toBeGreaterThan(0);
  });

  // ── Images ────────────────────────────────────────────────────────────────────

  test('homepage has at least one image @functional', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    expect(count, 'Homepage should contain at least one image').toBeGreaterThan(0);
  });

  test('homepage images are not broken @functional', async ({ page, siteConfig }) => {
    const images = page.locator('img[src]');
    const count = await images.count();

    if (count === 0) return;

    const brokenImages: string[] = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      const src = await images.nth(i).getAttribute('src');
      if (!src || src.startsWith('data:')) continue;

      const isLoaded = await images.nth(i).evaluate<boolean>((img) => {
        const el = img as HTMLImageElement;
        return el.complete && el.naturalWidth > 0;
      });

      if (!isLoaded) {
        brokenImages.push(src);
      }
    }

    expect(
      brokenImages,
      `Found ${brokenImages.length} broken image(s):\n${brokenImages.join('\n')}`
    ).toHaveLength(0);
  });
});
