# Merchant UX Manual Chromium Scenarios — QA Report

**Date**: 2026-06-16T06:51:49.628Z
**Environment**: Frontend http://localhost:3001 | Backend http://localhost:8000
**Browser**: Chromium (Playwright)
**Account**: merchant@test.com

---

## Summary

| Total | Passed | Failed | Pass Rate |
|-------|--------|--------|-----------|
| 21 | 0 | 21 | 0% |

---

## Scenario Results

### ❌ Scenario 1: Login Redirect and Merchant Entry
**Status**: FAIL
**Details**: URL: http://localhost:3001/en/login, Shell: false

**Console Errors (2)**:
  - `Failed to load resource: the server responded with a status of 401 (Unauthorized)`
  - `Failed to load resource: the server responded with a status of 401 (Unauthorized)`

**Network Failures (4)**:
  - 401 http://localhost:3001/api/proxy?endpoint=%2Fapi%2Fv1%2Fmerchant%2Fme
  -  http://localhost:3001/api/proxy?endpoint=%2Fapi%2Fv1%2Fmerchant%2Fme
  - 401 http://localhost:3001/api/proxy?endpoint=%2Fapi%2Fv1%2Fmerchant%2Fme
  -  http://localhost:3001/api/proxy?endpoint=%2Fapi%2Fv1%2Fmerchant%2Fme


### ❌ Scenario 2: Canonical Navigation Across Merchant Workspace
**Status**: FAIL
**Details**: Error: page.waitForLoadState: Target page, context or browser has been closed


**Network Failures (14)**:
  -  http://localhost:3001/api/proxy?endpoint=%2Fapi%2Fsanctum%2Fcsrf-cookie
  -  http://localhost:3001/_next/static/chunks/src_0cc~4fk._.js
  -  http://localhost:3001/_next/static/chunks/node_modules_0uovr5r._.js
  -  http://localhost:3001/_next/static/chunks/node_modules_%40base-ui_react_esm_utils_0jd~aj0._.js
  -  http://localhost:3001/en/merchant/dashboard?_rsc=7xr7g
  -  http://localhost:3001/_next/static/chunks/src_app_%5Blocale%5D_(merchant)_layout_tsx_05b6_q0._.js
  -  http://localhost:3001/_next/static/chunks/src_00k717.._.js
  -  http://localhost:3001/_next/static/chunks/src_app_%5Blocale%5D_(merchant)_merchant_dashboard_page_tsx_0boo~1r._.js
  -  http://localhost:3001/_next/static/chunks/node_modules_%40base-ui_react_esm_floating-ui-react_0vr-leb._.js
  -  http://localhost:3001/_next/static/chunks/node_modules_%40base-ui_react_esm_menu_04s~gix._.js
  -  http://localhost:3001/_next/static/chunks/node_modules_%40base-ui_react_esm_0v9gz5d._.js
  -  http://localhost:3001/en/merchant/dashboard?_rsc=7xr7g
  -  http://localhost:3001/_next/static/chunks/node_modules_0rkk2j~._.js
  -  http://localhost:3001/_next/static/chunks/node_modules_%40base-ui_react_esm_select_0b15u.w._.js


### ❌ Scenario 3: Direct Legacy Route Fallback
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 4: Store Switch Preserves Route Context
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 5: Disabled / Blocked / Provisioning Store Messaging
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 6: Setup Flow for Merchant With No Store
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 7: Setup Recovery State
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 8: Setup Completion Handoff
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 9: Top Bar Trust Check
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 10: Page Header and Orientation Check
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 11: Empty State Guidance
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 12: Store Settings Self-Service
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 12A: Profile Avatar Upload
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 12B: Profile Information Update
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 12C: Password Change Flow
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 12D: Account Status and Management
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 12E: Profile Settings Page Layout
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 12F: Profile Settings End-to-End Flow
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 13: First-Run Merchant Checklist
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 14: Workflow Comfort Improvements
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed




### ❌ Scenario 15: Browser History and Multi-Step Navigation
**Status**: FAIL
**Details**: Error: page.goto: Target page, context or browser has been closed





---

## Screenshots

- [Scenario 1: Login Redirect and Merchant Entry](./screenshots/scenario-1-login-redirect-and-merchant-entry.png)
- [Scenario 2: Canonical Navigation Across Merchant Workspace](./screenshots/scenario-2-canonical-navigation-across-merchant-workspace.png)
- [Scenario 3: Direct Legacy Route Fallback](./screenshots/scenario-3-direct-legacy-route-fallback.png)
- [Scenario 4: Store Switch Preserves Route Context](./screenshots/scenario-4-store-switch-preserves-route-context.png)
- [Scenario 5: Disabled / Blocked / Provisioning Store Messaging](./screenshots/scenario-5-disabled-blocked-provisioning-store-messaging.png)
- [Scenario 6: Setup Flow for Merchant With No Store](./screenshots/scenario-6-setup-flow-for-merchant-with-no-store.png)
- [Scenario 7: Setup Recovery State](./screenshots/scenario-7-setup-recovery-state.png)
- [Scenario 8: Setup Completion Handoff](./screenshots/scenario-8-setup-completion-handoff.png)
- [Scenario 9: Top Bar Trust Check](./screenshots/scenario-9-top-bar-trust-check.png)
- [Scenario 10: Page Header and Orientation Check](./screenshots/scenario-10-page-header-and-orientation-check.png)
- [Scenario 11: Empty State Guidance](./screenshots/scenario-11-empty-state-guidance.png)
- [Scenario 12: Store Settings Self-Service](./screenshots/scenario-12-store-settings-self-service.png)
- [Scenario 12A: Profile Avatar Upload](./screenshots/scenario-12a-profile-avatar-upload.png)
- [Scenario 12B: Profile Information Update](./screenshots/scenario-12b-profile-information-update.png)
- [Scenario 12C: Password Change Flow](./screenshots/scenario-12c-password-change-flow.png)
- [Scenario 12D: Account Status and Management](./screenshots/scenario-12d-account-status-and-management.png)
- [Scenario 12E: Profile Settings Page Layout](./screenshots/scenario-12e-profile-settings-page-layout.png)
- [Scenario 12F: Profile Settings End-to-End Flow](./screenshots/scenario-12f-profile-settings-end-to-end-flow.png)
- [Scenario 13: First-Run Merchant Checklist](./screenshots/scenario-13-first-run-merchant-checklist.png)
- [Scenario 14: Workflow Comfort Improvements](./screenshots/scenario-14-workflow-comfort-improvements.png)
- [Scenario 15: Browser History and Multi-Step Navigation](./screenshots/scenario-15-browser-history-and-multi-step-navigation.png)

---

## Issues Found

- **Scenario 1: Login Redirect and Merchant Entry**: URL: http://localhost:3001/en/login, Shell: false
- **Scenario 2: Canonical Navigation Across Merchant Workspace**: Error: page.waitForLoadState: Target page, context or browser has been closed
- **Scenario 3: Direct Legacy Route Fallback**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 4: Store Switch Preserves Route Context**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 5: Disabled / Blocked / Provisioning Store Messaging**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 6: Setup Flow for Merchant With No Store**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 7: Setup Recovery State**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 8: Setup Completion Handoff**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 9: Top Bar Trust Check**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 10: Page Header and Orientation Check**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 11: Empty State Guidance**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 12: Store Settings Self-Service**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 12A: Profile Avatar Upload**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 12B: Profile Information Update**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 12C: Password Change Flow**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 12D: Account Status and Management**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 12E: Profile Settings Page Layout**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 12F: Profile Settings End-to-End Flow**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 13: First-Run Merchant Checklist**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 14: Workflow Comfort Improvements**: Error: page.goto: Target page, context or browser has been closed
- **Scenario 15: Browser History and Multi-Step Navigation**: Error: page.goto: Target page, context or browser has been closed

---

## Recommendations

1. Address failing scenarios identified above.
2. Verify with additional merchant accounts (multi-store, no-store, blocked).
3. Run on mobile viewport for responsive testing.
4. Consider automating critical paths.

---

*Report generated by Merchant UX Manual Chromium Scenarios Layer 3 Agent Mission*
