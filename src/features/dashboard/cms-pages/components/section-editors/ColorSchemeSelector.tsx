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

  // Fetch themes to get color schemes
  const activeStoreSlug = activeStore ? getStoreRouteParam(activeStore) : null;
  const { data: themesData } = useThemes(activeStoreSlug!, {
    page: 1,
    perPage: 100,
  });

  // Get the active theme
  const activeTheme = themesData?.data.find((theme) => theme.isActive);
  const themeSettings = activeTheme as unknown as { 
    settings?: { 
      color_schemes?: Record<string, ColorScheme> 
    } 
  };

  // Get available color schemes
  const colorSchemes = themeSettings?.settings?.color_schemes || {
    default: {
      name: 'Default',
      background: '#FFFFFF',
      text: '#1F2937',
      button_background: '#3B82F6',
      button_text: '#FFFFFF',
      secondary_background: '#F3F4F6',
      border: '#E5E7EB',
    },
    brand: {
      name: 'Brand',
      background: '#3B82F6',
      text: '#FFFFFF',
      button_background: '#FFFFFF',
      button_text: '#3B82F6',
      secondary_background: '#2563EB',
      border: 'rgba(255, 255, 255, 0.2)',
    },
    dark: {
      name: 'Dark',
      background: '#1F2937',
      text: '#FFFFFF',
      button_background: '#F59E0B',
      button_text: '#000000',
      secondary_background: '#374151',
      border: '#4B5563',
    },
    light: {
      name: 'Light',
      background: '#F9FAFB',
      text: '#1F2937',
      button_background: '#3B82F6',
      button_text: '#FFFFFF',
      secondary_background: '#FFFFFF',
      border: '#E5E7EB',
    },
  };

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
