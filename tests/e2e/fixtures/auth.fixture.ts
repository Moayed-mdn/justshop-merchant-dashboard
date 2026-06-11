import { test as base, type Page } from '@playwright/test';

type AuthFixture = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixture>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/en/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[name="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('merchant@test.com');
      await page.locator('input[name="password"]').fill('password');
      await page.locator('button[type="submit"]').click();
      await page.waitForLoadState('networkidle');
    }

    await use(page);
  },
});

export { expect } from '@playwright/test';
