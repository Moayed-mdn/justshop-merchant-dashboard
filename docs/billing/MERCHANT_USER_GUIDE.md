# 💳 Billing & Subscription - Merchant Guide

**Last Updated:** June 11, 2026  
**Version:** 1.0  
**For:** Merchant Users

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Getting Started with Your Free Trial](#-getting-started-with-your-free-trial)
3. [Managing Your Subscription](#-managing-your-subscription)
4. [Understanding Your Usage & Limits](#-understanding-your-usage--limits)
5. [Viewing Invoices](#-viewing-invoices)
6. [Managing Payment Methods](#-managing-payment-methods)
7. [Handling Payment Failures](#-handling-payment-failures)
8. [Plan Comparison](#-plan-comparison)
9. [Frequently Asked Questions](#-frequently-asked-questions)
10. [Need Help?](#-need-help)

---

## 📋 Overview

Welcome to the LaraTenant Commerce billing system! This guide explains how to manage your subscription, view billing information, and understand your plan limits.

### What You Can Do

- ✅ Start a 14-day free trial (no credit card required)
- ✅ Upgrade or downgrade your plan anytime
- ✅ View and download invoices
- ✅ Manage payment methods
- ✅ Monitor your usage and limits
- ✅ Cancel or resume your subscription

### Where to Find Billing

**Option 1:** Click "Billing" in the sidebar navigation  
**Option 2:** Go to Settings → Subscription & Billing

---

## 🎉 Getting Started with Your Free Trial

### How to Start a Trial

Starting your 14-day free trial is quick and easy:

1. **Navigate to Billing**
   - Click "Billing" in the sidebar
   - Or visit `/merchant/billing`

2. **Choose a Plan**
   - Click "Start Free Trial"
   - Review available plans (Starter, Growth, Enterprise)
   - Toggle between Monthly and Annual billing to compare pricing
   - Select your preferred plan by clicking "Select Plan"

3. **Complete Checkout**
   - Enter your payment information (required for after trial ends)
   - Click "Start Trial"
   - Your 14-day trial begins immediately with full access

### What's Included in the Trial?

Your free trial includes:

- ✅ **Full access** to all features in your selected plan
- ✅ **14 days completely free** - no charges during trial
- ✅ **No credit card required** until you're ready to continue
- ✅ **Cancel anytime** before trial ends with no charges
- ✅ **Switch plans** during trial at no cost

### Trial Countdown

Once your trial starts, you'll see a banner at the top of your dashboard showing:
- Days remaining in your trial
- Trial end date
- Quick link to choose a paid plan

### Urgency Levels

The trial banner changes color to help you stay informed:

- 🔵 **Blue Banner** (>7 days remaining): You have plenty of time to explore
- 🟠 **Orange Banner** (3-7 days remaining): Friendly reminder to choose a plan
- 🔴 **Red Banner** (<3 days remaining): Urgent - choose a plan soon to avoid interruption

### What Happens When Trial Ends?

If you don't select a paid plan before your trial expires:
- Your stores will be suspended
- You'll lose access to products and features
- Your data is safely stored and not deleted
- Simply choose a plan to restore full access immediately


---

## 💳 Managing Your Subscription

### View Subscription Status

Navigate to `/merchant/billing` to see your subscription dashboard. You'll find:

- **Current plan name** (e.g., "Growth")
- **Billing cycle** (Monthly or Annual)
- **Subscription status** (Active, Trialing, Past Due, Canceled)
- **Next renewal date**
- **Quick action buttons** for common tasks

### Upgrade Your Plan

**When to Upgrade:** You need more stores, products, or access to advanced features

**Steps:**
1. Go to Billing → Plans
2. Review available plans and their features
3. Select a higher-tier plan
4. Click "Select Plan"
5. Confirm the upgrade

**What Happens:**
- ✅ Upgrade happens **immediately**
- ✅ You get new features and higher limits right away
- ✅ You're charged a prorated amount for the remainder of your billing period
- ✅ Your next invoice reflects the new plan price

**Example:** If you upgrade from Starter ($29/month) to Growth ($79/month) halfway through your billing cycle, you'll pay approximately $25 prorated charge immediately, then $79 on your next renewal date.

### Downgrade Your Plan

**When to Downgrade:** You want to reduce costs or don't need all features

**Steps:**
1. Go to Billing → Plans
2. Select a lower-tier plan
3. Review "Features you'll lose" carefully
4. Click "Select Plan"
5. Confirm the downgrade

**What Happens:**
- ⏰ Downgrade is **scheduled** for the end of your current billing period
- ✅ You keep your current plan and all features until then
- ✅ No refund for the current period
- ✅ Lower price applies on your next billing cycle

**Important:** If you're currently using more resources than your new plan allows (e.g., 5 stores but downgrading to 3-store limit), you'll need to delete excess resources before the downgrade takes effect.


### Cancel Subscription

**Steps:**
1. Go to your Billing dashboard
2. Scroll to find "Cancel Subscription" button
3. Read the "What happens next" message carefully
4. Click "Confirm Cancellation"

**What Happens:**
- ✅ You retain **full access** until the end of your current billing period
- ✅ No future charges will be made
- ✅ You can **resume** your subscription anytime before the period ends
- ⚠️ After the period ends, your stores will be suspended
- 💾 Your data remains safe - nothing is deleted

**No Hassle:** We make cancellation easy with no hidden tricks or hostile patterns.

### Resume Canceled Subscription

**If you canceled by mistake or changed your mind:**

1. Go to your Billing dashboard
2. You'll see a "Resume Subscription" button
3. Click "Resume Subscription"
4. Confirm the action

**Result:** Your subscription reactivates immediately, and billing will continue as normal on your next renewal date.

### Change Billing Cycle

**Switch between Monthly and Annual billing:**

1. Go to Billing dashboard
2. Click "Change Billing Cycle" (or similar option)
3. Select your preferred cycle (Monthly or Annual)
4. Review the proration details
5. Confirm the change

**Benefits of Annual Billing:**
- 💰 **Save 20%** compared to paying monthly
- ✅ Fewer billing transactions to manage
- ✅ Lock in current pricing for a full year
- 🎁 Better value for long-term commitment

**Example:** Growth plan costs $79/month or $790/year (save $158 annually!)


---

## 📊 Understanding Your Usage & Limits

### View Usage Dashboard

Your Billing dashboard shows real-time usage metrics:

**Location:** `/merchant/billing`

**What You'll See:**
- **Stores:** Current count / Maximum allowed (e.g., 2 / 3)
- **Products:** Total across all stores / Maximum allowed (e.g., 5,247 / 10,000)
- **Features:** Checkmarks for enabled features in your plan

### What Are Limits?

Each plan includes specific limits:

- **Store Limit:** Maximum number of stores you can create
- **Product Limit:** Total products across all your stores combined
- **Features:** Boolean features (analytics, multi-currency, API access, etc.)

### What Happens at Limit?

**Scenario:** You try to create a new product, but you're at 10,000 / 10,000

**What You'll See:**
- ❌ Creation is blocked
- 💬 An upgrade prompt dialog appears automatically
- 📈 Your current usage is displayed
- 🔗 Recommended plan shown with upgrade options

**Solution:** Upgrade to a higher plan for more capacity, or delete existing items to free up space.

### Soft vs Hard Limits

- **Hard Limits:** Strictly enforced (stores, products)
- **Soft Limits:** Grace period before enforcement (bandwidth, API calls)

### Usage Monitoring Tips

1. **Check regularly:** Visit your billing dashboard weekly
2. **Set internal alerts:** When you hit 80% of capacity, consider upgrading
3. **Plan ahead:** Upgrade before hitting limits to avoid workflow interruptions
4. **Clean up:** Delete unused products or stores to optimize your usage


---

## 🧾 Viewing Invoices

### Invoice List

**Location:** `/merchant/billing/invoices`

**Features:**
- See all past and current invoices
- Filter by status (Paid, Open, Draft, Void)
- Filter by year
- Pagination for accounts with many invoices
- Search by invoice number

**Status Badges:**
- 🟢 **Paid** - Invoice successfully paid
- 🟡 **Open** - Payment pending
- ⚪ **Draft** - Not yet finalized
- 🔴 **Void** - Canceled or invalid

### Invoice Detail

Click "View" on any invoice to see complete details:

**What's Included:**
- Invoice number and date
- Detailed line items (what you were charged for)
- Subtotal before tax
- Tax amount (if applicable)
- Total amount charged
- Payment status
- Payment method used
- Download PDF button

### Download Invoice PDF

1. Navigate to invoice detail page
2. Click "Download PDF" button
3. PDF opens in new tab or downloads automatically

**Use Cases:**
- Accounting and bookkeeping
- Expense reports
- Tax documentation
- Record keeping

**Pro Tip:** All invoices are securely hosted by Stripe with permanent URLs you can bookmark.

### Invoice Timeline

- **Draft:** Invoice created but not finalized (rare)
- **Open:** Invoice sent, payment processing
- **Paid:** Payment successful, transaction complete
- **Void:** Invoice canceled (refunds, corrections)


---

## 💸 Managing Payment Methods

### Update Payment Method

**Location:** Billing Dashboard → "Billing Portal" button

**Steps:**
1. Go to your Billing page
2. Click "Manage in Billing Portal" button
3. You'll be redirected to Stripe's secure portal
4. Click "Update payment method"
5. Enter your new credit card details
6. Save changes
7. Return to your dashboard

**When to Update:**
- Your card is expiring soon
- You got a new credit card
- A payment failed due to insufficient funds
- You want to change billing address
- You need to update cardholder name

### What is the Billing Portal?

The Billing Portal is a secure Stripe-hosted page where you can:

- ✅ Update payment methods safely
- ✅ View complete billing history
- ✅ Update billing address
- ✅ Manage payment preferences
- ✅ Download all invoices

**Security:** Your payment information is encrypted and processed by Stripe, a PCI DSS Level 1 certified payment processor. We never see or store your full credit card number.

### Accepted Payment Methods

We accept all major credit and debit cards:

- Visa
- Mastercard
- American Express
- Discover
- JCB
- Diners Club

**Note:** Prepaid cards and virtual cards are accepted as long as they support recurring payments.


---

## ⚠️ Handling Payment Failures

### Grace Period

If a payment fails (expired card, insufficient funds, bank decline), here's what happens:

**Day 1 (Payment Fails):**
1. Subscription status changes to "Past Due"
2. A red warning banner appears at the top of your dashboard
3. Grace period starts (typically 3 days)
4. You receive an email notification

**During Grace Period:**
- ✅ You retain **full access** to all features
- ⚠️ You must update your payment method within the grace period
- 🔴 Daily reminders via banner and email
- ⏰ Countdown shows days remaining

**After Grace Period Expires:**
- ❌ Your stores are suspended
- ❌ Products become inaccessible to customers
- 📧 Final notice email sent
- 🔄 You can reactivate anytime by updating payment

### How to Fix Payment Failures

**Method 1: Update via Banner (Fastest)**
1. Click "Update Payment" in the red warning banner
2. You'll be redirected to Stripe Billing Portal
3. Update your payment method
4. Payment retries automatically
5. Access restored within minutes

**Method 2: Update via Billing Page**
1. Go to `/merchant/billing`
2. Click "Manage in Billing Portal"
3. Update payment method
4. Return to dashboard

**Method 3: Contact Support**
If you're having persistent issues, contact our support team for assistance.

### Common Payment Failure Reasons

- **Expired Card:** Update expiration date
- **Insufficient Funds:** Add funds or use different card
- **Bank Decline:** Contact your bank or use different card
- **Card Limit Reached:** Use different card
- **Address Mismatch:** Update billing address


---

## 💡 Plan Comparison

### Starter Plan

**Best for:** Small businesses, single store, getting started

**Price:**
- 💵 $29/month
- 💵 $290/year (save $58 - 17% discount)

**Includes:**
- 1 store
- 1,000 products
- Basic dashboard
- Email support (24-48 hour response)
- Standard themes
- Product categories and tags
- Basic SEO features

**Limitations:**
- No advanced analytics
- No multi-currency support
- No API access
- No priority support

---

### Growth Plan ⭐ (Most Popular)

**Best for:** Growing businesses, multiple stores, serious sellers

**Price:**
- 💵 $79/month
- 💵 $790/year (save $158 - 20% discount)

**Includes:**
- 3 stores
- 10,000 products
- Advanced analytics and reporting
- Multi-currency support
- Priority email support (12-24 hour response)
- Custom themes
- Hero banners and CMS
- Advanced SEO features
- Inventory management
- Discount codes

**Upgrade from Starter:**
- ✅ 2 additional stores
- ✅ 9,000 more products
- ✅ Advanced features
- ✅ Better support

---

### Enterprise Plan

**Best for:** Large businesses, unlimited scale, enterprise needs

**Price:**
- 💵 Custom pricing (contact sales)
- 💵 Typically starts at $299/month

**Includes:**
- ✅ **Unlimited stores**
- ✅ **Unlimited products**
- ✅ All Growth features
- ✅ Priority support (4-hour response)
- ✅ Dedicated account manager
- ✅ API access for integrations
- ✅ Custom integrations
- ✅ White-label options
- ✅ SLA guarantees
- ✅ Advanced security features


**Contact Sales:**
- Email: sales@laratenant.com
- Schedule a demo to discuss your needs

---

### Feature Comparison Table

| Feature | Starter | Growth | Enterprise |
|---------|---------|--------|------------|
| **Stores** | 1 | 3 | Unlimited |
| **Products** | 1,000 | 10,000 | Unlimited |
| **Basic Dashboard** | ✅ | ✅ | ✅ |
| **Advanced Analytics** | ❌ | ✅ | ✅ |
| **Multi-Currency** | ❌ | ✅ | ✅ |
| **Custom Themes** | ❌ | ✅ | ✅ |
| **Hero Banners/CMS** | ❌ | ✅ | ✅ |
| **Priority Support** | ❌ | ✅ | ✅ |
| **API Access** | ❌ | ❌ | ✅ |
| **Account Manager** | ❌ | ❌ | ✅ |
| **SLA Guarantee** | ❌ | ❌ | ✅ |
| **Support Response** | 24-48h | 12-24h | 4h |

---

## ❓ Frequently Asked Questions

### General Questions

**Q: Can I change plans during my trial?**  
A: Yes! You can switch between plans anytime during your 14-day trial without any charges.

**Q: Will I be charged during the trial?**  
A: No. Your credit card is only charged after the 14-day trial ends, unless you cancel before then.

**Q: Can I cancel during the trial?**  
A: Absolutely. Cancel anytime during your trial period to avoid any charges. No questions asked.

**Q: What happens if I don't choose a plan after trial?**  
A: Your trial expires after 14 days, and access to your stores is blocked. Your data remains safe, and you can reactivate anytime by selecting a paid plan.

**Q: Do I get a refund if I cancel mid-month?**  
A: No, we don't offer prorated refunds. However, you retain full access until the end of your current billing period.

**Q: Can I upgrade and downgrade multiple times?**  
A: Yes. Upgrades happen immediately. Downgrades are scheduled for the end of your billing period. You can change your plan as often as needed.


### Payment Questions

**Q: What payment methods do you accept?**  
A: We accept all major credit cards (Visa, Mastercard, American Express, Discover) via Stripe. Debit cards and some prepaid cards are also accepted.

**Q: Is my payment information secure?**  
A: Yes. We use Stripe for payment processing, which is PCI DSS Level 1 certified (the highest security standard). Your card details are encrypted and never stored on our servers.

**Q: How do I get a receipt or invoice?**  
A: All invoices are available at `/merchant/billing/invoices`. You can view details and download PDFs for your records.

**Q: Can I pause my subscription instead of canceling?**  
A: Currently, pausing is not available. You can cancel and retain access until the end of your billing period, then reactivate later by selecting a plan again.

**Q: What happens if my payment fails?**  
A: You enter a 3-day grace period with full access. Update your payment method to avoid suspension. After the grace period, your stores are temporarily suspended until payment is resolved.

### Plan & Limit Questions

**Q: What if I exceed my plan limits?**  
A: You'll be unable to create more stores or products until you either upgrade your plan or delete existing items. Your existing stores and products continue to function normally.

**Q: Can I buy additional stores without upgrading?**  
A: No, stores and products are tied to plan tiers. To get more capacity, you need to upgrade to a higher plan.

**Q: Are there any hidden fees?**  
A: No. The price you see is what you pay. Taxes may apply based on your location. There are no setup fees, cancellation fees, or hidden charges.

**Q: Do you offer discounts for annual billing?**  
A: Yes! Annual billing saves you 20% compared to monthly. For example, Growth plan is $79/month or $790/year (save $158).

**Q: Do you offer discounts for nonprofits or educators?**  
A: Please contact our sales team at sales@laratenant.com to discuss special pricing for qualifying organizations.


### Data & Account Questions

**Q: What happens to my data if I cancel?**  
A: Your data is safely stored for 90 days after cancellation. You can reactivate anytime during this period with no data loss. After 90 days, data may be permanently deleted.

**Q: Can I export my data before canceling?**  
A: Yes. You can export all your products, orders, and customer data from your dashboard before canceling.

**Q: Can I transfer my stores to another account?**  
A: Please contact support to arrange store transfers between accounts. There may be verification steps for security.

---

## 📞 Need Help?

### Support Channels

**Email Support:**
- Email: support@laratenant.com
- Starter/Growth plans: 24-48 hour response time
- Enterprise plans: 4-hour priority response time

**Help Center:**
- URL: help.laratenant.com
- Searchable knowledge base
- Video tutorials
- Getting started guides

**Live Chat:**
- Available for Enterprise plans
- Business hours: Mon-Fri 9am-5pm EST

**Sales Inquiries:**
- Email: sales@laratenant.com
- Schedule a demo for Enterprise plans
- Custom pricing discussions

### Before Contacting Support

Please have ready:
- Your account email address
- Description of the issue
- Screenshots (if applicable)
- Invoice number (for billing issues)
- Steps you've already tried

### Emergency Issues

For critical issues like:
- Payment failures affecting active sales
- Security concerns
- Data loss

Mark your email subject with **[URGENT]** for priority handling.

---

**Last Updated:** June 11, 2026  
**Version:** 1.0  
**Feedback:** Have suggestions for this guide? Email docs@laratenant.com

