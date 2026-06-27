'use client';

/**
 * Hero section content editor (v1: single item).
 * Reads: content.items[0] { headline, subheadline, eyebrow, ctaText, ctaUrl, visualType, imageUrl, gradientFrom, gradientTo }
 *        + top-level fallbacks: content.eyebrow, content.headline, content.subheadline
 */

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocalizedTextField } from '../LocalizedTextField';
import { ImageUrlOrUpload } from '@/components/media/ImageUrlOrUpload';
import { ColorSchemeSelector } from './ColorSchemeSelector';
import { ColorPicker } from '@/features/theme/settings/ColorPicker';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface HeroSectionContentProps {
  index: number;
  storeId: string;
}

export function HeroSectionContent({ index, storeId }: HeroSectionContentProps) {
  const t = useTranslations('cmsPages');
  const { watch, setValue, register } = useFormContext<MarketingPageFormValues>();

  const basePath = `sections.${index}.content`;
  const items = (watch(`${basePath}.items` as any) ?? []) as any[];
  const item = items[0] ?? {};
  const visualType = item.visualType ?? 'gradient';

  // Ensure items[0] exists on mount
  useEffect(() => {
    if (items.length === 0) {
      setValue(`${basePath}.items` as any, [
        {
          headline: { en: '', ar: '' },
          subheadline: { en: '', ar: '' },
          eyebrow: { en: '', ar: '' },
          ctaText: { en: '', ar: '' },
          ctaUrl: '',
          visualType: 'gradient',
          imageUrl: null,
          gradientFrom: '#4F46E5',
          gradientTo: '#7C3AED',
        },
      ], { shouldDirty: false });
    }
  }, [basePath, items.length, setValue]);

  const itemPath = `${basePath}.items.0`;

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
      <h4 className="text-sm font-semibold">
        {t('sections.editors.hero.heading')}
      </h4>

      {/* Color Scheme */}
      <ColorSchemeSelector
        fieldPath={`sections.${index}.settings.color_scheme`}
        description={t('sections.editors.common.colorSchemeDescription')}
      />

      {/* Eyebrow (localized) */}
      <div className="space-y-2">
        <Label>{t('sections.editors.hero.eyebrow')}</Label>
        <LocalizedTextField
          name={`${itemPath}.eyebrow`}
          placeholder={{ en: 'Small heading', ar: 'عنوان صغير' }}
        />
      </div>

      {/* Headline (localized) */}
      <div className="space-y-2">
        <Label>{t('sections.editors.hero.headline')}</Label>
        <LocalizedTextField
          name={`${itemPath}.headline`}
          placeholder={{ en: 'Main headline', ar: 'العنوان الرئيسي' }}
        />
      </div>

      {/* Subheadline (localized) */}
      <div className="space-y-2">
        <Label>{t('sections.editors.hero.subheadline')}</Label>
        <LocalizedTextField
          name={`${itemPath}.subheadline`}
          placeholder={{ en: 'Supporting text', ar: 'نص داعم' }}
          multiline
          rows={2}
        />
      </div>

      {/* CTA Text (localized) */}
      <div className="space-y-2">
        <Label>{t('sections.editors.hero.ctaText')}</Label>
        <LocalizedTextField
          name={`${itemPath}.ctaText`}
          placeholder={{ en: 'Shop now', ar: 'تسوق الآن' }}
        />
      </div>

      {/* CTA URL */}
      <div className="space-y-2">
        <Label>{t('sections.editors.hero.ctaUrl')}</Label>
        <Input
          {...register(`${itemPath}.ctaUrl` as any)}
          placeholder="/products"
        />
      </div>

      {/* Visual Type */}
      <div className="space-y-2">
        <Label>{t('sections.editors.hero.visualType')}</Label>
        <Select
          value={visualType}
          onValueChange={(v) =>
            setValue(`${itemPath}.visualType` as any, v, { shouldDirty: true })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gradient">{t('sections.editors.hero.visualTypeGradient')}</SelectItem>
            <SelectItem value="image">{t('sections.editors.hero.visualTypeImage')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conditional: Gradient colors */}
      {visualType === 'gradient' && (
        <div className="grid grid-cols-2 gap-3 rounded border p-3 bg-background">
          <div className="space-y-2">
            <Label>{t('sections.editors.hero.gradientFrom')}</Label>
            <ColorPicker
              value={item.gradientFrom ?? '#4F46E5'}
              onChange={(v) => setValue(`${itemPath}.gradientFrom` as any, v, { shouldDirty: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('sections.editors.hero.gradientTo')}</Label>
            <ColorPicker
              value={item.gradientTo ?? '#7C3AED'}
              onChange={(v) => setValue(`${itemPath}.gradientTo` as any, v, { shouldDirty: true })}
            />
          </div>
        </div>
      )}

      {/* Conditional: Image — URL or upload */}
      {visualType === 'image' && (
        <div className="rounded border p-3 bg-background">
          <ImageUrlOrUpload
            label={t('sections.editors.hero.imageUrl')}
            value={item.imageUrl ?? ''}
            onChange={(v) =>
              setValue(`${itemPath}.imageUrl` as any, v || null, { shouldDirty: true })
            }
            storeId={storeId}
            placeholder="https://example.com/hero.jpg"
          />
        </div>
      )}

      {/* Top-level fallbacks (for renderer compatibility) */}
      <p className="text-xs text-muted-foreground pt-2">
        {t('sections.editors.hero.note')}
      </p>
    </div>
  );
}
