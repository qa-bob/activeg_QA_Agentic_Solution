import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@config/site-config.types';

export interface FormFieldInfo {
  name: string;
  type: string;
  required: boolean;
}

export class ContactFormPage extends BasePage {
  // ── Specific field locators (naviam.io contact form) ─────────────────────────
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly companyInput: Locator;
  readonly jobTitleInput: Locator;
  readonly countrySelect: Locator;
  readonly citySelect: Locator;
  readonly industrySelect: Locator;
  readonly interestSelect: Locator;
  readonly commentsTextarea: Locator;
  readonly consentCheckbox: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.firstNameInput = page.locator(
      'input[name*="first" i], input[placeholder*="first name" i], input[autocomplete="given-name"]'
    ).first();
    this.lastNameInput = page.locator(
      'input[name*="last" i], input[placeholder*="last name" i], input[autocomplete="family-name"]'
    ).first();
    this.emailInput = page.locator(
      'input[type="email"], input[name*="email" i], input[placeholder*="email" i]'
    ).first();
    this.companyInput = page.locator(
      'input[name*="company" i], input[placeholder*="company" i], input[name*="organization" i]'
    ).first();
    this.jobTitleInput = page.locator(
      'input[name*="job" i], input[name*="title" i], input[placeholder*="job title" i]'
    ).first();
    this.countrySelect = page.locator(
      'select[name*="country" i], select[id*="country" i]'
    ).first();
    this.citySelect = page.locator(
      'select[name*="city" i], select[id*="city" i]'
    ).first();
    this.industrySelect = page.locator(
      'select[name*="industry" i], select[id*="industry" i]'
    ).first();
    this.interestSelect = page.locator(
      'select[name*="interest" i], select[id*="interest" i]'
    ).first();
    this.commentsTextarea = page.locator('textarea').first();
    this.consentCheckbox = page.locator('input[type="checkbox"]').first();
    this.submitButton = page.locator(
      'input[type="submit"], button[type="submit"], button:not([type="button"]):not([type="reset"])'
    ).filter({ hasText: /submit|send|contact|get in touch/i }).first();
    this.successMessage = page.getByText(/thank you.*submission.*received|successfully submitted/i).first();
    this.errorMessage = page.getByText(/something went wrong|error.*submitting/i).first();
  }

  async navigateToContact(): Promise<void> {
    await this.page.goto(this.url + '/contact/', { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async findContactForm(): Promise<Locator | null> {
    const byAction = this.page.locator('form[action*="contact" i], form[action*="message" i]');
    if (await byAction.count() > 0) return byAction.first();

    const withEmail = this.page.locator('form').filter({
      has: this.page.locator('input[type="email"], input[name*="email" i]'),
    });
    if (await withEmail.count() > 0) return withEmail.first();

    const anyForm = this.page.locator('form').first();
    if (await anyForm.count() > 0) return anyForm;

    return null;
  }

  async getFormFields(): Promise<FormFieldInfo[]> {
    const form = await this.findContactForm();
    if (!form) return [];

    const inputLocator = form.locator(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select'
    );
    const count = await inputLocator.count();
    const fields: FormFieldInfo[] = [];

    for (let i = 0; i < count; i++) {
      const el = inputLocator.nth(i);
      const name =
        (await el.getAttribute('name')) ??
        (await el.getAttribute('id')) ??
        (await el.getAttribute('placeholder')) ??
        `field-${i}`;
      const type =
        (await el.getAttribute('type')) ??
        (await el.evaluate((node) => node.tagName.toLowerCase()));
      const required =
        (await el.getAttribute('required')) !== null ||
        (await el.getAttribute('aria-required')) === 'true';

      fields.push({ name, type, required });
    }

    return fields;
  }

  async hasEmailField(): Promise<boolean> {
    const form = await this.findContactForm();
    if (!form) return false;
    const emailField = form.locator(
      'input[type="email"], input[name*="email" i], input[placeholder*="email" i]'
    );
    return (await emailField.count()) > 0;
  }

  async hasNameField(): Promise<boolean> {
    const form = await this.findContactForm();
    if (!form) return false;
    const nameField = form.locator(
      'input[name*="name" i], input[placeholder*="name" i], input[autocomplete*="name" i]'
    );
    return (await nameField.count()) > 0;
  }

  async hasSubmitButton(): Promise<boolean> {
    const form = await this.findContactForm();
    if (!form) return false;

    const anyButton = form.locator('button, input[type="submit"]');
    return (await anyButton.count()) > 0;
  }

  async fillForm(data: Record<string, string>): Promise<void> {
    const form = await this.findContactForm();
    if (!form) throw new Error('[ContactFormPage] No contact form found on this page.');

    for (const [key, value] of Object.entries(data)) {
      const field = form.locator(
        `input[name="${key}"], input[id="${key}"], input[placeholder*="${key}" i], ` +
        `textarea[name="${key}"], textarea[id="${key}"], textarea[placeholder*="${key}" i]`
      ).first();

      if (await field.count() > 0) {
        await field.fill(value);
      }
    }
  }

  async validateFormPresence(): Promise<boolean> {
    const form = await this.findContactForm();
    if (!form) return false;
    const hasEmail = await this.hasEmailField();
    const hasSubmit = await this.hasSubmitButton();
    return hasEmail && hasSubmit;
  }

  async countSelectFields(): Promise<number> {
    const form = await this.findContactForm();
    if (!form) return 0;
    return form.locator('select').count();
  }
}
