'use client';

/**
 * Video section content editor.
 * Reads: content.video_url, content.poster_url, content.description (localized)
 */

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocalizedTextField } from '../LocalizedTextField';
import { ImageUrlOrUpload } from '@/components/media/ImageUrlOrUpload';
import { ColorSchemeSelector } from './ColorSchemeSelector';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface VideoSectionContentProps {
  index: number;
  storeId: string;
}

export function VideoSectionContent({ index, storeId }: VideoSectionContentProps) {
  const t = useTranslations('cmsPages');
  const { register, watch, setValue } = useFormContext<MarketingPageFormValues>();

  const basePath = `sections.${index}.content`;

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
      <h4 className="text-sm font-semibold">
        {t('sections.editors.video.heading')}
      </h4>

      {/* Color Scheme */}
      <ColorSchemeSelector
        fieldPath={`sections.${index}.settings.color_scheme`}
        description={t('sections.editors.common.colorSchemeDescription')}
      />

      {/* Video URL (required) */}
      <div className="space-y-2">
        <Label htmlFor={`${basePath}.video_url`}>
          {t('sections.editors.video.videoUrl')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${basePath}.video_url`}
          {...register(`${basePath}.video_url` as any)}
          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
        />
        <p className="text-xs text-muted-foreground">
          {t('sections.editors.video.videoUrlHelp')}
        </p>
      </div>

      {/* Poster image — URL or upload */}
      <ImageUrlOrUpload
        label={t('sections.editors.video.posterUrl')}
        value={(watch(`${basePath}.poster_url` as any) as string) ?? ''}
        onChange={(v) =>
          setValue(`${basePath}.poster_url` as any, v, { shouldDirty: true })
        }
        storeId={storeId}
        placeholder="https://example.com/thumbnail.jpg"
      />

      {/* Description (localized, optional) */}
      <div className="space-y-2">
        <Label>{t('sections.editors.video.description')}</Label>
        <LocalizedTextField
          name={`${basePath}.description`}
          placeholder={{
            en: 'Video description',
            ar: 'وصف الفيديو',
          }}
          multiline
          rows={3}
        />
      </div>
    </div>
  );
}
