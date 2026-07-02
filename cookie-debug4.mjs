#!/usr/bin/env node
import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const ctx = await b.newContext();
const p = await ctx.newPage();

// SPA login
await p.goto('http://localhost:3001/en/login', { waitUntil: 'networkidle', timeout: 30000 });
await p.waitForTimeout(500);
await p.locator('input[type="email"]').first().fill('merchant@test.com');
await p.locator('input[type="password"]').first().fill('password');
await p.locator('button[type="submit"]').first().click();
try { await p.waitForURL('**/en/merchant/dashboard', { timeout: 15000 }); } catch {}
await p.waitForTimeout(3000);

function showCookies(label, cookies) {
  console.log(`\n${label}:`);
  cookies.forEach(c => console.log(`  ${c.name}=${c.value.substring(0,40)}... domain=${c.domain}`));
}

showCookies('After SPA login', await ctx.cookies());

// First goto
console.log('\n--- First page.goto ---');
const r1 = await p.goto('http://localhost:3001/en/merchant/dashboard', { waitUntil: 'domcontentloaded', timeout: 15000 });
console.log('Status:', r1.status());
await p.waitForTimeout(3000);
showCookies('After goto #1', await ctx.cookies());

// Check the page state
const s1 = await p.evaluate(() => ({
  spinVisible: document.querySelector('.animate-spin')?.offsetParent !== null,
  preparing: document.body.innerText.includes('Preparing your session')
}));
console.log('State after #1:', JSON.stringify(s1));

// Second goto
console.log('\n--- Second page.goto ---');
const r2 = await p.goto('http://localhost:3001/en/merchant/dashboard', { waitUntil: 'domcontentloaded', timeout: 15000 });
console.log('Status:', r2.status());
await p.waitForTimeout(3000);
showCookies('After goto #2', await ctx.cookies());

const s2 = await p.evaluate(() => ({
  spinVisible: document.querySelector('.animate-spin')?.offsetParent !== null,
  preparing: document.body.innerText.includes('Preparing your session')
}));
console.log('State after #2:', JSON.stringify(s2));

// Try with brand new context using the last cookie value
console.log('\n--- Fresh context with last cookie value ---');
const ctx2 = await b.newContext();
const p2 = await ctx2.newPage();
const sessCookie = (await ctx.cookies()).find(c => c.name === 'ecommerce_session');
if (sessCookie) {
  await ctx2.addCookies([{
    name: 'ecommerce_session',
    value: sessCookie.value,
    domain: 'localhost',
    path: '/'
  }]);
}
showCookies('New context cookie', await ctx2.cookies());
await p2.goto('http://localhost:3001/en/merchant/dashboard', { waitUntil: 'domcontentloaded', timeout: 15000 });
await p2.waitForTimeout(3000);
const s3 = await p2.evaluate(() => ({
  spinVisible: document.querySelector('.animate-spin')?.offsetParent !== null,
  preparing: document.body.innerText.includes('Preparing your session'),
  dashboard: document.body.innerText.includes('Dashboard')
}));
console.log('Fresh context state:', JSON.stringify(s3));

await b.close();
