'use client';

/**
 * SEO tab for the marketing page form.
 * Handles localized meta_title, meta_description, canonical_url, robots, og_image.
 */

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocalizedInput } from './LocalizedInput';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

export function SeoTab() {
  const t = useTranslations('cmsPages');
  const { register, watch, setValue, formState: { errors } } =
    useFormContext<MarketingPageFormValues>();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('form.seo.metaTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <LocalizedInput
            value={watch('seo.meta_title') ?? { en: '', ar: '' }}
            onChange={(v) => setValue('seo.meta_title', v, { shouldDirty: true })}
            placeholder={{ en: 'Page title for search engines', ar: 'عنوان الصفحة لمحركات البحث' }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('form.seo.metaDescription')}</CardTitle>
        </CardHeader>
        <CardContent>
          <LocalizedInput
            value={watch('seo.meta_description') ?? { en: '', ar: '' }}
            onChange={(v) => setValue('seo.meta_description', v, { shouldDirty: true })}
            placeholder={{ en: 'Brief description for search results', ar: 'وصف مختصر لنتائج البحث' }}
            multiline
            rows={3}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('form.seo.technical')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Canonical URL */}
          <div className="space-y-2">
            <Label htmlFor="seo-canonical">{t('form.seo.canonicalUrl')}</Label>
            <Input
              id="seo-canonical"
              {...register('seo.canonical_url')}
              placeholder="https://example.com/page"
              type="url"
            />
            {errors.seo?.canonical_url && (
              <p className="text-sm text-destructive">
                {errors.seo.canonical_url.message}
              </p>
            )}
          </div>

          {/* Robots */}
          <div className="space-y-2">
            <Label htmlFor="seo-robots">{t('form.seo.robots')}</Label>
            <Input
              id="seo-robots"
              {...register('seo.robots')}
              placeholder="index, follow"
            />
          </div>

          {/* OG Image */}
          <div className="space-y-2">
            <Label htmlFor="seo-og-image">{t('form.seo.ogImage')}</Label>
            <Input
              id="seo-og-image"
              {...register('seo.og_image')}
              placeholder="https://example.com/og-image.jpg"
              type="url"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
