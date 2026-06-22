'use client';

/**
 * Custom section content editor.
 * Provides raw JSON editors for content and settings, with a warning.
 */

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import { JsonEditorField } from '../JsonEditorField';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface CustomSectionContentProps {
  index: number;
}

export function CustomSectionContent({ index }: CustomSectionContentProps) {
  const t = useTranslations('cmsPages');
  const { watch, setValue } = useFormContext<MarketingPageFormValues>();

  const content = (watch(`sections.${index}.content` as any) ?? {}) as Record<string, unknown>;
  const settings = (watch(`sections.${index}.settings` as any) ?? {}) as Record<string, unknown>;

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
      <h4 className="text-sm font-semibold">
        {t('sections.editors.custom.heading')}
      </h4>

      {/* Warning */}
      <div className="flex gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
        <p className="text-sm text-destructive">
          {t('sections.editors.custom.warning')}
        </p>
      </div>

      {/* Content JSON editor */}
      <JsonEditorField
        label={t('sections.editors.custom.content')}
        value={content}
        onChange={(v) => setValue(`sections.${index}.content` as any, v, { shouldDirty: true })}
      />

      {/* Settings JSON editor */}
      <JsonEditorField
        label={t('sections.editors.custom.settings')}
        value={settings}
        onChange={(v) => setValue(`sections.${index}.settings` as any, v, { shouldDirty: true })}
      />
    </div>
  );
}
