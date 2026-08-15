# Complete Arabic Translation Fix for Billing Plans Page

## Problem
The billing plans page at `/ar/merchant/billing/plans` was displaying English text instead of Arabic, even though the route indicated it should be in Arabic.

## Root Causes
1. **Translation file structure issue**: The Arabic translation keys (`plans`, `downgrade`, `errors`, `invoices`) were at the root level instead of nested inside the `billing` object
2. **Component not using translations**: The page components (`PlansPageClient.tsx`, `PlanCard.tsx`, `page.tsx`) had hardcoded English strings instead of using the `next-intl` translation system

## Solutions Applied

### 1. Fixed Translation File Structure
**File**: `src/locales/ar/common.json`

Moved the following sections to be nested inside `billing`:
- `plans` 
- `downgrade`
- `errors`
- `invoices`

**Before**:
```json
{
  "billing": { ... },
  "plans": { ... },
  "downgrade": { ... }
}
```

**After**:
```json
{
  "billing": {
    ...
    "plans": { ... },
    "downgrade": { ... },
    "errors": { ... },
    "invoices": { ... }
  }
}
```

### 2. Updated PlansPageClient Component
**File**: `src/app/[locale]/(merchant)/merchant/billing/plans/PlansPageClient.tsx`

**Changes**:
- Added `useTranslations` hook import from `next-intl`
- Created translation instances:
  - `t = useTranslations('billing.plans')` - for plan-specific text
  - `tBilling = useTranslations('billing')` - for general billing text
  - `tErrors = useTranslations('billing.errors')` - for error messages
- Replaced all hardcoded English strings with translation keys:

| Original English | Translation Key | Arabic Translation |
|-----------------|-----------------|-------------------|
| "Choose Your Plan" | `t('title')` | "اختر خطتك" |
| "Select the plan that fits your business needs" | `t('subtitle')` | "اختر الخطة التي تناسب احتياجات عملك" |
| "Start your paid subscription..." | `t('trialSubtitle')` | "ابدأ اشتراكك المدفوع..." |
| "Loading plans..." | `t('loadingPlans')` | "جارٍ تحميل الخطط..." |
| "No plans available" | `t('noPlans')` | "لا توجد خطط متاحة" |
| "Monthly" | `t('monthly')` | "شهري" |
| "Annual" | `t('annual')` | "سنوي" |
| "(Save 20%)" | `t('savePercentage')` | "(وفّر 20%)" |
| "Plan upgraded!" | `t('planUpgraded')` | "تمت ترقية الخطة!" |
| "Downgrade scheduled" | `t('downgradeScheduled')` | "تم جدولة التخفيض" |
| Error messages | `tErrors(...)` | Various error messages |

### 3. Updated PlanCard Component
**File**: `src/components/billing/PlanCard.tsx`

**Changes**:
- Added `useTranslations` hook
- Replaced hardcoded strings:

| Original English | Translation Key | Arabic Translation |
|-----------------|-----------------|-------------------|
| "Popular" | `t('popular')` | "الأكثر شعبية" |
| "/year" | `t('perYear')` | "/سنة" |
| "/month" | `t('perMonth')` | "/شهر" |
| "billed annually" | `t('billedAnnually')` | "الدفع السنوي" |
| "Included" | `t('included')` | "مشمول" |
| "Up to {count}" | `t('upTo', { count })` | "حتى {count}" |
| "Current Plan" | `t('currentPlan')` | "الخطة الحالية" |
| "Select {plan}" | `t('selectPlan', { plan })` | "اختر {plan}" |

### 4. Updated Page Metadata
**File**: `src/app/[locale]/(merchant)/merchant/billing/plans/page.tsx`

**Changes**:
- Converted static metadata to dynamic `generateMetadata` function
- Used `getTranslations` from `next-intl/server` to fetch translations server-side
- Page title and description now respect the locale

## Translation Keys Structure

All translations are now properly structured under `billing.plans`:

```json
{
  "billing": {
    "plans": {
      "title": "اختر خطتك",
      "subtitle": "اختر الخطة التي تناسب احتياجات عملك",
      "trialSubtitle": "ابدأ اشتراكك المدفوع باختيار خطة",
      "loadingPlans": "جارٍ تحميل الخطط...",
      "noPlans": "لا توجد خطط متاحة",
      "monthly": "شهري",
      "annual": "سنوي",
      "savePercentage": "(وفّر 20%)",
      "perYear": "/سنة",
      "perMonth": "/شهر",
      "billedAnnually": "الدفع السنوي",
      "currentPlan": "الخطة الحالية",
      "selectPlan": "اختر {plan}",
      "popular": "الأكثر شعبية",
      "upTo": "حتى {count}",
      "included": "مشمول",
      "redirectingToCheckout": "جارٍ التحويل إلى صفحة الدفع",
      "settingUpSubscription": "جارٍ إعداد اشتراكك...",
      "planUpgraded": "تمت ترقية الخطة!",
      "upgradedTo": "تمت ترقيتك إلى {plan}",
      "downgradeScheduled": "تم جدولة التخفيض",
      "downgradeMessage": "ستتغير خطتك إلى {plan} في نهاية فترة الفوترة..."
    },
    "errors": {
      "noActiveStore": "لم يتم العثور على متجر نشط. يرجى اختيار متجر أولاً.",
      "planNotFound": "الخطة غير موجودة",
      "priceNotFound": "السعر غير متوفر لدورة الفوترة المحددة",
      "checkoutFailed": "فشل بدء عملية الدفع. يرجى المحاولة مرة أخرى.",
      "planChangeFailed": "فشل تغيير الخطة. يرجى المحاولة مرة أخرى."
    }
  }
}
```

## Files Modified
1. ✅ `src/locales/ar/common.json` - Fixed structure
2. ✅ `src/app/[locale]/(merchant)/merchant/billing/plans/PlansPageClient.tsx` - Added translations
3. ✅ `src/app/[locale]/(merchant)/merchant/billing/plans/page.tsx` - Dynamic metadata
4. ✅ `src/components/billing/PlanCard.tsx` - Added translations

## Testing Checklist
- [ ] Navigate to `/ar/merchant/billing/plans`
- [ ] Verify page title is in Arabic: "اختر خطتك"
- [ ] Verify subtitle is in Arabic
- [ ] Verify billing cycle buttons show "شهري" and "سنوي (وفّر 20%)"
- [ ] Verify plan cards show "الأكثر شعبية" badge
- [ ] Verify pricing shows "/شهر" or "/سنة"
- [ ] Verify "الخطة الحالية" appears on current plan
- [ ] Verify "اختر {plan name}" appears on other plans
- [ ] Verify feature list shows "مشمول" for included features
- [ ] Verify "حتى {number}" for limited features
- [ ] Test plan selection and verify toast messages in Arabic

## Result
✅ The billing plans page now fully displays in Arabic when accessed via the `/ar` locale
✅ All user-facing text is translated
✅ Error messages are in Arabic
✅ Toast notifications are in Arabic
✅ Page metadata (title/description) is in Arabic
