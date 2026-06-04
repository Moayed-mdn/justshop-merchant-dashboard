# User Stories

## [Epic] Onboarding & Setup
### US-1: Verified Registration
- **As a** prospective merchant
- **I want to** sign up and verify my email
- **So that** I can begin setting up my commerce operations
- **Acceptance Criteria:**
  - [ ] Receive a verification email after signing up.
  - [ ] Redirected to store creation once verified.
- **Related Requirements:** REQ-ONBOARD-1

### US-2: First Store Provisioning
- **As a** new merchant
- **I want to** name my store and wait for setup
- **So that** my dedicated commerce infrastructure is ready
- **Acceptance Criteria:**
  - [ ] Name and slug are validated during creation.
  - [ ] Real-time progress bar shows provisioning status.
- **Related Requirements:** REQ-ONBOARD-2, REQ-ONBOARD-3

## [Epic] Product Management
### US-3: Guided Product Creation
- **As a** merchant
- **I want to** follow a step-by-step process to add a product
- **So that** I don't miss important details like variants or images
- **Acceptance Criteria:**
  - [ ] Progress through Content, Structure, Media, and Review steps.
  - [ ] Automatic variant generation from options like Size and Color.
- **Related Requirements:** REQ-PROD-1, REQ-PROD-3

### US-4: Multi-Lingual Catalog
- **As a** global merchant
- **I want to** translate my product names and descriptions
- **So that** I can sell to customers in both English and Arabic
- **Acceptance Criteria:**
  - [ ] Toggle between English and Arabic content tabs in the editor.
  - [ ] Validate required fields for the primary locale.
- **Related Requirements:** REQ-PROD-5, REQ-I18N-1

## [Epic] Order Fulfillment
### US-5: Order Status Tracking
- **As a** store operator
- **I want to** update the status of customer orders
- **So that** customers know when their items have shipped
- **Acceptance Criteria:**
  - [ ] Change status from Processing to Shipped.
  - [ ] View full customer and item details in the order view.
- **Related Requirements:** REQ-ORDER-1

## [Epic] Multi-Store Operations
### US-6: Seamless Store Switching
- **As a** serial entrepreneur
- **I want to** switch between my multiple stores from the topbar
- **So that** I can manage all my businesses without logging in and out
- **Acceptance Criteria:**
  - [ ] See a list of all active stores in the switcher.
  - [ ] Permissions and data refresh immediately after switching.
- **Related Requirements:** REQ-MS-1, REQ-PERM-1

## [Epic] Content Management
### US-7: Custom Marketing Pages
- **As a** marketing manager
- **I want to** build landing pages using pre-defined sections
- **So that** I can launch campaigns without developer assistance
- **Acceptance Criteria:**
  - [ ] Add Hero, Features, and FAQ blocks to a page.
  - [ ] Configure SEO metadata for each page.
- **Related Requirements:** REQ-CMS-1
