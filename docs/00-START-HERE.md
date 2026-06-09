# 🚀 START HERE - LaraTenant Commerce Documentation

**Welcome to the LaraTenant Commerce frontend documentation!**  
**Last Updated**: June 7, 2026

---

## 🎯 What is This Project?

**LaraTenant Commerce** is a multi-tenant Next.js 15+ commerce platform with:
- **App Router** (Server-first architecture)
- **TypeScript** (Strict typing)
- **Multi-tenancy** (Multiple stores, single platform)
- **Internationalization** (English/Arabic with RTL support)
- **Laravel Backend** (Headless API)

---

## 📚 Quick Navigation

### 🔥 MUST READ (Start Here)

1. **[AI Prompt Template](./AI_PROMPT_TEMPLATE.md)** ⭐⭐⭐  
   Copy-paste template for every AI interaction

2. **[AI Rules Enforcement System](./AI_RULES_ENFORCEMENT_SYSTEM.md)** ⭐⭐⭐  
   How to make AI follow our architecture rules

3. **[AI Documentation Rules](./AI_DOCUMENTATION_RULES.md)** ⭐⭐  
   Prevent documentation chaos

4. **[AI Collaboration Checklist](./AI_COLLABORATION_CHECKLIST.md)** ⭐⭐  
   Systematic verification checklist

### 📖 Core Documentation

5. **[Standards](./standards/)** ⭐⭐⭐  
   - [Components](./standards/components.md) - RSC boundaries, composition
   - [TypeScript](./standards/typescript.md) - Type safety rules
   - [Fetching](./standards/fetching.md) - Data fetching patterns
   - [Routing](./standards/routing.md) - Route structure
   - [Forms](./standards/forms.md) - Form handling
   - [API Layer](./standards/api-layer.md) - Backend integration
   - [State Management](./standards/state-management.md) - React Query + Zustand
   - [Styling](./standards/styling.md) - Tailwind + RTL
   - [Error Handling](./standards/error-handling.md) - Error patterns

6. **[Architecture](./architecture/)** ⭐⭐  
   - [Frontend](./architecture/frontend.md) - App Router, providers
   - [CMS](./architecture/cms.md) - CMS integration
   - [Backend Integration](./architecture/backend-integration.md) - API contracts
   - [Routing](./architecture/routing.md) - Route architecture
   - [Multi-Tenancy](./architecture/multi-tenancy.md) - Tenant resolution
   - [Auth](./architecture/auth.md) - Session-based auth

7. **[Requirements](./requirements/)** ⭐  
   - [Functional Requirements](./requirements/FUNCTIONAL_REQUIREMENTS.md)
   - [Technical Requirements](./requirements/TECHNICAL_REQUIREMENTS.md)
   - [Feature Status](./requirements/FEATURE_STATUS.md)

---

## 🎓 Learning Path

### For New Developers (First Week)

**Day 1: Understand the Project**
```
1. Read this file completely
2. Read requirements/FUNCTIONAL_REQUIREMENTS.md
3. Explore the codebase structure
4. Run the project locally
```

**Day 2: Learn the Standards**
```
1. Read standards/components.md
2. Read standards/typescript.md
3. Read standards/fetching.md
4. Read standards/routing.md
```

**Day 3: Master AI Collaboration**
```
1. Read AI_PROMPT_TEMPLATE.md
2. Read AI_RULES_ENFORCEMENT_SYSTEM.md
3. Read AI_DOCUMENTATION_RULES.md
4. Read AI_COLLABORATION_CHECKLIST.md
```

**Day 4: Architecture Deep Dive**
```
1. Read architecture/frontend.md
2. Read architecture/backend-integration.md
3. Read architecture/routing.md
4. Read architecture/multi-tenancy.md
```

**Day 5: First Feature**
```
1. Use AI_PROMPT_TEMPLATE.md
2. Implement a small feature
3. Follow the checklist
4. Get code review
```

### For Existing Developers

**Quick Start:**
```
1. Read AI_PROMPT_TEMPLATE.md
2. Bookmark it for daily use
3. Use it in every AI interaction
4. Share with team
```

---

## 🏗️ Project Structure

```
laratenant-commerce/
├── docs/                    ← YOU ARE HERE
│   ├── 00-START-HERE.md    ← This file ⭐
│   ├── README.md           ← Documentation index
│   │
│   ├── AI_PROMPT_TEMPLATE.md              ⭐⭐⭐
│   ├── AI_RULES_ENFORCEMENT_SYSTEM.md     ⭐⭐⭐
│   ├── AI_DOCUMENTATION_RULES.md          ⭐⭐
│   ├── AI_COLLABORATION_CHECKLIST.md      ⭐
│   │
│   ├── standards/          ← Coding standards ⭐⭐⭐
│   ├── architecture/       ← System architecture ⭐⭐
│   ├── requirements/       ← Requirements & status
│   ├── features/           ← Feature documentation
│   ├── fixes/              ← Bug fix summaries
│   ├── implementation/     ← Implementation guides
│   ├── sessions/           ← Session logs
│   ├── testing/            ← Test documentation
│   ├── routing/            ← Routing changes
│   ├── frontend/           ← Frontend patterns
│   ├── planning/           ← Planning docs
│   ├── decisions/          ← ADRs
│   ├── security/           ← Security docs
│   ├── marketing/          ← Marketing/CMS
│   ├── migrations/         ← Migration guides
│   ├── troubleshooting/    ← Debug guides
│   └── archive/            ← Historical docs
│
├── src/
│   ├── app/                ← Next.js App Router
│   │   └── [locale]/       ← Locale-first routing
│   │       ├── (marketing)/← Public pages
│   │       └── merchant/   ← Dashboard (canonical)
│   │
│   ├── features/           ← Feature modules
│   ├── components/         ← Shared components
│   │   ├── ui/            ← shadcn/ui primitives
│   │   └── cms/           ← CMS rendering
│   │
│   ├── services/           ← Business logic
│   ├── lib/                ← Utilities
│   ├── hooks/              ← Shared hooks
│   ├── types/              ← TypeScript types
│   └── messages/           ← i18n translations
│
├── tests/                  ← Playwright E2E tests
└── README.md              ← Basic project info
```

---

## 🔥 The 13 Critical Frontend Rules

These rules are MANDATORY for all development:

1. ✅ **Server Components by default** → Client Components ONLY for interactivity
2. ❌ **NO `any` type** → Use explicit types or `unknown`
3. ✅ **serverFetch for SSR** → clientFetch for browser requests
4. ✅ **CMS routes use cmsService** → No direct fetch calls
5. ✅ **Thin components** → Business logic in services/features
6. ✅ **Use existing UI patterns** → shadcn/ui components
7. ✅ **Routes under /{locale}/** → Locale-first routing
8. ✅ **Merchant routes under /merchant/*** → Canonical workspace
9. ❌ **NO localStorage for auth** → Use AuthContext + cookies
10. ✅ **RTL support** → Logical properties or rtl: prefix
11. ✅ **generateMetadata() for SEO** → No manual <head> tags
12. ✅ **React Query for mutations** → Centralized query keys
13. ✅ **Type safety** → Frontend types MUST match backend DTOs

**Learn More**: [AI_RULES_ENFORCEMENT_SYSTEM.md](./AI_RULES_ENFORCEMENT_SYSTEM.md)

---

## 🤖 Working with AI Assistants

### Always Use This Template:

```
I need to [DESCRIBE TASK].

🔥 MANDATORY RULES:
1. Server Components by default → Client only for interactivity
2. NO `any` types → explicit types
3. serverFetch for SSR → clientFetch for browser
4. CMS routes use cmsService
5. Thin components → logic in services
6. Routes under /{locale}/ and /merchant/*
7. NO localStorage for auth
8. RTL support → logical properties
9. generateMetadata() for SEO
10. React Query for mutations
11. Types match backend contracts

🚫 DOCUMENTATION RULES:
- NO files outside docs/
- ASK before creating docs
- Use UPPERCASE_NAMING.md

TASK: [Your task details]

Confirm approach, then implement.
```

**Full Template**: [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md)

---

## 📊 Documentation Categories

| Category | Purpose | When to Use |
|----------|---------|-------------|
| **standards/** | Coding rules | Always refer before coding |
| **architecture/** | System design | Understanding big picture |
| **features/** | Feature docs | Implementing features |
| **fixes/** | Bug fixes | Fixing bugs |
| **implementation/** | How-to guides | Step-by-step work |
| **sessions/** | Session logs | Historical context |
| **testing/** | Test docs | Writing/running tests |
| **routing/** | Routing changes | Route modifications |
| **frontend/** | Frontend patterns | UI architecture |
| **requirements/** | Requirements | Understanding needs |

---

## 🔍 Common Tasks

### Task 1: Add a New Feature

```
1. Read standards/components.md
2. Read standards/fetching.md
3. Use AI_PROMPT_TEMPLATE.md
4. Implement following standards
5. Use AI_COLLABORATION_CHECKLIST.md
6. Test locally (dev, TypeScript, lint)
7. Document if significant (ask first)
```

### Task 2: Fix a Bug

```
1. Identify affected layer
2. Read relevant standards
3. Use AI_PROMPT_TEMPLATE.md
4. Fix following standards
5. Verify with checklist
6. Consider docs/fixes/ documentation
```

### Task 3: Refactor Code

```
1. Read current implementation
2. Identify standards violations
3. Use AI_PROMPT_TEMPLATE.md
4. Refactor incrementally
5. Verify no regressions
6. Update documentation if architecture changed
```

### Task 4: Ask Questions

```
1. Check existing documentation first
2. Use simple prompt (no template needed)
3. Ask AI to explain from docs
4. No code/file changes needed
```

---

## ✅ Quality Checklist

Before committing code, verify:

### Code Quality
- [ ] No `any` types
- [ ] Server Components used appropriately
- [ ] Client Components only where needed
- [ ] Types match backend contracts
- [ ] Components are thin
- [ ] Business logic in services
- [ ] Proper fetch utilities used

### Standards Compliance
- [ ] Follows standards/components.md
- [ ] Follows standards/typescript.md
- [ ] Follows standards/fetching.md
- [ ] Follows standards/routing.md
- [ ] RTL compatible
- [ ] SEO metadata correct

### Testing
- [ ] TypeScript passes (npm run type-check)
- [ ] Linter passes (npm run lint)
- [ ] No console errors
- [ ] Tested in browser
- [ ] Tested RTL (Arabic locale)

### Documentation
- [ ] No files in wrong locations
- [ ] Documentation in correct category (if any)
- [ ] UPPERCASE naming used
- [ ] Professional content

---

## 🎯 Success Metrics

You're successful when:

- ✅ You can navigate documentation quickly
- ✅ You follow standards automatically
- ✅ AI follows your rules strictly
- ✅ Code quality is consistently high
- ✅ TypeScript/linter always pass
- ✅ No chaotic documentation files
- ✅ Team collaboration is smooth

---

## 📞 Need Help?

### Documentation Navigation
→ Check [README.md](./README.md) for full index

### AI Collaboration
→ Re-read [AI_RULES_ENFORCEMENT_SYSTEM.md](./AI_RULES_ENFORCEMENT_SYSTEM.md)

### Standards Questions
→ Check [standards/](./standards/) folder

### Architecture Questions
→ Check [architecture/](./architecture/) folder

### Still Stuck?
→ Ask the team or review recent [sessions/](./sessions/)

---

## 🌟 Key Innovations

### 1. AI Governance System
- **4 comprehensive AI guides** (1,500+ lines)
- **Ready-to-use templates**
- **Systematic verification**
- **Prevents violations automatically**

### 2. Standards-First Architecture
- **12+ standard documents**
- **Clear patterns**
- **No guesswork**
- **Consistent codebase**

### 3. Documentation Organization
- **19 logical categories**
- **Easy navigation**
- **Professional structure**
- **No chaos**

---

## 🚀 Quick Start Command

```bash
# 1. Clone and install
npm install

# 2. Set up environment
cp .env.example .env.local

# 3. Start development
npm run dev

# 4. Open browser
# http://localhost:3000

# 5. Start reading docs
# Begin with this file and AI_PROMPT_TEMPLATE.md
```

---

## 📖 Recommended Reading Order

**Week 1: Foundations**
1. This file (00-START-HERE.md)
2. AI_PROMPT_TEMPLATE.md
3. AI_RULES_ENFORCEMENT_SYSTEM.md
4. standards/components.md
5. standards/typescript.md

**Week 2: Deep Dive**
6. standards/fetching.md
7. standards/routing.md
8. architecture/frontend.md
9. architecture/backend-integration.md
10. requirements/FUNCTIONAL_REQUIREMENTS.md

**Week 3: Mastery**
11. All remaining standards/
12. All architecture/ docs
13. Feature-specific docs as needed

---

## 🎉 Summary

You now have access to:

- ✅ **Comprehensive AI governance system**
- ✅ **Complete coding standards**
- ✅ **Architecture documentation**
- ✅ **Ready-to-use templates**
- ✅ **Systematic checklists**
- ✅ **Professional organization**

**Most Important**: The [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md) will transform your workflow. Use it for EVERY AI interaction.

---

## 🎯 Next Steps

1. ✅ Read this file (done!)
2. 📖 Read [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md)
3. 🔖 Bookmark key documents
4. 🤖 Try the template with AI
5. ✅ Use [AI_COLLABORATION_CHECKLIST.md](./AI_COLLABORATION_CHECKLIST.md)
6. 💬 Share with team

---

**Welcome aboard! Let's build something amazing! 🚀**

---

**Created**: June 7, 2026  
**Purpose**: Entry point for all commerce frontend documentation  
**Status**: Your starting point for everything  
**Next**: Read [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md) ⭐
