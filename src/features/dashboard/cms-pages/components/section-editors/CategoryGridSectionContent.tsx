'use client';

/**
 * Category grid section content editor.
 * Reads: content.categories[] { id, name (localized), slug, path (localized), productCount, image }
 */

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RepeaterField } from '../RepeaterField';
import { LocalizedTextField } from '../LocalizedTextField';
import { ImageUrlOrUpload } from '@/components/media/ImageUrlOrUpload';
import { ColorSchemeSelector } from './ColorSchemeSelector';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface CategoryGridSectionContentProps {
  index: number;
  storeSlug: string;
}

type CategoryItem = {
  id: string;
  name: { en: string; ar: string };
  slug: string;
  path: { en: string; ar: string };
  productCount: number;
  image?: string | null;
};

export function CategoryGridSectionContent({ index, storeSlug }: CategoryGridSectionContentProps) {
  const t = useTranslations('cmsPages');
  const { watch, setValue, register } = useFormContext<MarketingPageFormValues>();

  const basePath = `sections.${index}.content`;
  const categories = (watch(`${basePath}.categories` as any) ?? []) as CategoryItem[];

  const handleAdd = () => {
    const randomId = Date.now();
    setValue(`${basePath}.categories` as any, [
      ...categories,
      { 
        id: `cat-${randomId}`,
        name: { en: '', ar: '' },
        slug: '',
        path: { en: '', ar: '' },
        productCount: 0,
        image: null,
      },
    ], { shouldDirty: true });
  };

  const handleRemove = (itemIndex: number) => {
    setValue(`${basePath}.categories` as any, categories.filter((_, i) => i !== itemIndex), { shouldDirty: true });
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    const updated = [...categories];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setValue(`${basePath}.categories` as any, updated, { shouldDirty: true });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
      <h4 className="text-sm font-semibold">
        {t('sections.editors.categoryGrid.heading')}
      </h4>

      {/* Color Scheme */}
      <ColorSchemeSelector
        fieldPath={`sections.${index}.settings.color_scheme`}
        description={t('sections.editors.common.colorSchemeDescription')}
      />

      <RepeaterField
        items={categories}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onMoveUp={(i) => i > 0 && handleMove(i, i - 1)}
        onMoveDown={(i) => i < categories.length - 1 && handleMove(i, i + 1)}
        getItemLabel={(item: any, i) => item?.name?.en || item?.slug || `Category ${i + 1}`}
        addLabel={t('sections.editors.categoryGrid.addCategory')}
        emptyLabel={t('sections.editors.categoryGrid.noCategories')}
        renderItem={(itemIndex) => (
          <div className="space-y-3">
            {/* ID */}
            <div className="space-y-2">
              <Label htmlFor={`${basePath}.categories.${itemIndex}.id`}>
                {t('sections.editors.categoryGrid.id')}
              </Label>
              <Input
                id={`${basePath}.categories.${itemIndex}.id`}
                {...register(`${basePath}.categories.${itemIndex}.id` as any)}
                placeholder="cat-electronics"
                className="font-mono text-sm"
              />
            </div>

            {/* Name (localized) */}
            <div className="space-y-2">
              <Label>{t('sections.editors.categoryGrid.name')}</Label>
              <LocalizedTextField
                name={`${basePath}.categories.${itemIndex}.name`}
                placeholder={{ en: 'Electronics', ar: 'الإلكترونيات' }}
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor={`${basePath}.categories.${itemIndex}.slug`}>
                {t('sections.editors.categoryGrid.slug')}
              </Label>
              <Input
                id={`${basePath}.categories.${itemIndex}.slug`}
                {...register(`${basePath}.categories.${itemIndex}.slug` as any)}
                placeholder="electronics"
                className="font-mono text-sm"
              />
            </div>

            {/* Path (localized) */}
            <div className="space-y-2">
              <Label>{t('sections.editors.categoryGrid.path')}</Label>
              <LocalizedTextField
                name={`${basePath}.categories.${itemIndex}.path`}
                placeholder={{ en: '/shop/category/electronics', ar: '/ar/shop/category/electronics' }}
              />
            </div>

            {/* Product Count */}
            <div className="space-y-2">
              <Label htmlFor={`${basePath}.categories.${itemIndex}.productCount`}>
                {t('sections.editors.categoryGrid.productCount')}
              </Label>
              <Input
                id={`${basePath}.categories.${itemIndex}.productCount`}
                type="number"
                min={0}
                {...register(`${basePath}.categories.${itemIndex}.productCount` as any, { valueAsNumber: true })}
                placeholder="24"
              />
            </div>

            {/* Image */}
            <div className="space-y-2">
              <ImageUrlOrUpload
                label={t('sections.editors.categoryGrid.image')}
                value={categories[itemIndex]?.image ?? ''}
                onChange={(v) =>
                  setValue(`${basePath}.categories.${itemIndex}.image` as any, v, { shouldDirty: true })
                }
                storeSlug={storeSlug}
                placeholder="https://example.com/category-image.jpg"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
