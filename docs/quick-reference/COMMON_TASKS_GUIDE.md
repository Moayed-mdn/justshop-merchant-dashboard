# ⚡ Common Tasks - Quick Reference Guide

**Fast answers for everyday development tasks**  
**Last Updated**: June 7, 2026

---

## 🎯 Most Common Tasks

### 1. Start Development
```bash
npm install          # First time only
npm run dev         # Start dev server
# → http://localhost:3000
```

### 2. Add a New Feature
```markdown
1. Read: standards/components.md + standards/fetching.md
2. Use: AI_PROMPT_TEMPLATE.md for AI help
3. Create: Component in src/features/[feature-name]/
4. Test: npm run type-check && npm run lint
5. Verify: Browser + RTL (Arabic locale)
```

### 3. Fix a Bug
```markdown
1. Identify: Which layer (UI, API, routing)?
2. Check: troubleshooting/ for similar issues
3. Read: Relevant standards doc
4. Fix: Follow standards
5. Verify: No regressions
```

### 4. Add a New Route
```markdown
Location: src/app/[locale]/...
Pattern: /{locale}/path/to/route
Merchant: /{locale}/merchant/path

Example:
src/app/[locale]/merchant/products/page.tsx
→ /en/merchant/products
→ /ar/merchant/products
```

### 5. Create a New Component
```markdown
1. Decide: Server or Client Component?
   - Server: Default (no interactivity)
   - Client: Only if interactive ("use client")

2. Location:
   - Feature-specific: src/features/[feature]/components/
   - Shared: src/components/
   - UI primitives: src/components/ui/

3. Pattern:
   - Thin component (presentation only)
   - Logic in services/hooks
   - Props interface exported
   - TypeScript strict mode
```

---

## 📦 Component Patterns

### Server Component (Default)
```typescript
// src/features/products/components/ProductList.tsx
import { serverFetch } from '@/lib/fetch/server-fetch'

interface Product {
  id: number
  name: string
  price: number
}

export async function ProductList() {
  const { data } = await serverFetch<{ data: Product[] }>('/api/products')
  
  return (
    <div>
      {data.data.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

### Client Component (Interactive)
```typescript
// src/features/products/components/ProductActions.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ProductActionsProps {
  productId: number
}

export function ProductActions({ productId }: ProductActionsProps) {
  const [loading, setLoading] = useState(false)
  
  const handleAddToCart = async () => {
    setLoading(true)
    // Logic here
    setLoading(false)
  }
  
  return (
    <Button onClick={handleAddToCart} disabled={loading}>
      Add to Cart
    </Button>
  )
}
```

---

## 🔄 Data Fetching Patterns

### Server-Side Fetch (SSR)
```typescript
// In Server Component or server action
import { serverFetch } from '@/lib/fetch/server-fetch'

const { data, error } = await serverFetch<ResponseType>('/api/endpoint', {
  headers: { /* custom headers */ },
  cache: 'no-store', // or 'force-cache'
})
```

### Client-Side Fetch (Browser)
```typescript
// In Client Component
'use client'

import { clientFetch } from '@/lib/fetch/client-fetch'
import { useQuery } from '@tanstack/react-query'

export function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => clientFetch<Product[]>('/api/products'),
  })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{/* render data */}</div>
}
```

### Mutation (POST/PUT/DELETE)
```typescript
'use client'

import { clientFetch } from '@/lib/fetch/client-fetch'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function ProductForm() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: (data: ProductInput) => 
      clientFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      mutation.mutate(formData)
    }}>
      {/* form fields */}
    </form>
  )
}
```

---

## 🎨 Styling Patterns

### Tailwind CSS
```typescript
// Standard styling
<div className="flex items-center gap-4 p-4">
  <h1 className="text-2xl font-bold">Title</h1>
  <Button variant="primary">Click</Button>
</div>

// RTL-compatible (logical properties)
<div className="ps-4 pe-4">  {/* padding-inline-start/end */}
  <div className="ms-2">     {/* margin-inline-start */}
    Content
  </div>
</div>

// RTL-specific with plugin
<div className="text-start rtl:text-end">
  Aligned text
</div>
```

### shadcn/ui Components
```typescript
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

<Card>
  <Input placeholder="Enter text" />
  <Button>Submit</Button>
</Card>
```

---

## 🌍 Internationalization

### Using Translations
```typescript
// Server Component
import { getTranslations } from 'next-intl/server'

export async function MyServerComponent() {
  const t = await getTranslations('namespace')
  
  return <h1>{t('key')}</h1>
}

// Client Component
'use client'

import { useTranslations } from 'next-intl'

export function MyClientComponent() {
  const t = useTranslations('namespace')
  
  return <h1>{t('key')}</h1>
}
```

### Translation Files
```
Location: messages/[locale].json

messages/
├── en.json
└── ar.json

Example (en.json):
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "products": {
    "title": "Products"
  }
}
```

---

## 🔒 Authentication Patterns

### Check Auth Status
```typescript
// Server Component
import { auth } from '@/lib/auth'

export async function ProtectedPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }
  
  return <div>Protected content</div>
}

// Client Component
'use client'

import { useAuth } from '@/features/auth/hooks/useAuth'

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) return null
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

## 🧪 Testing Patterns

### Unit Test
```typescript
// src/lib/utils/__tests__/format.test.ts
import { formatPrice } from '../format'

describe('formatPrice', () => {
  it('formats price correctly', () => {
    expect(formatPrice(1234.56)).toBe('$1,234.56')
  })
})
```

### Component Test
```typescript
// src/components/Button/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### E2E Test
```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'user@example.com')
  await page.fill('[name="password"]', 'password')
  await page.click('[type="submit"]')
  
  await expect(page).toHaveURL('/merchant/dashboard')
})
```

---

## 🐛 Debugging

### Common Issues

#### 1. Hydration Error
```
Problem: HTML mismatch between server and client
Solution: 
- Check for browser-only APIs in Server Components
- Ensure consistent rendering
- Use 'use client' if needed

Debug:
- Check browser console
- Look for differences in HTML
- Review component rendering logic
```

#### 2. Type Errors
```
Problem: TypeScript compilation errors
Solution:
- Run: npm run type-check
- Fix all `any` types
- Match backend types
- Use proper imports

Debug:
- Check types/ directory
- Verify API response types
- Use IDE type hints
```

#### 3. Route Not Found
```
Problem: 404 on valid route
Solution:
- Verify file structure: src/app/[locale]/path/page.tsx
- Check dynamic segments: [id], [slug]
- Ensure proper exports
- Check middleware

Debug:
- Check file naming
- Review route groups: (name)
- Check .next/server/ for built routes
```

#### 4. Data Not Loading
```
Problem: Data fetch fails or returns undefined
Solution:
- Check network tab for API calls
- Verify API endpoint URL
- Check authentication
- Review error handling

Debug:
- Console.log fetch responses
- Check API error messages
- Verify token/session
- Test API directly
```

---

## 🚀 Performance Tips

### 1. Optimize Images
```typescript
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority  // For above-fold images
/>
```

### 2. Use Server Components
```typescript
// ✅ Good: Fetch on server
export async function ProductList() {
  const products = await serverFetch('/api/products')
  return <div>{/* render */}</div>
}

// ❌ Avoid: Unnecessary client fetch
'use client'
export function ProductList() {
  const [products, setProducts] = useState([])
  useEffect(() => { /* fetch */ }, [])
  // ...
}
```

### 3. Lazy Load Components
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { loading: () => <div>Loading...</div> }
)
```

### 4. Memoize Expensive Operations
```typescript
'use client'

import { useMemo } from 'react'

export function ExpensiveList({ items }) {
  const processed = useMemo(
    () => items.map(expensiveOperation),
    [items]
  )
  
  return <div>{/* render */}</div>
}
```

---

## 📋 Code Quality Checklist

Before committing:

```markdown
[ ] TypeScript passes: npm run type-check
[ ] Linter passes: npm run lint
[ ] No `any` types
[ ] Server Components used appropriately
[ ] Types match backend
[ ] Components are thin
[ ] Business logic in services
[ ] Translations exist for all text
[ ] RTL tested (Arabic locale)
[ ] SEO metadata added
[ ] Error handling implemented
[ ] Loading states added
[ ] Tests written (if applicable)
```

---

## 🔧 Useful Commands

### Development
```bash
npm run dev              # Start dev server
npm run dev -- --turbo   # With Turbopack (faster)
```

### Quality Checks
```bash
npm run type-check       # TypeScript validation
npm run lint             # ESLint
npm run lint:fix         # Auto-fix lint issues
npm run format           # Prettier formatting
```

### Testing
```bash
npm run test             # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
npm run test:e2e         # E2E tests
npm run test:e2e:ui      # E2E with UI
```

### Build
```bash
npm run build            # Production build
npm run start            # Start production
npm run analyze          # Bundle analysis
```

### Cleanup
```bash
rm -rf .next             # Clear Next.js cache
rm -rf node_modules      # Clear dependencies
npm install              # Reinstall
```

---

## 🎯 Quick Wins

### Instant Productivity Boosts

1. **Use AI Template**
   - Copy from: `docs/AI_PROMPT_TEMPLATE.md`
   - Use for every AI interaction
   - Saves hours of debugging

2. **Bookmark Key Docs**
   - `docs/standards/components.md`
   - `docs/standards/fetching.md`
   - `docs/standards/typescript.md`

3. **Use Code Snippets**
   - Set up in your IDE
   - Server Component template
   - Client Component template
   - Fetch pattern templates

4. **Learn Shortcuts**
   - `Cmd/Ctrl + P` - Quick file open
   - `Cmd/Ctrl + Shift + F` - Search all files
   - `F12` - Go to definition

---

## 📚 Related Documentation

- **Complete Guide**: [00-START-HERE.md](../00-START-HERE.md)
- **All Standards**: [standards/](../standards/)
- **Architecture**: [architecture/](../architecture/)
- **Troubleshooting**: [troubleshooting/](../troubleshooting/)
- **AI Template**: [AI_PROMPT_TEMPLATE.md](../AI_PROMPT_TEMPLATE.md)

---

**Created**: June 7, 2026  
**Purpose**: Quick reference for common development tasks  
**Audience**: All developers  
**Status**: Living document (update as patterns evolve)

**💡 Tip**: Print this out or keep it open while coding!
