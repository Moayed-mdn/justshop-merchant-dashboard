# 📚 Documentation System - LaraTenant Commerce

**Start Here**: [00-START-HERE.md](./00-START-HERE.md) ⭐⭐⭐

This directory is the canonical documentation for the Next.js + Laravel multi-tenant commerce platform.
The codebase is the source of truth. These docs describe what exists today.

---

## 🚀 Quick Start

### New to the Project?
1. **Read**: [00-START-HERE.md](./00-START-HERE.md) - Complete guide ⭐⭐⭐
2. **Navigate**: [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) - Visual navigation guide ⭐⭐
3. **Quick Ref**: [quick-reference/COMMON_TASKS_GUIDE.md](./quick-reference/COMMON_TASKS_GUIDE.md) - Common tasks ⭐⭐
4. **Use**: [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md) - Every AI interaction ⭐⭐⭐

### Working with AI?
→ **ALWAYS** use [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md)  
→ Prevents violations and documentation chaos  
→ Ensures consistent code quality

### Need Quick Answers?
→ Check [quick-reference/COMMON_TASKS_GUIDE.md](./quick-reference/COMMON_TASKS_GUIDE.md)  
→ Common patterns, debugging tips, and commands

### Lost in Documentation?
→ Use [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)  
→ Visual guide to all 100+ documentation files

---

## 📋 How To Use This

**Priority Order:**

1. **AI Guides** (New!) ⭐⭐⭐ - Use for EVERY AI interaction
2. **standards/** ⭐⭐⭐ - Implementation rules for day-to-day work
3. **architecture/** ⭐⭐ - System-level behavior and boundaries
4. **requirements/** ⭐ - Functional and technical requirements
5. **features/** - Feature-specific documentation
6. **fixes/** - Bug fix summaries
7. **Other categories** - As needed

---

## 📊 Documentation Structure

```text
docs/
├── 00-START-HERE.md                    ← YOUR ENTRY POINT ⭐⭐⭐
├── README.md                           ← This file (Index)
├── DOCUMENTATION_MAP.md                ← NEW! Visual navigation guide ⭐⭐
│
├── AI GOVERNANCE SYSTEM (NEW!) ⭐⭐⭐
│   ├── AI_PROMPT_TEMPLATE.md           ← Copy-paste for every AI task
│   ├── AI_RULES_ENFORCEMENT_SYSTEM.md  ← Make AI follow architecture
│   ├── AI_DOCUMENTATION_RULES.md       ← Prevent file chaos
│   └── AI_COLLABORATION_CHECKLIST.md   ← Systematic verification
│
├── standards/                          ← CODING STANDARDS ⭐⭐⭐
│   ├── AI_AGENT_RULES.md              ← Core principles (moved from root)
│   ├── components.md                   ← RSC boundaries, composition
│   ├── typescript.md                   ← Type safety rules
│   ├── fetching.md                     ← Data fetching patterns
│   ├── routing.md                      ← Route structure
│   ├── forms.md                        ← Form handling
│   ├── api-layer.md                    ← Backend integration
│   ├── state-management.md            ← React Query + Zustand
│   ├── styling.md                      ← Tailwind + RTL
│   ├── error-handling.md              ← Error patterns
│   ├── permissions.md                  ← Permission boundaries
│   ├── testing.md                      ← Testing standards
│   └── translations.md                 ← i18n patterns
│
├── architecture/                       ← SYSTEM ARCHITECTURE ⭐⭐
│   ├── frontend.md                     ← App Router, providers
│   ├── cms.md                          ← CMS integration
│   ├── backend-integration.md         ← API contracts
│   ├── routing.md                      ← Route architecture
│   ├── multi-tenancy.md               ← Tenant resolution
│   ├── auth.md                         ← Session-based auth
│   ├── data-flow.md                    ← Data flow patterns
│   └── rendering-strategy.md          ← SSR/ISR strategy
│
├── requirements/                       ← PROJECT REQUIREMENTS ⭐
│   ├── FUNCTIONAL_REQUIREMENTS.md     ← Feature requirements
│   ├── TECHNICAL_REQUIREMENTS.md      ← Technical specs
│   ├── FEATURE_STATUS.md              ← Implementation status
│   ├── GAPS_AND_ISSUES.md             ← Known gaps
│   ├── USER_STORIES.md                ← User stories
│   └── README.md                       ← Requirements index
│
├── features/                           ← FEATURE DOCS
│   ├── auth.md                         ← Authentication
│   ├── dashboard.md                    ← Dashboard overview
│   ├── products.md                     ← Product management
│   ├── orders.md                       ← Order management
│   ├── users.md                        ← User management
│   └── HERO_BANNER_IMAGE_UPLOAD_FEATURE.md
│
├── fixes/                              ← BUG FIXES
│   ├── FINAL_SOLUTION.md
│   ├── FIX_MERCHANT_VIEW_ROUTES.md
│   ├── FIX_MISSING_ROUTES.md
│   ├── FIX_STORE_SWITCHER_DISPLAY.md
│   ├── FIXES_APPLIED.md
│   ├── FRONTEND_ERROR_DISPLAY_FIX.md
│   ├── FRONTEND_ERROR_HANDLING_EXAMPLE.md
│   ├── FRONTEND_LOGOUT_UX_FIX.md
│   ├── ROUTING_CONFUSION_SOLUTION.md
│   ├── ROUTING_HOTFIX.md
│   └── ROUTING_ISSUES_FIXED.md
│
├── implementation/                     ← IMPLEMENTATION GUIDES
│   ├── FRONTEND_IMPLEMENTATION_COMPLETE.md
│   └── FRONTEND_REMAINING_FILES.md
│
├── sessions/                           ← SESSION LOGS
│   ├── SESSION_10_COMPLETE.md
│   ├── SESSION_11_COMPLETE.md
│   ├── SESSION_12_COMPLETE.md
│   └── [various session docs]
│
├── testing/                            ← TEST DOCUMENTATION
│   ├── missions/
│   ├── OPENCODER_IMPROVED_TESTING_GUIDE.md
│   ├── OPENCODER_TEST_RESULTS_AND_FIXES.md
│   ├── ROUTING_IMPLEMENTATION_VERIFICATION.md
│   ├── ROUTING_TEST_RESULTS.md
│   ├── TESTING_APPROACH_SUMMARY.md
│   └── TESTING-ARCHITECTURE.md
│
├── routing/                            ← ROUTING DOCS
│   ├── DEBUG_ROUTING_ISSUES.md
│   ├── README_ROUTING_FIX.md
│   ├── ROUTING_STANDARDIZATION_COMPLETE.md
│   ├── ROUTING_STANDARDIZATION_FINAL_SUMMARY.md
│   ├── ROUTING_STANDARDIZATION_IMPLEMENTATION.md
│   └── ROUTING_STANDARDIZATION_INVESTIGATION.md
│
├── frontend/                           ← FRONTEND PATTERNS
│   ├── active-store-context.md
│   ├── active-store-routing.md
│   ├── legacy-route-compatibility.md
│   ├── merchant-workspace-architecture.md
│   ├── multi-store-flow.md
│   ├── onboarding-state-machine.md
│   ├── setup-flow-architecture.md
│   ├── setup-routing.md
│   ├── sidebar-consolidation.md
│   ├── store-switching.md
│   └── workspace-routing-architecture.md
│
├── planning/                           ← PLANNING DOCS
│   ├── FRONTEND_CONCRETE_PLAN.md
│   └── FRONTEND_IMPLEMENTATION_PLAN.md
│
├── decisions/                          ← ADRs
│   ├── ADR-001-httpOnly-auth.md
│   ├── ADR-002-server-fetch-pattern.md
│   └── ADR-003-multi-tenant-routing.md
│
├── security/                           ← SECURITY DOCS
│   ├── permissions.md
│   ├── sanctum.md
│   └── session-auth.md
│
├── marketing/                          ← MARKETING/CMS
│   ├── component-architecture.md
│   ├── content-strategy.md
│   ├── design-system.md
│   └── seo.md
│
├── migrations/                         ← MIGRATION GUIDES
│   ├── app-router-migration.md
│   ├── bearer-to-session-auth.md
│   └── current-state.md
│
├── troubleshooting/                    ← DEBUG GUIDES
│   ├── auth-debugging.md
│   ├── build-errors.md
│   ├── cors.md
│   └── hydration.md
│
├── theme-system/                       ← THEME SYSTEM
│   └── THEME_SYSTEM_FRONTEND_COMPLETE.md
│
├── quick-reference/                    ← QUICK GUIDES
│   ├── QUICK_START_SESSION_11_V2.md
│   └── COMMON_TASKS_GUIDE.md ⭐⭐     ← NEW! Common tasks reference
│
└── archive/                            ← HISTORICAL DOCS
    ├── legacy-map.md
    └── README.md
```

## Architectural Philosophy

- Locale-first App Router under `src/app/[locale]`.
- Server-first architecture with Server Components for initial reads and route metadata.
- Laravel remains the API and CMS source of truth.
- Public marketing, blog, docs, sitemap, and robots consume the platform CMS through `src/services/cms/cms.service.ts`.
- Public CMS SEO maps into Next.js Metadata via `src/lib/seo/cms-seo.ts` and JSON-LD via `src/components/cms/JsonLd.tsx`.
- Public CMS reads use cache tags and App Router caching; interactive browser requests still use `/api/proxy`.

## Canonical Starting Points

- `architecture/frontend.md`: App Router, route groups, provider graph, and frontend boundaries.
- `architecture/cms.md`: CMS route map, service layer, docs/blog rendering flow, TOC/sidebar, and cache strategy.
- `architecture/rendering-strategy.md`: server-first rendering, hybrid SSR/ISR behavior, and RSC boundaries.
- `architecture/backend-integration.md`: Laravel integration model, public CMS boundaries, and proxy responsibilities.
- `marketing/seo.md`: CMS SEO contract, Metadata API usage, JSON-LD, sitemap, and robots.

## Contributor Rules

- Update canonical docs when architecture or standards change.
- Keep one source of truth per topic and cross-link instead of duplicating.
- Remove obsolete active guidance when implementation changes; keep historical notes in `archive/` or `migrations/` only.
- Do not describe planned architecture as implemented.
- Keep docs concise, architectural, and aligned with the current code.



---

## 📊 Documentation Statistics

- **Total Categories**: 19
- **AI Governance Docs**: 4 (NEW! ⭐⭐⭐)
- **Standards**: 13 files
- **Architecture**: 8 files
- **Requirements**: 6 files
- **Features**: 6 files
- **Fixes**: 11 files
- **Testing**: 6+ files
- **Routing**: 6 files
- **Frontend**: 11 files

---

## 🎯 Architectural Philosophy

- **Locale-first App Router** under `src/app/[locale]`.
- **Server-first architecture** with Server Components for initial reads and route metadata.
- **Laravel remains the API** and CMS source of truth.
- **Public marketing, blog, docs** consume the platform CMS through `src/services/cms/cms.service.ts`.
- **Public CMS SEO** maps into Next.js Metadata via `src/lib/seo/cms-seo.ts` and JSON-LD via `src/components/cms/JsonLd.tsx`.
- **Public CMS reads** use cache tags and App Router caching; interactive browser requests still use `/api/proxy`.

---

## 📖 Canonical Starting Points

**Priority Reading:**
1. [00-START-HERE.md](./00-START-HERE.md) - Complete guide ⭐⭐⭐
2. [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md) - Use for every AI task ⭐⭐⭐
3. [AI_RULES_ENFORCEMENT_SYSTEM.md](./AI_RULES_ENFORCEMENT_SYSTEM.md) - Make AI follow rules ⭐⭐⭐

**Core Standards:**
- [standards/components.md](./standards/components.md) - RSC boundaries, composition
- [standards/typescript.md](./standards/typescript.md) - Type safety rules
- [standards/fetching.md](./standards/fetching.md) - Data fetching patterns
- [standards/routing.md](./standards/routing.md) - Route structure

**Architecture:**
- [architecture/frontend.md](./architecture/frontend.md) - App Router, route groups, provider graph
- [architecture/cms.md](./architecture/cms.md) - CMS route map, service layer, docs/blog rendering
- [architecture/rendering-strategy.md](./architecture/rendering-strategy.md) - Server-first rendering, hybrid SSR/ISR
- [architecture/backend-integration.md](./architecture/backend-integration.md) - Laravel integration model

**Marketing/CMS:**
- [marketing/seo.md](./marketing/seo.md) - CMS SEO contract, Metadata API, JSON-LD, sitemap, robots

---

## 🔥 Critical Rules Summary

### Frontend Rules (13 MANDATORY)

1. ✅ Server Components by default → Client only for interactivity
2. ❌ NO `any` type → explicit types or `unknown`
3. ✅ serverFetch for SSR → clientFetch for browser
4. ✅ CMS routes use cmsService → no direct fetch
5. ✅ Thin components → business logic in services
6. ✅ Use existing UI patterns → shadcn/ui
7. ✅ Routes under /{locale}/ → locale-first
8. ✅ Merchant routes under /merchant/* → canonical
9. ❌ NO localStorage for auth → AuthContext + cookies
10. ✅ RTL support → logical properties or rtl: prefix
11. ✅ generateMetadata() for SEO → no manual <head>
12. ✅ React Query for mutations → centralized queryKeys
13. ✅ Type safety → match backend DTOs

### Documentation Rules (5 MANDATORY)

1. ❌ NO files outside docs/
2. ❌ NO files in project root (except README.md)
3. ❌ NO files in code folders (src/**, tests/**)
4. ✅ ASK before creating documentation
5. ✅ Use UPPERCASE_NAMING.md format

---

## 🤖 AI Collaboration

### Every AI Interaction:
```
1. Use AI_PROMPT_TEMPLATE.md
2. Include all 13 frontend rules
3. Include documentation rules
4. Specify task details
5. Demand confirmation first
6. Verify with AI_COLLABORATION_CHECKLIST.md
```

### Quick Template:
See [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md) for copy-paste template.

---

## ✅ Contributor Rules

### When Coding:
- Follow all standards/ documents
- Use Server Components by default
- No `any` types
- Types match backend contracts
- Thin components
- Routes under /{locale}/ and /merchant/*
- RTL compatible
- generateMetadata() for SEO

### When Documenting:
- Update canonical docs when architecture or standards change
- Keep one source of truth per topic and cross-link instead of duplicating
- Remove obsolete active guidance when implementation changes
- Keep historical notes in `archive/` or `migrations/` only
- Do not describe planned architecture as implemented
- Keep docs concise, architectural, and aligned with the current code
- **ALWAYS place docs in correct category**
- **NEVER create docs in project root or code folders**

### When Using AI:
- **ALWAYS** use AI_PROMPT_TEMPLATE.md
- Include all rules in prompt
- Demand confirmation before implementation
- Verify output with checklist
- Reject violations immediately

---

## 🎓 Learning Resources

### For Beginners:
1. Start with [00-START-HERE.md](./00-START-HERE.md)
2. Follow the 5-day learning path
3. Read all standards/ docs
4. Read all architecture/ docs
5. Practice with AI_PROMPT_TEMPLATE.md

### For AI Users:
1. Read [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md)
2. Read [AI_RULES_ENFORCEMENT_SYSTEM.md](./AI_RULES_ENFORCEMENT_SYSTEM.md)
3. Read [AI_DOCUMENTATION_RULES.md](./AI_DOCUMENTATION_RULES.md)
4. Use [AI_COLLABORATION_CHECKLIST.md](./AI_COLLABORATION_CHECKLIST.md)
5. Enforce rules consistently

### For Debugging:
1. Check troubleshooting/ folder
2. Check fixes/ folder for similar issues
3. Review architecture/ for system behavior
4. Check sessions/ for historical context

---

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start dev server

# Quality Checks
npm run type-check       # TypeScript validation
npm run lint             # ESLint validation
npm run lint:fix         # Fix lint issues

# Testing
npm run test             # Run tests
npm run test:e2e         # Run Playwright E2E tests

# Build
npm run build            # Production build
npm run start            # Start production server
```

---

## 📞 Need Help?

### Documentation Issues:
- Check this README for structure
- Check 00-START-HERE.md for guidance
- Search docs/ by category

### Code Issues:
- Check standards/ for coding rules
- Check architecture/ for system design
- Check troubleshooting/ for common issues

### AI Issues:
- Re-read AI_RULES_ENFORCEMENT_SYSTEM.md
- Use AI_PROMPT_TEMPLATE.md strictly
- Verify with AI_COLLABORATION_CHECKLIST.md

---

## 🌟 What's New (June 7, 2026)

### Major Updates:
✅ **Documentation Map** - Complete visual navigation guide (NEW!)  
✅ **Common Tasks Guide** - Quick reference for everyday tasks (NEW!)  
✅ **Enhanced README** - Professional project documentation (UPDATED!)  
✅ **AI Governance System** - 4 comprehensive guides (1,500+ lines)  
✅ **AI Prompt Template** - Ready-to-use copy-paste template  
✅ **AI Rules Enforcement** - Make AI follow architecture strictly  
✅ **AI Documentation Rules** - Prevent file chaos  
✅ **AI Collaboration Checklist** - Systematic verification  
✅ **00-START-HERE.md** - Complete entry point  
✅ **Root Cleanup** - Moved files to proper categories  

### Impact:
- 🚀 Faster development with AI
- ✅ Higher code quality
- 📁 Clean documentation structure
- 🎯 Consistent patterns
- 💪 Architecture compliance guaranteed
- 🗺️ Easy navigation (100+ files organized)
- ⚡ Quick answers for common tasks

---

## 🎯 Success Metrics

You're successful when:
- ✅ You navigate documentation quickly
- ✅ You follow standards automatically
- ✅ AI follows your rules strictly
- ✅ Code quality is consistently high
- ✅ TypeScript/linter always pass
- ✅ No chaotic documentation
- ✅ Team collaborates smoothly

---

**Last Updated**: June 7, 2026  
**Status**: Complete and ready to use  
**Key Innovation**: AI Governance System  
**Start Here**: [00-START-HERE.md](./00-START-HERE.md) ⭐⭐⭐
