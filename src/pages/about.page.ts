import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@config/site-config.types';

export class AboutPage extends BasePage {
  readonly pageHeading: Locator;
  readonly missionSection: Locator;
  readonly coreValuesSection: Locator;
  readonly teamStatsText: Locator;
  readonly companyDescription: Locator;
  readonly joinTeamLink: Locator;
  readonly ctaButtons: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.pageHeading = page.locator('h1').first();
    this.missionSection = page.locator('section, div')
      .filter({ hasText: /our mission|mission/i }).first();
    this.coreValuesSection = page.locator('section, div')
      .filter({ hasText: /core values|one naviam|go beyond|be excellent/i }).first();
    this.teamStatsText = page.locator('body').getByText(/400\+.*professionals|professionals.*400\+/i).first();
    this.companyDescription = page.locator('section, div')
      .filter({ hasText: /world.*leading.*maximo|maximo.*partner/i }).first();
    this.joinTeamLink = page.getByRole('link', { name: /join our team/i }).first();
    this.ctaButtons = page.locator('a, button').filter({
      hasText: /contact us|let's talk|get started|join our team|explore/i,
    });
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url + '/about/', { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageHeading.textContent())?.trim() ?? '';
  }

  async getCoreValuesList(): Promise<string[]> {
    const valueElements = this.page.locator('h2, h3').filter({
      hasText: /one naviam|go beyond|be excellent|win together|customer obsessed|dynamically innovative|flexibly collaborative/i,
    });
    const count = await valueElements.count();
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = ((await valueElements.nth(i).textContent()) ?? '').trim();
      if (text) values.push(text);
    }
    return values;
  }
}
