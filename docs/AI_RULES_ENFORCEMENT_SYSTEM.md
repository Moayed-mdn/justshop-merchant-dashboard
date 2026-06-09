# 🤖 AI Rules Enforcement System (Commerce Frontend)

**Purpose**: Ensure AI assistants strictly follow Next.js/TypeScript architectural rules  
**Authority**: docs/standards/ and docs/architecture/ are the supreme law  
**Date**: June 7, 2026

---

## 🎯 Core Principle

**AI MUST follow the rules defined in docs/standards/ and docs/architecture/ WITHOUT EXCEPTION.**

This document teaches you how to make AI assistants respect the frontend architecture rules.

---

## 📋 Table of Contents

1. [How to Make AI Follow Rules](#how-to-make-ai-follow-rules)
2. [AI Prompt Templates](#ai-prompt-templates)
3. [Rule Enforcement Checklist](#rule-enforcement-checklist)
4. [Common AI Mistakes & Prevention](#common-ai-mistakes--prevention)
5. [Code Review Checklist for AI Output](#code-review-checklist)

---

## 1. How to Make AI Follow Rules

### Method 1: Explicit Rule Reference (BEST)

When asking AI to do something, **always reference the standards documents**:

```
Read these standards before implementing:
- /laratenant-commerce/docs/standards/components.md
- /laratenant-commerce/docs/standards/typescript.md
- /laratenant-commerce/docs/standards/fetching.md
- /laratenant-commerce/docs/standards/routing.md

Strictly follow ALL rules while implementing [your task].

Critical rules to follow:
- Server Components by default (Client only for interactivity)
- NO `any` type (use explicit types)
- Use serverFetch for SSR, clientFetch for browser
- CMS routes use cmsService
- Thin components (business logic in services)
- All routes under /{locale}/

Now implement: [your specific task]
```

### Method 2: Provide Rules as Context

Copy the critical rules into your prompt:

```
MANDATORY RULES (from docs/standards/):

1. Server/Client Boundary:
   ❌ 'use client' everywhere
   ✅ Server Components by default, Client only for interactivity

2. TypeScript Safety:
   ❌ any type
   ✅ Explicit types or unknown

3. Data Fetching:
   ❌ fetch() directly in pages
   ✅ serverFetch in Server Components, clientFetch for browser

4. CMS Routes:
   ❌ Direct API calls from components
   ✅ Use cmsService methods (getPage, getBlogPost, etc.)

5. Component Structure:
   ❌ Business logic in UI components
   ✅ Thin components, logic in services/features

Now implement: [your task]
```

### Method 3: Ask AI to Extract and Confirm Rules

```
1. Read docs/standards/ files relevant to [feature]
2. Extract the rules applicable to this task
3. List them for my confirmation
4. Then implement following those rules strictly
```

---

## 2. AI Prompt Templates

### Template 1: New Feature Implementation

```
I need to implement [feature name] for the Next.js commerce frontend.

STRICT REQUIREMENTS:

1. Read and follow ALL rules in:
   - /laratenant-commerce/docs/standards/components.md
   - /laratenant-commerce/docs/standards/typescript.md
   - /laratenant-commerce/docs/standards/fetching.md
   - /laratenant-commerce/docs/standards/routing.md

2. Architecture compliance checklist:
   ✓ Server Components by default
   ✓ 'use client' only where needed
   ✓ No `any` types
   ✓ Types match backend contracts
   ✓ serverFetch for SSR data
   ✓ clientFetch for browser requests
   ✓ CMS routes use cmsService
   ✓ Thin components
   ✓ Business logic in services
   ✓ Route under /{locale}/
   ✓ Merchant routes under /merchant/*
   ✓ RTL compatibility
   ✓ generateMetadata() for SEO

3. Feature: [describe your feature]

4. Acceptance criteria:
   - [criterion 1]
   - [criterion 2]

5. BEFORE writing code, confirm:
   - Is this a Server or Client Component?
   - What files need to be created?
   - Are all rules satisfied?

6. Then implement following the standards.
```

### Template 2: Bug Fix

```
I need to fix [bug description].

MANDATORY PROCESS:

1. Read relevant docs/standards/ files
2. Identify which layer has the bug
3. Propose the fix while maintaining ALL rules:
   - Server/Client boundary intact
   - No `any` types introduced
   - Proper fetch utility used
   - Type safety maintained
   - Component stays thin

4. Show me the fix for approval before applying

Bug details: [describe bug]
```

### Template 3: Refactoring

```
I need to refactor [component] to be architecture-compliant.

STRICT REQUIREMENTS:

1. Read docs/standards/ sections on:
   - [relevant sections]

2. Current violations to fix:
   - [violation 1]
   - [violation 2]

3. Target state:
   - 100% standards-compliant
   - All rules followed
   - No regressions

4. Show me the refactoring plan first
5. Then implement with my approval

Component: [describe what to refactor]
```

### Template 4: Code Review by AI

```
Review this code against docs/standards/ rules:

[paste code here]

Check for violations of:
1. Server/Client Component boundary
2. TypeScript safety (any usage)
3. Data fetching patterns
4. CMS service usage
5. Component thickness
6. Type matching with backend
7. Routing conventions
8. RTL compatibility
9. SEO metadata
10. State management

List ALL violations found and suggest fixes.
```

---

## 3. Rule Enforcement Checklist

Use this checklist when asking AI to implement anything:

### ✅ Pre-Implementation Checklist

- [ ] AI has read relevant docs/standards/ files
- [ ] AI understands Server vs Client Component boundary
- [ ] AI knows data fetching patterns
- [ ] AI confirmed route structure (locale, merchant)
- [ ] AI confirmed Server Component default approach
- [ ] AI confirmed type safety strategy
- [ ] AI confirmed CMS service usage (if applicable)

### ✅ During Implementation Checklist

- [ ] Files created in correct folders
- [ ] Server Components used by default
- [ ] 'use client' only where needed (hooks, events)
- [ ] No `any` types used
- [ ] Types match backend DTOs/Resources
- [ ] serverFetch used in Server Components
- [ ] clientFetch used for browser requests
- [ ] CMS routes use cmsService
- [ ] Components are thin (no business logic)
- [ ] Business logic in services/features
- [ ] Routes under /{locale}/
- [ ] Merchant routes under /merchant/*
- [ ] RTL support via logical properties
- [ ] generateMetadata() for SEO
- [ ] React Query for mutations
- [ ] AuthContext for auth state

### ✅ Post-Implementation Checklist

- [ ] Code follows standards
- [ ] All rules followed
- [ ] No anti-patterns present
- [ ] Type safety verified
- [ ] Server/Client boundary respected
- [ ] RTL tested
- [ ] Tests written (if applicable)
- [ ] Documentation updated

---

## 4. Common AI Mistakes & Prevention

### ❌ Mistake 1: Using 'use client' Everywhere

**What AI does wrong:**
```tsx
'use client' // ❌ Unnecessary

export default function Page() {
  return <div>Static content</div>
}
```

**Prevention prompt:**
```
CRITICAL: Use Server Components by default.
Add 'use client' ONLY when you need:
- React hooks (useState, useEffect, etc.)
- Event handlers (onClick, onChange, etc.)
- Browser APIs (window, document, etc.)

Correct approach:
- Page is Server Component (fetches data)
- Interactive parts are Client Components (leaves)
```

---

### ❌ Mistake 2: Using `any` Type

**What AI does wrong:**
```typescript
const handleSubmit = (data: any) => { // ❌ any type
  // ...
}
```

**Prevention prompt:**
```
CRITICAL: NO `any` types allowed.

❌ FORBIDDEN: data: any
✅ REQUIRED: data: CreateProductData

Use:
- Explicit interfaces
- Type imports from backend contracts
- unknown (if truly unknown, then narrow)

TypeScript strict mode MUST pass.
```

---

### ❌ Mistake 3: Direct fetch() in Components

**What AI does wrong:**
```tsx
export default async function Page() {
  const res = await fetch('/api/products') // ❌ Direct fetch
  const data = await res.json()
  return <div>{/* ... */}</div>
}
```

**Prevention prompt:**
```
CRITICAL: Never use fetch() directly.

❌ FORBIDDEN: fetch('/api/...')
✅ REQUIRED SSR: serverFetch('/api/...')
✅ REQUIRED Browser: clientFetch('/api/...')

For CMS routes:
✅ REQUIRED: cmsService.getPage(slug)

These utilities handle:
- Cookie forwarding
- Locale headers
- Error normalization
- XSRF tokens
```

---

### ❌ Mistake 4: Business Logic in Components

**What AI does wrong:**
```tsx
export function ProductForm() {
  const handleSubmit = async (data: FormData) => {
    // 50 lines of validation
    // API calls
    // Error handling
    // State updates
  }
  return <form>{/* ... */}</form>
}
```

**Prevention prompt:**
```
CRITICAL: Components MUST be thin.

Required pattern:
1. Component handles UI only
2. Business logic in services or features
3. React Query for data mutations
4. Form validation in schemas

Example:
export function ProductForm() {
  const mutation = useCreateProduct() // Hook handles logic
  
  const onSubmit = (data: ProductFormData) => {
    mutation.mutate(data) // Simple delegation
  }
  
  return <form onSubmit={handleSubmit(onSubmit)}>{/* UI */}</form>
}
```

---

### ❌ Mistake 5: Missing Type Safety with Backend

**What AI does wrong:**
```typescript
// Frontend type (made up)
interface Product {
  id: number
  name: string
}

// Backend returns: { id, name, store_id, slug, status }
// ❌ Type mismatch!
```

**Prevention prompt:**
```
CRITICAL: Frontend types MUST match backend contracts.

1. Check backend API Resource structure
2. Create matching frontend type
3. Use type guards or validation
4. Handle all optional fields

Correct:
interface Product {
  id: number
  name: string
  store_id: number // ✅ Matches backend
  slug: string
  status: 'active' | 'draft'
}
```

---

### ❌ Mistake 6: Wrong Route Structure

**What AI does wrong:**
```
src/app/products/page.tsx  ❌ Missing locale
src/app/stores/[id]/products/page.tsx  ❌ Using legacy pattern
```

**Prevention prompt:**
```
CRITICAL: Routes MUST follow conventions.

❌ WRONG:
src/app/products/page.tsx

✅ CORRECT:
src/app/[locale]/merchant/products/page.tsx

Rules:
- All routes under /{locale}/
- Merchant routes under /merchant/*
- Store ID from session, not URL
```

---

### ❌ Mistake 7: Manual <head> Tags for SEO

**What AI does wrong:**
```tsx
export default function Page() {
  return (
    <>
      <Head>  {/* ❌ Wrong API */}
        <title>My Page</title>
      </Head>
      <div>Content</div>
    </>
  )
}
```

**Prevention prompt:**
```
CRITICAL: Use generateMetadata() for SEO.

❌ FORBIDDEN: <Head>, <title>, manual meta tags
✅ REQUIRED: generateMetadata()

Correct:
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'My Page',
    description: 'Description',
  }
}

export default function Page() {
  return <div>Content</div>
}
```

---

### ❌ Mistake 8: localStorage for Auth

**What AI does wrong:**
```typescript
// Store token in localStorage
localStorage.setItem('token', token) // ❌ Security issue
```

**Prevention prompt:**
```
CRITICAL: NO localStorage for auth.

❌ FORBIDDEN: localStorage.setItem('token', ...)
✅ REQUIRED: Cookie-based session (Sanctum)

Auth state management:
- AuthContext provides user state
- Cookies handled by backend
- No tokens in browser storage

Check AuthContext usage in existing code.
```

---

## 5. Code Review Checklist for AI Output

When AI gives you code, verify these points:

### Component Layer
- [ ] 'use client' only where needed
- [ ] Server Components for data fetching
- [ ] Client Components for interactivity
- [ ] No business logic in UI components
- [ ] Thin components (UI only)

### TypeScript
- [ ] No `any` types
- [ ] Explicit interfaces
- [ ] Types match backend contracts
- [ ] All optional fields handled
- [ ] Proper null safety

### Data Fetching
- [ ] serverFetch in Server Components
- [ ] clientFetch in browser code
- [ ] CMS routes use cmsService
- [ ] No direct fetch() calls
- [ ] Proper error handling

### Routing
- [ ] All routes under /{locale}/
- [ ] Merchant routes under /merchant/*
- [ ] No legacy /stores/[id]/ patterns
- [ ] generateMetadata() for SEO
- [ ] No manual <head> tags

### State Management
- [ ] React Query for server state
- [ ] Zustand for global UI state
- [ ] AuthContext for auth state
- [ ] No localStorage for sensitive data

### Styling & RTL
- [ ] Uses shadcn/ui components
- [ ] Logical properties for RTL
- [ ] rtl: prefix where needed
- [ ] Consistent with design system

### Services & Features
- [ ] Business logic in services
- [ ] Reuses existing patterns
- [ ] Centralized query keys
- [ ] Proper error handling

---

## 6. Example: Perfect AI Interaction

### Your Prompt:
```
I need to add a "create brand" feature to the merchant dashboard.

MANDATORY RULES from docs/standards/:
1. Server Components by default
2. No `any` types
3. Use clientFetch for mutations
4. Thin components
5. Business logic in services
6. React Query for data mutations
7. Route under /[locale]/merchant/brands
8. generateMetadata() for SEO
9. RTL compatible
10. Types match backend

Steps:
1. Confirm component structure
2. List files to create
3. Show implementation plan
4. Implement following standards

Do this now.
```

### AI Should Respond:
```
I'll implement the "create brand" feature following docs/standards/ strictly.

COMPONENT STRUCTURE:
- Server Component: page.tsx (route wrapper, metadata)
- Client Component: CreateBrandForm (interactive form)
- Hook: useCreateBrand (React Query mutation)
- Service: brands.service.ts (API call logic)
- Type: types/brand.ts (matches backend)

FILES TO CREATE:
1. src/app/[locale]/merchant/brands/create/page.tsx (Server)
2. src/features/brands/components/CreateBrandForm.tsx (Client)
3. src/features/brands/hooks/useCreateBrand.ts (Hook)
4. src/features/brands/services/brands.service.ts (Service)
5. src/features/brands/types/brand.ts (Types)
6. src/features/brands/schemas/brandSchema.ts (Validation)

STANDARDS COMPLIANCE:
✓ Server Component for route
✓ Client Component for form
✓ No `any` types
✓ Types match backend Resource
✓ clientFetch in service
✓ React Query in hook
✓ Thin components
✓ Business logic in service
✓ Route under /[locale]/merchant/
✓ generateMetadata() for SEO
✓ RTL compatible forms

IMPLEMENTATION PLAN:
[Shows detailed plan following standards]

Proceed with implementation?
```

---

## 7. Quick Reference Card for AI Prompts

Copy this into every AI prompt:

```
🔥 MANDATORY FRONTEND RULES 🔥

1. Server Components by default → Client Components ONLY for interactivity
2. NO `any` type → use explicit types or `unknown`
3. Use serverFetch for SSR → clientFetch for browser requests
4. CMS routes MUST use cmsService (no direct fetch)
5. Keep components thin → business logic in services/features
6. Use existing UI patterns (shadcn/ui)
7. All routes under /{locale}/ prefix
8. Merchant routes under /merchant/* (canonical)
9. NO localStorage for auth → use AuthContext + cookies
10. RTL support → use rtl: prefix or logical properties
11. generateMetadata() for SEO → NO manual <head> tags
12. React Query for mutations → centralized queryKeys
13. Type safety → frontend types MUST match backend DTOs

NO EXCEPTIONS. NO SHORTCUTS. FOLLOW STRICTLY.
```

---

## 8. Enforcement Workflow

### Step 1: Before Asking AI
- [ ] Identify which feature area (products, orders, CMS, etc.)
- [ ] Know which standards apply
- [ ] Have docs/standards/ open
- [ ] Prepare rule checklist

### Step 2: In Your Prompt
- [ ] Reference docs/standards/ explicitly
- [ ] List critical rules for this task
- [ ] Demand confirmation before implementation
- [ ] Request standards compliance check

### Step 3: After AI Responds
- [ ] Review against checklist
- [ ] Check for rule violations
- [ ] Verify component structure
- [ ] Confirm standards followed

### Step 4: If Violations Found
- [ ] Point out specific rule violated
- [ ] Reference docs/standards/ section
- [ ] Demand correction
- [ ] Re-verify after fix

---

## 9. Summary

### To Make AI Follow Rules:

1. **Always reference docs/standards/ in prompts**
2. **List critical rules explicitly**
3. **Use provided prompt templates**
4. **Demand confirmation before implementation**
5. **Review output against checklist**
6. **Reject code that violates rules**
7. **Train AI by pointing out violations**

### Key Success Factors:

- **Be explicit**: Don't assume AI knows the rules
- **Be repetitive**: Mention rules in every prompt
- **Be strict**: Reject any violation immediately
- **Be consistent**: Always enforce, never compromise

---

## 10. Resources

**Primary Authority:**
- `/laratenant-commerce/docs/standards/` - All coding standards
- `/laratenant-commerce/docs/architecture/` - Architecture rules

**Quick References:**
- This document - AI enforcement guide
- Rule checklist above
- Prompt templates above

---

**Remember**: AI is a tool. YOU enforce the rules. Be strict, be consistent, and your codebase will remain clean and maintainable.

---

**Date**: June 7, 2026  
**Authority**: docs/standards/ + docs/architecture/  
**Status**: Active enforcement guide
