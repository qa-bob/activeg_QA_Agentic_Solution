import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@config/site-config.types';

export class HomePage extends BasePage {
  // ── Hero ────────────────────────────────────────────────────────────────────
  readonly heroHeading: Locator;
  readonly heroTagline: Locator;

  // ── Product cards ────────────────────────────────────────────────────────────
  readonly productCards: Locator;
  readonly mapEngineCard: Locator;
  readonly nashCard: Locator;
  readonly powerSyncCard: Locator;

  // ── Feature sections ─────────────────────────────────────────────────────────
  readonly syncSection: Locator;
  readonly visualizeSection: Locator;
  readonly automateSection: Locator;
  readonly companyHistorySection: Locator;
  readonly spatialEamSection: Locator;

  // ── CTAs ────────────────────────────────────────────────────────────────────
  readonly readMoreLink: Locator;
  readonly primaryCtas: Locator;

  // ── Footer ──────────────────────────────────────────────────────────────────
  readonly footerPhone: Locator;
  readonly footerFacebookLink: Locator;
  readonly footerTwitterLink: Locator;
  readonly footerSection: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.heroHeading = page.locator('h1').first();
    this.heroTagline = page.locator('h3').first();

    this.productCards = page.locator(
      '[class*="card"], [class*="product"], article'
    ).filter({ hasText: /mapengine|nash|powersync/i });

    this.mapEngineCard = page.locator('a[href*="mapengine"], section, div, article')
      .filter({ hasText: /mapengine/i }).first();
    this.nashCard = page.locator('a[href*="nash"], section, div, article')
      .filter({ hasText: /nash/i }).first();
    this.powerSyncCard = page.locator('a[href*="powersync"], section, div, article')
      .filter({ hasText: /powersync/i }).first();

    this.syncSection = page.locator('section, div').filter({ hasText: /^Sync$/i }).first();
    this.visualizeSection = page.locator('section, div').filter({ hasText: /^Visualize$/i }).first();
    this.automateSection = page.locator('section, div').filter({ hasText: /^Automate$/i }).first();
    this.companyHistorySection = page.locator('section, div')
      .filter({ hasText: /integration since 1997/i }).first();
    this.spatialEamSection = page.locator('section, div')
      .filter({ hasText: /spatial eam program/i }).first();

    this.readMoreLink = page.getByRole('link', { name: /read more/i }).first();
    this.primaryCtas = page.locator('a[href], button').filter({
      hasText: /get started|contact us|learn more|read more|request/i,
    });

    this.footerSection = page.locator('footer').first();
    this.footerPhone = page.locator('footer, [class*="footer"]')
      .getByText(/\+1.*480.*610|480.*610.*0839/i).first();
    this.footerFacebookLink = page.locator('a[href*="facebook.com"]').first();
    this.footerTwitterLink = page.locator('a[href*="twitter.com"], a[href*="x.com"]').first();
  }

  async getHeroText(): Promise<string> {
    const h1 = this.heroHeading;
    if (await h1.count() > 0) {
      return (await h1.textContent())?.trim() ?? '';
    }
    return '';
  }

  async getMainHeading(): Promise<string> {
    return this.getHeroText();
  }

  async getCTAButtons(): Promise<Locator[]> {
    return this.primaryCtas.all();
  }

  async isLoaded(): Promise<boolean> {
    try {
      const headingCount = await this.page.locator('h1, h2').count();
      if (headingCount === 0) return false;
      const navCount = await this.page.locator('nav, [role="navigation"]').count();
      if (navCount === 0) return false;
      const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
      return bodyText.trim().length > 50;
    } catch {
      return false;
    }
  }

  async getProductCardLinks(): Promise<{ text: string; href: string }[]> {
    const links = this.page.locator('a[href*="mapengine"], a[href*="nash"], a[href*="powersync"]');
    const count = await links.count();
    const results: { text: string; href: string }[] = [];
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = ((await link.textContent()) ?? '').trim();
      const href = (await link.getAttribute('href')) ?? '';
      results.push({ text, href });
    }
    return results;
  }
}
