import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '@config/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactFormPage } from '@pages/contact.page';
import { ServicesPage } from '@pages/services.page';
import { AboutPage } from '@pages/about.page';
import { MapEnginePage } from '@pages/mapengine.page';
import { WorkflowsPage } from '@pages/workflows.page';
import { PowerSyncPage } from '@pages/powersync.page';
import { BlogPage } from '@pages/blog.page';
import { PartnersPage } from '@pages/partners.page';

export interface Fixtures {
  siteConfig: SiteConfig;
  homePage: HomePage;
  navigationPage: NavigationPage;
  contactPage: ContactFormPage;
  servicesPage: ServicesPage;
  aboutPage: AboutPage;
  mapEnginePage: MapEnginePage;
  workflowsPage: WorkflowsPage;
  powerSyncPage: PowerSyncPage;
  blogPage: BlogPage;
  partnersPage: PartnersPage;
}

export const test = base.extend<Fixtures>({
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  navigationPage: async ({ page, siteConfig }, use) => {
    await use(new NavigationPage(page, siteConfig));
  },

  contactPage: async ({ page, siteConfig }, use) => {
    await use(new ContactFormPage(page, siteConfig));
  },

  servicesPage: async ({ page, siteConfig }, use) => {
    await use(new ServicesPage(page, siteConfig));
  },

  aboutPage: async ({ page, siteConfig }, use) => {
    await use(new AboutPage(page, siteConfig));
  },

  mapEnginePage: async ({ page, siteConfig }, use) => {
    await use(new MapEnginePage(page, siteConfig));
  },

  workflowsPage: async ({ page, siteConfig }, use) => {
    await use(new WorkflowsPage(page, siteConfig));
  },

  powerSyncPage: async ({ page, siteConfig }, use) => {
    await use(new PowerSyncPage(page, siteConfig));
  },

  blogPage: async ({ page, siteConfig }, use) => {
    await use(new BlogPage(page, siteConfig));
  },

  partnersPage: async ({ page, siteConfig }, use) => {
    await use(new PartnersPage(page, siteConfig));
  },
});

export { expect };
