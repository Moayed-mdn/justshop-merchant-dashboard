'use client';

/**
 * CTA section content editor.
 * Reads: content.ctas[] { label (localized), url, style }, content.trust_badges[] (localized strings)
 */

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RepeaterField } from '../RepeaterField';
import { LocalizedTextField } from '../LocalizedTextField';
import { ColorSchemeSelector } from './ColorSchemeSelector';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface CtaSectionContentProps {
  index: number;
}

type CtaItem = {
  label: { en: string; ar: string };
  url: string;
  style: 'primary' | 'secondary' | 'outline';
};

export function CtaSectionContent({ index }: CtaSectionContentProps) {
  const t = useTranslations('cmsPages');
  const { watch, setValue, register } = useFormContext<MarketingPageFormValues>();

  const basePath = `sections.${index}.content`;
  const ctas = (watch(`${basePath}.ctas` as any) ?? []) as CtaItem[];
  const trustBadges = (watch(`${basePath}.trust_badges` as any) ?? []) as Array<{
    en: string;
    ar: string;
  }>;

  const handleAddCta = () => {
    setValue(`${basePath}.ctas` as any, [
      ...ctas,
      { label: { en: '', ar: '' }, url: '', style: 'primary' },
    ], { shouldDirty: true });
  };

  const handleRemoveCta = (ctaIndex: number) => {
    setValue(`${basePath}.ctas` as any, ctas.filter((_, i) => i !== ctaIndex), { shouldDirty: true });
  };

  const handleMoveCta = (fromIndex: number, toIndex: number) => {
    const updated = [...ctas];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setValue(`${basePath}.ctas` as any, updated, { shouldDirty: true });
  };

  const handleAddTrustBadge = () => {
    setValue(`${basePath}.trust_badges` as any, [
      ...trustBadges,
      { en: '', ar: '' },
    ], { shouldDirty: true });
  };

  const handleRemoveTrustBadge = (badgeIndex: number) => {
    setValue(`${basePath}.trust_badges` as any, trustBadges.filter((_, i) => i !== badgeIndex), { shouldDirty: true });
  };

  const handleMoveTrustBadge = (fromIndex: number, toIndex: number) => {
    const updated = [...trustBadges];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setValue(`${basePath}.trust_badges` as any, updated, { shouldDirty: true });
  };

  return (
    <div className="space-y-6 rounded-lg border p-4 bg-muted/30">
      <h4 className="text-sm font-semibold">
        {t('sections.editors.cta.heading')}
      </h4>

      {/* Color Scheme */}
      <ColorSchemeSelector
        fieldPath={`sections.${index}.settings.color_scheme`}
        description={t('sections.editors.common.colorSchemeDescription')}
      />

      {/* CTAs repeater */}
      <div className="space-y-2">
        <Label>{t('sections.editors.cta.ctas')}</Label>
        <RepeaterField
          items={ctas}
          onAdd={handleAddCta}
          onRemove={handleRemoveCta}
          onMoveUp={(i) => i > 0 && handleMoveCta(i, i - 1)}
          onMoveDown={(i) => i < ctas.length - 1 && handleMoveCta(i, i + 1)}
          getItemLabel={(item: any, i) => item?.label?.en || `CTA ${i + 1}`}
          addLabel={t('sections.editors.cta.addCta')}
          emptyLabel={t('sections.editors.cta.noCtas')}
          renderItem={(ctaIndex) => (
            <div className="space-y-3">
              {/* Label (localized) */}
              <div className="space-y-2">
                <Label>{t('sections.editors.cta.label')}</Label>
                <LocalizedTextField
                  name={`${basePath}.ctas.${ctaIndex}.label`}
                  placeholder={{ en: 'Get Started', ar: 'ابدأ الآن' }}
                />
              </div>

              {/* URL */}
              <div className="space-y-2">
                <Label>{t('sections.editors.cta.url')}</Label>
                <Input
                  {...register(`${basePath}.ctas.${ctaIndex}.url` as any)}
                  placeholder="/products"
                />
              </div>

              {/* Style */}
              <div className="space-y-2">
                <Label>{t('sections.editors.cta.style')}</Label>
                <Select
                  value={watch(`${basePath}.ctas.${ctaIndex}.style` as any) ?? 'primary'}
                  onValueChange={(v) =>
                    setValue(`${basePath}.ctas.${ctaIndex}.style` as any, v, { shouldDirty: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">{t('sections.editors.cta.stylePrimary')}</SelectItem>
                    <SelectItem value="secondary">{t('sections.editors.cta.styleSecondary')}</SelectItem>
                    <SelectItem value="outline">{t('sections.editors.cta.styleOutline')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        />
      </div>

      {/* Trust badges repeater */}
      <div className="space-y-2">
        <Label>{t('sections.editors.cta.trustBadges')}</Label>
        <RepeaterField
          items={trustBadges}
          onAdd={handleAddTrustBadge}
          onRemove={handleRemoveTrustBadge}
          onMoveUp={(i) => i > 0 && handleMoveTrustBadge(i, i - 1)}
          onMoveDown={(i) => i < trustBadges.length - 1 && handleMoveTrustBadge(i, i + 1)}
          getItemLabel={(item: any, i) => item?.en || `Badge ${i + 1}`}
          addLabel={t('sections.editors.cta.addTrustBadge')}
          emptyLabel={t('sections.editors.cta.noTrustBadges')}
          renderItem={(badgeIndex) => (
            <div className="space-y-2">
              <Label>{t('sections.editors.cta.badgeText')}</Label>
              <LocalizedTextField
                name={`${basePath}.trust_badges.${badgeIndex}`}
                placeholder={{ en: 'Secure Payment', ar: 'دفع آمن' }}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}
