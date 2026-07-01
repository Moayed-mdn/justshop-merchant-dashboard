'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useSystemTemplate } from '@/hooks/system-templates/useSystemTemplate';
import { useUpdateSystemTemplate } from '@/hooks/system-templates/useSystemTemplateMutations';
import { useSectionSchemas } from '@/hooks/section-schemas/useSectionSchemas';
import { SectionSettingsForm } from '@/features/page-templates/SectionSettingsForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Save, Loader2, AlertCircle, Eye,
  ChevronUp, ChevronDown, EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/config/routes';
import { getTemplateTypeLabel, BLOCK_TYPE_LABELS } from '@/types/theme';
import { BlockManager } from '@/components/theme/BlockManager';
import { BlockSettingsDialog } from './BlockSettingsDialog';
import { updateBlock } from '@/lib/api/blocks';
import type { SystemTemplateSectionView, ThemeBlock } from '@/types/theme';
import { getStoreRouteParam } from '@/lib/stores/route-param';

export function SystemTemplateEditContent() {
  const router = useRouter();
  const params = useParams();
  const themeIdentifier = params?.theme as string;
  const templateId = params?.templateId as string;
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const activeStoreSlug = activeStore ? getStoreRouteParam(activeStore) : null;

  const { data: template, isLoading, isError } = useSystemTemplate(activeStoreSlug!, themeIdentifier, templateId);
  const { data: schemas, isLoading: schemasLoading } = useSectionSchemas(activeStoreSlug!);
  const updateMutation = useUpdateSystemTemplate(activeStoreSlug!, themeIdentifier);

  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [sections, setSections] = useState<SystemTemplateSectionView[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [sectionOverrides, setSectionOverrides] = useState<Record<string, Record<string, unknown>>>({});
  const [configuringBlock, setConfiguringBlock] = useState<ThemeBlock | null>(null);

  useEffect(() => {
    if (!template) return;
    setFormData({
      name: template.name,
      description: template.description ?? '',
    });
    setSections(template.sections);
    setSelectedSectionId(null);
    const overrides: Record<string, Record<string, unknown>> = {};
    for (const section of template.sections) {
      overrides[section.id] = { ...section.overrides } as Record<string, unknown>;
    }
    setSectionOverrides(overrides);
    setIsDirty(false);
  }, [template]);

  const handleBack = useCallback(() => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push(ROUTES.merchant.theme.systemTemplates.list(themeIdentifier));
      }
    } else {
      router.push(ROUTES.merchant.theme.systemTemplates.list(themeIdentifier));
    }
  }, [isDirty, router, themeIdentifier]);

  const moveSection = useCallback((index: number, direction: 'up' | 'down') => {
    setSections((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
    setIsDirty(true);
  }, []);

  const toggleVisibility = useCallback((sectionId: number) => {
    setSections((prev) =>
      prev.map((s) => s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s),
    );
    setIsDirty(true);
  }, []);

  const handleOverrideChange = useCallback((sectionId: number, settings: Record<string, unknown>) => {
    setSectionOverrides((prev) => ({
      ...prev,
      [sectionId]: settings,
    }));
    setIsDirty(true);
  }, []);

  const handleBlockToggle = useCallback(async (blockId: number, sectionId: number, isEnabled: boolean) => {
    try {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? { ...s, blocks: s.blocks.map((b) => b.id === blockId ? { ...b, is_enabled: isEnabled } : b) }
            : s,
        ),
      );
      await updateBlock(activeStoreSlug!, themeIdentifier, sectionId.toString(), blockId.toString(), { is_enabled: isEnabled });
      toast.success(isEnabled ? 'Block enabled' : 'Block disabled');
    } catch {
      toast.error('Failed to update block');
      setSections((prev) => prev.map((s) => ({ ...s, blocks: [...s.blocks] })));
    }
  }, [activeStoreSlug, themeIdentifier]);

  const handleBlockMove = useCallback(async (blockId: number, sectionId: number, direction: 'up' | 'down') => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const sorted = [...section.blocks].sort((a, b) => a.position - b.position);
    const idx = sorted.findIndex((b) => b.id === blockId);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;
    [sorted[idx], sorted[targetIdx]] = [sorted[targetIdx], sorted[idx]];
    const reordered = sorted.map((b, i) => ({ ...b, position: i }));
    setSections((prev) =>
      prev.map((s) => s.id === sectionId ? { ...s, blocks: reordered } : s),
    );
    try {
      await Promise.all(
        reordered.map((b) =>
          updateBlock(activeStoreSlug!, themeIdentifier, sectionId.toString(), b.id.toString(), { position: b.position }),
        ),
      );
    } catch {
      toast.error('Failed to reorder blocks');
    }
  }, [activeStoreSlug, themeIdentifier, sections]);

  const handleBlockConfigure = useCallback((block: ThemeBlock) => {
    setConfiguringBlock(block);
  }, []);

  const handleSave = useCallback(async () => {
    if (!template) return;

    try {
      const sectionOverridesPayload: Record<string, Record<string, unknown>> = {};
      for (const section of sections) {
        if (Object.keys(sectionOverrides[section.id] ?? {}).length > 0) {
          sectionOverridesPayload[section.id] = sectionOverrides[section.id];
        }
      }

      const sectionVisibilityPayload: Record<string, boolean> = {};
      for (const section of sections) {
        sectionVisibilityPayload[section.id] = section.isVisible;
      }

      await updateMutation.mutateAsync({
        templateId: template.id.toString(),
        payload: {
          name: formData.name,
          description: formData.description || null,
          section_ids: sections.map((s) => s.id),
          section_overrides: Object.keys(sectionOverridesPayload).length > 0 ? sectionOverridesPayload : undefined,
          section_visibility: sectionVisibilityPayload,
        },
      });

      setIsDirty(false);
      toast.success('Template saved successfully');
    } catch {
      toast.error('Failed to save template');
    }
  }, [template, updateMutation, formData, sections, sectionOverrides]);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  if (isLoading || schemasLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-2">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-destructive font-medium">
          {isError ? 'Error loading template' : 'Template not found'}
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push(ROUTES.merchant.theme.systemTemplates.list(themeIdentifier))}>
          Go back
        </Button>
      </div>
    );
  }

  const selectedSection = sections.find((s) => s.id === selectedSectionId) ?? null;
  const selectedSchema = selectedSection
    ? schemas?.find((s) => s.type === selectedSection.sectionType) ?? null
    : null;
  const selectedEffectiveSettings = selectedSection
    ? { ...selectedSection.settings, ...(sectionOverrides[selectedSection.id] ?? {}) } as Record<string, unknown>
    : {};
  const schemasByType = schemas
    ? Object.fromEntries(schemas.map((s) => [s.type, s]))
    : {};

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{template.name}</h1>
            <p className="text-sm text-muted-foreground">
              Editing {getTemplateTypeLabel(template.type)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Template Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="template-name">Name</Label>
                    <Input
                      id="template-name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, name: e.target.value }));
                        setIsDirty(true);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="template-description">Description</Label>
                    <Textarea
                      id="template-description"
                      value={formData.description}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, description: e.target.value }));
                        setIsDirty(true);
                      }}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Type</Label>
                    <p className="text-sm text-muted-foreground">
                      {getTemplateTypeLabel(template.type)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-sm font-medium mb-2">
                  Sections
                  <span className="text-muted-foreground ml-1">({sections.length})</span>
                </h3>
                <div className="space-y-1">
                  {sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`rounded-lg border p-2 space-y-2 cursor-pointer transition-colors ${
                        selectedSectionId === section.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setSelectedSectionId(section.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {schemasByType[section.sectionType]?.name ?? section.sectionType}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Position {section.position + 1}
                            {section.blocks.length > 0 && ` · ${section.blocks.length} blocks`}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={index === 0}
                            onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={index === sections.length - 1}
                            onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => { e.stopPropagation(); toggleVisibility(section.id); }}
                          >
                            {section.isVisible ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {section.blocks.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {section.blocks.map((block) => (
                            <Badge key={block.id} variant="outline" className="text-xs">
                              {BLOCK_TYPE_LABELS[block.type] ?? block.type}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {sections.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No sections assigned to this template
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedSection ? (
            <ScrollArea className="flex-1">
              <div className="p-6 max-w-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <Badge variant="outline">
                    {schemasByType[selectedSection.sectionType]?.name ?? selectedSection.sectionType}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Section settings & overrides
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      Section Overrides
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      These settings override the section defaults for this specific template.
                    </p>
                    <SectionSettingsForm
                      storeSlug={activeStoreSlug!}
                      schema={selectedSchema}
                      settings={selectedEffectiveSettings}
                      onChange={(settings) => handleOverrideChange(selectedSection.id, settings)}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      Blocks in this section
                      <span className="text-muted-foreground ml-1">({selectedSection.blocks.length})</span>
                    </h3>
                    <BlockManager
                      blocks={selectedSection.blocks}
                      onToggle={(blockId, isEnabled) => handleBlockToggle(blockId, selectedSection.id, isEnabled)}
                      onMove={(blockId, dir) => handleBlockMove(blockId, selectedSection.id, dir)}
                      onConfigure={handleBlockConfigure}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a section to edit its settings and overrides
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <BlockSettingsDialog
        block={configuringBlock}
        open={configuringBlock !== null}
        onOpenChange={(open) => { if (!open) setConfiguringBlock(null); }}
        storeSlug={activeStoreSlug!}
        themeIdentifier={themeIdentifier}
        sectionId={configuringBlock?.section_id ?? selectedSectionId ?? 0}
      />
    </div>
  );
}
