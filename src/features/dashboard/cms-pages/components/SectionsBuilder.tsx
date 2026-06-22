'use client';

/**
 * Dynamic sections builder for marketing pages.
 * Supports add, remove, reorder, collapse/expand, and toggle active.
 */

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LocalizedInput } from './LocalizedInput';
import { SectionContentEditor } from './section-editors/SectionContentEditor';
import { defaultContentFor } from './section-content-defaults';
import { useMarketingSectionTypes } from '@/hooks/marketing-pages/useMarketingSectionTypes';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';
import type { SectionTypeOption } from '@/types/marketing-page';

function generateIdentifier(type: string): string {
  return `${type}_${Date.now()}`;
}

function buildEmptySection(type: string) {
  const defaults = defaultContentFor(type);
  return {
    type,
    identifier: generateIdentifier(type),
    title:      { en: '', ar: '' },
    subtitle:   { en: '', ar: '' },
    content:    defaults.content,
    settings:   defaults.settings,
    is_active:  true,
  };
}

function getOptionLabel(
  type: string,
  options: SectionTypeOption[],
): string {
  const option = options.find((o) => o.value === type);
  return option?.label ?? type;
}

interface SectionsBuilderProps {
  storeId: string;
}

export function SectionsBuilder({ storeId }: SectionsBuilderProps) {
  const t = useTranslations('cmsPages');
  const { control, register, watch, setValue, formState: { errors } } =
    useFormContext<MarketingPageFormValues>();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'sections',
  });

  const { data: sectionTypes = [], isLoading } = useMarketingSectionTypes(storeId);

  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [newSectionType, setNewSectionType] = useState<string>('');

  const toggleCollapse = (index: number) => {
    setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAdd = () => {
    const type = newSectionType || sectionTypes[0]?.value || 'hero';
    append(buildEmptySection(type));
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) move(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index < fields.length - 1) move(index, index + 1);
  };

  return (
    <div className="space-y-4">
      {/* Add section toolbar */}
      <div className="flex items-center gap-3">
        <Select
          value={newSectionType || sectionTypes[0]?.value || ''}
          onValueChange={(v) => { if (v) setNewSectionType(v); }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sectionTypes.map((st) => (
              <SelectItem key={st.value} value={st.value}>
                {st.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-1" />
          {t('sections.add')}
        </Button>
      </div>

      {/* Empty state */}
      {fields.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">{t('sections.empty')}</p>
        </div>
      )}

      {/* Section cards */}
      {fields.map((field, index) => {
        const isCollapsed = collapsed[index] ?? false;
        const isActive    = watch(`sections.${index}.is_active`);
        const sectionType = watch(`sections.${index}.type`) ?? '';

        return (
          <Card key={field.id} className={isActive ? '' : 'opacity-60'}>
            {/* Section header */}
            <CardHeader className="py-3 px-4">
              <div className="flex items-center gap-2">
                {/* Drag handle (visual only — reorder via buttons) */}
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />

                {/* Type badge */}
                <Badge variant="secondary" className="text-xs shrink-0">
                  {getOptionLabel(sectionType, sectionTypes)}
                </Badge>

                {/* Identifier */}
                <span className="text-xs text-muted-foreground font-mono truncate flex-1">
                  {watch(`sections.${index}.identifier`)}
                </span>

                {/* Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Active toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setValue(`sections.${index}.is_active`, !isActive, {
                        shouldDirty: true,
                      })
                    }
                    className="p-1 rounded hover:bg-muted"
                    title={isActive ? t('sections.deactivate') : t('sections.activate')}
                  >
                    {isActive ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Move up */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30"
                    title={t('sections.moveUp')}
                  >
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  </button>

                  {/* Move down */}
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === fields.length - 1}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30"
                    title={t('sections.moveDown')}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>

                  {/* Collapse toggle */}
                  <button
                    type="button"
                    onClick={() => toggleCollapse(index)}
                    className="p-1 rounded hover:bg-muted"
                    title={isCollapsed ? t('sections.expand') : t('sections.collapse')}
                  >
                    {isCollapsed ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1 rounded hover:bg-destructive/10 text-destructive"
                    title={t('sections.remove')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardHeader>

            {/* Section fields (collapsible) */}
            {!isCollapsed && (
              <CardContent className="pt-0 space-y-4">

                {/* Type */}
                <div className="space-y-2">
                  <Label>{t('sections.fields.type')}</Label>
                  <Select
                    value={sectionType}
                    onValueChange={(v) => {
                      if (v) setValue(`sections.${index}.type`, v, { shouldDirty: true });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionTypes.map((st) => (
                        <SelectItem key={st.value} value={st.value}>
                          {st.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Identifier */}
                <div className="space-y-2">
                  <Label htmlFor={`sections.${index}.identifier`}>
                    {t('sections.fields.identifier')}
                  </Label>
                  <Input
                    id={`sections.${index}.identifier`}
                    {...register(`sections.${index}.identifier`)}
                    className="font-mono"
                    placeholder="e.g. hero_main"
                  />
                  {errors.sections?.[index]?.identifier && (
                    <p className="text-sm text-destructive">
                      {errors.sections[index]?.identifier?.message}
                    </p>
                  )}
                </div>

                {/* Title (localized) */}
                <div className="space-y-2">
                  <Label>{t('sections.fields.title')}</Label>
                  <LocalizedInput
                    value={watch(`sections.${index}.title`) ?? { en: '', ar: '' }}
                    onChange={(v) =>
                      setValue(`sections.${index}.title`, v, { shouldDirty: true })
                    }
                  />
                </div>

                {/* Subtitle (localized) */}
                <div className="space-y-2">
                  <Label>{t('sections.fields.subtitle')}</Label>
                  <LocalizedInput
                    value={watch(`sections.${index}.subtitle`) ?? { en: '', ar: '' }}
                    onChange={(v) =>
                      setValue(`sections.${index}.subtitle`, v, { shouldDirty: true })
                    }
                  />
                </div>

                {/* Section content editor (per-type) */}
                <SectionContentEditor
                  sectionType={sectionType}
                  sectionIndex={index}
                  storeId={storeId}
                />

                {/* Active toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor={`sections.${index}.is_active`}>
                    {t('sections.fields.isActive')}
                  </Label>
                  <Switch
                    id={`sections.${index}.is_active`}
                    checked={isActive}
                    onCheckedChange={(v) =>
                      setValue(`sections.${index}.is_active`, v, { shouldDirty: true })
                    }
                  />
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
