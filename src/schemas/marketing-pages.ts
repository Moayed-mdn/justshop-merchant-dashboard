/**
 * Zod schemas for marketing page filters and forms.
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

const LocalizedStringSchema = z.record(z.string(), z.string());

// ── SEO schema ────────────────────────────────────────────────────────────

export const MarketingPageSeoSchema = z.object({
  meta_title:       LocalizedStringSchema.default({ en: '', ar: '' }),
  meta_description: LocalizedStringSchema.default({ en: '', ar: '' }),
  canonical_url:    z.string().default(''),
  robots:           z.string().default(''),
  og_image:         z.string().default(''),
});

// ── Section schema ────────────────────────────────────────────────────────

export const MarketingPageSectionSchema = z.object({
  type:       z.string().min(1, 'Section type is required'),
  identifier: z.string().min(1, 'Section identifier is required'),
  title:      LocalizedStringSchema.default({ en: '', ar: '' }),
  subtitle:   LocalizedStringSchema.default({ en: '', ar: '' }),
  content:    z.record(z.string(), z.unknown()).default({}),
  settings:   z.record(z.string(), z.unknown()).default({}),
  is_active:  z.boolean().default(true),
});

export type MarketingPageSectionFormValues = z.infer<typeof MarketingPageSectionSchema>;

// ── Create / Update form schema ───────────────────────────────────────────

export const MarketingPageFormSchema = z
  .object({
    title:        LocalizedStringSchema,
    slug:         LocalizedStringSchema,
    excerpt:      LocalizedStringSchema.default({ en: '', ar: '' }),
    template:     z.enum(['landing', 'campaign', 'promotion', 'generic']),
    status:       z.enum(['draft', 'published', 'scheduled']),
    published_at: z.string().nullable().default(null),
    sort_order:   z.coerce.number().min(0).default(0),
    seo:          MarketingPageSeoSchema,
    sections:     z.array(MarketingPageSectionSchema).default([]),
  })
  .superRefine((data, ctx) => {
    // published_at is required when status is 'scheduled'
    if (data.status === 'scheduled' && !data.published_at) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        message: 'Publish date is required when status is Scheduled',
        path:    ['published_at'],
      });
    }

    // title must have at least one non-empty locale
    const hasTitle = Object.values(data.title).some((v) => v.trim().length > 0);
    if (!hasTitle) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        message: 'Title is required in at least one language',
        path:    ['title'],
      });
    }

    // slug must have at least one non-empty locale
    const hasSlug = Object.values(data.slug).some((v) => v.trim().length > 0);
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
