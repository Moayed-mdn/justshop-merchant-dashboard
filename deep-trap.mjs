#!/usr/bin/env node
// Deep Trap v4 — SPA navigation only (no page.goto for authenticated routes)
// ==========================================================================
import { chromium } from 'playwright';
const BASE = process.env.BASE_URL || 'http://localhost:3001';
const LOGIN = process.env.LOGIN_EMAIL || 'merchant@test.com';
const PASSWORD = process.env.LOGIN_PASSWORD || 'password';
const SLOW = parseInt(process.env.SLOW_MO || '0', 10);
const HEADLESS = process.env.HEADLESS !== 'false';

const log = [];
let step = 0;
let browser, page;

async function screenshot(name) {
  try {
    await page.screenshot({ path: `/tmp/dt-${String(step++).padStart(2, '0')}-${name}.png`, fullPage: true });
  } catch { /* nop */ }
}

async function clickSidebar(label) {
  // Click sidebar link by menu label text
  const link = page.locator(`a:has-text("${label}")`).first();
  if (await link.isVisible().catch(() => false)) {
    await link.click();
    await page.waitForTimeout(2000);
    try {
      await page.waitForFunction(() => {
        const b = document.body.textContent || '';
        return !b.includes('Preparing your session') || b.length > 5000;
      }, { timeout: 15000 });
    } catch { /* nop */ }
    await page.waitForTimeout(500);
  }
}

async function checkPage(label) {
  await page.waitForTimeout(1000);
  const title = await page.title().catch(() => 'N/A');
  const body = await page.textContent('body').catch(() => '');
  const clean = body.replace(/\s+/g, ' ').trim();
  // Check if "Preparing your session" is VISIBLE, not just in DOM
  const visible = await page.locator('text=Preparing your session').first().isVisible().catch(() => false);
  const ready = !visible && clean.length > 300;
  console.log(`  ${ready ? '✅' : '⚠️'} ${title} (${clean.length} chars) → ${page.url()}`);
  if (visible) log.push('[STUCK] Preparing your session still visible: ' + label);
  await screenshot(`sidebar-${label.replace(/[^a-z0-9]/gi, '-')}`);
}

async function main() {
  browser = await chromium.launch({ headless: HEADLESS, slowMo: SLOW });
  const ctx = await browser.newContext();
  page = await ctx.newPage();

  // Log console errors
  page.on('console', msg => {
    if (msg.type() === 'error') log.push(`[CONSOLE ERROR] ${msg.text()}`);
  });

  // Log HTTP errors
  page.on('response', resp => {
    const status = resp.status();
    if (status >= 400) log.push(`[HTTP ${status}] ${resp.url()}`);
  });

  // ═══════════════════════════════════════
  // LOGIN (SPA)
  // ═══════════════════════════════════════
  console.log('=== LOGIN ===');
  await page.goto(`${BASE}/en/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await screenshot('login-page');

  // Fill login form
  const emailInput = page.locator('input[type="email"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  const submitBtn = page.locator('button[type="submit"]').first();
  await emailInput.fill(LOGIN);
  await passwordInput.fill(PASSWORD);
  await submitBtn.click();

  // Wait for navigation to dashboard
  try {
    await page.waitForURL('**/en/merchant/dashboard', { timeout: 15000 });
    await page.waitForTimeout(2000);
    await checkPage('dashboard-after-login');
  } catch {
    log.push('[LOGIN] Timed out waiting for dashboard');
    console.log('  ⚠️ Login may have failed');
    await screenshot('login-fail');
  }

  // ═══════════════════════════════════════
  // SIDEBAR NAVIGATION
  // ═══════════════════════════════════════
  const sidebarLinks = [
    'Dashboard', 'Products', 'Orders', 'Categories',
    'Brands', 'Tags', 'Customers', 'Shipping'
  ];

  for (const label of sidebarLinks) {
    console.log(`\n=== SIDEBAR → ${label} ===`);
    await clickSidebar(label);
    await checkPage(label);
  }

  // ═══════════════════════════════════════
  // THEME → SYSTEM TEMPLATES → EDITOR
  // ═══════════════════════════════════════
  console.log('\n=== THEME → SYSTEM TEMPLATES → EDITOR ===');
  await clickSidebar('Themes');
  await checkPage('themes-overview');

  // Click "Templates" on first active theme card
  const tmplBtn = page.locator('button, a').filter({ hasText: 'Templates' }).first();
  if (await tmplBtn.isVisible().catch(() => false)) {
    await tmplBtn.click();
    await page.waitForTimeout(3000);
    await checkPage('system-templates');
    await screenshot('system-templates');

    // Try clicking first template in the list
    const tmplLink = page.locator('a[href*="/system-templates/"]').first();
    if (await tmplLink.isVisible().catch(() => false)) {
      await tmplLink.click();
      await page.waitForTimeout(3000);
      await checkPage('template-editor');
      await screenshot('template-editor');

      const editorBody = await page.textContent('body').catch(() => '');
      if (editorBody.includes('Product Filters')) {
        console.log('  ✅ Product Filters section visible in editor');
      } else if (editorBody.includes('search_filters') || editorBody.includes('Available Filters')) {
        console.log('  ✅ Filter settings visible');
      } else {
        log.push('[TEMPLATE] Product Filters section not found in editor');
      }
    }
  } else {
    log.push('[THEME] Templates button not found');
  }

  // ═══════════════════════════════════════
  // SETTINGS (SPA nav via sidebar)
  // ═══════════════════════════════════════
  // Settings is a submenu — we need to find it in the sidebar
  console.log('\n=== SETTINGS ===');
  const settingsLink = page.locator('a').filter({ hasText: /^Settings$/ }).first();
  if (await settingsLink.isVisible().catch(() => false)) {
    await settingsLink.click();
    await page.waitForTimeout(2000);
    await checkPage('settings');
    await screenshot('settings');
  } else {
    log.push('[SETTINGS] Settings link not found in sidebar');
  }

  // ═══════════════════════════════════════
  // BILLING
  // ═══════════════════════════════════════
  console.log('\n=== BILLING ===');
  const billingLink = page.locator('a').filter({ hasText: /^Billing$/ }).first();
  if (await billingLink.isVisible().catch(() => false)) {
    await billingLink.click();
    await page.waitForTimeout(2000);
    await checkPage('billing');
    await screenshot('billing');
  } else {
    log.push('[BILLING] Billing link not found');
  }

  // ═══════════════════════════════════════
  // STOREFRONT (separate domain, page.goto is fine)
  // ═══════════════════════════════════════
  console.log('\n=== STOREFRONT ===');
  for (const sf of ['/en/shop', '/en/search']) {
    console.log(`\n--- ${sf} ---`);
    await page.goto(`${BASE}${sf}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    await screenshot(sf === '/en/shop' ? 'storefront-shop' : 'storefront-search');

    const body = await page.textContent('body').catch(() => '');
    const hasFilters = /(Category|Price|Filter|Manufacture)/i.test(body);
    console.log(`  ${hasFilters ? '✅ Filters visible' : 'ℹ️  No filters'}`);
  }

  // ═══════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════
  console.log('\n═══════════════════════════════════════');
  console.log('DEEP TRAP RESULTS');
  console.log('═══════════════════════════════════════');

  const httpErrors = [...new Set(log.filter(l => l.startsWith('[HTTP')).map(l => l))];
  const consoleErrors = [...new Set(log.filter(l => l.startsWith('[CONSOLE ERROR]')).map(l => l))];
  const stuckErrors = [...new Set(log.filter(l => l.startsWith('[STUCK]')).map(l => l))];

  console.log(`HTTP 4xx/5xx:   ${httpErrors.length}`);
  console.log(`Console errors: ${consoleErrors.length}`);
  console.log(`Stuck pages:    ${stuckErrors.length}`);

  if (httpErrors.length) {
    console.log('\n🔴 HTTP:');
    for (const e of httpErrors) console.log(`  ${e}`);
  }
  if (consoleErrors.length) {
    console.log('\n🔴 CONSOLE:');
    for (const e of consoleErrors) console.log(`  ${e}`);
  }
  if (stuckErrors.length) {
    console.log('\n⚠️  STUCK:');
    for (const e of stuckErrors) console.log(`  ${e}`);
  }
  if (!httpErrors.length && !consoleErrors.length && !stuckErrors.length) {
    console.log('\n✅ All pages clean');
  }

  console.log(`\nScreenshots: /tmp/dt-*.png (${step} files)`);
  await browser.close();
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
