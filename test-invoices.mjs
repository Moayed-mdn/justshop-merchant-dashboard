import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ locale: 'en' });
const page = await context.newPage();

page.on('console', msg => {
  if (msg.type() === 'error') console.log(`[BROWSER ERROR] ${msg.text()}`);
});
page.on('response', response => {
  if (response.status() >= 400) console.log(`[API ERROR] ${response.status()} ${response.url().substring(0, 120)}`);
});

const BASE = 'http://localhost:3000';

try {
  // Login
  await page.goto(`${BASE}/en/login`, { waitUntil: 'networkidle' });
  const emailInput = page.locator('[data-testid="login-email"]');
  await emailInput.fill('merchant@test.com');
  await page.locator('[data-testid="login-password"]').fill('password');
  await page.locator('[data-testid="login-submit"]').click();
  await page.waitForTimeout(3000);

  // Go to invoices page
  console.log('=== Invoices Page ===');
  await page.goto(`${BASE}/en/merchant/billing/invoices`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log(`URL: ${page.url()}`);
  const text = await page.locator('body').innerText();
  console.log(text.substring(0, 1000));

  if (text.includes('invoice') || text.includes('Invoice')) {
    console.log('\n✓ Invoice section found');
  }
  if (!text.includes('No invoices')) {
    console.log('✓ Invoices are displayed');
  }

  // Go to billing page and try View Invoices link
  console.log('\n=== Billing Page - View Invoices ===');
  await page.goto(`${BASE}/en/merchant/billing`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const viewInvoices = page.locator('a:has-text("View Invoices")');
  if (await viewInvoices.isVisible().catch(() => false)) {
    await viewInvoices.click();
    await page.waitForTimeout(2000);
    console.log(`After click URL: ${page.url()}`);
  }

  // Try Billing Portal button
  console.log('\n=== Billing Portal Button ===');
  const portalBtn = page.locator('button:has-text("Billing Portal")');
  if (await portalBtn.isVisible().catch(() => false)) {
    console.log('✓ Billing Portal button is visible');
  }

  console.log('\n=== DONE ===');
} catch (err) {
  console.error(`ERROR: ${err.message}`);
} finally {
  await browser.close();
}
