'use client';

/**
 * Gallery (Team Members) section content editor.
 * Reads: content.members[] { name (localized), role (localized), bio (localized), image }, settings.show_bio
 */

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RepeaterField } from '../RepeaterField';
import { LocalizedTextField } from '../LocalizedTextField';
import { ImageUrlOrUpload } from '@/components/media/ImageUrlOrUpload';
import { ColorSchemeSelector } from './ColorSchemeSelector';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface GallerySectionContentProps {
  index: number;
  storeId: string;
}

type MemberItem = {
  name: { en: string; ar: string };
  role: { en: string; ar: string };
  bio: { en: string; ar: string };
  image: string;
};

export function GallerySectionContent({ index, storeId }: GallerySectionContentProps) {
  const t = useTranslations('cmsPages');
  const { watch, setValue } = useFormContext<MarketingPageFormValues>();

  const basePath = `sections.${index}.content`;
  const members = (watch(`${basePath}.members` as any) ?? []) as MemberItem[];
  const showBio = (watch(`sections.${index}.settings.show_bio` as any) ?? true) as boolean;

  const handleAdd = () => {
    setValue(`${basePath}.members` as any, [
      ...members,
      { name: { en: '', ar: '' }, role: { en: '', ar: '' }, bio: { en: '', ar: '' }, image: '' },
    ], { shouldDirty: true });
  };

  const handleRemove = (memberIndex: number) => {
    setValue(`${basePath}.members` as any, members.filter((_, i) => i !== memberIndex), { shouldDirty: true });
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    const updated = [...members];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setValue(`${basePath}.members` as any, updated, { shouldDirty: true });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
      <h4 className="text-sm font-semibold">
        {t('sections.editors.gallery.heading')}
      </h4>

      <p className="text-xs text-muted-foreground">
        {t('sections.editors.gallery.note')}
      </p>

      {/* Color Scheme */}
      <ColorSchemeSelector
        fieldPath={`sections.${index}.settings.color_scheme`}
        description={t('sections.editors.common.colorSchemeDescription')}
      />

      {/* Show bio setting */}
      <div className="flex items-center justify-between rounded border p-3 bg-background">
        <Label htmlFor={`sections.${index}.settings.show_bio`}>
          {t('sections.editors.gallery.showBio')}
        </Label>
        <Switch
          id={`sections.${index}.settings.show_bio`}
          checked={showBio}
          onCheckedChange={(v) =>
            setValue(`sections.${index}.settings.show_bio` as any, v, { shouldDirty: true })
          }
        />
      </div>

      {/* Members repeater */}
      <RepeaterField
        items={members}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onMoveUp={(i) => i > 0 && handleMove(i, i - 1)}
        onMoveDown={(i) => i < members.length - 1 && handleMove(i, i + 1)}
        getItemLabel={(item: any, i) => item?.name?.en || `Member ${i + 1}`}
        addLabel={t('sections.editors.gallery.addMember')}
        emptyLabel={t('sections.editors.gallery.noMembers')}
        renderItem={(memberIndex) => (
          <div className="space-y-3">
            {/* Name (localized) */}
            <div className="space-y-2">
              <Label>{t('sections.editors.gallery.name')}</Label>
              <LocalizedTextField
                name={`${basePath}.members.${memberIndex}.name`}
                placeholder={{ en: 'Full name', ar: 'الاسم الكامل' }}
              />
            </div>

            {/* Role (localized) */}
            <div className="space-y-2">
              <Label>{t('sections.editors.gallery.role')}</Label>
              <LocalizedTextField
                name={`${basePath}.members.${memberIndex}.role`}
                placeholder={{ en: 'Job title', ar: 'المسمى الوظيفي' }}
              />
            </div>

            {/* Bio (localized) */}
            <div className="space-y-2">
              <Label>{t('sections.editors.gallery.bio')}</Label>
              <LocalizedTextField
                name={`${basePath}.members.${memberIndex}.bio`}
                placeholder={{ en: 'Short bio', ar: 'نبذة قصيرة' }}
                multiline
                rows={3}
              />
            </div>

            {/* Image */}
            <div className="space-y-2">
              <ImageUrlOrUpload
                label={t('sections.editors.gallery.image')}
                value={members[memberIndex]?.image ?? ''}
                onChange={(v) =>
                  setValue(`${basePath}.members.${memberIndex}.image` as any, v, { shouldDirty: true })
                }
                storeId={storeId}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
