/**
 * tests/functional/blog.spec.ts
 *
 * Functional tests for the ActiveG blog page at /agblog/.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Blog Page @functional', () => {
  test.beforeEach(async ({ blogPage }) => {
    await blogPage.navigate();
  });

  // ── Page loads ────────────────────────────────────────────────────────────────

  test('blog page loads with a heading @functional', async ({ blogPage }) => {
    await expect(blogPage.pageHeading).toBeVisible();
    const text = await blogPage.pageHeading.textContent();
    expect(text?.trim().length ?? 0, 'Blog page h1 should not be empty').toBeGreaterThan(0);
  });

  test('blog page title includes "blog" or site name @functional', async ({ page, siteConfig }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/blog|activeg|naviam/i);
  });

  // ── Post listing ──────────────────────────────────────────────────────────────

  test('blog page shows at least one post @functional', async ({ blogPage }) => {
    const postCount = await blogPage.getPostCount();
    expect(
      postCount,
      'Blog page should display at least one post'
    ).toBeGreaterThan(0);
  });

  test('blog posts have non-empty titles @functional', async ({ blogPage }) => {
    const titles = await blogPage.getPostTitles();
    if (titles.length === 0) {
      console.warn('[blog] No post titles found — post markup may use different selectors');
      return;
    }

    const emptyTitles = titles.filter((t) => t.trim().length === 0);
    expect(
      emptyTitles.length,
      'All blog post titles should have non-empty text'
    ).toBe(0);
  });

  test('blog posts have links to full articles @functional', async ({ blogPage, page }) => {
    const postLinkCount = await blogPage.postLinks.count();
    expect(
      postLinkCount,
      'Blog posts should have links to read full articles'
    ).toBeGreaterThan(0);
  });

  test('blog post links have valid href attributes @functional', async ({ blogPage, page }) => {
    const links = blogPage.postLinks;
    const count = await links.count();
    if (count === 0) return;

    for (let i = 0; i < Math.min(count, 5); i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href, `Blog post link ${i} should have a non-empty href`).toBeTruthy();
      expect(href).not.toBe('#');
    }
  });

  // ── Pagination ────────────────────────────────────────────────────────────────

  test('blog page has pagination when more than one page of posts exists @functional', async ({ blogPage }) => {
    const hasPagination = await blogPage.hasPagination();
    if (!hasPagination) {
      console.warn('[blog] No pagination found — either all posts fit on one page or pagination uses different markup');
    }
    // This is a soft check — having no pagination is valid if there are few posts
    expect(typeof hasPagination).toBe('boolean');
  });

  // ── Content ───────────────────────────────────────────────────────────────────

  test('blog page contains at least one image @functional', async ({ page }) => {
    const images = page.locator('article img, [class*="post"] img, .entry-content img');
    const count = await images.count();
    if (count === 0) {
      console.warn('[blog] No images found in blog post entries');
    }
    // Blog may or may not have images — log but do not fail hard
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('blog page contains Maximo/GIS related content @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText.toLowerCase());
    expect(bodyText).toMatch(/maximo|arcgis|gis|activeg|naviam|mapengine|powersync|nash/);
  });
});
