# Testing Architecture

## Overview

This project implements a three-layer testing strategy designed to balance automation reliability with exploratory coverage. The architecture separates concerns between automated critical flow validation (Layer 2) and human/AI-driven workflow exploration (Layer 3), with backend API testing handled separately (Layer 1).

## Layer Structure

### Layer 1 — Laravel Backend Tests
**Location:** Backend repository (separate codebase)  
**Technology:** PHPUnit  
**Responsibility:** API contracts, business logic, database interactions  
**Status:** Maintained in Laravel application repository

### Layer 2 — Playwright E2E Tests
**Location:** `tests/e2e/`  
**Technology:** Playwright + TypeScript  
**Responsibility:** Critical business flow validation  
**CI Integration:** Yes — Blocks deployments on failure  
**Test Count:** 61 tests across 11 files

**Coverage:**
- **Authentication** (6 tests): Login, logout, session management, cross-tab sync
- **Commerce** (9 tests): Checkout, payment, order management
- **Tenancy** (22 tests): Data isolation, routing, onboarding, store switching
- **Permissions** (10 tests): Role restrictions, authorization boundaries
- **Subscriptions** (14 tests): Purchase, renewal, upgrades, cancellation

**Rules:**
- Test only critical business flows that must never break
- No CRUD operation testing (belongs in Layer 3)
- No UI cosmetic testing (belongs in visual regression or manual QA)
- Each test file includes header comment documenting its purpose
- All tests use mock backend for deterministic execution

### Layer 3 — Agent Missions
**Location:** `docs/testing/missions/`  
**Format:** Markdown documentation  
**Responsibility:** Workflow-oriented exploratory validation  
**CI Integration:** No — Used for manual/AI-assisted testing  
**Mission Count:** 6 comprehensive workflows (321 total steps)

**Coverage:**
- **owner-onboarding.md** (17 steps): New merchant registration and setup
- **cms-review.md** (35 steps): Content and media management
- **catalog-review.md** (58 steps): Product and inventory workflows
- **marketing-review.md** (49 steps): Promotions and campaigns
- **subscription-lifecycle.md** (68 steps): Complete subscription management
- **platform-admin-review.md** (94 steps): Platform administration

**Rules:**
- Workflow-oriented, not page-oriented
- Readable by both humans and AI agents
- Cover exploratory scenarios not suitable for automation
- Include defect reporting instructions
- Not used as CI gates

## Directory Structure

```
tests/e2e/
├── auth/                    # Authentication flows
├── commerce/                # Checkout and order flows
├── tenancy/                 # Multi-tenant isolation and routing
├── permissions/             # Authorization and security
├── subscriptions/           # Subscription lifecycle
├── utils/                   # Test helpers
└── mock-backend/            # Mock API server

docs/testing/missions/       # Exploratory mission files
```

## Running Tests

### E2E Tests (Layer 2)
```bash
# Run all E2E tests
npm run test:e2e

# Run specific category
npm run test:e2e -- tests/e2e/auth/
npm run test:e2e -- tests/e2e/commerce/

# Run with UI (headed mode)
npm run test:e2e -- --headed

# Debug mode
npm run test:e2e -- --debug
```

### Agent Missions (Layer 3)
```bash
# Missions are executed manually or via AI agent
# Read mission file and follow steps
# Document findings in issue tracker
```

## When to Add New Tests

### Add to Layer 2 (E2E) when:
- New critical business flow is introduced
- Existing flow has caused production incidents
- Flow involves cross-system integration (auth + tenant + billing)
- Failure would block core platform functionality

### Add to Layer 3 (Missions) when:
- New workflow requires human judgment (UX quality)
- Feature involves complex multi-step user journey
- Exploratory validation needed for new feature area
- Visual or content validation required

### Do NOT add to either layer when:
- Testing individual CRUD operations (unit test level)
- Testing form validation rules (unit/integration test level)
- Testing UI styling or CSS (visual regression tool)
- Testing API response formats (backend test level)

## Test Quality Standards

### E2E Tests Must:
- Have clear, descriptive test names
- Include header comment with Flow, Layer, Purpose, and Location
- Use mock backend for deterministic execution
- Test complete flows, not isolated actions
- Assert on business outcomes, not UI details
- Complete in reasonable time (< 30 seconds per test)

### Mission Files Must:
- Follow standard template structure
- Use numbered steps for clarity
- Be workflow-oriented, not page-oriented
- Include expected behavior section
- Provide defect reporting instructions
- Define clear completion criteria

## Architecture Validation

Last validated: 2026-06-04  
Status: ✅ **HEALTHY**  
Coverage: 100% of critical flows  
Anti-patterns detected: None  

## Maintenance

- Review E2E tests quarterly for relevance
- Update mission files when workflows change significantly
- Archive deprecated tests rather than deleting (keep history)
- Monitor test execution time and optimize slow tests
- Keep mock backend synchronized with actual API contracts
