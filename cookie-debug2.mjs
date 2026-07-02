#!/usr/bin/env node
import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ baseURL: 'http://localhost:3001' });
const p = await ctx.newPage();

// Monitor cookie header in requests
ctx.on('request', req => {
  const url = req.url();
  if (url.includes('localhost:3001') && !url.includes('.js') && !url.includes('.woff')) {
    const h = req.headers();
    console.log(' >>>', req.method(), url.split('?')[0].slice(0,80), h['cookie'] ? 'COOKIE:' + h['cookie'].substring(0,80) : 'NO-COOKIE');
  }
});

// SPA login
await p.goto('/en/login', { waitUntil: 'networkidle', timeout: 30000 });
await p.waitForTimeout(500);
await p.locator('input[type="email"]').first().fill('merchant@test.com');
await p.locator('input[type="password"]').first().fill('password');
await p.locator('button[type="submit"]').first().click();
try { await p.waitForURL('**/en/merchant/dashboard', { timeout: 15000 }); } catch {}
await p.waitForTimeout(3000);

const afterLogin = await ctx.cookies();
console.log('\n=== Cookies after login ===');
afterLogin.forEach(c => console.log(`  ${c.name} domain=${c.domain} path=${c.path}`));

// Try page.goto() with baseURL
console.log('\n=== page.goto to dashboard ===');
await p.goto('/en/merchant/dashboard', { waitUntil: 'domcontentloaded', timeout: 15000 });
await p.waitForTimeout(5000);

// Check visible state
const visible = await p.locator('.animate-spin').first().isVisible().catch(() => false);
const data = await p.locator('text=Dashboard').first().isVisible().catch(() => false);
console.log('Spinner visible:', visible);
console.log('Dashboard content visible:', data);

// Try adding cookies to specific URL
console.log('\n=== Try with addCookies for port 3001 ===');
await ctx.addCookies([{
  name: 'ecommerce_session',
  value: afterLogin.find(c => c.name === 'ecommerce_session')?.value || '',
  domain: 'localhost',
  path: '/',
  httpOnly: true,
  sameSite: 'Lax',
}]);

await p.goto('/en/merchant/dashboard', { waitUntil: 'domcontentloaded', timeout: 15000 });
await p.waitForTimeout(5000);

const visible2 = await p.locator('.animate-spin').first().isVisible().catch(() => false);
console.log('After addCookies - Spinner visible:', visible2);

await b.close();
