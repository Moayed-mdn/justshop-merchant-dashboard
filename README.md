# JustShop Merchant Dashboard

A bilingual merchant administration dashboard for the **JustShop multi-tenant commerce platform**.

The application gives merchants and authorized store staff a workspace for managing stores, catalogs, product variants, media, orders and storefront content.

## Related Repositories

- [Platform Overview](https://github.com/Moayed-mdn/justshop-multitenant-commerce-platform)
- [Backend API](https://github.com/Moayed-mdn/justshop-api)
- [Storefront](https://github.com/Moayed-mdn/justshop-storefront)
- [Platform Dashboard](https://github.com/Moayed-mdn/justshop-platform-dashboard)

## Main Features

- Merchant authentication and protected workspace
- Active-store selection
- Product listing and editing
- Dynamic product variants
- Variant-level media management
- Product image uploads
- Category, brand and tag management
- Soft delete and restore workflows
- Hero-banner management
- Merchant CMS pages
- Laravel validation feedback
- English and Arabic localization
- RTL layouts
- Responsive dashboard UI
- Dark and light themes

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod
- Zustand
- shadcn/ui and Radix UI
- next-intl
- Laravel Sanctum integration

## Application Boundary

```text
Merchant
   ↓
Next.js Dashboard
   ↓
Typed API Layer / Route Handlers
   ↓
Laravel API
   ↓
Tenant-Aware Services and Database
```

The backend remains responsible for authentication, store membership, tenant isolation, validation, authorization and persistence.

## Engineering Highlights

### Product and Variant Editing

The product editor supports variant combinations based on product options and preserves existing variant information and media when structures change safely.

### Unified Media Uploads

Reusable upload components support drag and drop, previews, file validation, product images, variant images, brand logos, hero banners and clear backend errors.

### Localized Merchant Experience

The dashboard supports English and Arabic routes with RTL-aware components and layouts.

### Centralized API Integration

Backend requests are centralized to handle session cookies, CSRF tokens, response normalization, validation errors, redirects and media responses consistently.

## Local Setup

### Prerequisites

- Node.js
- npm
- Running JustShop API
- Correct Laravel Sanctum and CORS configuration

### Installation

```bash
git clone https://github.com/Moayed-mdn/justshop-merchant-dashboard.git
cd justshop-merchant-dashboard
npm install
cp .env.example .env.local
npm run dev
```

The current package scripts use port `3001`.

Open:

```text
http://localhost:3001
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Use `package.json` as the source of truth for available scripts.

## Authentication Checklist

- The Laravel API is running.
- The frontend origin is trusted by Sanctum.
- CORS allows credentials.
- The browser requests a CSRF cookie before login.
- Credentialed requests forward cookies correctly.
- Session-domain settings match the local hostnames.

## Repository Structure

```text
app/ or src/app/       Next.js routes and layouts
components/            Reusable UI and feature components
lib/api/               API client and endpoint modules
lib/types/             TypeScript domain types
lib/stores/            Client-side state
messages/ or locales/  English and Arabic translations
public/                Static assets
docs/                  Project documentation
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Screenshots to Add

Create `docs/screenshots/` and add:

1. Dashboard home
2. Products table
3. Product editor
4. Variant and media dialog
5. Orders page
6. Hero-banner or CMS management
7. Arabic RTL interface

## Security

Frontend route protection does not replace backend authorization.

Never commit `.env.local`, cookies, CSRF tokens, request dumps, debug traces or real customer data.

## Status

Active portfolio project.

Docker and GitHub Actions are planned for the next infrastructure phase.
