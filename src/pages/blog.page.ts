import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@config/site-config.types';

export class BlogPage extends BasePage {
  readonly pageHeading: Locator;
  readonly blogPosts: Locator;
  readonly postLinks: Locator;
  readonly olderEntriesLink: Locator;
  readonly newerEntriesLink: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.pageHeading = page.locator('h1').first();

    this.blogPosts = page.locator('article, [class*="post"], [class*="entry"], .hentry');

    this.postLinks = page.locator('article a[href], [class*="post"] a[href], h2 a[href], h3 a[href]')
      .filter({ hasText: /.+/ });

    this.olderEntriesLink = page.getByRole('link', { name: /older entries|older posts|previous|next page/i }).first();
    this.newerEntriesLink = page.getByRole('link', { name: /newer entries|newer posts|next/i }).first();
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url + '/agblog/', { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async getPostCount(): Promise<number> {
    const articleCount = await this.blogPosts.count();
    if (articleCount > 0) return articleCount;

    const h2Links = await this.page.locator('h2 a[href], h3 a[href]').count();
    return h2Links;
  }

  async getPostTitles(): Promise<string[]> {
    const titleElements = this.page.locator('article h2, article h3, [class*="post-title"], h2 a, h3 a');
    const count = await titleElements.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = ((await titleElements.nth(i).textContent()) ?? '').trim();
      if (text) titles.push(text);
    }
    return [...new Set(titles)];
  }

  async hasPagination(): Promise<boolean> {
    const older = await this.olderEntriesLink.count();
    if (older > 0) return true;

    const paginationNav = await this.page.locator('[class*="pagination"], nav[aria-label*="page" i]').count();
    return paginationNav > 0;
  }
}
