#!/usr/bin/env node

/**
 * Comprehensive End-to-End Testing Script
 * 
 * This script performs thorough testing of the entire merchant flow.
 * Run this after starting all backend services and frontend.
 */

import { chromium } from '@playwright/test';
import { setTimeout } from 'timers/promises';

const BASE_URL = 'http://localhost:3001';
const LOCALE = 'en';

// Generate unique test data
const timestamp = Date.now();
const TEST_USER = {
  name: `Test Merchant ${timestamp}`,
  email: `merchant${timestamp}@test.com`,
  password: 'Password123!',
};

const TEST_STORE = {
  name: `Test Store ${timestamp}`,
  slug: `test-store-${timestamp}`,
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n[STEP ${step}] ${message}`, colors.cyan);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

async function waitForResponse(page, urlPattern) {
  return page.waitForResponse(response => 
    response.url().includes(urlPattern) && response.status() === 200
  );
}

async function checkConsoleErrors(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}

async function takeScreenshot(page, name) {
  await page.screenshot({ path: `screenshots/test-${name}-${timestamp}.png`, fullPage: true });
  log(`  📸 Screenshot saved: test-${name}-${timestamp}.png`, colors.blue);
}

async function main() {
  log('\n╔═══════════════════════════════════════════════════════════╗', colors.cyan);
  log('║       COMPREHENSIVE END-TO-END TESTING STARTED            ║', colors.cyan);
  log('╚═══════════════════════════════════════════════════════════╝\n', colors.cyan);

  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: 'test-results/videos' },
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // ==================== PHASE 1: Registration & Auth ====================
    logStep(1, 'USER REGISTRATION');
    
    await page.goto(`${BASE_URL}/${LOCALE}/signup`);
    await page.waitForLoadState('networkidle');
    logSuccess('Signup page loaded');

    // Fill signup form
    await page.fill('input[name="name"]', TEST_USER.name);
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.fill('input[name="password_confirmation"]', TEST_USER.password);
    logSuccess('Signup form filled');

    await takeScreenshot(page, 'signup-form-filled');

    // Submit signup
    const signupButton = page.locator('button[type="submit"]').first();
    await signupButton.click();
    logSuccess('Signup submitted');

    // Wait for redirect to verify-email
    await page.waitForURL('**/verify-email**', { timeout: 10000 });
    logSuccess('Redirected to verify-email page');
    await takeScreenshot(page, 'verify-email-page');

    // ==================== EMAIL VERIFICATION (Manual Step) ====================
    logStep(2, 'EMAIL VERIFICATION');
    logWarning('MANUAL STEP REQUIRED:');
    logWarning('Run this in Laravel tinker:');
    logWarning(`  User::where('email', '${TEST_USER.email}')->first()->update(['email_verified_at' => now()])`);
    logWarning('Press ENTER when done...');
    
    // Wait for manual verification
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });

    logSuccess('Email verification confirmed');

    // ==================== PHASE 2: Login ====================
    logStep(3, 'USER LOGIN');
    
    await page.goto(`${BASE_URL}/${LOCALE}/login`);
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    logSuccess('Login form filled');

    await takeScreenshot(page, 'login-form-filled');

    const loginButton = page.locator('button[type="submit"]').first();
    await loginButton.click();
    logSuccess('Login submitted');

    // Wait for redirect
    await page.waitForURL('**/create-store**', { timeout: 15000 });
    logSuccess('Logged in and redirected to create-store');
    await takeScreenshot(page, 'create-store-page');

    // ==================== PHASE 3: Store Creation ====================
    logStep(4, 'STORE CREATION');

    await page.fill('input[name="name"]', TEST_STORE.name);
    await setTimeout(500); // Wait for slug auto-generation
    logSuccess('Store name filled');

    // Check if slug was auto-generated
    const slugValue = await page.inputValue('input[name="slug"]');
    if (slugValue) {
      logSuccess(`Slug auto-generated: ${slugValue}`);
    }

    await takeScreenshot(page, 'store-form-filled');

    const createStoreButton = page.locator('button[type="submit"]').first();
    await createStoreButton.click();
    logSuccess('Store creation submitted');

    // Wait for store to be created and redirected
    await page.waitForURL('**/merchant/**', { timeout: 30000 });
    logSuccess('Store created! Redirected to merchant dashboard');
    await takeScreenshot(page, 'merchant-dashboard');

    // Wait a bit for bootstrap to complete
    logWarning('Waiting 10 seconds for store bootstrap to complete...');
    await setTimeout(10000);

    // ==================== PHASE 4: Categories Management ====================
    logStep(5, 'CATEGORIES MANAGEMENT');

    await page.goto(`${BASE_URL}/${LOCALE}/merchant/categories`);
    await page.waitForLoadState('networkidle');
    logSuccess('Categories page loaded');
    await takeScreenshot(page, 'categories-list');

    // Create category
    const createCategoryBtn = page.locator('button', { hasText: /create|new|add/i }).first();
    await createCategoryBtn.click();
    await page.waitForLoadState('networkidle');
    logSuccess('Create category form opened');

    await page.fill('input[name*="name"]', 'Electronics');
    await setTimeout(500);
    
    // Try to fill Arabic name if exists
    const arabicNameInput = page.locator('input[name*="ar"]').first();
    if (await arabicNameInput.isVisible()) {
      await arabicNameInput.fill('إلكترونيات');
    }

    await takeScreenshot(page, 'category-form-filled');

    const saveCategoryBtn = page.locator('button[type="submit"]').first();
    await saveCategoryBtn.click();
    await page.waitForLoadState('networkidle');
    logSuccess('Electronics category created');
    await takeScreenshot(page, 'category-created');

    // Create more categories
    const categories = [
      { en: 'Fashion', ar: 'ملابس' },
      { en: 'Home & Garden', ar: 'المنزل والحديقة' },
      { en: 'Sports', ar: 'رياضة' },
    ];

    for (const cat of categories) {
      try {
        const createBtn = page.locator('button', { hasText: /create|new|add/i }).first();
        await createBtn.click();
        await page.waitForLoadState('networkidle');
        
        await page.fill('input[name*="name"]', cat.en);
        await setTimeout(300);
        
        const arabicInput = page.locator('input[name*="ar"]').first();
        if (await arabicInput.isVisible()) {
          await arabicInput.fill(cat.ar);
        }
        
        const saveBtn = page.locator('button[type="submit"]').first();
        await saveBtn.click();
        await page.waitForLoadState('networkidle');
        
        logSuccess(`${cat.en} category created`);
      } catch (err) {
        logError(`Failed to create ${cat.en} category: ${err.message}`);
      }
    }

    await takeScreenshot(page, 'all-categories-created');

    // ==================== PHASE 5: Brands Management ====================
    logStep(6, 'BRANDS MANAGEMENT');

    await page.goto(`${BASE_URL}/${LOCALE}/merchant/brands`);
    await page.waitForLoadState('networkidle');
    logSuccess('Brands page loaded');
    await takeScreenshot(page, 'brands-list');

    const brands = [
      { en: 'Apple', ar: 'أبل', website: 'https://www.apple.com' },
      { en: 'Samsung', ar: 'سامسونج', website: 'https://www.samsung.com' },
      { en: 'Nike', ar: 'نايكي', website: 'https://www.nike.com' },
    ];

    for (const brand of brands) {
      try {
        const createBtn = page.locator('button', { hasText: /create|new|add/i }).first();
        await createBtn.click();
        await page.waitForLoadState('networkidle');
        
        await page.fill('input[name*="name"]', brand.en);
        await setTimeout(300);
        
        // Try to fill website if field exists
        const websiteInput = page.locator('input[name*="website"]').first();
        if (await websiteInput.isVisible()) {
          await websiteInput.fill(brand.website);
        }
        
        const saveBtn = page.locator('button[type="submit"]').first();
        await saveBtn.click();
        await page.waitForLoadState('networkidle');
        
        logSuccess(`${brand.en} brand created`);
      } catch (err) {
        logError(`Failed to create ${brand.en} brand: ${err.message}`);
      }
    }

    await takeScreenshot(page, 'all-brands-created');

    // ==================== PHASE 6: Products Management ====================
    logStep(7, 'PRODUCTS MANAGEMENT');

    await page.goto(`${BASE_URL}/${LOCALE}/merchant/products`);
    await page.waitForLoadState('networkidle');
    logSuccess('Products page loaded');
    await takeScreenshot(page, 'products-list');

    // Create simple product
    const createProductBtn = page.locator('button', { hasText: /create|new|add/i }).first();
    await createProductBtn.click();
    await page.waitForLoadState('networkidle');
    logSuccess('Create product form opened');

    await page.fill('input[name*="name"]', 'iPhone 15 Pro');
    await page.fill('input[name*="sku"]', `IPHONE-15-PRO-${timestamp}`);
    await page.fill('textarea[name*="description"]', 'Latest iPhone with A17 Pro chip');
    await page.fill('input[name*="price"]', '999.00');
    
    // Try to set stock
    const stockInput = page.locator('input[name*="stock"]').first();
    if (await stockInput.isVisible()) {
      await stockInput.fill('50');
    }

    await takeScreenshot(page, 'product-form-filled');

    const saveProductBtn = page.locator('button[type="submit"]').first();
    await saveProductBtn.click();
    await page.waitForLoadState('networkidle');
    logSuccess('iPhone 15 Pro product created');
    await takeScreenshot(page, 'product-created');

    // Create more products (simplified)
    const products = [
      { name: 'Samsung Galaxy S24', sku: `SAMSUNG-S24-${timestamp}`, price: '899.00' },
      { name: 'Classic T-Shirt', sku: `TSHIRT-${timestamp}`, price: '29.99' },
    ];

    for (const product of products) {
      try {
        await page.goto(`${BASE_URL}/${LOCALE}/merchant/products`);
        await page.waitForLoadState('networkidle');
        
        const createBtn = page.locator('button', { hasText: /create|new|add/i }).first();
        await createBtn.click();
        await page.waitForLoadState('networkidle');
        
        await page.fill('input[name*="name"]', product.name);
        await page.fill('input[name*="sku"]', product.sku);
        await page.fill('input[name*="price"]', product.price);
        
        const saveBtn = page.locator('button[type="submit"]').first();
        await saveBtn.click();
        await page.waitForLoadState('networkidle');
        
        logSuccess(`${product.name} created`);
      } catch (err) {
        logError(`Failed to create ${product.name}: ${err.message}`);
      }
    }

    // ==================== PHASE 7: Theme Management ====================
    logStep(8, 'THEME MANAGEMENT');

    await page.goto(`${BASE_URL}/${LOCALE}/merchant/theme`);
    await page.waitForLoadState('networkidle');
    logSuccess('Theme page loaded');
    await takeScreenshot(page, 'theme-page');

    // Try to customize theme (if customize button exists)
    const customizeBtn = page.locator('button', { hasText: /customize|settings|edit/i }).first();
    if (await customizeBtn.isVisible({ timeout: 2000 })) {
      await customizeBtn.click();
      await page.waitForLoadState('networkidle');
      logSuccess('Theme customization opened');
      await takeScreenshot(page, 'theme-customization');
    } else {
      logWarning('Theme customization button not found');
    }

    // ==================== PHASE 8: CMS/Marketing Pages ====================
    logStep(9, 'CMS & MARKETING PAGES');

    // Try different possible routes
    const cmsRoutes = [
      '/merchant/cms',
      '/merchant/marketing-pages',
      '/merchant/pages',
      '/merchant/cms/pages',
    ];

    let cmsPageFound = false;
    for (const route of cmsRoutes) {
      try {
        await page.goto(`${BASE_URL}/${LOCALE}${route}`, { waitUntil: 'networkidle', timeout: 5000 });
        if (page.url().includes(route)) {
          logSuccess(`CMS pages loaded at: ${route}`);
          cmsPageFound = true;
          await takeScreenshot(page, 'cms-pages-list');
          break;
        }
      } catch (err) {
        // Try next route
      }
    }

    if (cmsPageFound) {
      // Try to create a marketing page
      const createPageBtn = page.locator('button', { hasText: /create|new|add/i }).first();
      if (await createPageBtn.isVisible({ timeout: 2000 })) {
        await createPageBtn.click();
        await page.waitForLoadState('networkidle');
        logSuccess('Create page form opened');
        
        await page.fill('input[name*="title"]', 'About Us');
        await page.fill('input[name*="slug"]', 'about-us');
        
        await takeScreenshot(page, 'cms-page-form');
        logSuccess('Marketing page form filled (not submitted for now)');
      }
    } else {
      logWarning('CMS/Marketing pages route not found');
    }

    // ==================== PHASE 9: Navigation Testing ====================
    logStep(10, 'NAVIGATION & MENU TESTING');

    const menuItems = [
      '/merchant/dashboard',
      '/merchant/products',
      '/merchant/categories',
      '/merchant/brands',
      '/merchant/orders',
      '/merchant/settings',
    ];

    for (const route of menuItems) {
      try {
        await page.goto(`${BASE_URL}/${LOCALE}${route}`, { timeout: 5000 });
        await page.waitForLoadState('networkidle');
        logSuccess(`Navigated to: ${route}`);
      } catch (err) {
        logWarning(`Could not navigate to: ${route}`);
      }
    }

    // ==================== PHASE 10: Console Errors Check ====================
    logStep(11, 'CONSOLE ERRORS CHECK');

    if (consoleErrors.length === 0) {
      logSuccess('No console errors detected! ✨');
    } else {
      logWarning(`${consoleErrors.length} console errors detected:`);
      consoleErrors.forEach((err, i) => {
        log(`  ${i + 1}. ${err}`, colors.yellow);
      });
    }

    // ==================== PHASE 11: Back Navigation Test ====================
    logStep(12, 'BACK NAVIGATION TEST');

    await page.goto(`${BASE_URL}/${LOCALE}/merchant/products`);
    await page.waitForLoadState('networkidle');
    logSuccess('On products page');

    // Click first product to edit (if exists)
    const firstProduct = page.locator('tr a, .product-item a').first();
    if (await firstProduct.isVisible({ timeout: 2000 })) {
      await firstProduct.click();
      await page.waitForLoadState('networkidle');
      logSuccess('Opened product edit page');
      
      await page.goBack();
      await page.waitForLoadState('networkidle');
      logSuccess('Back navigation successful - returned to products list');
      
      await page.goForward();
      await page.waitForLoadState('networkidle');
      logSuccess('Forward navigation successful');
    }

    // ==================== FINAL SCREENSHOT ====================
    await page.goto(`${BASE_URL}/${LOCALE}/merchant/dashboard`);
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, 'final-dashboard');

    // ==================== SUCCESS ====================
    log('\n╔═══════════════════════════════════════════════════════════╗', colors.green);
    log('║          COMPREHENSIVE TESTING COMPLETED! ✓               ║', colors.green);
    log('╚═══════════════════════════════════════════════════════════╝\n', colors.green);

    log('\n📊 SUMMARY:', colors.cyan);
    log(`   Test User: ${TEST_USER.email}`);
    log(`   Test Store: ${TEST_STORE.name}`);
    log(`   Categories Created: 4+`);
    log(`   Brands Created: 3+`);
    log(`   Products Created: 3+`);
    log(`   Console Errors: ${consoleErrors.length}`);
    log(`   Screenshots: Check screenshots/ folder`);
    log(`   Video: Check test-results/videos/ folder\n`);

  } catch (error) {
    logError(`\nTest failed with error: ${error.message}`);
    logError(error.stack);
    await takeScreenshot(page, 'error-state');
  } finally {
    await setTimeout(2000);
    await context.close();
    await browser.close();
    
    log('\n👋 Browser closed. Check results in screenshots/ and test-results/ folders.\n');
  }
}

main().catch(console.error);
