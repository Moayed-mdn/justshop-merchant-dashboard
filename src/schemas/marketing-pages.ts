/**
 * Zod schemas for marketing page filters and forms.
 * 
 * IMPORTANT: These schemas match the EXACT backend structure:
 * - Backend Model: StoreMarketingPage (laratenant-backend/app/Models/Cms/Marketing/Store/StoreMarketingPage.php)
 * - Backend Resource: AdminStoreMarketingPageResource
 * - Backend Section Resource: StoreMarketingSectionResource
 * 
 * Backend returns:
 * - title, slug, excerpt, content: arrays (localized maps like { en: "text", ar: "نص" })
 * - seo: array with meta_title, meta_description (arrays), canonical_url, og_image, robots
 * - sections: array with section_type, identifier, title, subtitle, content, settings (all arrays)
 * - published_at: ISO 8601 string or null
 */

import { z } from 'zod';

// ── Filter schema ─────────────────────────────────────────────────────────

export const MarketingPageFiltersSchema = z.object({
  search:   z.string().default(''),
  status:   z.enum(['all', 'draft', 'published', 'scheduled']).default('all'),
  template: z.enum(['all', 'landing', 'campaign', 'promotion', 'generic']).default('all'),
  page:     z.coerce.number().min(1).default(1),
  perPage:  z.coerce.number().min(1).max(100).default(15),
});

export type MarketingPageFilters = z.infer<typeof MarketingPageFiltersSchema>;

// ── Localized string schema ───────────────────────────────────────────────
// Backend returns objects like { en: "text", ar: "نص" }
// BUT can also return { en: null, ar: null } for empty fields!

const LocalizedStringSchema = z.record(
  z.string(), 
  z.string().nullable()
).transform(val => {
  // Convert null values to empty strings
  if (!val) return { en: '', ar: '' };
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(val)) {
    result[key] = value || '';
  }
  return result;
});

// ── SEO schema ────────────────────────────────────────────────────────────
// Backend returns seo as array with specific structure. Fields can be null or empty.
// og_image can be string or array<string, string> (localized) per backend SeoMetaDTO

export const MarketingPageSeoSchema = z.object({
  meta_title:       LocalizedStringSchema,
  meta_description: LocalizedStringSchema,
  canonical_url:    z.string().nullable().transform(val => val || ''),
  robots:           z.string().nullable().transform(val => val || ''),
  og_image:         z.union([
    z.string(), 
    z.record(z.string(), z.string()),
    z.null()
  ]).transform(val => {
    // Transform to string for form consistency
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object') {
      const values = Object.values(val).filter(v => v);
      return values[0] || '';
    }
    return '';
  }),
});

// ── Section schema ────────────────────────────────────────────────────────
// Backend StoreMarketingSection model casts: title, subtitle, content, settings as arrays

export const MarketingPageSectionSchema = z.object({
  // Backend uses 'section_type', frontend uses 'type' (mapper handles this)
  type:       z.string().min(1, 'Section type is required'),
  identifier: z.string().min(1, 'Section identifier is required'),
  title:      LocalizedStringSchema,
  subtitle:   LocalizedStringSchema,
  // content and settings can be empty arrays [] from backend
  content:    z.union([
    z.record(z.string(), z.unknown()),
    z.array(z.unknown())
  ]).transform(val => {
    if (Array.isArray(val) && val.length === 0) return {};
    return val as Record<string, unknown>;
  }),
  settings:   z.union([
    z.record(z.string(), z.unknown()),
    z.array(z.unknown())
  ]).transform(val => {
    if (Array.isArray(val) && val.length === 0) return {};
    return val as Record<string, unknown>;
  }),
  is_active:  z.boolean().default(true),
});

export type MarketingPageSectionFormValues = z.infer<typeof MarketingPageSectionSchema>;

// ── Create / Update form schema ───────────────────────────────────────────
// Matches AdminStoreMarketingPageResource output shape

export const MarketingPageFormSchema = z
  .object({
    title:           LocalizedStringSchema,
    slug:            LocalizedStringSchema,
    excerpt:         LocalizedStringSchema,
    template:        z.enum(['landing', 'campaign', 'promotion', 'generic']),
    page_template_id: z.number().nullable().default(null),
    status:          z.enum(['draft', 'published', 'scheduled']),
    // Backend returns ISO 8601 string or null, form uses empty string for datetime-local input
    published_at: z.string().default(''),
    sort_order:   z.coerce.number().min(0).default(0),
    is_homepage:  z.boolean().default(false),
    seo:          MarketingPageSeoSchema,
    sections:     z.array(MarketingPageSectionSchema).default([]),
  })
  .superRefine((data, ctx) => {
    // published_at is required when status is 'scheduled'
    if (data.status === 'scheduled' && (!data.published_at || data.published_at.trim() === '')) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        message: 'Publish date is required when status is Scheduled',
        path:    ['published_at'],
      });
    }

    // title must have at least one non-empty locale
    const hasTitle = Object.values(data.title).some((v) => v && v.trim().length > 0);
    if (!hasTitle) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        message: 'Title is required in at least one language',
        path:    ['title'],
      });
    }

    // slug must have at least one non-empty locale
    const hasSlug = Object.values(data.slug).some((v) => v && v.trim().length > 0);
    if (!hasSlug) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        message: 'Slug is required in at least one language',
        path:    ['slug'],
      });
    }

    // section identifiers must be unique within the form
    const identifiers = data.sections.map((s) => s.identifier);
    const seen = new Set<string>();
    identifiers.forEach((id, index) => {
      if (seen.has(id)) {
        ctx.addIssue({
          code:    z.ZodIssueCode.custom,
          message: 'Section identifiers must be unique',
          path:    ['sections', index, 'identifier'],
        });
      }
      seen.add(id);
    });
  });

export type MarketingPageFormValues = z.output<typeof MarketingPageFormSchema>;
export type MarketingPageFormInput  = z.input<typeof MarketingPageFormSchema>;
