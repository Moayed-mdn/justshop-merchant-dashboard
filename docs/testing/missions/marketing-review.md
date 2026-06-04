# Marketing Review

## Goal

Verify that a merchant can create and manage marketing campaigns including discount codes, coupons, promotional rules, and automated marketing workflows. This mission validates the complete promotional lifecycle from campaign creation through rule configuration to customer redemption tracking.

## Entry Point

Merchant dashboard: `/en/merchant/dashboard` (authenticated as merchant with marketing permissions)

## Preconditions

- Merchant account exists with active store
- User is logged in with promotion.create, discount.create permissions
- Store has published products with inventory
- At least one category and brand exist for targeting rules
- Customer segment data exists (optional)

## Steps

1. Navigate to Marketing section from sidebar
2. Observe marketing overview dashboard showing active campaigns
3. Navigate to Discounts subsection
4. Click "Create Discount" button
5. Fill discount creation form:
   - Discount name: "Summer Sale 2026"
   - Discount type: "Percentage"
   - Discount value: 20%
   - Code: "SUMMER20"
6. Set validity period:
   - Start date: Today
   - End date: 30 days from today
7. Configure usage limits:
   - Max uses per customer: 1
   - Total usage limit: 1000
8. Set minimum requirements:
   - Minimum purchase amount: $50.00
9. Select applicable items:
   - Apply to: Specific categories
   - Select category: "Summer Apparel"
10. Set discount status: "Active"
11. Submit discount creation
12. Verify success message and redirect to discount list
13. Verify "SUMMER20" appears in active discounts
14. Click on discount to edit
15. Add exclusion rule:
    - Exclude products: Already discounted items
16. Save changes
17. Navigate to Coupons section
18. Create automatic discount (no code required):
    - Name: "First Order Discount"
    - Type: "Fixed amount"
    - Value: $10.00
    - Auto-apply: Yes
    - Target: First-time customers only
19. Set priority: High (applies before other discounts)
20. Submit coupon creation
21. Navigate to Promotions section
22. Click "Create Promotion" button
23. Configure promotion:
    - Promotion name: "Buy One Get One Free"
    - Type: "BOGO"
    - Buy quantity: 1
    - Get quantity: 1
    - Discount on free item: 100%
24. Select applicable products (e.g., specific SKUs)
25. Set validity dates
26. Set combinability: Cannot combine with other discounts
27. Submit promotion
28. Navigate to Email Campaigns subsection
29. Create abandoned cart email:
    - Campaign name: "Recover Cart - 24h"
    - Trigger: Cart abandoned for 24 hours
    - Subject line: "You left something behind!"
    - Email template: Select pre-built template
30. Configure discount incentive in email: 10% off
31. Set send time: 24 hours after abandonment
32. Activate campaign
33. Navigate back to Discounts list
34. Search for "SUMMER20" discount
35. View usage statistics:
    - Total uses
    - Revenue generated
    - Average order value with discount
36. Export discount usage report (if available)
37. Navigate to Discount Analytics
38. Review discount performance metrics:
    - Redemption rate
    - Discount ROI
    - Most popular discount codes
39. Filter analytics by date range: Last 30 days
40. Create flash sale:
    - Name: "Flash Friday"
    - Type: "Percentage"
    - Value: 30%
    - Duration: 3 hours
    - Start: Next Friday at 12:00 PM
41. Set product targeting: Entire catalog
42. Enable countdown timer on storefront
43. Schedule activation
44. Verify flash sale appears in scheduled campaigns
45. Clone existing discount "SUMMER20" to create "FALL20"
46. Modify cloned discount details
47. Save cloned discount
48. Deactivate original "SUMMER20" discount
49. Verify status change reflects in discount list

## Expected Behavior

- Discount creation form validates code format and uniqueness
- Percentage discounts accept values 1-100
- Fixed amount discounts accept positive decimal values
- Date pickers prevent invalid date ranges (end before start)
- Usage limits accept zero for unlimited or positive integers
- Minimum purchase requirement is optional
- Product/category selection supports multi-select with search
- Exclusion rules prevent conflicts (cannot apply and exclude same item)
- Auto-apply discounts appear in cart without code entry
- Priority settings determine stacking order when combinable
- BOGO promotions calculate correctly with quantity rules
- Email campaigns support dynamic variables (customer name, cart items)
- Discount statistics update in real-time or near-real-time
- Usage reports include customer email, order ID, discount amount
- Analytics charts visualize trends over time
- Flash sales display countdown on storefront
- Scheduled campaigns activate automatically at specified time
- Cloning discounts copies all settings for easy duplication
- Deactivating discounts prevents new redemptions but preserves history
- Active discounts apply automatically at checkout when conditions met
- Discount stacking follows configured combinability rules
- Error messages clearly indicate validation failures
- Discount codes are case-insensitive for customer convenience

## Defect Reporting Instructions

When a defect is found:
- Capture screenshot of marketing section and affected campaign
- Capture browser console errors
- Capture network failures during creation or update
- Record exact reproduction steps from entry point
- Identify affected campaign type (discount, coupon, promotion, email)
- Note whether defect affects campaign creation or redemption
- Test discount application in storefront checkout (if possible)
- Verify if discount calculations are correct
- Check if usage limits enforce correctly
- Verify if date-based activation works as scheduled
- Propose root cause when possible (e.g., "Percentage discount calculates incorrectly with multiple items", "Usage limit does not decrement after redemption", "Auto-apply discount conflicts with manual code", "Email campaign sends immediately instead of waiting for trigger")

## Completion Criteria

The mission is considered successful when:
- All steps complete successfully
- Expected behavior is observed at each step
- No blocking defects prevent campaign management
- Discounts can be created with various types and configurations
- Coupons auto-apply correctly when conditions are met
- Promotions calculate BOGO and other complex rules accurately
- Email campaigns schedule and trigger appropriately
- Usage statistics track redemptions correctly
- Analytics provide meaningful insights into discount performance
- Discount codes are case-insensitive and validated for format
- Combinability rules enforce correctly at checkout
- Scheduled campaigns activate without manual intervention
- Cloning functionality preserves all settings
- Status changes (active/inactive) take effect immediately
