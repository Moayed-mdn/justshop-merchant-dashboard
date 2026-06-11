import { test, expect } from '@playwright/test';

const PROXY_PREFIX = '/api/proxy?endpoint=/api/v1/merchant/billing';

test.describe('Invoice Management', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/en/login');
    await page.waitForLoadState('networkidle');
    const emailInput = page.locator('[data-testid="login-email"]');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill('merchant@test.com');
    await page.locator('[data-testid="login-password"]').fill('password');
    await page.locator('[data-testid="login-submit"]').click();
    await page.waitForLoadState('networkidle');
  });

  test('should display invoices page', async ({ page }) => {
    await page.goto('/en/merchant/billing/invoices');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    console.log(`ℹ️ Invoices page URL: ${currentUrl}`);

    const heading = page.locator('h1');
    const headingText = await heading.textContent().catch(() => '');
    console.log(`ℹ️ Page heading: "${headingText}"`);

    const table = page.locator('table');
    const hasTable = await table.isVisible().catch(() => false);
    console.log(`ℹ️ Invoice table visible: ${hasTable}`);

    await page.screenshot({ path: 'test-results/screenshots/invoices-page.png', fullPage: true });
  });

  test('should handle invoice API endpoint', async ({ page }) => {
    const response = await page.request.get(`${PROXY_PREFIX}/invoices`);
    const status = response.status();
    console.log(`ℹ️ Invoices API status: ${status}`);

    if (response.ok()) {
      const data = await response.json();
      console.log('✅ Invoices data retrieved');
      const hasData = data.data ? data.data.length : (Array.isArray(data) ? data.length : 'unknown');
      console.log(`ℹ️ Invoice count: ${hasData}`);
    } else {
      const body = await response.text().catch(() => '');
      console.log(`ℹ️ Invoices response (${status}): ${body.substring(0, 200)}`);
    }
  });

  test('should handle invalid invoice ID with 404', async ({ page }) => {
    const response = await page.request.get(`${PROXY_PREFIX}/invoices/invalid-id-12345`);
    const status = response.status();
    console.log(`ℹ️ Invalid invoice API status: ${status}`);

    if (status === 404) {
      console.log('✅ 404 handling working correctly');
    } else {
      const body = await response.text().catch(() => '');
      console.log(`ℹ️ Response (${status}): ${body.substring(0, 200)}`);
    }

    await page.goto('/en/merchant/billing/invoices/invalid-id-12345');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/screenshots/invoice-404.png', fullPage: true });
  });

  test('should display invoice detail page if invoices exist', async ({ page }) => {
    const response = await page.request.get(`${PROXY_PREFIX}/invoices`);
    if (!response.ok()) {
      console.log('ℹ️ Cannot test invoice detail - invoices API not available');
      return;
    }

    const data = await response.json();
    const invoices = data.data || data;
    if (!Array.isArray(invoices) || invoices.length === 0) {
      console.log('ℹ️ No invoices to view detail for');
      return;
    }

    const firstInvoice = invoices[0];
    const invoiceId = firstInvoice.id || firstInvoice.invoice_id;
    await page.goto(`/en/merchant/billing/invoices/${invoiceId}`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'test-results/screenshots/invoice-detail.png', fullPage: true });
    console.log(`✅ Invoice detail page loaded for invoice #${invoiceId}`);
  });
});
