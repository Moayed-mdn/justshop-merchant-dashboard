# Subscription Lifecycle

## Goal

Verify that a merchant can successfully navigate the complete subscription lifecycle including plan selection, purchase, payment management, plan upgrades and downgrades, renewal handling, and cancellation. This mission validates the critical subscription flows that directly impact platform revenue and merchant access.

## Entry Point

Merchant dashboard: `/en/merchant/dashboard` (authenticated as merchant without active subscription)

## Preconditions

- Merchant account exists with active store
- User is logged in but has no active subscription
- Multiple subscription plans are available (Starter, Professional, Enterprise)
- Test payment cards are available:
  - Valid: 4242424242424242
  - Declined: 4000000000000002
- Mock backend supports subscription operations

## Steps

1. Navigate to Subscription section from sidebar or banner
2. Observe subscription plans comparison page
3. Review plan features:
   - Starter: Basic features, limited products
   - Professional: Advanced features, unlimited products
   - Enterprise: Custom features, dedicated support
4. Compare pricing for monthly vs annual billing
5. Toggle billing cycle selector to see annual discount
6. Click "Select Plan" on Professional plan
7. Observe redirect to checkout/payment page
8. Verify plan details display:
   - Plan name: Professional
   - Price per month
   - Billing cycle
   - Total amount due today
9. Fill payment information:
   - Card number: 4242424242424242
   - Expiry: 12/26
   - CVC: 123
   - Cardholder name: "Jane Merchant"
10. Review terms and conditions checkbox
11. Check "I accept the terms and conditions"
12. Click "Subscribe Now" or "Complete Purchase"
13. Observe payment processing indicator
14. Verify redirect to subscription confirmation page
15. Observe success message: "Subscription Activated"
16. Verify plan details display with active status
17. Navigate to Dashboard
18. Verify subscription status banner shows "Professional Plan - Active"
19. Navigate back to Subscription section
20. Observe current subscription details:
    - Current plan: Professional
    - Status: Active
    - Next billing date
    - Payment method: Card ending in 4242
21. Click "Update Payment Method" button
22. Fill new card information:
    - Card number: 4242424242424243
    - Expiry: 06/27
    - CVC: 456
23. Submit payment method update
24. Verify success message: "Payment method updated"
25. Verify card ending digits updated in subscription details
26. Click "Upgrade Plan" button
27. Review available upgrade options
28. Select Enterprise plan
29. Review upgrade details:
    - Prorated credit from current plan
    - New plan price
    - Amount due today
30. Confirm upgrade
31. Verify redirect to confirmation
32. Verify plan updated to Enterprise
33. Navigate to Billing History section
34. Observe transaction list:
    - Initial Professional subscription purchase
    - Upgrade to Enterprise
35. Click on transaction to view invoice details
36. Verify invoice shows itemized charges
37. Download invoice PDF (if available)
38. Navigate back to Subscription
39. Click "Cancel Subscription" button
40. Observe cancellation confirmation dialog
41. Review cancellation terms:
    - Access until end of current period
    - No refund (or prorated refund)
    - Can reactivate before period ends
42. Select cancellation reason from dropdown
43. Optionally provide feedback in text area
44. Click "Confirm Cancellation"
45. Verify cancellation confirmation message
46. Verify subscription status: "Cancelled - Active until [date]"
47. Verify "Reactivate Subscription" button appears
48. Click "Reactivate Subscription"
49. Confirm reactivation
50. Verify status returns to "Active"
51. Verify next billing date is restored
52. Navigate to Subscription settings
53. Toggle auto-renewal setting to "Off"
54. Save settings
55. Verify warning: "Subscription will expire on [date]"
56. Toggle auto-renewal back to "On"
57. Save settings
58. Simulate payment failure (logout and use mock endpoint to expire payment)
59. Log back in
60. Observe payment failed banner on dashboard
61. Navigate to Subscription section
62. Observe status: "Past Due"
63. Observe grace period countdown
64. Click "Update Payment Method" from warning banner
65. Enter new valid payment information
66. Submit payment update
67. Verify retry payment success message
68. Verify subscription status returns to "Active"

## Expected Behavior

- Plan comparison page displays features side-by-side clearly
- Annual billing shows discount percentage vs monthly
- Billing cycle toggle updates displayed prices instantly
- Checkout page displays itemized pricing breakdown
- Payment form validates card format before submission
- Terms checkbox is required before submission
- Payment processing shows loading indicator
- Successful purchase redirects to confirmation within 10 seconds
- Confirmation page displays subscription start date and next billing date
- Dashboard subscription banner updates immediately after purchase
- Subscription details page shows accurate billing information
- Payment method update encrypts card data (PCI compliant)
- Updated payment method displays only last 4 digits
- Upgrade flow calculates prorated credit accurately
- Upgrade confirmation applies immediately
- Billing history displays all transactions chronologically
- Invoices include merchant details, platform details, and itemization
- PDF invoices download successfully with correct formatting
- Cancellation requires explicit confirmation to prevent accidents
- Cancelled subscription maintains access until period end
- Reactivation restores full subscription benefits immediately
- Auto-renewal toggle has clear on/off visual indication
- Payment failure triggers email notification (check email logs if available)
- Grace period allows limited access to prevent data loss
- Past due status prevents creating new resources but allows viewing
- Payment retry from grace period restores full access
- All subscription state changes log to audit trail (if available)

## Defect Reporting Instructions

When a defect is found:
- Capture screenshot of subscription section and current state
- Capture browser console errors
- Capture network failures (especially payment API calls)
- Record exact reproduction steps from entry point
- Identify affected subscription flow (purchase, upgrade, cancel, payment)
- Note whether defect causes billing issues or access issues
- Verify if payment information is transmitted securely
- Check if prorated calculations are mathematically correct
- Verify if grace period duration matches expected policy
- Test on multiple payment card scenarios if possible
- Propose root cause when possible (e.g., "Proration calculation double-charges on upgrade", "Cancellation immediately revokes access instead of waiting for period end", "Payment method update fails silently without error message", "Grace period does not extend after payment retry")

## Completion Criteria

The mission is considered successful when:
- All steps complete successfully
- Expected behavior is observed at each step
- No blocking defects prevent subscription lifecycle completion
- Plan purchase completes with valid payment
- Payment method can be updated securely
- Plan upgrades calculate prorated charges correctly
- Cancellation preserves access until period end
- Reactivation restores full subscription immediately
- Auto-renewal setting persists correctly
- Payment failures trigger appropriate warnings and grace period
- Grace period allows payment retry
- Billing history accurately reflects all transactions
- Subscription state changes are immediate and consistent across dashboard
- No unauthorized charges occur
- Payment data is handled securely throughout
