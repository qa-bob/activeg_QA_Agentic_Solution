import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@config/site-config.types';

export class MapEnginePage extends BasePage {
  readonly pageHeading: Locator;
  readonly subHeading: Locator;
  readonly keyFeaturesSection: Locator;
  readonly featureItems: Locator;
  readonly faqSection: Locator;
  readonly faqItems: Locator;
  readonly getStartedCta: Locator;
  readonly ctaButtons: Locator;
  readonly whyChooseSection: Locator;
  readonly whoBenefitsSection: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.pageHeading = page.locator('h1').first();
    this.subHeading = page.locator('h1 + p, h1 ~ p, h2').first();

    this.keyFeaturesSection = page.locator('section, div')
      .filter({ hasText: /key features/i }).first();
    this.featureItems = page.locator('li, [class*="feature"], [class*="card"]').filter({
      hasText: /gis|work management|visualization|optimization|search|mobile/i,
    });

    this.faqSection = page.locator('section, div')
      .filter({ hasText: /frequently asked questions|faq/i }).first();
    this.faqItems = page.locator('details, [class*="accordion"], [class*="faq"]')
      .or(page.locator('button').filter({ hasText: /\?/ }));

    this.getStartedCta = page.getByRole('link', { name: /get started/i }).first();
    this.ctaButtons = page.locator('a, button').filter({
      hasText: /get started|let's talk|contact|request|learn/i,
    });

    this.whyChooseSection = page.locator('section, div')
      .filter({ hasText: /why choose.*mapengine/i }).first();
    this.whoBenefitsSection = page.locator('section, div')
      .filter({ hasText: /who benefits/i }).first();
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url + '/mapengine/', { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async getFeatureNames(): Promise<string[]> {
    const items = this.page.locator('h3, h4, strong, [class*="feature-title"], [class*="card-title"]')
      .filter({ hasText: /gis|work|visualization|route|search|mobile|admin|spatial/i });
    const count = await items.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = ((await items.nth(i).textContent()) ?? '').trim();
      if (text) names.push(text);
    }
    return names;
  }

  async getFaqItemCount(): Promise<number> {
    const detailsCount = await this.page.locator('details').count();
    if (detailsCount > 0) return detailsCount;

    const buttonFaqs = this.page.locator('button').filter({ hasText: /\?/ });
    return buttonFaqs.count();
  }

  async openFaqItem(index: number): Promise<void> {
    const details = this.page.locator('details');
    if (await details.count() > index) {
      const summary = details.nth(index).locator('summary');
      await summary.click();
      return;
    }

    const faqButtons = this.page.locator('button').filter({ hasText: /\?/ });
    if (await faqButtons.count() > index) {
      await faqButtons.nth(index).click();
    }
  }
}
