import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const ctx = await b.newContext();
const p = await ctx.newPage();

// Listen for all console messages
p.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()));

// Listen for all requests
p.on('request', req => {
  if (req.url().includes('/api/') || req.url().includes('me')) console.log('REQ:', req.method(), req.url());
});

p.on('response', resp => {
  if (resp.url().includes('/api/') || resp.url().includes('me')) console.log('RESP:', resp.status(), resp.url().slice(0,100));
});

// Login via backend
const api = p.request;
await api.get('http://localhost:8000/api/sanctum/csrf-cookie');
await p.waitForTimeout(500);
const csrfCookies = await ctx.cookies();
const xsrf = decodeURIComponent(csrfCookies.find(c=>c.name==='XSRF-TOKEN')?.value || '');
await api.post('http://localhost:8000/api/v1/merchant/auth/login', {
  headers: { 'Content-Type':'application/json', 'X-XSRF-TOKEN':xsrf },
  data: { email:'merchant@test.com', password:'password' }
});

// Check cookies
console.log('\nCookies before nav:');
(await ctx.cookies()).forEach(c => console.log('  ' + c.name + '=' + c.value.slice(0,20)));

// Navigate
console.log('\nNavigating...');
await p.goto('http://localhost:3001/en/merchant/dashboard', { waitUntil:'networkidle', timeout: 30000 });
await p.waitForTimeout(2000);

console.log('\nURL:', p.url());
const body = await p.textContent('body');
console.log('Preparing?', body.includes('Preparing your session'));
console.log('Dashboard text?', body.includes('Dashboard'));
console.log('Products link?', body.includes('Products'));
console.log('Session restored?', body.includes('session'));
console.log('Bootstrap?', body.includes('Bootstrap'));

// Check if the loader is visible
const preparingSpans = p.locator('text=Preparing your session');
console.log('Preparing count:', await preparingSpans.count());

// Screenshot for debugging
await p.screenshot({ path: '/tmp/opencode/dashboard-debug.png', fullPage: true });
console.log('Screenshot saved');

await b.close();
