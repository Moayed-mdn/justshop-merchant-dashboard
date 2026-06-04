# Functional Requirements — LaraTenant Commerce

## System Overview
LaraTenant Commerce is a multi-tenant, production-grade commerce platform designed to host multiple independent stores (tenants) under a single management infrastructure. The system provides a centralized merchant workspace for operational management and a localized storefront for customer transactions.

## User Roles & Personas
- **Super Admin**: Global platform manager with access to all stores and system-wide settings.
- **Store Admin**: Primary merchant user with full control over a specific store’s products, orders, and users.
- **Staff**: Operational user with restricted dashboard access, typically limited to viewing data or specific order processing.
- **Customer/Guest**: End-user interacting with the storefront to browse products and place orders.

## Authentication & Onboarding
- **Identity Gating**: All merchant routes must be protected by session-based authentication.
- **Onboarding State Machine**:
  - **Signup**: Users must be able to register with name, email, and password.
  - **Email Verification**: Users must verify their email before accessing store creation.
  - **Store Creation**: Verified users must define their first store (Name, Slug).
  - **Provisioning**: The system must provide a visual wait state with a progress checklist while the backend prepares the tenant infrastructure.
- **Session Recovery**: Users must be redirected to their last state (onboarding or dashboard) upon re-login or page refresh.

## Dashboard Requirements
- **Overview Metrics**: Display key performance indicators: Total Revenue, Order Count, Customer Count, and Average Order Value.
- **Activity Monitoring**: Show lists of Recent Orders and Top Selling Products.
- **Context Awareness**: All dashboard data must be strictly scoped to the currently active store.

## Product Management
- **Creation Wizard**: A 4-step process for entering product data:
  1. **Content**: Localized names, slugs, and descriptions.
  2. **Structure**: Definition of options (e.g., Size, Color) and automatic generation of variants.
  3. **Media**: Management of product-level images.
  4. **Review**: Final validation before persistence.
- **Variant Management**: Each variant must support its own SKU, price, stock quantity, and weight.
- **Status Control**: Products must support `active` (visible) and `draft` (hidden) statuses.

## Order Management
- **Workflow Tracking**: Support for multiple statuses: `pending`, `processing`, `shipped`, `delivered`, `cancelled`, and `refunded`.
- **Payment Lifecycle**: Track payment states: `pending`, `paid`, `failed`, `refunded`.
- **Fulfillment**: Support for `unfulfilled`, `partial`, and `fulfilled` states.
- **Details**: View full order composition, customer info, and line item breakdowns.

## Taxonomy: Categories, Brands, & Tags
- **Categories**:
  - Support for parent/child hierarchical relationships.
  - Multi-locale name and slug management.
- **Brands**:
  - Independent entity for product categorization.
  - Support for logos and descriptions.
- **Tags**:
  - Flexible labeling for products and orders.
  - Color-coded badges for UI consistency.

## CMS & Marketing Pages
- **Marketing Pages**: Create landing pages with custom slugs and templates.
- **Section Builder**: Compose pages using modular blocks (Hero, Features, Pricing, FAQ, etc.).
- **SEO Management**: Granular control over meta titles, descriptions, canonical URLs, and robots directives.
- **Publishing**: Support for `draft` and `published` states.

## User & Permission Management
- **Invitations**: Store Admins must be able to create/invite other users to their store.
- **Role Control**: Assign roles (Store Admin, Staff) to manage functional access.
- **Permission Boundaries**: Enforce functional restrictions (e.g., Staff cannot manage users or change store settings).

## Multi-Store Requirements
- **Store Switcher**: Seamlessly transition between multiple stores without re-authentication.
- **Context Isolation**: Ensure that switching stores refreshes all permissions and data context immediately.
- **Provisioning Flow**: Support for creating additional stores after the initial onboarding.

## Internationalization (i18n)
- **Language Support**: Native support for English (`en`) and Arabic (`ar`).
- **Layout Direction**: Automatic switching between LTR (English) and RTL (Arabic) layouts.
- **Data Localization**: Support for localized content fields (Name, Slug, Description) for all core entities.
