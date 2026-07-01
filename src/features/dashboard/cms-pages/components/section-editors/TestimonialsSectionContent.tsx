'use client';

/**
 * Testimonials section content editor.
 * Reads: content.testimonials[] { quote, author, role, rating, avatar },
 *        content.aggregate { average_rating, total_reviews },
 *        settings.show_rating
 */

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RepeaterField } from '../RepeaterField';
import { LocalizedTextField } from '../LocalizedTextField';
import { ImageUrlOrUpload } from '@/components/media/ImageUrlOrUpload';
import { ColorSchemeSelector } from './ColorSchemeSelector';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface TestimonialsSectionContentProps {
  index: number;
  storeSlug: string;
}

type TestimonialItem = {
  quote: { en: string; ar: string };
  author: { en: string; ar: string };
  role: { en: string; ar: string };
  rating?: number;
  avatar?: string;
};

export function TestimonialsSectionContent({ index, storeSlug }: TestimonialsSectionContentProps) {
  const t = useTranslations('cmsPages');
  const { watch, setValue, register } = useFormContext<MarketingPageFormValues>();

  const basePath = `sections.${index}.content`;
  const testimonials = (watch(`${basePath}.testimonials` as any) ?? []) as TestimonialItem[];
  const showRating = (watch(`sections.${index}.settings.show_rating` as any) ?? true) as boolean;

  const handleAdd = () => {
    setValue(`${basePath}.testimonials` as any, [
      ...testimonials,
      { quote: { en: '', ar: '' }, author: { en: '', ar: '' }, role: { en: '', ar: '' }, rating: 5, avatar: '' },
    ], { shouldDirty: true });
  };

  const handleRemove = (itemIndex: number) => {
    setValue(`${basePath}.testimonials` as any, testimonials.filter((_, i) => i !== itemIndex), { shouldDirty: true });
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    const updated = [...testimonials];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setValue(`${basePath}.testimonials` as any, updated, { shouldDirty: true });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
      <h4 className="text-sm font-semibold">
        {t('sections.editors.testimonials.heading')}
      </h4>

      {/* Color Scheme */}
      <ColorSchemeSelector
        fieldPath={`sections.${index}.settings.color_scheme`}
        description={t('sections.editors.common.colorSchemeDescription')}
      />

      {/* Show rating setting */}
      <div className="flex items-center justify-between rounded border p-3 bg-background">
        <Label htmlFor={`sections.${index}.settings.show_rating`}>
          {t('sections.editors.testimonials.showRating')}
        </Label>
        <Switch
          id={`sections.${index}.settings.show_rating`}
          checked={showRating}
          onCheckedChange={(v) =>
            setValue(`sections.${index}.settings.show_rating` as any, v, { shouldDirty: true })
          }
        />
      </div>

      {/* Testimonials repeater */}
      <RepeaterField
        items={testimonials}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onMoveUp={(i) => i > 0 && handleMove(i, i - 1)}
        onMoveDown={(i) => i < testimonials.length - 1 && handleMove(i, i + 1)}
        getItemLabel={(item: any, i) => item?.author?.en || `Testimonial ${i + 1}`}
        addLabel={t('sections.editors.testimonials.addTestimonial')}
        emptyLabel={t('sections.editors.testimonials.noTestimonials')}
        renderItem={(itemIndex) => (
          <div className="space-y-3">
            {/* Quote (localized) */}
            <div className="space-y-2">
              <Label>{t('sections.editors.testimonials.quote')}</Label>
              <LocalizedTextField
                name={`${basePath}.testimonials.${itemIndex}.quote`}
                placeholder={{ en: 'Customer testimonial', ar: 'شهادة العميل' }}
                multiline
                rows={3}
              />
            </div>

            {/* Author (localized) */}
            <div className="space-y-2">
              <Label>{t('sections.editors.testimonials.author')}</Label>
              <LocalizedTextField
                name={`${basePath}.testimonials.${itemIndex}.author`}
                placeholder={{ en: 'Customer name', ar: 'اسم العميل' }}
              />
            </div>

            {/* Role (localized) */}
            <div className="space-y-2">
              <Label>{t('sections.editors.testimonials.role')}</Label>
              <LocalizedTextField
                name={`${basePath}.testimonials.${itemIndex}.role`}
                placeholder={{ en: 'Job title or company', ar: 'المسمى الوظيفي أو الشركة' }}
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>{t('sections.editors.testimonials.rating')}</Label>
              <Input
                type="number"
                min={1}
                max={5}
                step={0.5}
                {...register(`${basePath}.testimonials.${itemIndex}.rating` as any, { valueAsNumber: true })}
              />
            </div>

            {/* Avatar */}
            <div className="space-y-2">
              <ImageUrlOrUpload
                label={t('sections.editors.testimonials.avatar')}
                value={testimonials[itemIndex]?.avatar ?? ''}
                onChange={(v) =>
                  setValue(`${basePath}.testimonials.${itemIndex}.avatar` as any, v, { shouldDirty: true })
                }
                storeSlug={storeSlug}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
        )}
      />

      {/* Optional aggregate */}
      <div className="space-y-3 rounded border p-3 bg-background">
        <Label className="text-xs font-medium">{t('sections.editors.testimonials.aggregate')}</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">{t('sections.editors.testimonials.averageRating')}</Label>
            <Input
              type="number"
              min={0}
              max={5}
              step={0.1}
              {...register(`${basePath}.aggregate.average_rating` as any, { valueAsNumber: true })}
              placeholder="4.5"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">{t('sections.editors.testimonials.totalReviews')}</Label>
            <Input
              type="number"
              min={0}
              {...register(`${basePath}.aggregate.total_reviews` as any, { valueAsNumber: true })}
              placeholder="100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
