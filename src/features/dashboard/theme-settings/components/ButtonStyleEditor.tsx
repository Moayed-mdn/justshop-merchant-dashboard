'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ButtonSettings } from '@/hooks/themes/useThemeSettings';

interface ButtonStyleEditorProps {
  label: string;
  description?: string;
  value: ButtonSettings;
  onChange: (value: ButtonSettings) => void;
}

export function ButtonStyleEditor({ label, description, value, onChange }: ButtonStyleEditorProps) {
  const t = useTranslations('theme-settings');

  const updateField = <K extends keyof ButtonSettings>(field: K, fieldValue: ButtonSettings[K]) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        <div className="rounded-lg border bg-muted/30 p-6 flex items-center justify-center">
          <button
            type="button"
            className="inline-flex items-center text-decoration-none whitespace-nowrap transition-opacity"
            style={{
              backgroundColor: value.backgroundColor,
              color: value.textColor,
              borderColor: value.borderColor,
              borderWidth: `${value.borderWidth}px`,
              borderStyle: value.borderWidth > 0 ? 'solid' : 'none',
              borderRadius: {
                none: '0',
                sm: '0.25rem',
                md: '0.5rem',
                lg: '1rem',
                full: '9999px',
              }[value.borderRadius],
              paddingLeft: { sm: '1rem', md: '1.5rem', lg: '1.75rem', xl: '2rem' }[value.paddingX],
              paddingRight: { sm: '1rem', md: '1.5rem', lg: '1.75rem', xl: '2rem' }[value.paddingX],
              paddingTop: { sm: '0.5rem', md: '0.75rem', lg: '1rem' }[value.paddingY],
              paddingBottom: { sm: '0.5rem', md: '0.75rem', lg: '1rem' }[value.paddingY],
              fontSize: { sm: '0.875rem', base: '0.9375rem', lg: '1rem' }[value.fontSize],
              fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700' }[value.fontWeight],
            }}
          >
            {t('buttons.preview')}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Background Color */}
          <div className="space-y-2">
            <Label>{t('buttons.backgroundColor')}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={value.backgroundColor}
                onChange={(e) => updateField('backgroundColor', e.target.value)}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={value.backgroundColor}
                onChange={(e) => updateField('backgroundColor', e.target.value)}
                className="flex-1"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <Label>{t('buttons.textColor')}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={value.textColor}
                onChange={(e) => updateField('textColor', e.target.value)}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={value.textColor}
                onChange={(e) => updateField('textColor', e.target.value)}
                className="flex-1"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          {/* Border Color */}
          <div className="space-y-2">
            <Label>{t('buttons.borderColor')}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={value.borderColor}
                onChange={(e) => updateField('borderColor', e.target.value)}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={value.borderColor}
                onChange={(e) => updateField('borderColor', e.target.value)}
                className="flex-1"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Border Width */}
          <div className="space-y-2">
            <Label>{t('buttons.borderWidth')}</Label>
            <Input
              type="number"
              min="0"
              max="10"
              value={value.borderWidth}
              onChange={(e) => updateField('borderWidth', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          {/* Border Radius */}
          <div className="space-y-2">
            <Label>{t('buttons.borderRadius')}</Label>
            <Select
              value={value.borderRadius}
              onValueChange={(v) => updateField('borderRadius', v as ButtonSettings['borderRadius'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('buttons.radius.none')}</SelectItem>
                <SelectItem value="sm">{t('buttons.radius.sm')}</SelectItem>
                <SelectItem value="md">{t('buttons.radius.md')}</SelectItem>
                <SelectItem value="lg">{t('buttons.radius.lg')}</SelectItem>
                <SelectItem value="full">{t('buttons.radius.full')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Padding X */}
          <div className="space-y-2">
            <Label>{t('buttons.paddingX')}</Label>
            <Select
              value={value.paddingX}
              onValueChange={(v) => updateField('paddingX', v as ButtonSettings['paddingX'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">{t('buttons.padding.sm')}</SelectItem>
                <SelectItem value="md">{t('buttons.padding.md')}</SelectItem>
                <SelectItem value="lg">{t('buttons.padding.lg')}</SelectItem>
                <SelectItem value="xl">{t('buttons.padding.xl')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Padding Y */}
          <div className="space-y-2">
            <Label>{t('buttons.paddingY')}</Label>
            <Select
              value={value.paddingY}
              onValueChange={(v) => updateField('paddingY', v as ButtonSettings['paddingY'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">{t('buttons.padding.sm')}</SelectItem>
                <SelectItem value="md">{t('buttons.padding.md')}</SelectItem>
                <SelectItem value="lg">{t('buttons.padding.lg')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label>{t('buttons.fontSize')}</Label>
            <Select
              value={value.fontSize}
              onValueChange={(v) => updateField('fontSize', v as ButtonSettings['fontSize'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">{t('buttons.size.sm')}</SelectItem>
                <SelectItem value="base">{t('buttons.size.base')}</SelectItem>
                <SelectItem value="lg">{t('buttons.size.lg')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font Weight */}
          <div className="space-y-2">
            <Label>{t('buttons.fontWeight')}</Label>
            <Select
              value={value.fontWeight}
              onValueChange={(v) => updateField('fontWeight', v as ButtonSettings['fontWeight'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">{t('buttons.weight.normal')}</SelectItem>
                <SelectItem value="medium">{t('buttons.weight.medium')}</SelectItem>
                <SelectItem value="semibold">{t('buttons.weight.semibold')}</SelectItem>
                <SelectItem value="bold">{t('buttons.weight.bold')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hover Effect */}
          <div className="space-y-2">
            <Label>{t('buttons.hoverEffect')}</Label>
            <Select
              value={value.hoverEffect}
              onValueChange={(v) => updateField('hoverEffect', v as ButtonSettings['hoverEffect'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opacity">{t('buttons.hover.opacity')}</SelectItem>
                <SelectItem value="darken">{t('buttons.hover.darken')}</SelectItem>
                <SelectItem value="lift">{t('buttons.hover.lift')}</SelectItem>
                <SelectItem value="scale">{t('buttons.hover.scale')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
