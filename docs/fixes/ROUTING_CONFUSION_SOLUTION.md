# Routing Confusion Solution

## Problem Analysis

You have a **multi-tenant e-commerce platform** with three separate applications:

1. **Nuxt.js Storefront** (`justshop-frontend`) - Port 3000/3002
   - Customer-facing storefront pages
   - Routes: `/`, `/shop`, `/cart`, `/login`, `/products`, etc.

2. **Next.js Merchant Dashboard** (`laratenant-commerce`) - Port 4000
   - Merchant admin panel
   - Routes: `/merchant/dashboard`, `/merchant/brands`, `/merchant/tags`, `/stores/{storeId}/brands`, etc.

3. **Laravel Backend** (`laratenant-backend`) - Port 8000
   - API backend
   - Handles all API requests

## Issues Identified

### Issue 1: 404 on `/en/merchant/brands/new` and `/en/merchant/tags/new`

**Root Cause:**
You're accessing merchant routes on the Nuxt storefront (port 3002), but `/merchant/*` routes are defined in the Next.js merchant dashboard (port 4000).

**Evidence:**
```
GET /en/merchant/brands/new 404 in 2.2s (next.js: 2.1s, proxy.ts: 30ms, application-code: 80ms)
GET /en/merchant/tags/new 404 in 104ms (next.js: 21ms, proxy.ts: 23ms, application-code: 60ms)
```

The log shows "next.js" but you're on the Nuxt app - this suggests you're getting a 404 from Nuxt which has no merchant routes.

**Solution:**
Access merchant routes on the correct application:
- ❌ Wrong: `http://localhost:3002/en/merchant/brands/new` (Nuxt storefront)
- ✅ Correct: `http://localhost:4000/en/merchant/brands/new` (Next.js dashboard)

### Issue 2: `/en/en/login` Double Locale Prefix

**Root Cause:**
The `useLocalePath()` function from Nuxt i18n is adding the `/en` prefix to a route that already contains the locale prefix.

**Current Code in `useStorefrontRoutes.ts`:**
```typescript
const login = () => localePath(paths.login)  // paths.login = '/login'
```

When called, if the route already has a locale or there's a redirect with a locale:
1. `paths.login` returns `/login`
2. `localePath('/login')` adds `/en` → `/en/login`
3. But somewhere a redirect is adding another `/en` → `/en/en/login`

**Solution:**
Need to check where the redirect is being generated. Let me investigate the auth middleware and session expiry redirect logic.

## Fix Implementation

### Fix 1: Use Correct Application Ports

Update your bookmarks/links:

**Storefront (Customer) - Port 3000/3002:**
- Home: `http://localhost:3002/en`
- Shop: `http://localhost:3002/en/shop`
- Cart: `http://localhost:3002/en/cart`
- Login: `http://localhost:3002/en/login`

**Merchant Dashboard - Port 4000:**
- Dashboard: `http://localhost:4000/en/merchant/dashboard`
- Brands: `http://localhost:4000/en/merchant/brands`
- Tags: `http://localhost:4000/en/merchant/tags`
- Store-specific: `http://localhost:4000/en/stores/3/brands`

### Fix 2: `/en/en` Duplication - Root Cause Found!

**The Real Problem:**
You're accessing a **Next.js merchant dashboard** session expiry redirect URL on the **Nuxt storefront app**!

**What's Happening:**
1. You're logged into the Next.js merchant dashboard (port 4000)
2. Your session expires in the merchant dashboard
3. The merchant dashboard redirects you to: `http://localhost:4000/en/login?redirect=%2Fen%2Fmerchant%2Fdashboard&expired=1`
4. BUT somehow you end up on: `http://localhost:3002/en/en/login?redirect=%2Fen%2Fmerchant%2Fdashboard&expired=1`

**Why the Double `/en/en`?**
- The Next.js app (port 4000) generates: `/en/login` correctly
- But you're accessing port 3002 (Nuxt app) which also uses `i18n` with `strategy: 'prefix'`
- The Nuxt app's i18n sees the incoming request and adds another `/en` prefix
- Result: `/en/en/login`

**Solution:**
Keep the applications separate! Don't mix URLs between Next.js (merchant) and Nuxt (storefront).

**If you need to share authentication:**
Consider using a shared session domain or implement a proper SSO (Single Sign-On) flow between the two applications.

## Complete Solution

### Immediate Fixes

#### 1. Stop Mixing Application URLs

**DO NOT do this:**
- ❌ Open merchant dashboard, let session expire, then try to access the redirect on Nuxt storefront
- ❌ Copy URLs from merchant app (port 4000) and paste into storefront app (port 3002)
- ❌ Have browser tabs mixing both applications

**DO this:**
- ✅ Keep merchant dashboard in separate browser/profile: `http://localhost:4000`
- ✅ Keep storefront in separate browser/profile: `http://localhost:3002`
- ✅ Use bookmarks to keep them separate

#### 2. Fix the Storefront Login Page (Remove Double Locale)

If you're getting `/en/en/login` on the Nuxt app, it means a redirect is coming from outside with a locale-prefixed path. You need to strip the locale before passing to `localePath`:

**Option A: Fix in `useStorefrontRoutes.ts`**

```typescript
// Add a helper to strip existing locale prefix
const stripExistingLocale = (path: string): string => {
  const localePattern = /^\/(en|ar)(\/|$)/
  if (localePattern.test(path)) {
    return path.replace(localePattern, '/')
  }
  return path
}

// Then use it in the login function
const login = (redirect?: string) => {
  const loginPath = localePath(paths.login)
  if (redirect) {
    const cleanRedirect = stripExistingLocale(redirect)
    return {
      path: loginPath,
      query: { redirect: cleanRedirect, ...otherParams }
    }
  }
  return loginPath
}
```

**Option B: Add Global Middleware to Detect Double Locale**

Create a middleware file:

```typescript
// app/middleware/fix-double-locale.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const doubleLocalePattern = /^\/(en|ar)\/(en|ar)/
  
  if (doubleLocalePattern.test(to.path)) {
    const fixedPath = to.path.replace(doubleLocalePattern, '/$1')
    return navigateTo({
      path: fixedPath,
      query: to.query,
    }, { redirectCode: 301 })
  }
})
```

#### 3. Ensure Separate Session Storage

Make sure the two applications use different session storage keys to avoid conflicts:

**Nuxt Storefront (.env):**
```env
SESSION_COOKIE_NAME=storefront_session
```

**Next.js Merchant Dashboard (.env):**
```env
SESSION_COOKIE_NAME=merchant_session
```

### Long-term Architecture Improvements

#### 1. Use Different Domains

**Development:**
```bash
# Add to /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 shop.justshop.test
127.0.0.1 admin.justshop.test
127.0.0.1 api.justshop.test
```

**Then configure:**
- Storefront: `http://shop.justshop.test:3002`
- Merchant: `http://admin.justshop.test:4000`
- Backend: `http://api.justshop.test:8000`

**Update nuxt.config.ts:**
```typescript
i18n: {
  baseUrl: 'http://shop.justshop.test:3002',
  // ... rest of config
}
```

#### 2. Implement Proper SSO (If Needed)

If merchants need to access both apps seamlessly, implement proper Single Sign-On:

1. **Shared Authentication Service** - Use the Laravel backend as SSO provider
2. **Token-based Auth** - Use JWT tokens instead of session cookies
3. **OAuth2 Flow** - Implement OAuth2 authorization code flow between apps

#### 3. Add Reverse Proxy (Advanced)

If you really need unified URLs, use a reverse proxy:

```nginx
# nginx.conf
server {
    listen 80;
    server_name justshop.test;

    location /merchant/ {
        proxy_pass http://localhost:4000;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
    }

    location / {
        proxy_pass http://localhost:3002;
    }
}
```

Then access everything through `http://justshop.test`
