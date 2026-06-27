'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface ColorSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  error: string;
  warning: string;
}

interface ColorSettingsEditorProps {
  value: ColorSettings;
  onChange: (value: ColorSettings) => void;
}

export function ColorSettingsEditor({ value, onChange }: ColorSettingsEditorProps) {
  const t = useTranslations('theme-settings');

  const updateColor = (field: keyof ColorSettings, color: string) => {
    onChange({ ...value, [field]: color });
  };

  const colorFields: Array<{ key: keyof ColorSettings; label: string; description: string }> = [
    {
      key: 'primary',
      label: t('colors.primary.label'),
      description: t('colors.primary.description'),
    },
    {
      key: 'secondary',
      label: t('colors.secondary.label'),
      description: t('colors.secondary.description'),
    },
    {
      key: 'accent',
      label: t('colors.accent.label'),
      description: t('colors.accent.description'),
    },
    {
      key: 'background',
      label: t('colors.background.label'),
      description: t('colors.background.description'),
    },
    {
      key: 'text',
      label: t('colors.text.label'),
      description: t('colors.text.description'),
    },
    {
      key: 'textMuted',
      label: t('colors.textMuted.label'),
      description: t('colors.textMuted.description'),
    },
    {
      key: 'border',
      label: t('colors.border.label'),
      description: t('colors.border.description'),
    },
    {
      key: 'success',
      label: t('colors.success.label'),
      description: t('colors.success.description'),
    },
    {
      key: 'error',
      label: t('colors.error.label'),
      description: t('colors.error.description'),
    },
    {
      key: 'warning',
      label: t('colors.warning.label'),
      description: t('colors.warning.description'),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('colors.title')}</CardTitle>
        <CardDescription>{t('colors.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {colorFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label>
                <div className="font-medium">{field.label}</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  {field.description}
                </div>
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={value[field.key]}
                  onChange={(e) => updateColor(field.key, e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={value[field.key]}
                  onChange={(e) => updateColor(field.key, e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Color Preview Section */}
        <div className="mt-8 pt-6 border-t">
          <h4 className="text-sm font-medium mb-4">{t('colors.preview')}</h4>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Preview Card 1: Primary */}
            <div
              className="rounded-lg p-4 border"
              style={{
                backgroundColor: value.background,
                borderColor: value.border,
              }}
            >
              <div
                className="text-sm font-medium mb-2"
                style={{ color: value.text }}
              >
                {t('colors.previewTitle')}
              </div>
              <div
                className="text-xs mb-3"
                style={{ color: value.textMuted }}
              >
                {t('colors.previewText')}
              </div>
              <button
                type="button"
                className="text-sm px-4 py-2 rounded-md font-medium"
                style={{
                  backgroundColor: value.primary,
                  color: '#FFFFFF',
                }}
              >
                {t('colors.primaryAction')}
              </button>
            </div>

            {/* Preview Card 2: Status Colors */}
            <div
              className="rounded-lg p-4 border"
              style={{
                backgroundColor: value.background,
                borderColor: value.border,
              }}
            >
              <div
                className="text-sm font-medium mb-3"
                style={{ color: value.text }}
              >
                {t('colors.statusColors')}
              </div>
              <div className="space-y-2">
                <div
                  className="text-xs px-2 py-1 rounded inline-block"
                  style={{
                    backgroundColor: `${value.success}20`,
                    color: value.success,
                  }}
                >
                  {t('colors.successExample')}
                </div>
                <div
                  className="text-xs px-2 py-1 rounded inline-block"
                  style={{
                    backgroundColor: `${value.error}20`,
                    color: value.error,
                  }}
                >
                  {t('colors.errorExample')}
                </div>
                <div
                  className="text-xs px-2 py-1 rounded inline-block"
                  style={{
                    backgroundColor: `${value.warning}20`,
                    color: value.warning,
                  }}
                >
                  {t('colors.warningExample')}
                </div>
              </div>
            </div>

            {/* Preview Card 3: Secondary */}
            <div
              className="rounded-lg p-4 border"
              style={{
                backgroundColor: value.background,
                borderColor: value.border,
              }}
            >
              <div
                className="text-sm font-medium mb-2"
                style={{ color: value.text }}
              >
                {t('colors.previewTitle')}
              </div>
              <div
                className="text-xs mb-3"
                style={{ color: value.textMuted }}
              >
                {t('colors.previewText')}
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  className="text-sm px-4 py-2 rounded-md font-medium border block w-full"
                  style={{
                    backgroundColor: value.background,
                    color: value.secondary,
                    borderColor: value.secondary,
                  }}
                >
                  {t('colors.secondaryAction')}
                </button>
                <button
                  type="button"
                  className="text-sm px-4 py-2 rounded-md font-medium block w-full"
                  style={{
                    backgroundColor: value.accent,
                    color: '#FFFFFF',
                  }}
                >
                  {t('colors.accentAction')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
