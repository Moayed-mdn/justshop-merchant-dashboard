'use client';

/**
 * Features section content editor.
 * Reads: content.items[] { title (localized), body (localized), icon }
 */

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { RepeaterField } from '../RepeaterField';
import { LocalizedTextField } from '../LocalizedTextField';
import { ImageUrlOrUpload } from '@/components/media/ImageUrlOrUpload';
import { ColorSchemeSelector } from './ColorSchemeSelector';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface FeaturesSectionContentProps {
  index: number;
  storeSlug: string;
}

type FeatureItem = {
  title: { en: string; ar: string };
  body: { en: string; ar: string };
  icon?: string;
};

export function FeaturesSectionContent({ index, storeSlug }: FeaturesSectionContentProps) {
  const t = useTranslations('cmsPages');
  const { watch, setValue } = useFormContext<MarketingPageFormValues>();

  const basePath = `sections.${index}.content`;
  const items = (watch(`${basePath}.items` as any) ?? []) as FeatureItem[];

  const handleAdd = () => {
    setValue(`${basePath}.items` as any, [
      ...items,
      { title: { en: '', ar: '' }, body: { en: '', ar: '' }, icon: '' },
    ], { shouldDirty: true });
  };

  const handleRemove = (itemIndex: number) => {
    setValue(`${basePath}.items` as any, items.filter((_, i) => i !== itemIndex), { shouldDirty: true });
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    const updated = [...items];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setValue(`${basePath}.items` as any, updated, { shouldDirty: true });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
      <h4 className="text-sm font-semibold">
        {t('sections.editors.features.heading')}
      </h4>

      {/* Color Scheme */}
      <ColorSchemeSelector
        fieldPath={`sections.${index}.settings.color_scheme`}
        description={t('sections.editors.common.colorSchemeDescription')}
      />

      <RepeaterField
        items={items}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onMoveUp={(i) => i > 0 && handleMove(i, i - 1)}
        onMoveDown={(i) => i < items.length - 1 && handleMove(i, i + 1)}
        getItemLabel={(item: any, i) => item?.title?.en || `Feature ${i + 1}`}
        addLabel={t('sections.editors.features.addFeature')}
        emptyLabel={t('sections.editors.features.noFeatures')}
        renderItem={(itemIndex) => (
          <div className="space-y-3">
            {/* Title (localized) */}
            <div className="space-y-2">
              <Label>{t('sections.editors.features.title')}</Label>
              <LocalizedTextField
                name={`${basePath}.items.${itemIndex}.title`}
                placeholder={{ en: 'Feature title', ar: 'عنوان الميزة' }}
              />
            </div>

            {/* Body (localized) */}
            <div className="space-y-2">
              <Label>{t('sections.editors.features.body')}</Label>
              <LocalizedTextField
                name={`${basePath}.items.${itemIndex}.body`}
                placeholder={{ en: 'Feature description', ar: 'وصف الميزة' }}
                multiline
                rows={3}
              />
            </div>

            {/* Icon — URL or upload */}
            <div className="space-y-2">
              <ImageUrlOrUpload
                label={t('sections.editors.features.icon')}
                value={items[itemIndex]?.icon ?? ''}
                onChange={(v) =>
                  setValue(`${basePath}.items.${itemIndex}.icon` as any, v, { shouldDirty: true })
                }
                storeSlug={storeSlug}
                placeholder="https://example.com/icon.svg or icon-name"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
