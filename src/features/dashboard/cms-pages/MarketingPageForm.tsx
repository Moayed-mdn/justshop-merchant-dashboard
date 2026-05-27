'use client';

/**
 * Shared form for creating and editing marketing pages.
 * Multi-tab layout: General | Content Builder | SEO
 */

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { MarketingPageFormSchema, type MarketingPageFormValues, type MarketingPageFormInput } from '@/schemas/marketing-pages';
import type { MarketingPageDetailView, MarketingPageTemplate, MarketingPageStatus } from '@/types/marketing-page';import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

// ── Default values ────────────────────────────────────────────────────────

const DEFAULT_VALUES: MarketingPageFormValues = {
  title:        { en: 'Summer Sale 2026', ar: 'تخفيضات الصيف 2026' },
  slug:         { en: 'summer-sale-2026', ar: 'تخفيضات-الصيف-2026' },
  excerpt:      {
    en: 'Discover our biggest summer deals — up to 50% off on selected items.',
    ar: 'اكتشف أكبر عروض الصيف — خصم يصل إلى 50% على منتجات مختارة.',
  },
  template:     'campaign',
  status:       'draft',
  published_at: null,
  sort_order:   1,
  seo: {
    meta_title:       {
      en: 'Summer Sale 2026 | Best Deals & Discounts',
      ar: 'تخفيضات الصيف 2026 | أفضل العروض والخصومات',
    },
    meta_description: {
      en: 'Shop the Summer Sale 2026 and save up to 50% on top products. Limited time offers available now.',
      ar: 'تسوق في تخفيضات الصيف 2026 ووفر حتى 50% على أفضل المنتجات. عروض محدودة متاحة الآن.',
    },
    canonical_url: 'https://example.com/summer-sale-2026',
    robots:        'index, follow',
    og_image:      'https://placehold.co/1200x630/FF6B35/FFFFFF?text=Summer+Sale+2026',
  },
  sections: [
    {
      type:       'hero',
      identifier: 'hero-main',
      title:      { en: 'Summer Sale 2026', ar: 'تخفيضات الصيف 2026' },
      subtitle:   { en: 'Up to 50% off — limited time only', ar: 'خصم يصل إلى 50% — لفترة محدودة فقط' },
      content:    {
        cta_label: 'Shop Now',
        cta_url:   '/products',
        image_url: 'https://placehold.co/1440x600/FF6B35/FFFFFF?text=Hero+Banner',
      },
      settings:  { full_width: true, overlay_opacity: 0.4 },
      is_active: true,
    },
    {
      type:       'features',
      identifier: 'features-highlights',
      title:      { en: 'Why Shop With Us', ar: 'لماذا تتسوق معنا' },
      subtitle:   { en: 'Fast shipping, easy returns, and great prices', ar: 'شحن سريع، إرجاع سهل، وأسعار رائعة' },
      content:    {
        items: [
          { icon: 'truck',  label: 'Free Shipping',   description: 'On orders over $50' },
          { icon: 'shield', label: 'Secure Payment',  description: '100% protected checkout' },
          { icon: 'refresh', label: 'Easy Returns',   description: '30-day return policy' },
        ],
      },
      settings:  { columns: 3 },
      is_active: true,
    },
  ],
};

function buildDefaultValues(page?: MarketingPageDetailView): MarketingPageFormValues {
  if (!page) return DEFAULT_VALUES;
  return {
    title:        page.title,
    slug:         page.slug,
    excerpt:      page.excerpt,
    template:     page.template,
    status:       page.status,
    published_at: page.publishedAt,
    sort_order:   page.sortOrder,
    seo:          page.seo,
    sections:     page.sections,
  };
}

// ── Props ─────────────────────────────────────────────────────────────────

interface Props {
  storeId:    string;
  page?:      MarketingPageDetailView;
  onSubmit:   (values: MarketingPageFormValues) => Promise<void>;
  isLoading?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function MarketingPageForm({ storeId, page, onSubmit, isLoading }: Props) {
  const t       = useTranslations('cmsPages');
  const isEdit  = Boolean(page);

  const form = useForm<MarketingPageFormInput, unknown, MarketingPageFormValues>({
    resolver:      zodResolver(MarketingPageFormSchema),
    defaultValues: buildDefaultValues(page),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = form;

  const status      = watch('status');
  const isScheduled = status === 'scheduled';

  const handleFormSubmit = async (values: MarketingPageFormValues) => {
    await onSubmit(values);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {isEdit ? t('form.editTitle') : t('form.createTitle')}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isEdit ? t('form.editSubtitle') : t('form.createSubtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isEdit && page && (
              <DeleteMarketingPageDialog
                storeId={storeId}
                pageId={String(page.id)}
                pageTitle={page.title.en ?? `Page #${page.id}`}
              />
            )}
            <Button
              type="submit"
              disabled={isSubmitting || isLoading || (isEdit && !isDirty)}
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
          <TabsList>
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
                      value={watch('title') ?? { en: '', ar: '' }}
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
                      value={watch('slug') ?? { en: '', ar: '' }}
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
                      value={watch('excerpt') ?? { en: '', ar: '' }}
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
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── TAB 2: Content Builder ── */}
          <TabsContent value="content" className="mt-6">
            <SectionsBuilder />
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
