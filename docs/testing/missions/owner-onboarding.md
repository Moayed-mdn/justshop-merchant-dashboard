# Owner Onboarding

## Goal

Verify that a new merchant can successfully complete the full onboarding journey from account registration through store creation to accessing the merchant dashboard. This mission validates the critical path that transforms a visitor into an active platform user with a functional store.

## Entry Point

Landing page: `/en` or registration page: `/en/signup`

## Preconditions

- No active session (logged out state)
- Test email address available (not previously registered)
- Mock backend is reset to initial state
- Browser localStorage and cookies cleared

## Steps

1. Navigate to the registration page
2. Fill registration form with:
   - Full name (e.g., "Jane Merchant")
   - Email address (e.g., "jane.merchant@example.com")
   - Password (minimum 8 characters)
   - Password confirmation (matching)
3. Submit registration form
4. Observe email verification step message
5. Simulate email verification (in mock environment, this may auto-complete)
6. Observe redirect to store creation page
7. Fill store creation form with:
   - Store name (e.g., "Jane's Fashion Boutique")
   - Store slug (e.g., "janes-fashion")
8. Submit store creation form
9. Observe provisioning progress indicator
10. Wait for provisioning to complete
11. Observe redirect to merchant dashboard
12. Verify dashboard shows store name in header
13. Verify sidebar navigation contains expected menu items
14. Navigate to Products page
15. Navigate to Orders page
16. Navigate back to Dashboard
17. Verify store switcher shows the newly created store

## Expected Behavior

- Registration form validates input fields inline
- Duplicate email addresses are rejected with clear error message
- Email verification step is shown after successful registration
- Store creation form appears after email verification
- Store slug is validated for uniqueness and format
- Provisioning screen shows progress updates
- Provisioning completes within reasonable time (< 30 seconds in mock)
- Dashboard loads with personalized welcome message
- Sidebar shows appropriate permissions for store owner
- Navigation between pages preserves active store context
- Store switcher displays the correct store name and ID
- URL structure uses canonical workspace routes (`/en/merchant/...`)
- No JavaScript errors in browser console
- All page transitions complete without blank screens

## Defect Reporting Instructions

When a defect is found:
- Capture screenshot of current state
- Capture browser console errors (F12 → Console tab)
- Capture network failures (F12 → Network tab, filter by Failed)
- Record exact reproduction steps from the beginning
- Identify affected workflow step number
- Note whether defect blocks onboarding completion
- Propose root cause when possible (e.g., "API timeout during provisioning", "Missing email validation", "Route mismatch after store creation")

## Completion Criteria

The mission is considered successful when:
- All steps complete successfully without manual intervention
- Expected behavior is observed at each step
- No blocking defects are discovered
- Merchant can access dashboard and navigate core pages
- Store context is correctly established and maintained
- New merchant can proceed to content management workflows
