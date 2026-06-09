# 🛍️ LaraTenant Commerce - Multi-Tenant E-Commerce Platform

A modern, multi-tenant e-commerce platform built with **Next.js 15+** and **Laravel**, featuring server-first architecture, internationalization, and comprehensive theme customization.

## 🚀 Quick Start

**→ New to the project? Start here:** [`docs/00-START-HERE.md`](./docs/00-START-HERE.md)

### Development Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development server
npm run dev

# Open browser
# → http://localhost:3000
```

### Development Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Quality Checks
npm run type-check       # TypeScript validation
npm run lint             # ESLint validation
npm run lint:fix         # Auto-fix lint issues

# Testing
npm run test             # Run Jest tests
npm run test:e2e         # Run Playwright E2E tests
npm run test:watch       # Watch mode for tests

# Build
npm run build            # Production build
npm run start            # Start production server
```

---

## 📚 Documentation

**Complete documentation is in the [`docs/`](./docs/) directory.**

### Quick Links

| Document | Purpose |
|----------|---------|
| **[📖 Start Here](./docs/00-START-HERE.md)** | Your entry point - read this first! |
| **[📋 Documentation Index](./docs/README.md)** | Complete documentation map |
| **[🤖 AI Prompt Template](./docs/AI_PROMPT_TEMPLATE.md)** | Use for every AI interaction |
| **[📏 Coding Standards](./docs/standards/)** | All development standards |
| **[🏗️ Architecture](./docs/architecture/)** | System architecture docs |
| **[📦 Features](./docs/features/)** | Feature-specific guides |
| **[🧪 Testing](./docs/testing/)** | Testing guides and strategies |
| **[🐛 Troubleshooting](./docs/troubleshooting/)** | Debug guides |

---

## 🎯 Core Features

### Multi-Tenancy
- **Multiple stores** on a single platform
- **Isolated data** per tenant
- **Custom domains** and subdomains
- **Theme customization** per store

### Internationalization
- **Locale-first routing** (/{locale}/...)
- **English and Arabic** with RTL support
- **Dynamic content translation**
- **SEO-optimized** metadata per locale

### Server-First Architecture
- **Server Components** by default
- **Server-side rendering (SSR)**
- **Incremental static regeneration (ISR)**
- **Optimized performance**

### E-Commerce Features
- Product catalog management
- Order processing
- User management
- Dashboard analytics
- Theme system with visual customization
- Hero banner management
- Category and tag organization
- Brand management

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 15+** (App Router)
- **TypeScript** (Strict mode)
- **React 18+** (Server Components)
- **Tailwind CSS** (with RTL support)
- **shadcn/ui** (Component library)
- **React Query** (Data fetching)
- **next-intl** (Internationalization)

### Backend Integration
- **Laravel API** (Headless CMS & API)
- **Session-based auth** (HttpOnly cookies)
- **REST API** (JSON communication)

### Testing
- **Jest** (Unit tests)
- **React Testing Library** (Component tests)
- **Playwright** (E2E tests)

### Development Tools
- **ESLint** (Code quality)
- **TypeScript** (Type safety)
- **Prettier** (Code formatting)

---

## 📁 Project Structure

```
laratenant-commerce/
├── docs/                    # 📚 Complete documentation
│   ├── 00-START-HERE.md    # ⭐ Start here
│   ├── README.md           # Documentation index
│   ├── standards/          # Coding standards
│   ├── architecture/       # System architecture
│   ├── features/           # Feature guides
│   └── ...                 # More categories
│
├── src/
│   ├── app/                # Next.js App Router
│   │   └── [locale]/       # Locale-first routing
│   │       ├── (marketing)/# Public pages
│   │       └── merchant/   # Admin dashboard
│   │
│   ├── features/           # Feature modules
│   ├── components/         # Shared components
│   │   ├── ui/            # shadcn/ui primitives
│   │   └── cms/           # CMS rendering
│   │
│   ├── services/           # Business logic
│   ├── lib/                # Utilities
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   └── messages/           # i18n translations
│
├── tests/                  # E2E tests (Playwright)
├── public/                 # Static assets
└── scripts/                # Utility scripts
```

---

## 🔥 Key Architectural Principles

### 1. Server-First
- Server Components by default
- Client Components only for interactivity
- Data fetching on the server

### 2. Type Safety
- No `any` types
- Strict TypeScript configuration
- Types match backend contracts

### 3. Standards-Based
- Consistent component patterns
- Standardized data fetching
- Documented conventions

### 4. Locale-First Routing
- All routes under `/{locale}/`
- Merchant workspace at `/merchant/*`
- SEO-optimized per locale

### 5. Thin Components
- Business logic in services
- Components focus on presentation
- Reusable patterns

---

## 🤖 Working with AI

**Always use the AI Prompt Template:**  
→ [`docs/AI_PROMPT_TEMPLATE.md`](./docs/AI_PROMPT_TEMPLATE.md)

This ensures:
- ✅ Architecture compliance
- ✅ Standards enforcement
- ✅ Documentation consistency
- ✅ Code quality

---

## 🧪 Testing

### Run Tests

```bash
# Unit & Component Tests
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage

# E2E Tests
npm run test:e2e          # Playwright tests
npm run test:e2e:ui       # With UI
```

### Testing Documentation
- [Testing Architecture](./docs/testing/TESTING-ARCHITECTURE.md)
- [Testing Guide](./docs/testing/OPENCODER_IMPROVED_TESTING_GUIDE.md)
- [Playwright MCP Guide](./docs/testing/PLAYWRIGHT_MCP_TESTING_GUIDE.md)

---

## 🚀 Deployment

### Build for Production

```bash
# Create optimized build
npm run build

# Test production build locally
npm run start
```

### Deployment Checklist
See: [`docs/deployment/DEPLOYMENT_CHECKLIST.md`](./docs/deployment/DEPLOYMENT_CHECKLIST.md)

---

## 📖 Learning Resources

### For New Developers
1. Read [`docs/00-START-HERE.md`](./docs/00-START-HERE.md)
2. Follow the 5-day learning path
3. Review coding standards
4. Explore the codebase

### For AI Users
1. Use [`docs/AI_PROMPT_TEMPLATE.md`](./docs/AI_PROMPT_TEMPLATE.md)
2. Follow AI collaboration guidelines
3. Verify outputs systematically

### For Contributors
1. Review all standards
2. Follow architectural principles
3. Update documentation as needed
4. Write tests for new features

---

## 🐛 Troubleshooting

Common issues and solutions:
- [Authentication Issues](./docs/troubleshooting/auth-debugging.md)
- [Build Errors](./docs/troubleshooting/build-errors.md)
- [CORS Issues](./docs/troubleshooting/cors.md)
- [Hydration Errors](./docs/troubleshooting/hydration.md)

---

## 📄 License

[Your License Here]

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Read the documentation
2. Follow coding standards
3. Write tests
4. Update documentation

---

## 📞 Support

- **Documentation**: [`docs/`](./docs/)
- **Issues**: Check troubleshooting guides
- **Questions**: Review architecture docs

---

**Last Updated**: June 7, 2026  
**Status**: Active Development  
**Version**: Next.js 15+

**→ Start here: [`docs/00-START-HERE.md`](./docs/00-START-HERE.md)**
