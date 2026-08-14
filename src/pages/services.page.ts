import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@config/site-config.types';

export class ServicesPage extends BasePage {
  readonly pageHeading: Locator;
  readonly sectionHeadings: Locator;
  readonly implementationsSection: Locator;
  readonly upgradeSection: Locator;
  readonly supportSection: Locator;
  readonly configurationsSection: Locator;
  readonly trainingSection: Locator;
  readonly ctaButtons: Locator;
  readonly contactUsLinks: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.pageHeading = page.locator('h1').first();
    this.sectionHeadings = page.locator('h2, h3');

    this.implementationsSection = page.locator('h2, h3, [class*="card"], [class*="service"]')
      .filter({ hasText: /maximo implementations/i }).first();
    this.upgradeSection = page.locator('h2, h3, [class*="card"], [class*="service"]')
      .filter({ hasText: /maximo upgrade/i }).first();
    this.supportSection = page.locator('h2, h3, [class*="card"], [class*="service"]')
      .filter({ hasText: /^support$/i }).first();
    this.configurationsSection = page.locator('h2, h3, [class*="card"], [class*="service"]')
      .filter({ hasText: /configurations/i }).first();
    this.trainingSection = page.locator('h2, h3, [class*="card"], [class*="service"]')
      .filter({ hasText: /^training$/i }).first();

    this.ctaButtons = page.locator('a, button').filter({
      hasText: /contact us|let's talk|get started|learn more|see how|request/i,
    });
    this.contactUsLinks = page.locator('a[href*="contact"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url + '/services/', { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async getServiceNames(): Promise<string[]> {
    const headings = this.page.locator('h2, h3').filter({
      hasText: /implementations|upgrade|support|configurations|training/i,
    });
    const count = await headings.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = ((await headings.nth(i).textContent()) ?? '').trim();
      if (text) names.push(text);
    }
    return names;
  }

  async getCtaCount(): Promise<number> {
    return this.ctaButtons.count();
  }
}
