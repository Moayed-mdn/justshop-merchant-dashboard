# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: commerce/checkout.spec.ts >> checkout with invalid payment card shows error and allows retry
- Location: tests/e2e/commerce/checkout.spec.ts:53:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('product-101')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - heading "404" [level=1] [ref=e4]
    - heading "This page could not be found." [level=2] [ref=e6]
  - button "Open Next.js Dev Tools" [ref=e12] [cursor=pointer]:
    - img [ref=e13]
  - alert [ref=e16]
```

# Test source

```ts
  1   | /**
  2   |  * Flow: Commerce Checkout
  3   |  * Layer: Playwright E2E — Layer 2
  4   |  * Purpose: Protects complete purchase flow from cart to order confirmation including payment processing and error recovery
  5   |  * Belongs to: tests/e2e/commerce/checkout.spec.ts
  6   |  */
  7   | 
  8   | import { expect, test } from '@playwright/test';
  9   | import { login, resetMockBackend } from '../utils/mock-backend';
  10  | 
  11  | test.beforeEach(async ({ request }) => {
  12  |   await resetMockBackend(request);
  13  | });
  14  | 
  15  | test('successful checkout completes purchase and shows confirmation', async ({ page }) => {
  16  |   await login(page, 'merchant@example.com');
  17  |   await expect(page).toHaveURL(/\/en\/merchant\/dashboard$/);
  18  | 
  19  |   // Navigate to storefront (simulating customer view)
  20  |   await page.goto('/en/stores/101/shop');
  21  | 
  22  |   // Add product to cart
  23  |   await page.getByTestId('product-101').click();
  24  |   await page.getByTestId('add-to-cart-button').click();
  25  |   await expect(page.getByTestId('cart-count')).toContainText('1');
  26  | 
  27  |   // Proceed to checkout
  28  |   await page.getByTestId('cart-icon').click();
  29  |   await page.getByTestId('proceed-to-checkout').click();
  30  | 
  31  |   // Fill shipping information
  32  |   await page.getByTestId('checkout-name').fill('John Doe');
  33  |   await page.getByTestId('checkout-email').fill('customer@example.com');
  34  |   await page.getByTestId('checkout-address').fill('123 Main St');
  35  |   await page.getByTestId('checkout-city').fill('New York');
  36  |   await page.getByTestId('checkout-postal-code').fill('10001');
  37  | 
  38  |   // Fill payment information
  39  |   await page.getByTestId('checkout-card-number').fill('4242424242424242');
  40  |   await page.getByTestId('checkout-card-expiry').fill('12/25');
  41  |   await page.getByTestId('checkout-card-cvc').fill('123');
  42  | 
  43  |   // Complete purchase
  44  |   await page.getByTestId('checkout-submit').click();
  45  | 
  46  |   // Should show order confirmation
  47  |   await expect(page).toHaveURL(/\/en\/stores\/101\/order\/\d+\/confirmation$/, { timeout: 15000 });
  48  |   await expect(page.getByRole('heading', { name: 'Order Confirmed' })).toBeVisible();
  49  |   await expect(page.getByTestId('order-number')).toBeVisible();
  50  |   await expect(page.getByText('Thank you for your purchase')).toBeVisible();
  51  | });
  52  | 
  53  | test('checkout with invalid payment card shows error and allows retry', async ({ page }) => {
  54  |   await login(page, 'merchant@example.com');
  55  |   await page.goto('/en/stores/101/shop');
  56  | 
> 57  |   await page.getByTestId('product-101').click();
      |                                         ^ Error: locator.click: Test timeout of 30000ms exceeded.
  58  |   await page.getByTestId('add-to-cart-button').click();
  59  |   await page.getByTestId('cart-icon').click();
  60  |   await page.getByTestId('proceed-to-checkout').click();
  61  | 
  62  |   // Fill valid shipping information
  63  |   await page.getByTestId('checkout-name').fill('John Doe');
  64  |   await page.getByTestId('checkout-email').fill('customer@example.com');
  65  |   await page.getByTestId('checkout-address').fill('123 Main St');
  66  |   await page.getByTestId('checkout-city').fill('New York');
  67  |   await page.getByTestId('checkout-postal-code').fill('10001');
  68  | 
  69  |   // Use invalid test card number
  70  |   await page.getByTestId('checkout-card-number').fill('4000000000000002');
  71  |   await page.getByTestId('checkout-card-expiry').fill('12/25');
  72  |   await page.getByTestId('checkout-card-cvc').fill('123');
  73  | 
  74  |   await page.getByTestId('checkout-submit').click();
  75  | 
  76  |   // Should show payment error
  77  |   await expect(page.getByTestId('checkout-error')).toBeVisible();
  78  |   await expect(page.getByTestId('checkout-error')).toContainText('payment declined');
  79  | 
  80  |   // Should remain on checkout page for retry
  81  |   await expect(page).toHaveURL(/\/en\/stores\/101\/checkout$/);
  82  |   await expect(page.getByTestId('checkout-submit')).toBeVisible();
  83  | });
  84  | 
  85  | test('checkout with insufficient inventory shows error', async ({ page }) => {
  86  |   await login(page, 'merchant@example.com');
  87  |   await page.goto('/en/stores/101/shop');
  88  | 
  89  |   // Intercept checkout submission to simulate out-of-stock
  90  |   await page.route(
  91  |     (url) => url.pathname.includes('/api/v1/stores/101/orders'),
  92  |     async (route) => {
  93  |       if (route.request().method() === 'POST') {
  94  |         await route.fulfill({
  95  |           status: 422,
  96  |           contentType: 'application/json',
  97  |           body: JSON.stringify({
  98  |             success: false,
  99  |             code: 'VALIDATION_ERROR',
  100 |             message: 'Product is out of stock',
  101 |             errors: {
  102 |               items: ['Product "Sample Product" is no longer available in the requested quantity.'],
  103 |             },
  104 |           }),
  105 |         });
  106 |       } else {
  107 |         await route.continue();
  108 |       }
  109 |     }
  110 |   );
  111 | 
  112 |   await page.getByTestId('product-101').click();
  113 |   await page.getByTestId('add-to-cart-button').click();
  114 |   await page.getByTestId('cart-icon').click();
  115 |   await page.getByTestId('proceed-to-checkout').click();
  116 | 
  117 |   await page.getByTestId('checkout-name').fill('John Doe');
  118 |   await page.getByTestId('checkout-email').fill('customer@example.com');
  119 |   await page.getByTestId('checkout-address').fill('123 Main St');
  120 |   await page.getByTestId('checkout-city').fill('New York');
  121 |   await page.getByTestId('checkout-postal-code').fill('10001');
  122 |   await page.getByTestId('checkout-card-number').fill('4242424242424242');
  123 |   await page.getByTestId('checkout-card-expiry').fill('12/25');
  124 |   await page.getByTestId('checkout-card-cvc').fill('123');
  125 | 
  126 |   await page.getByTestId('checkout-submit').click();
  127 | 
  128 |   await expect(page.getByTestId('checkout-error')).toContainText('no longer available');
  129 |   await expect(page).toHaveURL(/\/en\/stores\/101\/checkout$/);
  130 | });
  131 | 
  132 | test('empty cart prevents checkout access', async ({ page }) => {
  133 |   await login(page, 'merchant@example.com');
  134 |   await page.goto('/en/stores/101/checkout');
  135 | 
  136 |   // Should redirect to cart or shop
  137 |   await expect(page).toHaveURL(/\/en\/stores\/101\/(shop|cart)$/);
  138 |   await expect(page.getByText('Your cart is empty')).toBeVisible();
  139 | });
  140 | 
```