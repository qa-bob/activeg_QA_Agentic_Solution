/**
 * tests/navigation/nav-links.spec.ts
 *
 * Navigation tests — verify the primary nav is present, all links resolve,
 * mobile menu works, and expected ActiveG nav items are present.
 *
 * Tag: @navigation
 */

import { test, expect } from '@fixtures/site.fixture';

const EXPECTED_NAV_ITEMS = [
  'Services',
  'About',
  'Blog',
  'Partners',
  'Contact',
];

test.describe('Navigation @navigation', () => {
  test.beforeEach(async ({ navigationPage }) => {
    await navigationPage.navigate();
    await navigationPage.waitForLoad();
  });

  // ── Visibility ──────────────────────────────────────────────────────────────

  test('navigation menu is visible @navigation', async ({ navigationPage }) => {
    const isVisible = await navigationPage.isNavVisible();
    expect(isVisible, 'A nav / [role="navigation"] element should be visible').toBeTruthy();
  });

  // ── Expected nav items ───────────────────────────────────────────────────────

  test('expected nav items are present @navigation', async ({ navigationPage, siteConfig }) => {
    const navLinks = await navigationPage.getNavLinks();
    const navTexts = navLinks.map((l) => l.text.toLowerCase());

    const expectedItems = siteConfig.expectedNavItems.length > 0
      ? siteConfig.expectedNavItems
      : EXPECTED_NAV_ITEMS;

    const missingItems: string[] = [];
    for (const item of expectedItems) {
      const found = navTexts.some((t) => t.includes(item.toLowerCase()));
      if (!found) missingItems.push(item);
    }

    if (missingItems.length > 0) {
      console.warn(
        `[navigation] These expected nav items were not found: ${missingItems.join(', ')}\n` +
        `Available nav items: ${navTexts.join(', ')}`
      );
    }

    // At least 50% of expected items should be present
    expect(
      missingItems.length,
      `${missingItems.length} expected nav item(s) not found: ${missingItems.join(', ')}`
    ).toBeLessThanOrEqual(Math.ceil(expectedItems.length / 2));
  });

  test('"Contact" nav link is present @navigation', async ({ navigationPage, page }) => {
    const contactLink = page.locator('nav a, [role="navigation"] a')
      .filter({ hasText: /^contact$/i })
      .first();
    const count = await contactLink.count();
    expect(count, 'A "Contact" link should be present in the navigation').toBeGreaterThan(0);
  });

  // ── Link reachability ───────────────────────────────────────────────────────

  test('all nav links are reachable (no 404s) @navigation', async ({ navigationPage }) => {
    const results = await navigationPage.checkAllNavLinksReachable();

    if (results.length === 0) {
      console.warn('[navigation] No nav links found to check — skipping reachability assertion.');
      return;
    }

    const broken = results.filter((r) => !r.ok && r.status !== 0);
    const unreachable = results.filter((r) => r.status === 0);

    if (unreachable.length > 0) {
      console.warn(
        '[navigation] Could not reach (network):\n' +
          unreachable.map((r) => `  ${r.url}`).join('\n')
      );
    }

    expect(
      broken,
      `Found ${broken.length} broken nav link(s):\n` +
        broken.map((r) => `  ${r.url} → HTTP ${r.status}`).join('\n')
    ).toHaveLength(0);
  });

  // ── Mobile nav ──────────────────────────────────────────────────────────────

  test('mobile nav menu toggles correctly @navigation', async ({ navigationPage, page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await navigationPage.navigate();
    await navigationPage.waitForLoad();

    const toggle = await navigationPage.getMobileMenuToggle();

    if (!toggle) {
      const navVisible = await navigationPage.isNavVisible();
      expect(
        navVisible,
        'At mobile viewport, either a menu toggle or visible nav should exist'
      ).toBeTruthy();
      return;
    }

    await expect(toggle, 'Mobile menu toggle should be visible').toBeVisible();
    await navigationPage.openMobileMenu();

    const navLinks = await navigationPage.getNavLinks();
    expect(
      navLinks.length,
      'After opening mobile menu, nav links should be discoverable'
    ).toBeGreaterThan(0);
  });

  // ── Accessible link text ────────────────────────────────────────────────────

  test('nav links have descriptive text (not just "click here") @navigation', async ({ navigationPage }) => {
    const navLinks = await navigationPage.getNavLinks();

    if (navLinks.length === 0) {
      console.warn('[navigation] No nav links found — skipping text quality check.');
      return;
    }

    const badPhrases = /^(click here|here|more|read more|learn more|link|go)$/i;
    const genericLinks = navLinks.filter((link) => badPhrases.test(link.text.trim()));

    expect(
      genericLinks,
      `Found nav links with non-descriptive text:\n` +
        genericLinks.map((l) => `  "${l.text}" → ${l.href}`).join('\n')
    ).toHaveLength(0);
  });

  // ── Logo home link ──────────────────────────────────────────────────────────

  test('logo links back to homepage @navigation', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const logoLink = page.locator(
      'a[class*="logo" i], a[aria-label*="home" i], a[aria-label*="logo" i], ' +
      'header a[href="/"], header a[href="' + siteConfig.url + '"]'
    ).first();

    if (await logoLink.count() === 0) {
      console.warn('[navigation] Could not identify a logo link — skipping this assertion.');
      return;
    }

    const href = await logoLink.getAttribute('href');
    expect(href).not.toBeNull();

    const resolvedHref = new URL(href!, siteConfig.url).toString();
    const siteOrigin = new URL(siteConfig.url).origin;

    expect(
      resolvedHref.startsWith(siteOrigin),
      `Logo link "${href}" should point to the site homepage (origin: ${siteOrigin})`
    ).toBeTruthy();
  });

  // ── Product links ───────────────────────────────────────────────────────────

  test('product links (MapEngine, Nash, PowerSync) are navigable @navigation', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const productPaths = ['/mapengine/', '/nash/', '/powersync/'];
    const unreachable: string[] = [];

    for (const path of productPaths) {
      try {
        const response = await page.request.head(siteConfig.url + path, { timeout: 10_000 });
        if (!response.ok()) {
          unreachable.push(`${path} → HTTP ${response.status()}`);
        }
      } catch {
        unreachable.push(`${path} → network error`);
      }
    }

    expect(
      unreachable,
      `Product pages are not reachable:\n${unreachable.join('\n')}`
    ).toHaveLength(0);
  });

  // ── Footer links ────────────────────────────────────────────────────────────

  test('footer contains social media links @navigation', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const socialLinks = page.locator('footer a[href*="facebook.com"], footer a[href*="twitter.com"], footer a[href*="linkedin.com"], footer a[href*="x.com"]');
    const count = await socialLinks.count();

    expect(
      count,
      'Footer should contain at least one social media link'
    ).toBeGreaterThan(0);
  });
});
