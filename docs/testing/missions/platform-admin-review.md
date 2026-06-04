# Platform Admin Review

## Goal

Verify that a platform administrator can effectively manage the multi-tenant ecommerce platform including tenant provisioning, subscription plan configuration, global settings management, user support workflows, and platform-wide analytics. This mission validates administrative capabilities that affect all merchants and the platform's operational health.

## Entry Point

Platform admin dashboard: `/en/admin/dashboard` (authenticated as platform administrator)

## Preconditions

- Platform admin account exists with full administrative privileges
- User is logged in with admin role
- Multiple tenant stores exist in various states (active, pending, suspended)
- Subscription plans are configured
- Platform has transaction history and usage data
- Mock backend supports admin operations

## Steps

1. Navigate to admin dashboard
2. Observe platform overview metrics:
   - Total tenants (stores)
   - Active subscriptions
   - Monthly recurring revenue (MRR)
   - New signups this month
   - System health indicators
3. Navigate to Tenants section
4. Observe tenant list with columns:
   - Store name
   - Owner email
   - Status (active, pending, suspended, archived)
   - Subscription plan
   - Created date
   - Last activity
5. Apply filter: Status = "Pending Setup"
6. Observe tenants that have not completed onboarding
7. Click on a pending tenant
8. View tenant details:
   - Owner information
   - Store information
   - Provisioning status
   - Activity logs
9. Observe provisioning failure or stuck state
10. Click "Retry Provisioning" button
11. Verify provisioning restarts
12. Observe real-time provisioning progress
13. Verify provisioning completes successfully
14. Navigate back to tenant list
15. Clear filters
16. Search for specific tenant by name or email
17. Verify search results display correct tenant
18. Click on active tenant
19. View tenant resource usage:
    - Storage used
    - Bandwidth used
    - API calls this month
    - Product count
    - Order count
20. Navigate to tenant's subscription tab
21. Observe subscription details:
    - Current plan
    - Billing cycle
    - Payment status
    - Renewal date
22. Click "Modify Subscription" button
23. Change plan from Professional to Enterprise
24. Set effective date: Immediate
25. Optionally add admin note: "Upgraded due to support request"
26. Confirm subscription change
27. Verify tenant subscription updates
28. Navigate to Subscription Plans section
29. Observe list of available plans (Starter, Professional, Enterprise)
30. Click "Create Plan" button
31. Fill new plan form:
    - Plan name: "Premium"
    - Plan slug: "premium"
    - Price (monthly): $299.00
    - Price (annual): $2990.00 (17% discount)
    - Features:
      - Unlimited products
      - Priority support
      - Custom domain
      - Advanced analytics
    - Limits:
      - Max products: Unlimited (-1)
      - Max storage: 100 GB
      - Max API calls/month: 500,000
32. Set plan visibility: Active
33. Submit plan creation
34. Verify "Premium" plan appears in plan list
35. Navigate to existing plan (Professional)
36. Click "Edit Plan"
37. Modify pricing: Increase monthly price to $59.99
38. Set effective date: Beginning of next month
39. Add change note: "Annual price adjustment"
40. Save plan changes
41. Verify grandfathering notice for existing subscribers (if applicable)
42. Navigate to Global Settings section
43. Review settings categories:
    - General settings
    - Email configuration
    - Payment gateways
    - Feature flags
    - Maintenance mode
44. Click Email Configuration
45. Verify SMTP settings:
    - SMTP host
    - SMTP port
    - Encryption method
    - From address
46. Send test email
47. Verify test email delivery confirmation
48. Navigate to Payment Gateways
49. Observe configured gateways (Stripe, PayPal)
50. Click on Stripe configuration
51. Verify API keys are masked (show only last 4 chars)
52. Toggle "Enable Stripe" setting
53. Save gateway configuration
54. Navigate to Feature Flags section
55. Observe available feature toggles:
    - Enable AI product recommendations
    - Enable advanced reporting
    - Enable API access
56. Toggle "Enable advanced reporting" to On
57. Set rollout percentage: 50% (gradual rollout)
58. Save feature flag
59. Navigate to Maintenance Mode
60. Observe maintenance mode is currently Off
61. Enable maintenance mode
62. Set maintenance message: "Platform upgrade in progress. Back online in 30 minutes."
63. Set allowed IP addresses for admin access
64. Activate maintenance mode
65. Verify maintenance page displays for regular users (test in incognito)
66. Return to admin dashboard
67. Disable maintenance mode
68. Navigate to Reports section
69. View platform-wide analytics:
    - Revenue trends (MRR growth)
    - Tenant growth (new signups)
    - Churn rate
    - Average revenue per tenant (ARPU)
70. Filter reports by date range: Last 90 days
71. Export report to CSV
72. Verify CSV download contains correct data
73. Navigate to Activity Logs
74. Observe admin actions log:
    - Admin user
    - Action type
    - Affected resource
    - Timestamp
75. Filter logs by action type: "Subscription Modified"
76. Verify filtered results show only subscription changes
77. Navigate to Support Tickets section (if available)
78. Observe open support tickets from merchants
79. Click on a ticket
80. View ticket details and conversation history
81. Reply to ticket with admin response
82. Change ticket status to "Resolved"
83. Verify ticket moves to resolved list
84. Navigate to System Health section
85. Observe system metrics:
    - Database connection status
    - API response times
    - Background job queue length
    - Storage capacity
86. Verify all health indicators show green (healthy)
87. Navigate to Tenant Actions
88. Select a tenant
89. Suspend tenant with reason: "Payment dispute"
90. Confirm suspension
91. Verify tenant status changes to "Suspended"
92. Verify tenant receives suspension notification (check email logs)
93. Reactivate suspended tenant
94. Verify tenant status returns to "Active"

## Expected Behavior

- Admin dashboard displays real-time or near-real-time metrics
- Tenant list supports pagination and sorting by any column
- Filters apply instantly without page reload
- Search returns results as you type (debounced)
- Tenant details provide comprehensive view of account
- Provisioning retry triggers immediately and shows progress
- Subscription modifications apply according to effective date setting
- Admin notes are logged in audit trail
- New plan creation validates uniqueness of slug
- Plan pricing accepts decimal values for cents
- Plan limits support -1 for unlimited
- Grandfathering rules protect existing subscribers from price increases
- Email configuration validates SMTP credentials before saving
- Test email sends within 10 seconds
- Payment gateway API keys are never displayed in full
- Feature flags support gradual rollout percentages
- Maintenance mode blocks all non-admin traffic
- Maintenance message displays with custom text
- Reports generate without performance degradation
- CSV export formats data correctly with proper headers
- Activity logs capture all administrative actions
- Log filtering updates results instantly
- Support ticket replies notify merchants via email
- System health checks run automatically at intervals
- Health indicators turn red when thresholds exceeded
- Tenant suspension immediately revokes access
- Suspension notification emails send automatically
- Reactivation restores full tenant access

## Defect Reporting Instructions

When a defect is found:
- Capture screenshot of admin section and affected resource
- Capture browser console errors
- Capture network failures during admin operations
- Record exact reproduction steps from entry point
- Identify affected admin function (tenant management, plans, settings, etc.)
- Note whether defect affects single tenant or platform-wide
- Verify if defect causes data inconsistency
- Check if audit logs captured the action correctly
- Test if defect reproduces across different tenants
- Verify if permissions are enforced correctly
- Propose root cause when possible (e.g., "Provisioning retry does not reset failed state", "Plan price change applies immediately despite future effective date", "Maintenance mode allows non-admin access from allowed IPs", "Feature flag rollout percentage calculates incorrectly", "Tenant suspension does not revoke active sessions")

## Completion Criteria

The mission is considered successful when:
- All steps complete successfully
- Expected behavior is observed at each step
- No blocking defects prevent platform administration
- Tenant management functions operate correctly
- Provisioning can be monitored and manually retried
- Subscription plans can be created and modified
- Plan changes respect effective dates and grandfathering
- Global settings persist and apply platform-wide
- Email configuration works and delivers test emails
- Payment gateways can be toggled without data loss
- Feature flags control feature availability correctly
- Maintenance mode blocks regular traffic but allows admin access
- Reports generate accurate data across date ranges
- CSV exports contain properly formatted data
- Activity logs capture all admin actions with sufficient detail
- Support workflows facilitate merchant assistance
- System health monitoring provides accurate status
- Tenant lifecycle actions (suspend, reactivate) work as expected
- All admin actions log to audit trail for compliance
- No unauthorized access to admin functions occurs
