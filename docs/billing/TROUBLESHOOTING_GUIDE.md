# 🐛 Billing System - Troubleshooting Guide

**Last Updated:** June 11, 2026  
**Version:** 1.0

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Common Issues](#-common-issues)
3. [Debugging Tools](#-debugging-tools)
4. [How to Get Help](#-how-to-get-help)

---

## 📋 Overview

This guide provides solutions to common issues you may encounter with the billing system. Issues are organized by category with symptoms, causes, and step-by-step solutions.

### Before You Start

1. **Check the basics:**
   - Are you logged in?
   - Is your internet connection stable?
   - Try in incognito mode (rules out cache issues)
   - Try a different browser

2. **Check system status:**
   - Is the backend API running?
   - Are there any known outages?
   - Check backend logs for errors

3. **Gather information:**
   - Screenshot of the issue
   - Browser console errors (F12 → Console tab)
   - Network tab errors (F12 → Network tab)
   - Steps to reproduce

---

## 🔧 Common Issues

### Issue 1: Trial Banner Not Appearing

**Symptoms:**
- Subscription status shows "trialing"
- Trial end date is set
- No banner visible at top of pages

**Possible Causes:**
1. Layout component not fetching subscription
2. Banner component not imported in layout
3. Trial end date is null
4. Banner was dismissed and state persisted
5. CSS z-index conflict hiding banner


**Solutions:**

**Solution 1: Verify layout fetches subscription**
```typescript
// Check src/app/[locale]/(merchant)/layout.tsx
import { billingService } from '@/services/billing/billing.service';

export default async function MerchantLayout() {
  const subscription = await billingService.getSubscription();
  console.log('Subscription in layout:', subscription);
  
  return (
    <>
      {subscription?.status === 'trialing' && subscription?.trial_ends_at && (
        <TrialBanner subscription={subscription} />
      )}
      {children}
    </>
  );
}
```

**Solution 2: Verify banner component import**
```typescript
// Ensure import statement exists
import { TrialBanner } from '@/components/billing/TrialBanner';
```

**Solution 3: Check trial_ends_at value**
```typescript
// In browser console
console.log('Trial ends at:', subscription?.trial_ends_at);
// Should be: "2026-06-25T10:30:00.000000Z"
// If null, trial is not active
```

**Solution 4: Clear dismissed state**
```typescript
// If using localStorage to persist dismiss state
localStorage.removeItem('trial_banner_dismissed');
// Reload page
```

**Solution 5: Fix z-index conflict**
```tsx
// In TrialBanner component
<div className="fixed top-0 left-0 right-0 z-50 bg-blue-600">
  {/* Banner content */}
</div>
// Ensure z-index is higher than other fixed elements
```

**Verification:**
- Reload page in incognito mode
- Check browser console for errors
- Verify banner appears with correct days remaining

---

### Issue 2: Plan Upgrade Fails

**Symptoms:**
- Click "Select Plan" or "Upgrade" button
- Error toast appears
- Plan doesn't change
- Subscription remains on current plan

**Possible Causes:**
1. API endpoint error (500)
2. Validation error (422) - invalid plan slug or billing cycle
3. Permission error (403) - not authorized
4. Network failure - timeout or connection issue
5. Stripe integration issue

**Solutions:**

**Solution 1: Check API response**
```typescript
// Add debugging in mutation
const mutation = useMutation({
  mutationFn: billingService.upgradeSubscription,
  onError: (error) => {
    console.error('Upgrade error:', error);
    console.log('Status:', error.status);
    console.log('Message:', error.message);
    console.log('Errors:', error.errors);
  }
});
```

**Solution 2: Verify payload**
```typescript
// Ensure correct payload format
const payload = {
  plan_slug: 'growth', // Must match backend plan slug exactly
  billing_cycle: 'monthly' // Must be 'monthly' or 'annual'
};

// Log payload before sending
console.log('Upgrade payload:', payload);
await billingService.upgradeSubscription(payload);
```

**Solution 3: Check backend logs**
```bash
# In Laravel backend
tail -f storage/logs/laravel.log

# Look for errors related to billing/subscription
```

**Solution 4: Test with curl**
```bash
# Test endpoint directly
curl -X POST https://api.yourdomain.com/api/v1/billing/subscription/upgrade \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan_slug":"growth","billing_cycle":"monthly"}'
```

**Solution 5: Check Stripe integration**
- Go to Stripe Dashboard → Logs
- Check for API errors
- Verify Stripe keys are correct (test mode vs live mode)
- Ensure Stripe subscription exists

**Verification:**
- Upgrade completes without errors
- Success toast appears
- Subscription plan updates
- React Query cache invalidates
- New entitlements active

---

### Issue 3: Stripe Checkout Redirect Fails

**Symptoms:**
- Click "Select Plan" on trial start page
- No redirect to Stripe occurs
- Or redirect happens but shows error page
- Blank screen or loading indefinitely

**Possible Causes:**
1. Invalid return URLs (must be absolute, not relative)
2. Stripe API key issues (wrong mode or invalid)
3. Checkout session creation failed on backend
4. CORS issues blocking redirect
5. Popup blocker preventing new window

**Solutions:**

**Solution 1: Use absolute URLs**
```typescript
// ❌ BAD - Relative URLs
const payload = {
  plan_slug: 'growth',
  billing_cycle: 'annual',
  success_url: '/merchant/billing?trial=success', // WRONG
  cancel_url: '/merchant/billing/trial/start' // WRONG
};

// ✅ GOOD - Absolute URLs
const payload = {
  plan_slug: 'growth',
  billing_cycle: 'annual',
  success_url: `${window.location.origin}/merchant/billing?trial=success`,
  cancel_url: `${window.location.origin}/merchant/billing/trial/start`
};
```

**Solution 2: Verify Stripe keys**
```bash
# Check backend .env file
STRIPE_KEY=pk_test_... # Public key (starts with pk_test_ or pk_live_)
STRIPE_SECRET=sk_test_... # Secret key (starts with sk_test_ or sk_live_)

# Keys must match (both test OR both live, not mixed)
```

**Solution 3: Check checkout session response**
```typescript
try {
  const response = await billingService.startTrial(payload);
  console.log('Checkout session:', response);
  
  if (response.checkout_url) {
    window.location.href = response.checkout_url;
  } else {
    console.error('No checkout URL in response');
  }
} catch (error) {
  console.error('Checkout session creation failed:', error);
}
```

**Solution 4: Disable popup blocker**
```typescript
// If using window.open() instead of window.location.href
// Ensure it's triggered by user click (not delayed/async)

// ❌ BAD - May be blocked
setTimeout(() => {
  window.open(checkoutUrl);
}, 1000);

// ✅ GOOD - Immediate on user click
<button onClick={async () => {
  const response = await startTrial(payload);
  window.location.href = response.checkout_url;
}}>
  Start Trial
</button>
```

**Verification:**
- Redirect to Stripe Checkout page occurs
- Checkout page shows correct plan and pricing
- After completion, redirect back to success URL works
- Trial subscription created successfully

---

### Issue 4: Invoice PDF Won't Download

**Symptoms:**
- Click "Download PDF" button
- Nothing happens
- Or 404 error occurs
- Or blank page opens

**Possible Causes:**
1. `invoice_pdf_url` is null (Stripe hasn't generated PDF yet)
2. PDF URL expired (Stripe URLs have limited lifetime)
3. Network issue preventing download
4. Browser popup blocker blocking new tab
5. CORS issue with Stripe CDN

**Solutions:**

**Solution 1: Check if PDF URL exists**
```typescript
// In Invoice detail page
if (invoice.invoice_pdf_url) {
  window.open(invoice.invoice_pdf_url, '_blank');
} else {
  toast({
    title: 'PDF not available',
    description: 'Invoice PDF is being generated. Please try again in a moment.',
    variant: 'warning'
  });
}
```

**Solution 2: Refresh invoice data**
```typescript
// Force refetch invoice
const { data: invoice, refetch } = useQuery({
  queryKey: ['invoice', invoiceId],
  queryFn: () => billingService.getInvoice(invoiceId)
});

// On PDF button click
const handleDownload = async () => {
  const updated = await refetch();
  if (updated.data?.invoice_pdf_url) {
    window.open(updated.data.invoice_pdf_url, '_blank');
  }
};
```

**Solution 3: Handle expired URLs**
```typescript
// Request new PDF URL from backend
const handleDownload = async () => {
  try {
    const response = await fetch(`/api/v1/billing/invoices/${invoiceId}/pdf`);
    const data = await response.json();
    window.open(data.pdf_url, '_blank');
  } catch (error) {
    toast({
      title: 'Download failed',
      description: 'Unable to download PDF. Please try again.',
      variant: 'destructive'
    });
  }
};
```

**Solution 4: Alternative download method**
```typescript
// Download as blob instead of opening
const handleDownload = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `invoice-${invoice.invoice_number}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};
```

**Verification:**
- PDF opens in new tab or downloads
- PDF content is correct (matches invoice data)
- PDF is properly formatted
- Invoice details are legible

---

### Issue 5: Quota Guard Not Working

**Symptoms:**
- Can create products beyond the plan limit
- No upgrade dialog appears when limit reached
- Guard check passes when it should fail

**Possible Causes:**
1. Guard not implemented on the page
2. Entitlement API returning incorrect data
3. Comparison logic error
4. Guard failing open due to API error
5. Cache showing stale data

**Solutions:**

**Solution 1: Verify guard implementation**
```typescript
// In product creation page
import { canCreateProduct } from '@/lib/billing/product-guard';

export default async function NewProductPage() {
  const storeId = 1; // Get from params or context
  const quotaCheck = await canCreateProduct(storeId);
  
  console.log('Quota check result:', quotaCheck);
  // Should log: { allowed: false, currentCount: 10000, limit: 10000 }
  
  if (!quotaCheck.allowed) {
    return <QuotaLimitReachedCard {...quotaCheck} />;
  }
  
  return <ProductCreationForm />;
}
```

**Solution 2: Debug entitlement API**
```typescript
// Check entitlement response
const entitlement = await billingService.getEntitlements();
console.log('Entitlement:', entitlement);
// Verify max_products value is correct
console.log('Max products:', entitlement.max_products);
console.log('Current products:', entitlement.current_product_count);
```

**Solution 3: Fix comparison logic**
```typescript
// In product-guard.ts
export async function canCreateProduct(storeId: number): Promise<QuotaCheckResult> {
  try {
    const entitlement = await billingService.getEntitlements();
    const currentCount = entitlement.current_product_count || 0;
    const limit = entitlement.max_products;
    
    // ✅ Correct comparison (>= for inclusive limit)
    const allowed = currentCount < limit;
    
    return {
      allowed,
      currentCount,
      limit,
      reason: allowed ? undefined : 'Product limit reached'
    };
  } catch (error) {
    console.error('Quota check failed:', error);
    // Fail open - allow creation on error
    return { allowed: true };
  }
}
```

**Solution 4: Clear cache**
```typescript
// Force refresh entitlements
import { queryClient } from '@/lib/react-query';

queryClient.invalidateQueries({ queryKey: ['entitlements'] });
```

**Solution 5: Check backend enforcement**
```bash
# The backend MUST also enforce limits
# Test creating product via API when at limit
curl -X POST https://api.yourdomain.com/api/v1/products \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Test Product"}'

# Should return 403 or 422 when at limit
```

**Verification:**
- Guard correctly blocks at limit
- Upgrade dialog opens automatically
- Usage meter shows correct count
- Backend also enforces limit

---

### Issue 6: Grace Period Banner Not Showing

**Symptoms:**
- Subscription status is "past_due"
- grace_period_ends_at is set
- No warning banner appears

**Possible Causes:**
1. Banner condition logic incorrect
2. Layout not checking for grace period
3. Banner component not imported
4. CSS z-index hiding banner
5. grace_period_ends_at is null

**Solutions:**

**Solution 1: Verify banner condition**
```typescript
// In merchant layout
const subscription = await billingService.getSubscription();

const showGraceBanner =
  subscription?.status === 'past_due' &&
  subscription?.grace_period_ends_at != null;

console.log('Should show grace banner:', showGraceBanner);
console.log('Status:', subscription?.status);
console.log('Grace period ends:', subscription?.grace_period_ends_at);

{showGraceBanner && (
  <GracePeriodBanner subscription={subscription} />
)}
```

**Solution 2: Check grace period calculation**
```typescript
// In GracePeriodBanner component
const gracePeriodEnd = new Date(subscription.grace_period_ends_at);
const now = new Date();
const daysRemaining = Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

console.log('Grace period ends:', gracePeriodEnd);
console.log('Days remaining:', daysRemaining);

// If daysRemaining is negative, grace period has expired
if (daysRemaining <= 0) {
  // Banner should show "Grace period expired"
}
```

**Solution 3: Import banner component**
```typescript
// Ensure import in layout
import { GracePeriodBanner } from '@/components/billing/GracePeriodBanner';
```

**Solution 4: Fix z-index**
```tsx
// In GracePeriodBanner component
<div className="fixed top-0 left-0 right-0 z-50 bg-red-600">
  {/* Ensure z-index is highest */}
</div>
```

**Verification:**
- Banner appears for past_due subscriptions
- Days remaining countdown accurate
- "Update Payment" button works
- Banner disappears after payment updated

---

### Issue 7: RTL Layout Broken

**Symptoms:**
- Switch to Arabic locale
- Layout looks wrong or misaligned
- Icons in wrong positions
- Text overlaps or truncates

**Possible Causes:**
1. Using directional classes (`mr-`, `ml-`) instead of logical properties
2. Not using logical properties correctly
3. Hardcoded left/right directions in styles
4. Flex/grid directions not reversing
5. Missing RTL directives

**Solutions:**

**Solution 1: Replace directional classes**
```tsx
// ❌ BAD - Hardcoded directions
<div className="mr-4 ml-2 pr-3 pl-1">

// ✅ GOOD - Logical properties
<div className="me-4 ms-2 pe-3 ps-1">

// Replacements:
// mr-X → me-X (margin-right → margin-inline-end)
// ml-X → ms-X (margin-left → margin-inline-start)
// pr-X → pe-X (padding-right → padding-inline-end)
// pl-X → ps-X (padding-left → padding-inline-start)
```

**Solution 2: Fix text alignment**
```tsx
// ❌ BAD - Hardcoded alignment
<div className="text-left">

// ✅ GOOD - Use start/end
<div className="text-start">

// text-left → text-start
// text-right → text-end
```

**Solution 3: Fix flex directions**
```tsx
// Icons should reverse in RTL
<div className="flex items-center gap-2">
  <ChevronRight className="rtl:rotate-180" />
  <span>Next</span>
</div>
```

**Solution 4: Add dir attribute**
```tsx
// Ensure html tag has dir attribute
// In root layout
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
  {children}
</html>
```

**Solution 5: Test all billing pages**
```bash
# Navigate to Arabic locale
http://localhost:3000/ar/merchant/billing
http://localhost:3000/ar/merchant/billing/plans
http://localhost:3000/ar/merchant/billing/invoices
```

**Verification:**
- All text right-aligned in Arabic
- Margins/padding mirror correctly
- Icons position correctly
- No layout breaks or overlaps
- Navigation flows right-to-left

---

### Issue 8: TypeScript Errors

**Symptoms:**
- Red squiggly lines in editor
- Build fails with type errors
- `npm run type-check` fails

**Common Errors & Solutions:**

**Error: Type 'any' is not assignable**
```typescript
// ❌ BAD
const subscription: any = await getSubscription();

// ✅ GOOD
import { Subscription } from '@/types/billing/subscription';
const subscription: Subscription = await billingService.getSubscription();
```

**Error: Property does not exist on type**
```typescript
// ❌ BAD
subscription.plan.name // Error if plan might be undefined

// ✅ GOOD - Optional chaining
subscription?.plan?.name
```

**Error: Argument of type X is not assignable to parameter of type Y**
```typescript
// ❌ BAD
const cycle = 'yearly'; // Wrong value

// ✅ GOOD
import { BillingCycle } from '@/types/billing/plan';
const cycle: BillingCycle = 'annual'; // Correct value
```

**Error: Cannot find module**
```typescript
// Check import path is correct
import { billingService } from '@/services/billing/billing.service';
// Ensure path matches actual file location
```

**General Debugging:**
```bash
# Clear Next.js cache
rm -rf .next

# Check types
npm run type-check

# If persistent, restart TypeScript server
# In VSCode: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

### Issue 9: React Query Not Updating

**Symptoms:**
- Data doesn't refresh after mutation
- Stale data displayed
- UI doesn't reflect latest changes

**Possible Causes:**
1. Cache not being invalidated after mutation
2. Query keys don't match
3. Mutation not awaited
4. Multiple query clients

**Solutions:**

**Solution 1: Ensure cache invalidation**
```typescript
const mutation = useMutation({
  mutationFn: billingService.upgradeSubscription,
  onSuccess: () => {
    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['subscription'] });
    queryClient.invalidateQueries({ queryKey: ['entitlements'] });
  }
});
```

**Solution 2: Match query keys**
```typescript
// Query definition
const { data } = useQuery({
  queryKey: ['subscription'], // Key must match exactly
  queryFn: billingService.getSubscription
});

// Invalidation
queryClient.invalidateQueries({ queryKey: ['subscription'] }); // Same key
```

**Solution 3: Await mutations**
```typescript
const handleUpgrade = async () => {
  try {
    await mutation.mutateAsync(payload);
    // Data will be refetched after this
    toast({ title: 'Upgrade successful' });
  } catch (error) {
    toast({ title: 'Upgrade failed' });
  }
};
```

**Verification:**
- UI updates immediately after mutation
- Refetch indicator shows briefly
- New data reflects in all components

---

### Issue 10: Billing Portal Redirect Fails

**Symptoms:**
- Click "Billing Portal" or "Manage Payment" button
- Nothing happens
- Or error occurs
- Button shows loading indefinitely

**Possible Causes:**
1. Portal session creation fails
2. Invalid return_url
3. Network timeout
4. Popup blocker
5. Stripe configuration issue

**Solutions:**

**Solution 1: Debug portal session creation**
```typescript
const handlePortalClick = async () => {
  try {
    console.log('Creating portal session...');
    const response = await billingService.createPortalSession({
      return_url: `${window.location.origin}/merchant/billing`
    });
    console.log('Portal response:', response);
    
    if (response.url) {
      window.location.href = response.url;
    } else {
      console.error('No URL in portal response');
    }
  } catch (error) {
    console.error('Portal creation failed:', error);
    toast({
      title: 'Failed to open billing portal',
      description: 'Please try again or contact support.',
      variant: 'destructive'
    });
  }
};
```

**Solution 2: Verify return URL**
```typescript
// Ensure absolute URL
const returnUrl = `${window.location.origin}/merchant/billing`;
console.log('Return URL:', returnUrl);
// Should be: https://yourdomain.com/merchant/billing
```

**Solution 3: Add timeout handling**
```typescript
const mutation = useMutation({
  mutationFn: billingService.createPortalSession,
  onSuccess: (data) => {
    window.location.href = data.url;
  },
  onError: (error) => {
    toast({ title: 'Portal unavailable', variant: 'destructive' });
  },
  // Add timeout
  retry: 0
});
```

**Verification:**
- Portal opens in same window
- Portal shows payment methods
- Can update card successfully
- Returns to billing page after changes

---

## 🔍 Debugging Tools

### 1. Browser DevTools

**Console Tab:**
```javascript
// Check subscription data
const subscription = await fetch('/api/v1/billing/subscription', {
  headers: {
    'Authorization': 'Bearer ' + document.cookie.match(/token=([^;]+)/)?.[1]
  }
}).then(r => r.json());

console.log(subscription);
```

**Network Tab:**
- Filter by "billing" to see all billing API calls
- Check request/response payloads
- Verify status codes (200, 422, 500, etc.)
- Check timing for slow requests

**Application Tab:**
- View cookies (check auth token)
- View localStorage (check cached data)
- Clear storage to reset state


---

### 2. React DevTools

**Installation:**
```bash
# Chrome/Edge
https://chrome.google.com/webstore/detail/react-developer-tools/

# Firefox
https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

**Usage:**
- Inspect component props
- Check component state
- Verify context values
- Debug re-renders

**Example:**
```
1. Open React DevTools (F12 → React tab)
2. Select SubscriptionStatusCard component
3. View props → subscription object
4. Verify all expected fields present
5. Check if data is stale
```

---

### 3. React Query DevTools

**Enable in development:**
```tsx
// Add to src/app/[locale]/layout.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  {children}
  {process.env.NODE_ENV === 'development' && (
    <ReactQueryDevtools initialIsOpen={false} />
  )}
</QueryClientProvider>
```

**Features:**
- View all active queries
- See cached data
- Check stale/fresh status
- Manually refetch queries
- See query keys and state

**Usage:**
```
1. Open app in browser
2. Click floating React Query icon
3. Find 'subscription' query
4. Inspect data, status, last updated
5. Click "Refetch" to force update
```

---

### 4. Stripe Dashboard

**Test Mode:** https://dashboard.stripe.com/test

**What to Check:**
- **Subscriptions:** View all test subscriptions
- **Customers:** Check customer records
- **Checkout Sessions:** Verify checkout URLs created
- **Webhooks:** Check webhook delivery status
- **Logs:** API request/response logs
- **Events:** All Stripe events (subscription.created, etc.)

**Common Checks:**
```
1. Go to Subscriptions
2. Find your test subscription
3. Verify status (active, trialing, past_due)
4. Check trial end date
5. Verify pricing matches
6. Check upcoming invoice
```

---

### 5. Backend Logs

**Laravel Log:**
```bash
# Tail log file
tail -f storage/logs/laravel.log

# Search for billing errors
grep "billing" storage/logs/laravel.log

# Filter by date
grep "2026-06-11" storage/logs/laravel.log | grep "ERROR"
```

**What to Look For:**
- API request errors
- Stripe API call failures
- Validation errors
- Database query issues
- Webhook processing errors

---

## 📞 How to Get Help

### Before Asking for Help

Complete this checklist:

- [ ] Read relevant section in this guide
- [ ] Checked browser console for errors
- [ ] Tested in incognito mode
- [ ] Tried different browser
- [ ] Cleared cache and reloaded
- [ ] Checked backend logs
- [ ] Verified API is running
- [ ] Tested with Stripe test cards

### How to Report an Issue

**Use this template:**

```markdown
## Issue Description
[Brief description of the problem]

## Steps to Reproduce
1. Navigate to...
2. Click on...
3. See error...

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Error Messages
```
[Paste full error from console]
```

## Environment
- **Browser:** Chrome 120.0.6099.109
- **OS:** macOS 14.2
- **Subscription Status:** trialing
- **Plan:** Growth (Monthly)
- **Account ID:** [If applicable]

## Screenshots
[Attach screenshots if helpful]

## Console Logs
```
[Paste relevant console logs]
```

## Network Errors
```
[Paste failed network requests from Network tab]
```

## What I've Tried
- Tested in incognito mode ✅
- Cleared cache ✅
- Tried different browser ❌
- Checked backend logs ✅
```

### Where to Get Help

**1. Internal Team**
- Slack: #billing-support
- Email: dev-team@laratenant.com

**2. Documentation**
- Developer docs: `DEVELOPER_DOCUMENTATION.md`
- User guide: `MERCHANT_USER_GUIDE.md`
- Testing report: `BILLING_FRONTEND_TESTING_REPORT.md`

**3. External Resources**
- Stripe Support: https://support.stripe.com
- Next.js Discord: https://discord.gg/nextjs
- React Query Discord: https://discord.gg/tanstack

### Emergency Contacts

**For Critical Issues:**
- Production down
- Payment processing failures
- Security vulnerabilities
- Data loss

**Contact:**
- Email: urgent@laratenant.com
- Subject: [URGENT] Brief description
- Include: Account ID, error logs, impact

---

**Last Updated:** June 11, 2026  
**Version:** 1.0  
**Maintained By:** Development Team

**Found an issue not covered here?** Submit a PR or email docs@laratenant.com

