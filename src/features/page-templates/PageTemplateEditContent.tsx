'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { usePageTemplate } from '@/hooks/page-templates/usePageTemplate';
import { useUpdatePageTemplate } from '@/hooks/page-templates/usePageTemplateMutations';
import { useSectionSchemas } from '@/hooks/section-schemas/useSectionSchemas';
import { SectionSettingsForm } from './SectionSettingsForm';
import { AddSectionDialog } from './AddSectionDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ChevronUp, ChevronDown, ArrowLeft, Save, Eye, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/config/routes';
import type { PageTemplateSection } from '@/types/theme';

export function PageTemplateEditContent() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const templateId = params?.id as string;
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const activeStoreId = activeStore ? String(activeStore.id) : null;

  const { data: template, isLoading, isError } = usePageTemplate(activeStoreId!, templateId);
  const { data: schemas, isLoading: schemasLoading } = useSectionSchemas(activeStoreId!);
  const updateMutation = useUpdatePageTemplate(activeStoreId!);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    sections: Record<string, PageTemplateSection>;
    sectionOrder: string[];
    selectedSectionId: string | null;
  }>({
    name: '',
    description: '',
    sections: {},
    sectionOrder: [],
    selectedSectionId: null,
  });

  const { name, description, sections, sectionOrder, selectedSectionId } = formData;

  useEffect(() => {
    if (!template) return;
    // eslint-disable-next-line -- sync query data to form state
    setFormData({
      name: template.name,
      description: template.description ?? '',
      sections: template.sections,
      sectionOrder: template.sectionOrder,
      selectedSectionId: template.sectionOrder[0] ?? null,
    });
    setIsDirty(false);
  }, [template]);

  const handleBack = useCallback(() => {
    if (isDirty) {
      if (window.confirm(t('theme.templates.customizer.unsavedWarning'))) {
        router.push(ROUTES.merchant.templates.list());
      }
    } else {
      router.push(ROUTES.merchant.templates.list());
    }
  }, [isDirty, router, t]);

  const handleSettingsChange = useCallback((sectionId: string, newSettings: Record<string, unknown>) => {
    setFormData((prev) => ({
      ...prev,
      sections: { ...prev.sections, [sectionId]: { ...prev.sections[sectionId], settings: newSettings } },
    }));
    setIsDirty(true);
  }, []);

  const handleAddSection = useCallback((type: string, identifier: string) => {
    const schema = schemas?.find((s) => s.type === type);
    if (!schema) return;

    const defaultSettings: Record<string, unknown> = {};
    for (const setting of schema.settings) {
      if (setting.default !== undefined) {
        defaultSettings[setting.id] = setting.default;
      }
    }

    setFormData((prev) => ({
      ...prev,
      sections: { ...prev.sections, [identifier]: { type, settings: defaultSettings } },
      sectionOrder: [...prev.sectionOrder, identifier],
      selectedSectionId: identifier,
    }));
    setIsDirty(true);
    setShowAddDialog(false);
    toast.success(t('theme.templates.customizer.sectionAdded'));
  }, [schemas, t]);

  const handleRemoveSection = useCallback((sectionId: string) => {
    setFormData((prev) => {
      const nextSections = { ...prev.sections };
      delete nextSections[sectionId];
      return {
        ...prev,
        sections: nextSections,
        sectionOrder: prev.sectionOrder.filter((id) => id !== sectionId),
        selectedSectionId: prev.selectedSectionId === sectionId ? null : prev.selectedSectionId,
      };
    });
    setIsDirty(true);
    toast.success(t('theme.templates.customizer.sectionRemoved'));
  }, [t]);

  const moveSection = useCallback((index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const newOrder = [...prev.sectionOrder];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newOrder.length) return prev;
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      return { ...prev, sectionOrder: newOrder };
    });
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!template) return;

    try {
      await updateMutation.mutateAsync({
        templateId: template.id.toString(),
        payload: {
          name,
          description: description || null,
          sections,
          section_order: sectionOrder,
        },
      });

      setIsDirty(false);
      toast.success(t('theme.templates.customizer.saveSuccess'));
    } catch (_err) {
      toast.error(t('theme.templates.customizer.saveError'));
    }
  }, [template, updateMutation, name, description, sections, sectionOrder, t]);

  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!selectedSectionId || showAddDialog) return;
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        e.preventDefault();
        handleRemoveSection(selectedSectionId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedSectionId, showAddDialog, handleSave, handleRemoveSection]);

  if (isLoading || schemasLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-destructive font-medium">
          {isError ? t('errorLoading') : t('notFound')}
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push(ROUTES.merchant.templates.list())}>
          {t('goBack')}
        </Button>
      </div>
    );
  }

  const selectedSection = selectedSectionId ? sections[selectedSectionId] : null;

  const sectionsList = sectionOrder
    .map((id) => ({ id, section: sections[id] }))
    .filter((item) => item.section);

  const schemasByType = schemas
    ? Object.fromEntries(schemas.map((s) => [s.type, s]))
    : {};

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{template.name}</h1>
            <p className="text-sm text-muted-foreground">
              {t('theme.templates.customizer.editing')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {updateMutation.isPending ? t('saving') : t('save')}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Template Metadata + Section List */}
        <div className="w-80 border-r flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{t('theme.templates.customizer.templateDetails')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="template-name">{t('theme.templates.name')}</Label>
                    <Input
                      id="template-name"
                      value={name}
                      onChange={(e) => { setFormData((prev) => ({ ...prev, name: e.target.value })); setIsDirty(true); }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="template-description">{t('theme.templates.description')}</Label>
                    <Textarea
                      id="template-description"
                      value={description}
                      onChange={(e) => { setFormData((prev) => ({ ...prev, description: e.target.value })); setIsDirty(true); }}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  {t('theme.templates.customizer.sections')}
                  <span className="text-muted-foreground ml-1">({sectionOrder.length})</span>
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {t('theme.templates.customizer.addSection')}
                </Button>
              </div>

              <div className="space-y-1">
                {sectionsList.map((item, index) => {
                  const schema = schemasByType[item.section.type];
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition-colors ${
                        selectedSectionId === item.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, selectedSectionId: item.id }))}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {schema?.name ?? item.section.type}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{item.id}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
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
                          disabled={index === sectionsList.length - 1}
                          onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); handleRemoveSection(item.id); }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {sectionsList.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    {t('theme.templates.customizer.noSections')}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Section Settings Panel */}
        <div className="flex-1 flex flex-col">
          {selectedSection && selectedSectionId ? (
            <ScrollArea className="flex-1">
              <div className="p-6 max-w-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <Badge variant="outline">{schemasByType[selectedSection.type]?.name ?? selectedSection.type}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedSectionId}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      {t('theme.templates.customizer.sectionSettings')}
                    </h3>
                    <SectionSettingsForm
                      storeId={activeStoreId!}
                      schema={schemasByType[selectedSection.type] ?? null}
                      settings={selectedSection.settings as Record<string, unknown>}
                      onChange={(newSettings) => handleSettingsChange(selectedSectionId, newSettings)}
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
                  {t('theme.templates.customizer.selectSection')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddDialog && schemas && (
        <AddSectionDialog
          schemas={schemas}
          onClose={() => setShowAddDialog(false)}
          onAdd={handleAddSection}
        />
      )}
    </div>
  );
}
