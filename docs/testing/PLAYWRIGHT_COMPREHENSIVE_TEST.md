# Complete Playwright MCP Test Flow

Use this prompt with Playwright MCP to automate comprehensive testing of ALL features.

---

## Prerequisites

- Backend running on http://127.0.0.1:8000
- Frontend running on http://localhost:3001
- Queue worker running: `php artisan queue:work redis --queue=store-bootstrap,default --sleep=3 --tries=3 --max-time=3600`
- Stripe listener active: `stripe listen --forward-to localhost:8000/api/webhooks/stripe`
- Scheduler running: `php artisan schedule:work`

---

## PHASE 1: Registration & Authentication

1. Navigate to http://localhost:3001/en/signup
2. Fill registration form with unique email (use timestamp: test-merchant-{{timestamp}}@example.com), password "Password123!", name "Test Merchant"
3. Submit form and wait for redirect to verify-email page
4. **Manually verify email using tinker:** Run `User::latest()->first()->update(['email_verified_at' => now()])` in backend
5. Navigate to http://localhost:3001/en/login
6. Login with the registered credentials
7. Verify redirect to setup/create-store page

---

## PHASE 2: Store Creation

8. Fill store creation form: name "Test Store", slug auto-generated
9. Submit and wait for store creation (check queue processes)
10. Verify redirect to merchant dashboard

---

## PHASE 2.5: Multi-Store Management & Store Switching

**Create Second Store:**
11. Navigate to /merchant/settings
12. Locate the store switcher dropdown/component
13. Click "Add Store" button in the store switcher
14. Fill store creation form: name "Second Test Store", slug auto-generated "second-test-store"
15. Submit and wait for store creation (queue should process)
16. Verify success message or redirect

**Test Store Switching:**
17. Open store switcher again
18. Verify both stores appear in list: "Test Store" and "Second Test Store"
19. Click to switch to "Second Test Store"
20. Verify active store changed (check header/dashboard shows "Second Test Store")
21. Navigate to /merchant/products
22. Verify products list is empty (new store has no products yet)
23. Create 1 test product in "Second Test Store": Name "Product in Store 2"
24. Open store switcher again
25. Switch back to "Test Store" (first store)
26. Verify active store changed to "Test Store"
27. Navigate to /merchant/products
28. Verify products list shows products from Store 1 only (not "Product in Store 2")
29. Navigate to /merchant/categories, /merchant/brands
30. Verify all data is isolated per store
31. Switch to "Second Test Store" again
32. Verify "Product in Store 2" still exists
33. Switch back to "Test Store" for remaining tests

**Store Context Persistence:**
34. While on "Test Store", refresh the page
35. Verify still on "Test Store" (context persisted)
36. Navigate to different pages: /merchant/dashboard, /merchant/orders
37. Verify store context remains "Test Store" across navigation

---

## PHASE 3: Categories (Full CRUD)

38. Navigate to /merchant/categories
39. Create category 1: Name EN "Electronics", AR "إلكترونيات", status Active
40. Create category 2: Name EN "Fashion", AR "ملابس", parent: none
41. Create category 3: Name EN "Mobile Phones", AR "هواتف", parent: Electronics (subcategory)
42. Create 2 more categories: "Home & Garden", "Sports"
43. Edit "Electronics" category: change description, upload image if possible
44. Delete "Sports" category (with confirmation)
45. Verify all operations: check list shows 4 categories (5 created - 1 deleted)

---

## PHASE 4: Brands (Full CRUD)

46. Navigate to /merchant/brands
47. Create brand 1: Name EN "Apple", AR "أبل", website "https://apple.com"
48. Create brand 2: Name EN "Samsung", AR "سامسونج"
49. Create brand 3: Name EN "Nike", AR "نايكي"
50. Create brand 4: Name EN "Sony", AR "سوني"
51. Edit "Apple" brand: update description, upload logo if possible
52. Create dummy brand "Test Delete Brand"
53. Delete "Test Delete Brand"
54. Verify list shows 4 brands

---

## PHASE 5: Tags (Full CRUD)

55. Navigate to /merchant/tags
56. Create tag 1: Name EN "Premium", AR "فاخر"
57. Create tag 2: Name EN "Sale", AR "تخفيض"
58. Create tag 3: Name EN "New Arrival", AR "وصل حديثاً"
59. Edit "Premium" tag: change description
60. Delete one tag
61. Verify tags list

---

## PHASE 6: Products (Full CRUD + Variants)

62. Navigate to /merchant/products
63. **Create simple product 1:**
    - Name EN "iPhone 15 Pro", AR "آيفون 15 برو"
    - SKU "IPHONE-15-001"
    - Price 999.00
    - Stock 50
    - Category: Electronics > Mobile Phones
    - Brand: Apple
    - Description: "Latest iPhone"
    - Upload 2 images if possible
64. **Create simple product 2:**
    - Name "Samsung Galaxy S24"
    - Price 899.00
    - Stock 30
    - Category: Electronics > Mobile Phones
    - Brand: Samsung
65. **Create product with variants:**
    - Name "Classic T-Shirt"
    - Category: Fashion
    - Brand: Nike
    - Enable variants
    - Add option 1: Size (S, M, L, XL)
    - Add option 2: Color (Black, White, Blue)
    - Generate variants (should create 12)
    - Set price 29.99 for all variants
    - Set stock 20 for all variants
66. Create 2 more simple products in different categories
67. Edit "iPhone 15 Pro": change price to 949.00, stock to 75
68. Delete one product (create dummy first)
69. Verify products list shows all created products

---

## PHASE 7: Hero Banners

70. Navigate to /merchant/hero-banners
71. Create banner 1: Title "Summer Sale", link to products page
72. Create banner 2: Title "New Arrivals"
73. Edit banner 1: change title
74. Delete banner 2
75. Verify banners list

---

## PHASE 8: Theme Management

76. Navigate to /merchant/theme
77. View current active theme
78. Navigate to /merchant/theme/settings
79. Try to change theme colors (primary color, background)
80. Update theme typography if available
81. Upload logo if possible
82. Save theme settings
83. Navigate to /merchant/theme/navigation
84. View navigation menus
85. Edit main menu (if exists): add/reorder menu items
86. Save navigation changes
87. Navigate to /merchant/theme/assets
88. Upload an asset/image
89. Verify asset appears in list

---

## PHASE 9: CMS Marketing Pages (Complex)

90. Navigate to /merchant/cms/pages
91. **Create page 1: "About Us"**
    - Title EN "About Us", AR "من نحن"
    - Slug "about-us"
    - Status: Published
    - Add section 1: Hero (heading "Welcome to Our Store", description, background)
    - Add section 2: Text content (heading "Our Story", long text)
    - Add section 3: Image with text
    - Save page
92. **Create page 2: "Features"**
    - Add section 1: Hero with video/image
    - Add section 2: Features grid (4 features: Fast Shipping, Secure Payment, Support, Returns)
    - Add section 3: Image gallery (multiple images)
    - Add section 4: Testimonials (3 testimonials)
    - Add section 5: Call-to-action button
    - Add section 6: FAQ accordion (5 questions)
    - Save page
93. **Create page 3: "Contact Us"**
    - Add contact form section
    - Add map section if available
    - Add office hours text
94. Edit "About Us" page:
    - Reorder sections (move section 3 to position 2)
    - Edit Hero section: change heading
    - Delete one section
    - Save changes
95. Create page 4: "Privacy Policy" with long text content
96. Change "Privacy Policy" status from Published to Draft
97. Change back to Published
98. Delete a dummy page
99. Verify 4 pages exist in list

---

## PHASE 10: Orders (View)

100. Navigate to /merchant/orders
101. Verify orders page loads (may be empty)
102. If orders exist, click one to view details

---

## PHASE 11: Customers

103. Navigate to /merchant/customers
104. Verify customers list loads
105. If customers exist, view one customer detail

---

## PHASE 12: Stores Management

106. Navigate to /merchant/stores
107. Verify stores list shows both created stores
108. Click store settings for "Test Store"
109. Update store information: description, contact email, phone
110. Save store settings

---

## PHASE 13: Billing

111. Navigate to /merchant/billing
112. Verify billing dashboard loads
113. View current plan information
114. Navigate to /merchant/billing/invoices
115. Verify invoices list (may be empty)
116. Navigate to /merchant/billing/plans
117. View available plans (don't upgrade, just view)

---

## PHASE 14: Settings

118. Navigate to /merchant/settings
119. Update user profile: name, phone
120. Upload avatar if possible
121. Save profile settings

---

## PHASE 15: Dashboard & Navigation

122. Navigate to /merchant/dashboard
123. Verify dashboard stats display
124. Check recent orders widget
125. Check top products widget
126. Test all sidebar menu items (click each one)
127. Test all header navigation links
128. Verify no broken links

---

## PHASE 16: Language Switching

129. Find language switcher
130. Switch from English to Arabic
131. Verify UI translates to RTL
132. Navigate to products, categories, brands pages in Arabic
133. Switch back to English

---

## PHASE 17: Back Navigation

134. Navigate: Dashboard → Products → Edit Product
135. Click browser back button
136. Verify returns to products list (no loop)
137. Navigate: Dashboard → CMS → Edit Page → Edit Section
138. Click back multiple times
139. Verify navigation works correctly

---

## PHASE 18: Search & Filters

140. On products page, use search to find "iPhone"
141. Verify search results
142. Apply filter: Category = Electronics
143. Apply filter: Brand = Apple
144. Clear filters
145. Test sorting: by name, by price, by date
146. Verify pagination if enough products

---

## PHASE 19: Responsive Testing

147. Resize browser to mobile width (375px)
148. Navigate through: dashboard, products, categories, CMS
149. Verify mobile menu works
150. Verify forms usable on mobile
151. Resize to tablet (768px)
152. Verify layout adapts
153. Return to desktop size

---

## PHASE 20: Error Validation

154. Navigate to /merchant/products/new
155. Try to submit empty form
156. Verify validation errors display
157. Try to create product with duplicate SKU
158. Verify error message
159. Navigate to /merchant/categories/new
160. Try invalid form inputs
161. Verify validation

---

## PHASE 21: Console & Network

162. Open browser console
163. Navigate through entire app
164. Check for console errors (red messages)
165. Check Network tab for failed requests (500, 404)
166. Report any errors found

---

## PHASE 22: Logout & Re-login

167. Click logout
168. Verify redirect to login page
169. Verify cannot access /merchant/dashboard without auth
170. Login again with same credentials
171. Verify all created data still exists

---

## FINAL VERIFICATION

**Data Created:**
- ✅ Total stores created: 2
- ✅ Total categories created: 5, deleted: 1, remaining: 4
- ✅ Total brands created: 5, deleted: 1, remaining: 4
- ✅ Total tags created: 3, deleted: 1, remaining: 2
- ✅ Total products created: at least 5 (including variants product)
- ✅ Total hero banners created: 2, deleted: 1, remaining: 1
- ✅ Total CMS pages: 4
- ✅ Total sections per CMS page: at least 6 in "Features" page

**Functionality Verified:**
- ✅ Store switching working correctly
- ✅ Data isolation between stores verified
- ✅ Store context persistence across page refreshes
- ✅ No console errors
- ✅ All navigation working
- ✅ Back button working without loops
- ✅ Language switching functional
- ✅ Mobile responsive
- ✅ Form validations working
- ✅ Search, filters, sorting working
- ✅ CRUD operations successful on all entities
- ✅ Theme customization saved
- ✅ CMS sections: create, edit, delete, reorder working

---

## Instructions for Use

**Copy this entire prompt and give it to Cursor or Playwright MCP:**

```
Use Playwright MCP to automate this complete test flow covering ALL features:

[Paste all phases from above]

Take screenshots at key points and report any failures, errors, console warnings, or broken functionality found during this comprehensive test.
```

---

## Expected Test Duration

**Complete execution: 20-30 minutes** (automated)

If test completes faster, verify all steps were actually executed.

---

## Reporting

For each failure found, document:
1. Step number where failure occurred
2. Expected behavior
3. Actual behavior
4. Screenshot
5. Console errors
6. Network request failures
