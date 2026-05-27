'use client';

/**
 * Shared form for creating and editing marketing pages.
 * Multi-tab layout: General | Content Builder | SEO
 */

import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
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

function buildDefaultValues(page?: MarketingPageDetailView): MarketingPageFormValues {
  if (page) {
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

  // Generate short random values for new pages
  const randomId = Math.floor(Math.random() * 9000 + 1000);
  const slug     = `page-${randomId}`;

  return {
    title:        { en: `Page ${randomId}`, ar: `صفحة ${randomId}` },
    slug:         { en: slug, ar: slug },
    excerpt:      { en: 'Short page description.', ar: 'وصف قصير للصفحة.' },
    template:     'generic',
    status:       'draft',
    published_at: null,
    sort_order:   0,
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
          cta_label: 'Explore',
          cta_url:   '/',
        },
        settings:  { full_width: true },
        is_active: true,
      },
    ],
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
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = form;

  // Sync form state with page data when it loads
  useEffect(() => {
    if (page) {
      reset(buildDefaultValues(page));
    }
  }, [page, reset]);

  const status      = watch('status');
  const isScheduled = status === 'scheduled';

  const handleFormSubmit = async (values: MarketingPageFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      // Mutation errors are usually handled by useMutation onError,
      // but we catch here to ensure isSubmitting is reset correctly.
    }
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
