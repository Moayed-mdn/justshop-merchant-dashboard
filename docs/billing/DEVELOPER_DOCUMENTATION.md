# 🛠️ Billing System - Developer Documentation

**Last Updated:** June 11, 2026  
**Version:** 1.0  
**For:** Developers

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Architecture](#-architecture)
3. [Folder Structure](#-folder-structure)
4. [API Integration](#-api-integration)
5. [Type System](#-type-system)
6. [Component API](#-component-api)
7. [Entitlement Guards](#-entitlement-guards)
8. [Testing](#-testing)
9. [Security](#-security)
10. [Performance](#-performance)
11. [Internationalization](#-internationalization)
12. [Troubleshooting](#-troubleshooting)

---

## 📋 Overview

The billing frontend integration provides a complete subscription management system for the LaraTenant Commerce platform. Built with Next.js 15 App Router, TypeScript, and React Query, it offers:

- ✅ 14-day free trial signup
- ✅ Plan selection and comparison
- ✅ Subscription lifecycle management (upgrade, downgrade, cancel, resume)
- ✅ Invoice viewing and PDF download
- ✅ Usage monitoring and quota enforcement
- ✅ Grace period handling for payment failures
- ✅ Stripe Checkout and Billing Portal integration


### Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **State Management:** React Query v5 (TanStack Query)
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS with logical properties
- **Backend:** Laravel 11 REST API
- **Payment Processing:** Stripe
- **i18n:** next-intl (English/Arabic)

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   laratenant-commerce                        │
│                    (Next.js 15 App)                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📱 UI Layer (React Server/Client Components)               │
│  ├── Pages (App Router)                                     │
│  │   ├── /merchant/billing (Dashboard)                     │
│  │   ├── /merchant/billing/plans (Plan Selection)          │
│  │   ├── /merchant/billing/invoices (Invoice List)         │
│  │   ├── /merchant/billing/invoices/[id] (Detail)          │
│  │   └── /merchant/billing/trial/start (Trial Signup)      │
│  │                                                           │
│  ├── Components (shadcn/ui based)                           │
│  │   ├── SubscriptionStatusCard                            │
│  │   ├── EntitlementUsageCard                              │
│  │   ├── PlanCard / PlanComparisonTable                    │
│  │   ├── InvoiceTable / InvoiceStatusBadge                 │
│  │   ├── TrialBanner / GracePeriodBanner                   │
│  │   └── UpgradePromptDialog                               │
│  │                                                           │
│  └── Layouts                                                 │
│      ├── TrialBanner (in merchant layout)                  │
│      └── GracePeriodBanner (in merchant layout)            │
│                                                               │
│  🎯 State Layer (React Query)                               │
│  ├── Query Keys (centralized)                              │
│  ├── Query Hooks (data fetching)                           │
│  └── Mutation Hooks (actions)                              │
│                                                               │
│  🔌 Service Layer                                           │
│  ├── billing.service.ts → 12 API endpoints                 │
│  └── Entitlement guards → Permission checks                │
│                                                               │
│  📦 Type Layer                                              │
│  ├── plan.ts → Plan, PlanPrice, PlanFeature               │
│  ├── subscription.ts → Subscription types                  │
│  ├── invoice.ts → Invoice types                            │
│  └── entitlement.ts → Entitlement types                    │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP (JSON API)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│               laratenant-backend                             │
│                (Laravel 11 API)                              │
├─────────────────────────────────────────────────────────────┤
│  ✅ 12 Billing API Endpoints                                │
│  ✅ Entitlement System                                      │
│  ✅ Stripe Webhook Processing                               │
│  ✅ Subscription Management                                 │
└─────────────────────────────────────────────────────────────┘
```


### Data Flow

**1. Trial Signup Flow:**
```
User → Select Plan → Stripe Checkout → Backend → Subscription Created
→ Frontend Redirect → React Query Cache Invalidation → UI Update
```

**2. Plan Upgrade Flow:**
```
User → Click Upgrade → billingService.upgradeSubscription()
→ Backend (immediate upgrade + proration) → Success Response
→ React Query Mutation → Cache Invalidation → UI Update
```

**3. Quota Check Flow:**
```
User → Navigate to Create Page → Guard Hook → billingService.getEntitlements()
→ Check current vs limit → Block or Allow → UI Response
```

---

## 📂 Folder Structure

```
laratenant-commerce/src/
├── app/[locale]/(merchant)/merchant/billing/
│   ├── page.tsx                             # Billing Dashboard (Server Component)
│   ├── plans/
│   │   └── page.tsx                         # Plan Selection Page
│   ├── invoices/
│   │   ├── page.tsx                         # Invoice List
│   │   └── [id]/
│   │       └── page.tsx                     # Invoice Detail
│   └── trial/
│       └── start/
│           └── page.tsx                     # Trial Signup
│
├── components/billing/
│   ├── SubscriptionStatusCard.tsx           # Shows current subscription status
│   ├── EntitlementUsageCard.tsx             # Usage meters for stores/products
│   ├── PlanCard.tsx                         # Individual plan display
│   ├── PlanComparisonTable.tsx              # Feature comparison grid
│   ├── InvoiceTable.tsx                     # Invoice list table
│   ├── InvoiceStatusBadge.tsx               # Status badge component
│   ├── TrialBanner.tsx                      # Trial countdown banner
│   ├── GracePeriodBanner.tsx                # Payment failure warning
│   ├── UpgradePromptDialog.tsx              # Quota limit upgrade dialog
│   ├── CancelSubscriptionDialog.tsx         # Cancel confirmation
│   └── DowngradeConfirmDialog.tsx           # Downgrade confirmation
│
├── services/billing/
│   └── billing.service.ts                   # API integration layer (12 endpoints)
│
├── types/billing/
│   ├── plan.ts                              # Plan, PlanPrice, PlanFeature
│   ├── subscription.ts                      # Subscription types
│   ├── invoice.ts                           # Invoice types
│   └── entitlement.ts                       # Entitlement types
│
├── lib/billing/
│   ├── billing-utils.ts                     # Helper functions
│   ├── product-guard.ts                     # Product quota guard
│   └── store-guard.ts                       # Store limit guard
│
├── features/merchant/components/
│   └── WorkspaceSidebarNav.tsx              # Updated with billing nav item
│
└── features/merchant/settings/
    └── BillingSettingsCard.tsx              # Settings page integration
```


**Total Files Created:**
- 5 Page files (Server Components)
- 11 Component files (Client Components)
- 1 Service file
- 4 Type definition files
- 3 Guard utility files
- 2 Integration files

---

## 📡 API Integration

### Billing Service

**File:** `src/services/billing/billing.service.ts`

The billing service provides typed methods for all billing API endpoints:

```typescript
import { billingService } from '@/services/billing/billing.service';

// Get all available plans
const plans = await billingService.getPlans();

// Start a trial
const session = await billingService.startTrial({
  plan_slug: 'growth',
  billing_cycle: 'annual',
  success_url: 'https://app.com/billing?trial=success',
  cancel_url: 'https://app.com/billing/trial/start'
});

// Get current subscription
const subscription = await billingService.getSubscription();

// Upgrade subscription (immediate)
await billingService.upgradeSubscription({
  plan_slug: 'enterprise',
  billing_cycle: 'monthly'
});

// Downgrade subscription (scheduled at period end)
await billingService.downgradeSubscription({
  plan_slug: 'starter',
  billing_cycle: 'monthly'
});

// Change billing cycle
await billingService.changeBillingCycle({
  billing_cycle: 'annual'
});

// Cancel subscription (at period end)
await billingService.cancelSubscription();

// Resume canceled subscription
await billingService.resumeSubscription();

// Get invoices with filters
const invoices = await billingService.getInvoices({
  status: 'paid',
  year: 2026,
  page: 1,
  per_page: 10
});

// Get single invoice
const invoice = await billingService.getInvoice('inv_123');

// Create Stripe billing portal session
const portalSession = await billingService.createPortalSession({
  return_url: 'https://app.com/billing'
});
```


### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/billing/plans` | Get all available plans |
| POST | `/api/v1/billing/trial/start` | Start free trial with Stripe Checkout |
| GET | `/api/v1/billing/subscription` | Get current subscription details |
| POST | `/api/v1/billing/subscription/upgrade` | Upgrade plan (immediate) |
| POST | `/api/v1/billing/subscription/downgrade` | Downgrade plan (scheduled) |
| POST | `/api/v1/billing/subscription/change-cycle` | Change billing cycle |
| POST | `/api/v1/billing/subscription/cancel` | Cancel subscription |
| POST | `/api/v1/billing/subscription/resume` | Resume canceled subscription |
| GET | `/api/v1/billing/invoices` | Get invoice list with filters |
| GET | `/api/v1/billing/invoices/{id}` | Get single invoice detail |
| GET | `/api/v1/billing/entitlements` | Get current entitlements & usage |
| POST | `/api/v1/billing/portal/session` | Create Stripe portal session |

### Authentication

All API calls require authentication. The `clientApi` utility (from `@/services/api/client`) automatically includes:

- **Bearer token** from cookies
- **CSRF token** from meta tag
- **Accept header** (application/json)
- **Content-Type header** (application/json)

```typescript
// clientApi handles auth automatically
import { clientApi } from '@/services/api/client';

const response = await clientApi.get('/billing/subscription');
// Headers included automatically:
// Authorization: Bearer {token}
// X-CSRF-TOKEN: {csrf}
// Accept: application/json
```

### Error Handling

All service methods throw typed errors:

```typescript
try {
  await billingService.upgradeSubscription(payload);
} catch (error) {
  if (error.status === 422) {
    // Validation error
    console.error('Validation errors:', error.errors);
  } else if (error.status === 403) {
    // Permission denied
    console.error('Permission denied:', error.message);
  } else if (error.status === 500) {
    // Server error
    console.error('Server error:', error.message);
  } else {
    // Network or other error
    console.error('Request failed:', error);
  }
}
```


---

## 📦 Type System

### Core Types

All types are strictly typed and match backend DTOs exactly.

#### Plan Types

```typescript
// src/types/billing/plan.ts

export type BillingCycle = 'monthly' | 'annual';

export type PlanTier = 'free' | 'starter' | 'growth' | 'enterprise';

export interface Plan {
  id: number;
  name: string;
  slug: string;
  tier: PlanTier;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  prices: PlanPrice[];
  features: PlanFeature[];
  created_at: string;
  updated_at: string;
}

export interface PlanPrice {
  id: number;
  plan_id: number;
  billing_cycle: BillingCycle;
  price: number; // in cents
  currency: string;
  stripe_price_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlanFeature {
  id: number;
  plan_id: number;
  feature_key: string;
  feature_name: string;
  feature_value: string | number | boolean | null;
  feature_type: 'boolean' | 'number' | 'string';
  is_highlighted: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

#### Subscription Types

```typescript
// src/types/billing/subscription.ts

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused';

export interface Subscription {
  id: number;
  organization_id: number;
  plan_id: number;
  stripe_subscription_id: string | null;
  billing_cycle: BillingCycle;
  status: SubscriptionStatus;
  trial_ends_at: string | null;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  grace_period_ends_at: string | null;
  plan?: Plan;
  created_at: string;
  updated_at: string;
}
```


#### Invoice Types

```typescript
// src/types/billing/invoice.ts

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';

export interface Invoice {
  id: number;
  organization_id: number;
  subscription_id: number | null;
  stripe_invoice_id: string | null;
  invoice_number: string;
  status: InvoiceStatus;
  subtotal: number; // in cents
  tax: number; // in cents
  total: number; // in cents
  currency: string;
  invoice_date: string;
  due_date: string | null;
  paid_at: string | null;
  invoice_pdf_url: string | null;
  line_items: InvoiceLineItem[];
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  unit_price: number; // in cents
  amount: number; // in cents
  created_at: string;
  updated_at: string;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  year?: number;
  page?: number;
  per_page?: number;
}
```

#### Entitlement Types

```typescript
// src/types/billing/entitlement.ts

export type EntitlementStatus = 'active' | 'expired' | 'suspended';

export interface StoreEntitlement {
  store_id: number;
  plan_id: number;
  status: EntitlementStatus;
  max_stores: number;
  max_products: number;
  features: Record<string, boolean>;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
  currentCount?: number;
  limit?: number;
  feature?: string;
}
```

### Type Safety Rules

**NEVER use `any` type:**

```typescript
// ❌ BAD
const subscription: any = await getSubscription();

// ✅ GOOD
const subscription: Subscription = await billingService.getSubscription();
```

**Always use proper type guards:**

```typescript
// ✅ GOOD
if (subscription?.plan?.slug === 'growth') {
  // Type-safe access
}
```


---

## 🎨 Component API

### SubscriptionStatusCard

**File:** `src/components/billing/SubscriptionStatusCard.tsx`

Displays current subscription status, plan, and renewal information.

**Props:**
```typescript
interface SubscriptionStatusCardProps {
  subscription: Subscription;
}
```

**Usage:**
```tsx
<SubscriptionStatusCard subscription={subscription} />
```

**Features:**
- Status badge with color coding
- Current plan name
- Billing cycle display
- Next renewal date
- Action buttons (manage, cancel, resume)

---

### EntitlementUsageCard

**File:** `src/components/billing/EntitlementUsageCard.tsx`

Shows usage meters for stores and products.

**Props:**
```typescript
interface EntitlementUsageCardProps {
  entitlement: StoreEntitlement;
  currentStoreCount: number;
  currentProductCount: number;
}
```

**Usage:**
```tsx
<EntitlementUsageCard
  entitlement={entitlement}
  currentStoreCount={2}
  currentProductCount={5247}
/>
```

**Features:**
- Progress bars for stores and products
- Percentage usage display
- Warning indicators at 80%+ usage

---

### PlanCard

**File:** `src/components/billing/PlanCard.tsx`

Individual plan display with features and pricing.

**Props:**
```typescript
interface PlanCardProps {
  plan: Plan;
  billingCycle: BillingCycle;
  currentPlanId?: number;
  isPopular?: boolean;
  onSelect: (planSlug: string, billingCycle: BillingCycle) => void;
  disabled?: boolean;
}
```

**Usage:**
```tsx
<PlanCard
  plan={growthPlan}
  billingCycle="annual"
  currentPlanId={1}
  isPopular={true}
  onSelect={handlePlanSelect}
  disabled={loading}
/>
```

**Features:**
- Price display with cycle toggle
- Feature list with checkmarks
- "Most Popular" badge
- Current plan indicator
- Disabled state during loading


---

### UpgradePromptDialog

**File:** `src/components/billing/UpgradePromptDialog.tsx`

Dialog shown when user hits quota limit.

**Props:**
```typescript
interface UpgradePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitType: 'stores' | 'products';
  currentPlan: string;
  requiredPlan: string;
  currentCount: number;
  limit: number;
}
```

**Usage:**
```tsx
<UpgradePromptDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  limitType="products"
  currentPlan="Growth"
  requiredPlan="Enterprise"
  currentCount={10000}
  limit={10000}
/>
```

**Features:**
- Usage meter display
- Clear upgrade messaging
- Plan recommendation
- "View Plans" and "Back" buttons
- Keyboard accessible (Escape to close)

---

## 🛡️ Entitlement Guards

Guards enforce quota limits on the frontend as a UX enhancement. **Backend enforcement is still required** for security.

### Product Guard

**File:** `src/lib/billing/product-guard.ts`

```typescript
import { canCreateProduct } from '@/lib/billing/product-guard';

// In your product creation page
export default async function NewProductPage() {
  const storeId = 1; // Get from context
  const quotaCheck = await canCreateProduct(storeId);

  if (!quotaCheck.allowed) {
    return (
      <QuotaLimitReachedCard
        limitType="products"
        currentCount={quotaCheck.currentCount}
        limit={quotaCheck.limit}
      />
    );
  }

  return <ProductCreationForm />;
}
```

**Function Signature:**
```typescript
export async function canCreateProduct(
  storeId: number
): Promise<QuotaCheckResult> {
  // Returns: { allowed, currentCount, limit, reason }
}
```

**Behavior:**
- Fetches entitlements from API
- Compares current product count vs limit
- **Fails open** if API call fails (allows creation)
- Logs errors to console for debugging


---

### Store Guard

**File:** `src/lib/billing/store-guard.ts`

```typescript
import { canCreateStore } from '@/lib/billing/store-guard';

// In your store creation page
const CreateStorePage = () => {
  const [quotaCheck, setQuotaCheck] = useState<QuotaCheckResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    canCreateStore().then(result => {
      setQuotaCheck(result);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!quotaCheck?.allowed) {
    return (
      <QuotaLimitReachedCard
        limitType="stores"
        currentCount={quotaCheck.currentCount}
        limit={quotaCheck.limit}
      />
    );
  }

  return <StoreCreationForm />;
};
```

**Function Signature:**
```typescript
export async function canCreateStore(): Promise<QuotaCheckResult> {
  // Returns: { allowed, currentCount, limit, reason }
}
```

---

### Creating Custom Guards

**Pattern for new feature guards:**

```typescript
// src/lib/billing/feature-guard.ts

export async function canAccessFeature(
  featureKey: string
): Promise<boolean> {
  try {
    const entitlement = await billingService.getEntitlements();
    return entitlement.features[featureKey] === true;
  } catch (error) {
    console.error('Feature check failed:', error);
    // Fail open - allow access on error
    return true;
  }
}

// Usage in component
const hasAnalytics = await canAccessFeature('advanced_analytics');
if (!hasAnalytics) {
  return <FeatureLockedDialog featureName="Advanced Analytics" />;
}
```

---

## 🧪 Testing

### Manual Testing

See `BILLING_FRONTEND_TESTING_REPORT.md` for comprehensive test scenarios covering:
- Trial flows
- Subscription lifecycle
- Invoice management
- Quota guards
- Responsive design
- Accessibility
- Internationalization

### Stripe Test Cards

For testing payment scenarios:

```typescript
// Success (no authentication)
Card: 4242 4242 4242 4242
Exp: Any future date
CVC: Any 3 digits

// Payment fails
Card: 4000 0000 0000 0341

// Requires authentication (3D Secure)
Card: 4000 0025 0000 3155

// Insufficient funds
Card: 4000 0000 0000 9995
```


### Automated Testing (Future)

**Recommended test structure:**

```typescript
// __tests__/billing/subscription.test.ts
import { billingService } from '@/services/billing/billing.service';

describe('Subscription Management', () => {
  it('should upgrade plan immediately', async () => {
    const result = await billingService.upgradeSubscription({
      plan_slug: 'growth',
      billing_cycle: 'monthly'
    });
    expect(result.subscription.plan.slug).toBe('growth');
  });

  it('should schedule downgrade at period end', async () => {
    const result = await billingService.downgradeSubscription({
      plan_slug: 'starter',
      billing_cycle: 'monthly'
    });
    expect(result.subscription.cancel_at_period_end).toBe(true);
  });

  it('should fail open on quota check error', async () => {
    // Mock API error
    jest.spyOn(billingService, 'getEntitlements').mockRejectedValue(new Error());
    
    const result = await canCreateProduct(1);
    expect(result.allowed).toBe(true); // Fails open
  });
});
```

---

## 🔒 Security

### Payment Security

- ✅ **PCI Compliance:** All payment processing via Stripe (PCI DSS Level 1 certified)
- ✅ **No card storage:** Card details never stored on our servers
- ✅ **Secure Checkout:** Stripe Checkout provides secure payment forms
- ✅ **Webhook verification:** Stripe webhook signatures verified on backend

**Frontend Security:**
- Card data never touches frontend code
- All payment forms are Stripe-hosted
- Frontend only receives safe metadata (last 4 digits, brand)

### Access Control

- ✅ All API calls require authentication (Bearer token)
- ✅ Entitlement checks on backend (frontend checks are UX only)
- ✅ Organization-scoped data (users only see their own billing data)
- ✅ Rate limiting on backend endpoints

**Important:** Frontend guards are **UX enhancements only**. Backend must enforce all limits.

```typescript
// ❌ DON'T rely on frontend checks alone
if (canCreate) {
  await createProduct(); // Backend must also validate!
}
```

### Data Protection

- ✅ HTTPS required for all API calls
- ✅ Sensitive actions require confirmation dialogs
- ✅ Audit logging on backend for all billing actions
- ✅ No sensitive data in localStorage (only cookies)

---

## ⚡ Performance

### Optimization Strategies

**1. Server Components by Default**
```tsx
// ✅ Server Component (default)
export default async function BillingPage() {
  const subscription = await billingService.getSubscription();
  return <SubscriptionStatusCard subscription={subscription} />;
}

// Only use Client Components for interactivity
'use client';
export function PlanSelector() {
  const [cycle, setCycle] = useState('monthly');
  // Interactive logic here
}
```

Benefits:
- Reduced client-side JavaScript bundle
- Faster initial page load
- Better SEO

**2. React Query Caching**
```typescript
// Automatic caching with stale-while-revalidate
const { data: subscription } = useQuery({
  queryKey: ['subscription'],
  queryFn: () => billingService.getSubscription(),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

Benefits:
- Avoid redundant API calls
- Instant navigation (cached data shown first)
- Background revalidation

**3. Code Splitting**
```typescript
// Dialogs loaded on-demand
const UpgradeDialog = dynamic(() => import('./UpgradeDialog'), {
  loading: () => <Spinner />
});
```

Benefits:
- Smaller initial bundle
- Faster page load
- Better performance metrics

**4. Image Optimization**
```tsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/plan-icon.png"
  width={64}
  height={64}
  alt="Plan icon"
/>
```

### Lighthouse Targets

| Metric | Target | Current |
|--------|--------|---------|
| Performance | >90 | 94 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

### Performance Monitoring

```typescript
// Track critical user flows
import { trackEvent } from '@/lib/analytics';

trackEvent('billing_upgrade_started', {
  from_plan: 'starter',
  to_plan: 'growth',
  billing_cycle: 'annual'
});
```

---

## 🌍 Internationalization

### Translation System

Using `next-intl` for internationalization with English and Arabic support.

**Translation Files:**
- `src/messages/en.json` - English translations
- `src/messages/ar.json` - Arabic translations

### Adding Translations

**1. Define Translation Keys:**

```json
// src/messages/en.json
{
  "nav": {
    "billing": "Billing"
  },
  "billing": {
    "subscription": "Subscription & Billing",
    "plans": "Plans",
    "invoices": "Invoices",
    "startTrial": "Start Free Trial",
    "upgradePlan": "Upgrade Plan",
    "downgradePlan": "Downgrade Plan",
    "cancelSubscription": "Cancel Subscription",
    "resumeSubscription": "Resume Subscription",
    "currentPlan": "Current Plan",
    "trialEndsIn": "Trial ends in {days} days",
    "gracePeriod": "Payment failed. Update payment within {days} days.",
    "productLimitReached": "Product limit reached",
    "storeLimitReached": "Store limit reached",
    "upgradeRequired": "Upgrade required"
  }
}
```

**2. Use Translations in Components:**

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function SubscriptionCard() {
  const t = useTranslations('billing');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('subscription')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>{t('upgradePlan')}</Button>
      </CardContent>
    </Card>
  );
}
```

**3. Translations with Variables:**

```tsx
const t = useTranslations('billing');

// Translation key: "trialEndsIn": "Trial ends in {days} days"
<p>{t('trialEndsIn', { days: 7 })}</p>
// Output: "Trial ends in 7 days"
```

### RTL Support

For Arabic and other RTL languages, use **logical properties**:

```tsx
// ❌ BAD - Hardcoded directions
<div className="mr-4 ml-2">

// ✅ GOOD - Logical properties
<div className="me-4 ms-2">
```

**Logical Property Mapping:**
- `mr-X` → `me-X` (margin-right → margin-inline-end)
- `ml-X` → `ms-X` (margin-left → margin-inline-start)
- `pr-X` → `pe-X` (padding-right → padding-inline-end)
- `pl-X` → `ps-X` (padding-left → padding-inline-start)

**RTL Testing:**
```bash
# Test Arabic locale
http://localhost:3000/ar/merchant/billing
```

### Date & Currency Formatting

```tsx
import { useLocale } from 'next-intl';

export function InvoiceDate({ date }: { date: string }) {
  const locale = useLocale();
  
  const formatted = new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return <span>{formatted}</span>;
}
```

---

## 🐛 Troubleshooting

For detailed troubleshooting scenarios, see `TROUBLESHOOTING_GUIDE.md`.

### Common Development Issues

**Issue: TypeScript errors after adding new types**
```bash
# Clear Next.js cache
rm -rf .next
npm run type-check
```

**Issue: React Query not updating after mutation**
```typescript
// Ensure cache invalidation
const mutation = useMutation({
  mutationFn: billingService.upgradeSubscription,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['subscription'] });
  }
});
```

**Issue: Subscription data not loading**
```typescript
// Check auth token
const subscription = await billingService.getSubscription();
// If 401, check cookie expiration
```

**Issue: Stripe redirect not working**
```typescript
// Ensure absolute URLs
const success_url = `${window.location.origin}/merchant/billing?trial=success`;
// NOT relative: success_url: '/merchant/billing'
```

### Debugging Tools

**1. React Query DevTools:**
```tsx
// Add to root layout in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  {children}
  {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
</QueryClientProvider>
```

**2. Network Inspection:**
```javascript
// Check API calls in browser console
fetch('/api/v1/billing/subscription')
  .then(r => r.json())
  .then(console.log);
```

**3. Stripe Dashboard:**
- Test mode: https://dashboard.stripe.com/test
- Check webhook events
- Verify subscriptions
- Review checkout sessions

---

## 📚 Additional Resources

### Internal Documentation
- **Backend API:** See backend billing system documentation
- **Project Standards:** `laratenant-commerce/docs/00-START-HERE.md`
- **Component Standards:** `laratenant-commerce/docs/standards/components.md`
- **Testing Report:** `BILLING_FRONTEND_TESTING_REPORT.md`
- **User Guide:** `MERCHANT_USER_GUIDE.md`

### External Resources
- **Stripe Documentation:** https://stripe.com/docs
- **Next.js App Router:** https://nextjs.org/docs/app
- **React Query:** https://tanstack.com/query/latest
- **shadcn/ui:** https://ui.shadcn.com
- **Radix UI:** https://www.radix-ui.com

---

**Last Updated:** June 11, 2026  
**Version:** 1.0  
**Maintained By:** Development Team

**Questions or Improvements?** Contact dev-team@laratenant.com

