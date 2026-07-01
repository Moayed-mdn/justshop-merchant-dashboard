'use client';

/**
 * Shared form for creating and editing marketing pages.
 * Multi-tab layout: General | Content Builder | SEO
 */

import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { MarketingPageFormSchema, type MarketingPageFormValues, type MarketingPageFormInput } from '@/schemas/marketing-pages';
import type { MarketingPageDetailView, MarketingPageTemplate, MarketingPageStatus } from '@/types/marketing-page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LocalizedInput } from './components/LocalizedInput';
import { SectionsBuilder } from './components/SectionsBuilder';
import { SeoTab } from './components/SeoTab';
import { DeleteMarketingPageDialog } from './components/DeleteMarketingPageDialog';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { usePageTemplates } from '@/hooks/page-templates/usePageTemplates';
import { ROUTES } from '@/config/routes';

// ── Default values ────────────────────────────────────────────────────────

/**
 * Convert ISO 8601 datetime string to datetime-local format.
 * datetime-local input expects: YYYY-MM-DDTHH:mm
 * Backend returns: YYYY-MM-DDTHH:mm:ss.ffffffZ
 */
function toDatetimeLocalValue(isoString: string | null | undefined): string {
  if (!isoString) return '';
  
  try {
    // Parse the ISO string and convert to local timezone
    const date = new Date(isoString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    // Format as YYYY-MM-DDTHH:mm (local timezone)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return '';
  }
}

function buildDefaultValues(page?: MarketingPageDetailView): MarketingPageFormValues {
  if (page) {
    return {
      title:           page.title,
      slug:            page.slug,
      excerpt:         page.excerpt,
      template:        page.template,
      page_template_id: page.pageTemplateId,
      status:          page.status,
      published_at:    toDatetimeLocalValue(page.publishedAt),
      sort_order:      page.sortOrder,
      is_homepage:     page.isHomepage ?? false,
      seo:             page.seo,
      sections:        page.sections,
    };
  }

    const randomId = Math.floor(Math.random() * 9000 + 1000);
    const slug     = `page-${randomId}`;

    return {
      title:           { en: `Page ${randomId}`, ar: `صفحة ${randomId}` },
      slug:            { en: slug, ar: slug },
      excerpt:         { en: 'Short page description.', ar: 'وصف قصير للصفحة.' },
      template:        'generic',
      page_template_id: null,
      status:          'draft',
      published_at:    '',
      sort_order:      0,
      is_homepage:     false,
      seo: {
        meta_title:       { en: `Meta ${randomId}`, ar: `عنوان ميتا ${randomId}` },
        meta_description: { en: `SEO description for ${randomId}`, ar: `وصف سيو ${randomId}` },
        canonical_url:    `https://example.com/${slug}`,
        robots:           'index, follow',
        og_image:         `https://placehold.co/1200x630/4F46E5/FFFFFF?text=${slug}`,
      },
    sections: [
      {
        type:       'hero',
        identifier: `hero-${randomId}`,
        title:      { en: `Welcome to ${randomId}`, ar: `أهلاً بك في ${randomId}` },
        subtitle:   { en: 'Valid random subtitle', ar: 'عنوان فرعي عشوائي' },
        content:    {
          items: [
            {
              headline: { en: `Welcome to ${randomId}`, ar: `أهلاً بك في ${randomId}` },
              subheadline: { en: 'Discover our amazing products', ar: 'اكتشف منتجاتنا الرائعة' },
              eyebrow: { en: 'New', ar: 'جديد' },
              ctaText: { en: 'Explore', ar: 'استكشف' },
              ctaUrl: '/',
              visualType: 'gradient',
              imageUrl: null,
              gradientFrom: '#4F46E5',
              gradientTo: '#7C3AED',
            },
          ],
          eyebrow: { en: 'New', ar: 'جديد' },
          headline: { en: `Welcome to ${randomId}`, ar: `أهلاً بك في ${randomId}` },
          subheadline: { en: 'Discover our amazing products', ar: 'اكتشف منتجاتنا الرائعة' },
        },
        settings:  {},
        is_active: true,
      },
    ],
  };
}

// ── Props ─────────────────────────────────────────────────────────────────

interface Props {
  storeSlug:    string;
  page?:      MarketingPageDetailView;
  onSubmit:   (values: MarketingPageFormValues) => Promise<void>;
  isLoading?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────

/**
 * Helper to normalize localized values by ensuring no null values
 */
function normalizeLocalizedValue(value: Record<string, string | null> | null | undefined): Record<string, string> {
  if (!value) return { en: '', ar: '' };
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [key, val ?? ''])
  ) as Record<string, string>;
}

export default function MarketingPageForm({ storeSlug, page, onSubmit, isLoading }: Props) {
  const t       = useTranslations('cmsPages');
  const isEdit  = Boolean(page);
  const router  = useRouter();

  const form = useForm<MarketingPageFormInput, unknown, MarketingPageFormValues>({
    resolver:      zodResolver(MarketingPageFormSchema),
    defaultValues: buildDefaultValues(page),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = form;

  const { bypassNextNavigation } = useUnsavedChangesGuard({ isDirty });

  const { data: pageTemplates = [] } = usePageTemplates(storeSlug);

  // Sync form state with page data when it loads
  useEffect(() => {
    if (page) {
      reset(buildDefaultValues(page));
    }
  }, [page, reset]);

  const status      = watch('status');
  const isScheduled = status === 'scheduled';

  const handleFormSubmit = async (values: MarketingPageFormValues) => {
    bypassNextNavigation();
    // Call the onSubmit handler. Errors are handled by the mutation's onError callback,
    // so we don't need a try-catch here. The mutation manages its own error state.
    await onSubmit(values);
  };

  const onInvalid = (errors: any) => {
    console.warn('Form validation errors:', errors);
    toast.error(t('form.errors.validationFailed'));
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                bypassNextNavigation();
                router.push(ROUTES.merchant.cmsPages());
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEdit ? t('form.editTitle') : t('form.createTitle')}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isEdit ? t('form.editSubtitle') : t('form.createSubtitle')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEdit && page && (
              <DeleteMarketingPageDialog
                storeSlug={storeSlug}
                pageId={String(page.id)}
                pageTitle={page.title.en ?? `Page #${page.id}`}
              />
            )}
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading
                ? t('form.saving')
                : isEdit
                  ? t('form.save')
                  : t('form.create')}
            </Button>
          </div>
        </div>

        {/* Main tabs */}
        <Tabs defaultValue="general">
          <TabsList className="bg-muted-foreground/15">
            <TabsTrigger value="general">{t('form.tabs.general')}</TabsTrigger>
            <TabsTrigger value="content">{t('form.tabs.content')}</TabsTrigger>
            <TabsTrigger value="seo">{t('form.tabs.seo')}</TabsTrigger>
          </TabsList>

          {/* ── TAB 1: General ── */}
          <TabsContent value="general" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left — localized fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('form.fields.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LocalizedInput
                      value={normalizeLocalizedValue(watch('title'))}
                      onChange={(v) => setValue('title', v, { shouldDirty: true })}
                      placeholder={{ en: 'Page title', ar: 'عنوان الصفحة' }}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive mt-2">
                        {typeof errors.title === 'object' && 'message' in errors.title
                          ? (errors.title as { message?: string }).message
                          : t('form.errors.titleRequired')}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Slug */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('form.fields.slug')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LocalizedInput
                      value={normalizeLocalizedValue(watch('slug'))}
                      onChange={(v) => setValue('slug', v, { shouldDirty: true })}
                      placeholder={{ en: 'page-url-slug', ar: 'معرف-الصفحة' }}
                    />
                    {errors.slug && (
                      <p className="text-sm text-destructive mt-2">
                        {typeof errors.slug === 'object' && 'message' in errors.slug
                          ? (errors.slug as { message?: string }).message
                          : t('form.errors.slugRequired')}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Excerpt */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('form.fields.excerpt')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LocalizedInput
                      value={normalizeLocalizedValue(watch('excerpt'))}
                      onChange={(v) => setValue('excerpt', v, { shouldDirty: true })}
                      placeholder={{ en: 'Short description', ar: 'وصف مختصر' }}
                      multiline
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right — settings */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('form.settings')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Template */}
                    <div className="space-y-2">
                      <Label htmlFor="template">{t('form.fields.template')}</Label>
                      <Select
                        value={watch('template') ?? ''}
                        onValueChange={(v) => {
                          if (v) setValue('template', v as MarketingPageTemplate, { shouldDirty: true });
                        }}
                      >
                        <SelectTrigger id="template">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(['landing', 'campaign', 'promotion', 'generic'] as const).map((tpl) => (
                            <SelectItem key={tpl} value={tpl}>
                              {t(`templates.${tpl}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.template && (
                        <p className="text-sm text-destructive">{errors.template.message}</p>
                      )}
                    </div>

                    {/* Page Template (Shopify-style template) */}
                    <div className="space-y-2">
                      <Label htmlFor="page_template_id">{t('form.fields.pageTemplate')}</Label>
                      <Select
                        value={String(watch('page_template_id') ?? '')}
                        onValueChange={(v) => {
                          setValue('page_template_id', v ? Number(v) : null, { shouldDirty: true });
                        }}
                      >
                        <SelectTrigger id="page_template_id">
                          {(() => {
                            const id = watch('page_template_id');
                            if (!id) return <span className="text-muted-foreground">{t('form.fields.pageTemplateNone')}</span>;
                            const pt = pageTemplates.find((t) => t.id === id);
                            return <span>{pt?.name ?? String(id)}</span>;
                          })()}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">{t('form.fields.pageTemplateNone')}</SelectItem>
                          {pageTemplates.map((pt) => (
                            <SelectItem key={pt.id} value={String(pt.id)}>
                              {pt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label htmlFor="status">{t('form.fields.status')}</Label>
                      <Select
                        value={watch('status') ?? ''}
                        onValueChange={(v) => {
                          if (v) setValue('status', v as MarketingPageStatus, { shouldDirty: true });
                        }}
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(['draft', 'published', 'scheduled'] as const).map((s) => (
                            <SelectItem key={s} value={s}>
                              {t(`status.${s}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.status && (
                        <p className="text-sm text-destructive">{errors.status.message}</p>
                      )}
                    </div>

                    {/* Published at — only shown when scheduled */}
                    {isScheduled && (
                      <div className="space-y-2">
                        <Label htmlFor="published_at">{t('form.fields.publishedAt')}</Label>
                        <Input
                          id="published_at"
                          type="datetime-local"
                          {...register('published_at')}
                        />
                        {errors.published_at && (
                          <p className="text-sm text-destructive">
                            {errors.published_at.message}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Sort order */}
                    <div className="space-y-2">
                      <Label htmlFor="sort_order">{t('form.fields.sortOrder')}</Label>
                      <Input
                        id="sort_order"
                        type="number"
                        min={0}
                        {...register('sort_order', { valueAsNumber: true })}
                      />
                      {errors.sort_order && (
                        <p className="text-sm text-destructive">{errors.sort_order.message}</p>
                      )}
                    </div>

                    {/* Is Homepage */}
                    <div className="flex items-center justify-between rounded border p-3 bg-background">
                      <div className="space-y-0.5">
                        <Label htmlFor="is_homepage">{t('form.fields.isHomepage')}</Label>
                        <p className="text-xs text-muted-foreground">
                          {t('form.fields.isHomepageHelp')}
                        </p>
                      </div>
                      <Switch
                        id="is_homepage"
                        checked={watch('is_homepage') ?? false}
                        onCheckedChange={(v) =>
                          setValue('is_homepage', v, { shouldDirty: true })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── TAB 2: Content Builder ── */}
          <TabsContent value="content" className="mt-6">
            <SectionsBuilder storeSlug={storeSlug} />
          </TabsContent>

          {/* ── TAB 3: SEO ── */}
          <TabsContent value="seo" className="mt-6">
            <SeoTab />
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
}
