'use client';

/**
 * Color Scheme Selector - Reusable component for selecting color schemes in section editors
 */

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useThemes } from '@/hooks/themes/useThemes';
import type { ColorScheme } from '@/types/theme';
import { getStoreRouteParam } from '@/lib/stores/route-param';

interface ColorSchemeSelectorProps {
  /** Path to the color_scheme field in form, e.g., "sections.0.settings.color_scheme" */
  fieldPath: string;
  /** Optional label override */
  label?: string;
  /** Optional description */
  description?: string;
}

export function ColorSchemeSelector({ 
  fieldPath, 
  label, 
  description 
}: ColorSchemeSelectorProps) {
  const t = useTranslations('cmsPages');
  const { watch, setValue } = useFormContext();
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const activeStoreSlug = activeStore ? getStoreRouteParam(activeStore) : null;

  // Fetch only the published theme (is_active + is_published)
  // Backend now properly filters by status parameter
  const { data: themesData } = useThemes(
    activeStoreSlug ?? '',
    { page: 1, perPage: 1, status: 'published' },
    { enabled: !!activeStoreSlug }
  );

  // Get the published theme (should be the only one returned)
  const activeTheme = themesData?.data[0];
  const colorSchemes = (activeTheme?.settings?.color_schemes ?? {}) as Record<string, ColorScheme>;

  const currentValue = watch(fieldPath as any) || 'default';

  return (
    <div className="space-y-2">
      <Label>{label || t('sections.editors.common.colorScheme')}</Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <Select
        value={currentValue}
        onValueChange={(value) => setValue(fieldPath as any, value, { shouldDirty: true })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(colorSchemes).map(([key, scheme]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm border border-border"
                  style={{ backgroundColor: scheme.background }}
                  title={scheme.background}
                />
                <span>{scheme.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Color preview */}
      {colorSchemes[currentValue] && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{t('sections.editors.common.preview')}:</span>
          <div className="flex items-center gap-1">
            <div
              className="w-6 h-6 rounded-sm border"
              style={{ backgroundColor: colorSchemes[currentValue].background }}
              title={`Background: ${colorSchemes[currentValue].background}`}
            />
            <div
              className="w-6 h-6 rounded-sm border"
              style={{ backgroundColor: colorSchemes[currentValue].text }}
              title={`Text: ${colorSchemes[currentValue].text}`}
            />
            <div
              className="w-6 h-6 rounded-sm border"
              style={{ backgroundColor: colorSchemes[currentValue].button_background }}
              title={`Button: ${colorSchemes[currentValue].button_background}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
