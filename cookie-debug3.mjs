#!/usr/bin/env node
import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const ctx = await b.newContext();
const p = await ctx.newPage();

// SPA login only, no sidebar clicks
console.log('=== LOGIN ===');
await p.goto('http://localhost:3001/en/login', { waitUntil: 'networkidle', timeout: 30000 });
await p.waitForTimeout(500);
await p.locator('input[type="email"]').first().fill('merchant@test.com');
await p.locator('input[type="password"]').first().fill('password');
await p.locator('button[type="submit"]').first().click();
try { await p.waitForURL('**/en/merchant/dashboard', { timeout: 15000 }); } catch {}
await p.waitForTimeout(3000);

const c = await ctx.cookies();
console.log('Cookies:', c.length);
c.forEach(x => console.log('  ' + x.name + '=' + x.value.substring(0,20)));

const s1 = await p.evaluate(() => ({
  spin: !!document.querySelector('.animate-spin'),
  preparing: document.body.innerText.includes('Preparing your session'),
  dashboard: document.body.innerText.includes('Dashboard')
}));
console.log('After SPA login:', JSON.stringify(s1));

// Now try page.goto to dashboard (should be same URL)
console.log('\n=== PAGE.GOTO ===');
const resp = await p.goto('http://localhost:3001/en/merchant/dashboard', { waitUntil: 'domcontentloaded', timeout: 15000 });
console.log('Status:', resp.status());

await p.waitForTimeout(3000);
const s2 = await p.evaluate(() => ({
  spin: !!document.querySelector('.animate-spin'),
  preparing: document.body.innerText.includes('Preparing your session'),
  dashboard: document.body.innerText.includes('Dashboard')
}));
console.log('After page.goto:', JSON.stringify(s2));

// Try one more time
console.log('\n=== PAGE.GOTO #2 ===');
await p.goto('http://localhost:3001/en/merchant/dashboard', { waitUntil: 'domcontentloaded', timeout: 15000 });
await p.waitForTimeout(3000);
const s3 = await p.evaluate(() => {
  const btn = document.querySelector('.animate-spin');
  return {
    spin: !!btn,
    spinVisible: btn ? btn.offsetParent !== null : false,
    preparing: document.body.innerText.includes('Preparing your session'),
    dashboard: document.body.innerText.includes('Dashboard'),
    products: document.body.innerText.includes('Products')
  };
});
console.log('After goto #2:', JSON.stringify(s3));

await b.close();
