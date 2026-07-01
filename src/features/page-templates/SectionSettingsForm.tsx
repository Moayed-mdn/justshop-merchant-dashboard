'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Info } from 'lucide-react';
import { LinkListSetting } from './LinkListSetting';
import type { SectionSchema } from '@/types/theme';

interface SectionSettingsFormProps {
  storeSlug: string;
  schema: SectionSchema | null;
  settings: Record<string, unknown>;
  onChange: (settings: Record<string, unknown>) => void;
}

export function SectionSettingsForm({ storeSlug, schema, settings, onChange }: SectionSettingsFormProps) {
  const t = useTranslations();

  const updateSetting = (id: string, value: unknown) => {
    onChange({ ...settings, [id]: value });
  };

  if (!schema || !schema.settings || schema.settings.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        {t('theme.templates.customizer.noSettings')}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {schema.settings.map((setting) => {
        const value = settings[setting.id] ?? setting.default ?? '';

        switch (setting.type) {
          case 'text':
            return (
              <div key={setting.id} className="space-y-2">
                <Label htmlFor={setting.id}>{setting.label}</Label>
                <Input
                  id={setting.id}
                  value={String(value)}
                  onChange={(e) => updateSetting(setting.id, e.target.value)}
                  placeholder={setting.placeholder}
                />
                {setting.info && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {setting.info}
                  </p>
                )}
              </div>
            );

          case 'textarea':
            return (
              <div key={setting.id} className="space-y-2">
                <Label htmlFor={setting.id}>{setting.label}</Label>
                <Textarea
                  id={setting.id}
                  value={String(value)}
                  onChange={(e) => updateSetting(setting.id, e.target.value)}
                  placeholder={setting.placeholder}
                  rows={3}
                />
                {setting.info && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {setting.info}
                  </p>
                )}
              </div>
            );

          case 'number':
            return (
              <div key={setting.id} className="space-y-2">
                <Label htmlFor={setting.id}>{setting.label}</Label>
                <Input
                  id={setting.id}
                  type="number"
                  value={Number(value)}
                  min={setting.min}
                  max={setting.max}
                  onChange={(e) => updateSetting(setting.id, parseInt(e.target.value, 10))}
                />
                {setting.info && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {setting.info}
                  </p>
                )}
              </div>
            );

          case 'checkbox':
            return (
              <div key={setting.id} className="flex items-center gap-2">
                <Switch
                  id={setting.id}
                  checked={Boolean(value)}
                  onCheckedChange={(checked) => updateSetting(setting.id, checked)}
                />
                <Label htmlFor={setting.id}>{setting.label}</Label>
                {setting.info && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {setting.info}
                  </p>
                )}
              </div>
            );

          case 'link_list':
            return (
              <LinkListSetting
                key={setting.id}
                storeSlug={storeSlug}
                setting={setting}
                value={String(value)}
                onChange={(v) => updateSetting(setting.id, v)}
              />
            );

          case 'select':
            return (
              <div key={setting.id} className="space-y-2">
                <Label htmlFor={setting.id}>{setting.label}</Label>
                <Select
                  value={String(value)}
                  onValueChange={(v) => v !== null && updateSetting(setting.id, v)}
                >
                  <SelectTrigger id={setting.id}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {setting.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {setting.info && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {setting.info}
                  </p>
                )}
              </div>
            );

          default:
            return (
              <div key={setting.id} className="space-y-2">
                <Label htmlFor={setting.id}>{setting.label}</Label>
                <Input
                  id={setting.id}
                  value={String(value)}
                  onChange={(e) => updateSetting(setting.id, e.target.value)}
                />
              </div>
            );
        }
      })}
    </div>
  );
}
