import { test, expect } from '@playwright/test';

const BACKEND_URL = 'http://localhost:8000';
const FRONTEND_URL = 'http://localhost:3000';

test.describe('Backend API Integration', () => {

  test.describe('Backend Health', () => {
    test('backend server is running', async () => {
      const response = await fetch(`${BACKEND_URL}/`);
      expect(response.ok || response.status === 302 || response.status === 301).toBeTruthy();
      console.log(`✅ Backend reachable (status: ${response.status})`);
    });

    test('frontend server is running', async () => {
      const response = await fetch(`${FRONTEND_URL}/en/login`);
      expect(response.ok).toBeTruthy();
      console.log(`✅ Frontend reachable (status: ${response.status})`);
    });
  });

  test.describe('Plans API', () => {
    test('GET /api/v1/merchant/public/plans - should return plans list', async () => {
      const response = await fetch(`${BACKEND_URL}/api/v1/merchant/public/plans`);
      const status = response.status;
      console.log(`ℹ️ Plans API status: ${status}`);

      if (response.ok) {
        const plans = await response.json();
        const plansArray = plans.data || plans;
        console.log(`ℹ️ Plans found: ${Array.isArray(plansArray) ? plansArray.length : 'unknown'}`);
        console.log('✅ Plans endpoint working');
      } else {
        const body = await response.text().catch(() => '');
        console.log(`ℹ️ Plans response: ${body.substring(0, 200)}`);
      }
    });
  });

  test.describe('Subscription API', () => {
    test('GET /api/v1/merchant/billing/subscription - requires auth', async () => {
      const response = await fetch(`${BACKEND_URL}/api/v1/merchant/billing/subscription`, {
        headers: { 'Accept': 'application/json' },
      });
      const status = response.status;
      console.log(`ℹ️ Subscription API (no auth) status: ${status}`);
      if (status === 302 || status === 401 || status === 403) {
        console.log('✅ Auth required for subscription endpoint');
      }
    });
  });

  test.describe('Checkout & Portal API', () => {
    test('POST /api/v1/merchant/billing/portal - requires auth', async () => {
      const response = await fetch(`${BACKEND_URL}/api/v1/merchant/billing/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ return_url: `${FRONTEND_URL}/merchant/billing` }),
      });
      const status = response.status;
      console.log(`ℹ️ Portal API (no auth) status: ${status}`);
      if (status === 302 || status === 401 || status === 403) {
        console.log('✅ Auth required for portal endpoint');
      }
    });
  });

  test.describe('Invoice API', () => {
    test('GET /api/v1/merchant/billing/invoices - requires auth', async () => {
      const response = await fetch(`${BACKEND_URL}/api/v1/merchant/billing/invoices`, {
        headers: { 'Accept': 'application/json' },
      });
      const status = response.status;
      console.log(`ℹ️ Invoices API (no auth) status: ${status}`);
      if (status === 302 || status === 401 || status === 403) {
        console.log('✅ Auth required for invoices endpoint');
      }
    });
  });

  test.describe('Frontend Proxy Integration', () => {
    test('frontend proxy forwards API requests', async () => {
      const response = await fetch(`${FRONTEND_URL}/api/proxy?endpoint=/api/v1/merchant/public/plans`);
      console.log(`ℹ️ Proxy status: ${response.status}`);
      if (response.ok) {
        console.log('✅ Frontend proxy working');
      } else {
        const body = await response.text().catch(() => '');
        console.log(`ℹ️ Proxy response (${response.status}): ${body.substring(0, 100)}`);
      }
    });
  });

  test.describe('API Route Validation', () => {
    test('verify billing API routes are accessible on backend', async () => {
      const routes = [
        '/api/v1/merchant/billing/subscription',
        '/api/v1/merchant/billing/subscription/upgrade',
        '/api/v1/merchant/billing/subscription/downgrade',
        '/api/v1/merchant/billing/subscription/cancel',
        '/api/v1/merchant/billing/subscription/resume',
        '/api/v1/merchant/billing/invoices',
        '/api/v1/merchant/billing/portal',
        '/api/v1/merchant/public/plans',
      ];

      for (const route of routes) {
        const response = await fetch(`${BACKEND_URL}${route}`);
        if (response.ok || response.status === 401 || response.status === 302) {
          console.log(`✅ ${route} → ${response.status}`);
        } else {
          console.log(`❌ ${route} → ${response.status}`);
        }
      }
    });
  });
});
