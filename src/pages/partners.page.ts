import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@config/site-config.types';

export class PartnersPage extends BasePage {
  readonly pageHeading: Locator;
  readonly esriSection: Locator;
  readonly ibmSection: Locator;
  readonly geonexusSection: Locator;
  readonly sharptreeSection: Locator;
  readonly pacmugSection: Locator;
  readonly partnerLinks: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.pageHeading = page.locator('h1').first();

    this.esriSection = page.locator('section, div, article')
      .filter({ hasText: /esri/i }).first();
    this.ibmSection = page.locator('section, div, article')
      .filter({ hasText: /^ibm$/i }).first();
    this.geonexusSection = page.locator('section, div, article')
      .filter({ hasText: /geonexus/i }).first();
    this.sharptreeSection = page.locator('section, div, article')
      .filter({ hasText: /sharptree/i }).first();
    this.pacmugSection = page.locator('section, div, article')
      .filter({ hasText: /pacmug|pacific maximo/i }).first();

    this.partnerLinks = page.locator('a[href]').filter({
      hasText: /esri|ibm|geonexus|sharptree|pacmug/i,
    });
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url + '/partners/', { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async getPartnerNames(): Promise<string[]> {
    const partnerHeadings = this.page.locator('h2, h3').filter({
      hasText: /esri|ibm|geonexus|sharptree|pacmug/i,
    });
    const count = await partnerHeadings.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = ((await partnerHeadings.nth(i).textContent()) ?? '').trim();
      if (text) names.push(text);
    }
    return names;
  }

  async getPartnerLinkCount(): Promise<number> {
    return this.partnerLinks.count();
  }
}
