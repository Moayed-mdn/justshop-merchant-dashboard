# Debug: Routing Issues Analysis

## Current Errors

### Error 1: 404 on Merchant Routes
```
GET /en/stores/3/brands/new 200 ✅
GET /en/merchant/brands/new 404 ❌
GET /en/stores/3/tags/new 200 ✅
GET /en/merchant/tags/new 404 ❌
```

### Error 2: Double Locale Prefix
```
http://localhost:3002/en/en/login?redirect=%2Fen%2Fmerchant%2Fdashboard&expired=1
                      ^^^^^^
                      Double /en prefix!
```

---

## Architecture Overview

You have a **multi-app monorepo** with separate frontend applications:

```
tenant/
├── justshop-frontend/          # Nuxt.js Storefront (Customer App)
│   ├── Port: 3000/3002
│   ├── Purpose: Customer shopping experience
│   └── Routes: /, /shop, /cart, /login, /products, /orders
│
├── laratenant-commerce/        # Next.js Merchant Dashboard (Admin App)
│   ├── Port: 4000
│   ├── Purpose: Merchant management panel
│   └── Routes: /merchant/*, /stores/{id}/*, /setup
│
└── laratenant-backend/         # Laravel API
    ├── Port: 8000
    ├── Purpose: Backend API for both apps
    └── Routes: /api/v1/*
```

---

## Problem 1: Accessing Wrong Application

### What You're Doing Wrong

```bash
# ❌ WRONG: Trying to access merchant routes on storefront app
curl http://localhost:3002/en/merchant/brands/new
# Returns 404 because merchant routes don't exist in Nuxt app

# ✅ CORRECT: Access merchant routes on merchant dashboard app
curl http://localhost:4000/en/merchant/brands/new
# Returns 200 because route exists in Next.js app
```

### Why `/stores/3/brands/new` Works

Looking at the logs, `/en/stores/3/brands/new` returns 200. This suggests:

**Option A:** These routes are being proxied to the Laravel backend
**Option B:** These routes are defined somewhere in the Nuxt app

Let me check what's handling these routes...

### Route Handler Investigation

Check if there's a proxy or catch-all handling `/stores/*`:

```bash
# In justshop-frontend directory
grep -r "stores" app/pages/
grep -r "stores" server/
```

If there's a catch-all route like `[...slug].vue`, it might be forwarding store routes to the backend, but **not** merchant routes.

---

## Problem 2: Double Locale Prefix (`/en/en`)

### Root Cause

The double locale happens due to **cross-application URL leakage**:

1. You're logged into **Next.js merchant app** (port 4000)
2. Session expires in merchant app
3. Merchant app generates redirect: `/en/login?redirect=/en/merchant/dashboard&expired=1`
4. Somehow this URL gets opened in the **Nuxt storefront app** (port 3002)
5. Nuxt's i18n middleware sees the request and adds **another** `/en` prefix
6. Result: `/en/en/login`

### How URLs Get Mixed

This can happen when:

1. **Shared Browser Tabs**: You have both apps open and click wrong tab
2. **Copy-Paste**: You copy a URL from one app and paste into another
3. **Bookmarks**: You save a merchant URL but open it in storefront port
4. **Proxy Misconfiguration**: A reverse proxy is forwarding requests incorrectly

### The Fix Applied

I've created a global middleware `fix-double-locale.global.ts` that:
- Detects double locale prefix pattern (`/en/en`, `/ar/ar`, etc.)
- Automatically redirects to the correct single-prefix URL
- Logs the issue so you can see when it happens

---

## Testing the Fixes

### Test 1: Verify Applications Are Separate

```bash
# Terminal 1: Check Nuxt app routes
curl http://localhost:3002/en/merchant/brands/new
# Expected: 404 (merchant routes don't exist here)

# Terminal 2: Check Next.js app routes
curl http://localhost:4000/en/merchant/brands/new
# Expected: Redirects to login or returns page
```

### Test 2: Verify Double Locale Fix

```bash
# Try accessing a double-locale URL
curl -I http://localhost:3002/en/en/login
# Expected: 301 redirect to http://localhost:3002/en/login
```

### Test 3: Check Store Routes

```bash
# Test store routes on storefront
curl http://localhost:3002/en/stores/3/brands/new
# If this returns 200, check server/middleware/ or app/pages/ for the handler

# Test store routes on merchant dashboard
curl http://localhost:4000/en/stores/3/brands/new
# Expected: 200 (these routes are defined in Next.js)
```

---

## How to Properly Use Each App

### Nuxt Storefront (port 3002) - Customer Features

Use this app for:
- ✅ Shopping as a customer
- ✅ Browsing products
- ✅ Adding to cart
- ✅ Customer login/registration
- ✅ Placing orders
- ✅ Viewing order history

URLs:
```
http://localhost:3002/en
http://localhost:3002/en/shop
http://localhost:3002/en/cart
http://localhost:3002/en/login         (customer login)
http://localhost:3002/en/register      (customer registration)
http://localhost:3002/en/orders
```

### Next.js Merchant Dashboard (port 4000) - Merchant Features

Use this app for:
- ✅ Merchant login
- ✅ Managing products
- ✅ Managing categories, brands, tags
- ✅ Managing stores
- ✅ Viewing orders as merchant
- ✅ Store settings

URLs:
```
http://localhost:4000/en/login              (merchant login)
http://localhost:4000/en/merchant/dashboard
http://localhost:4000/en/merchant/brands
http://localhost:4000/en/merchant/tags
http://localhost:4000/en/stores/3/brands
http://localhost:4000/en/stores/3/tags
```

---

## Debugging Tools

### Check Which App is Running

```bash
# List all node processes with ports
lsof -i :3002  # Nuxt storefront
lsof -i :4000  # Next.js merchant
lsof -i :8000  # Laravel backend
```

### Check Browser Network Tab

When you get a 404:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look at the request URL
4. Check which port it's hitting (3002 or 4000)
5. Verify if you're on the right application

### Enable Detailed Logging

**In Nuxt (justshop-frontend):**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  debug: true, // Already set to false in your config
})
```

**In Next.js (laratenant-commerce):**
```typescript
// next.config.js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Wrong Port
```bash
# You're on merchant dashboard functionality but using storefront port
http://localhost:3002/en/merchant/brands/new  # ❌ 404
```

### ❌ Mistake 2: Mixing Authentication
```bash
# Logging in as merchant on storefront app
http://localhost:3002/en/login  # This is customer login!
```

### ❌ Mistake 3: Copy-Paste URLs Between Apps
```bash
# Copying a Next.js URL and pasting in Nuxt browser tab
# Next.js URL: http://localhost:4000/en/merchant/dashboard
# Pasted as:   http://localhost:3002/en/merchant/dashboard  # ❌ 404
```

---

## Recommended Development Workflow

### Use Different Browser Profiles

**Profile 1: Customer (Storefront)**
- Open in Chrome/Firefox Profile 1
- Navigate to: `http://localhost:3002`
- Login as customer
- Test shopping features

**Profile 2: Merchant (Dashboard)**
- Open in Chrome/Firefox Profile 2
- Navigate to: `http://localhost:4000`
- Login as merchant
- Test management features

### Use Browser Bookmarks

Create bookmark folders:
```
📁 Storefront (3002)
  🔖 Home: http://localhost:3002/en
  🔖 Shop: http://localhost:3002/en/shop
  🔖 Login: http://localhost:3002/en/login

📁 Merchant Dashboard (4000)
  🔖 Login: http://localhost:4000/en/login
  🔖 Dashboard: http://localhost:4000/en/merchant/dashboard
  🔖 Brands: http://localhost:4000/en/merchant/brands
```

### Use Different Terminal Windows

```bash
# Terminal 1: Storefront
cd justshop-frontend
npm run dev -- --port 3002

# Terminal 2: Merchant Dashboard
cd laratenant-commerce
npm run dev -- --port 4000

# Terminal 3: Backend
cd laratenant-backend
php artisan serve --port 8000
```

---

## Next Steps

1. ✅ **Applied**: Created `fix-double-locale.global.ts` middleware to handle `/en/en` issue
2. ⏳ **Your Turn**: Use correct ports for each application
3. ⏳ **Your Turn**: Test the middleware by accessing a double-locale URL
4. 💡 **Optional**: Set up different domains (shop.test, admin.test) for cleaner separation
5. 💡 **Optional**: Implement SSO if you need seamless login between apps
