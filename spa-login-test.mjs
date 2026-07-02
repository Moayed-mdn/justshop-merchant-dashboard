#!/usr/bin/env node
import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const ctx = await b.newContext();
const p = await ctx.newPage();

// 1. Login VIA SPA FORM (not API), like a real user
console.log('=== SPA LOGIN ===');
await p.goto('http://localhost:3001/en/login', { waitUntil: 'networkidle', timeout: 30000 });
await p.waitForTimeout(1000);

// Check cookies BEFORE login
const preCookies = await ctx.cookies();
console.log(`Cookies before login: ${preCookies.length}`);
preCookies.forEach(c => console.log(`  ${c.name} domain=${c.domain} path=${c.path} value=${c.value.substring(0,20)}`));

// Fill and submit login form
await p.locator('input[type="email"]').first().fill('merchant@test.com');
await p.locator('input[type="password"]').first().fill('password');
await p.locator('button[type="submit"]').first().click();

// Wait for dashboard
try {
  await p.waitForURL('**/en/merchant/dashboard', { timeout: 15000 });
  console.log('URL after login:', p.url());
} catch {
  console.log('Failed to navigate to dashboard');
  await p.waitForTimeout(2000);
  console.log('URL after login attempt:', p.url());
}

await p.waitForTimeout(3000);

// Check cookies AFTER login
const postCookies = await ctx.cookies();
console.log(`\nCookies after login: ${postCookies.length}`);
postCookies.forEach(c => console.log(`  ${c.name} domain=${c.domain} path=${c.path} httpOnly=${c.httpOnly} secure=${c.secure} sameSite=${c.sameSite} value=${c.value.substring(0,20)}`));

// 2. Try page.goto to the dashboard
console.log('\n=== PAGE.GOTO TEST ===');
const resp = await p.goto('http://localhost:3001/en/merchant/dashboard', { waitUntil: 'domcontentloaded', timeout: 15000 });
console.log('Navigation response status:', resp.status());

// Check what cookies were sent 
const pCookies = await ctx.cookies();
console.log(`\nCookies after goto: ${pCookies.length}`);
pCookies.forEach(c => console.log(`  ${c.name} domain=${c.domain}`));

// Check if loading
const visible = await p.locator('text=Preparing your session').first().isVisible().catch(() => false);
console.log('Preparing your session visible:', visible);

await b.close();
