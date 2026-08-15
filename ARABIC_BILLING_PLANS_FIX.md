# Arabic Translation Fix for Billing Plans Page

## Issue
The billing plans page at `/ar/merchant/billing/plans` was displaying English text instead of Arabic translations, even though the page was supposed to be in Arabic.

## Root Cause
The Arabic translation file (`src/locales/ar/common.json`) had the billing-related translation sections (`plans`, `downgrade`, `errors`, `invoices`) placed at the **root level** instead of being nested **inside** the `billing` object, unlike the English version.

This structural mismatch caused the application to fail finding the translations at the expected path `billing.plans.*`, resulting in fallback to English text.

## Solution
Restructured the Arabic translation file to match the English file structure by moving the following sections inside the `billing` object:
- `plans`
- `downgrade`
- `errors`
- `invoices`

## Changes Made
**File**: `/home/leader/projects/full-stack/justshop-multitenant-commerce-platform/laratenant-commerce/src/locales/ar/common.json`

### Before:
```json
{
  "billing": {
    "title": "...",
    ...
    "payment": { ... }
  },
  "plans": { ... },
  "downgrade": { ... },
  "errors": { ... },
  "invoices": { ... },
  "settings": { ... }
}
```

### After:
```json
{
  "billing": {
    "title": "...",
    ...
    "payment": { ... },
    "plans": { ... },
    "downgrade": { ... },
    "errors": { ... },
    "invoices": { ... }
  },
  "settings": { ... }
}
```

## Arabic Translations Now Working
The following translations are now properly accessible on the billing plans page:

- **Title**: "اختر خطتك" (Choose Your Plan)
- **Subtitle**: "اختر الخطة التي تناسب احتياجات عملك" (Select the plan that fits your business needs)
- **Monthly**: "شهري" (Monthly)
- **Annual**: "سنوي" (Annual)
- **Save Percentage**: "(وفّر 20%)" (Save 20%)
- **Current Plan**: "الخطة الحالية" (Current Plan)
- **Popular**: "الأكثر شعبية" (Popular)

## Verification
✅ JSON structure validated
✅ All translation keys present (22 keys matched between English and Arabic)
✅ Proper nesting confirmed

## Testing
To verify the fix:
1. Navigate to `/ar/merchant/billing/plans`
2. Confirm all text displays in Arabic
3. Check that plan selection buttons show Arabic labels
4. Verify billing cycle toggles (شهري/سنوي) display correctly
