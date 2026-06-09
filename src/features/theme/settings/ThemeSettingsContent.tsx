'use client';

/**
 * Theme settings page content (client component).
 * Global theme settings editor (colors, fonts, layout).
 */

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { useThemes } from '@/hooks/themes/useThemes';
import { useUpdateTheme } from '@/hooks/themes/useThemeMutations';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { ColorPicker } from './ColorPicker';
import { FontSelector } from './FontSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/config/routes';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_COLORS, DEFAULT_FONTS } from '@/lib/fonts';
import type { ThemeSettings } from '@/types/theme';

export function ThemeSettingsContent() {
  const t = useTranslations();
  const router = useRouter();
  const activeStore = useBootstrapStore((state) => state.activeStore);
  
  // Fetch themes to get the active one
  const activeStoreId = activeStore ? String(activeStore.id) : null;
  const { data: themesData } = useThemes(activeStoreId!, {
    page: 1,
    perPage: 100, // Get all themes
  });

  const activeTheme = themesData?.data.find((theme) => theme.isActive);
  const updateMutation = useUpdateTheme(activeStoreId!);

  // Settings state
  const [colors, setColors] = useState({
    primary: DEFAULT_COLORS.primary,
    secondary: DEFAULT_COLORS.secondary,
    accent: DEFAULT_COLORS.accent,
    background: DEFAULT_COLORS.background,
    text: DEFAULT_COLORS.text,
  });

  const [fonts, setFonts] = useState({
    heading: DEFAULT_FONTS.heading,
    body: DEFAULT_FONTS.body,
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from active theme
  useEffect(() => {
    if (activeTheme) {
      const settings = activeTheme as unknown as { settings?: ThemeSettings };
      if (settings.settings) {
        if (settings.settings.colors) {
          setColors((prev) => ({ ...prev, ...settings.settings.colors }));
        }
        if (settings.settings.fonts) {
          setFonts((prev) => ({ ...prev, ...settings.settings.fonts }));
        }
      }
    }
  }, [activeTheme]);

  const handleColorChange = (key: string, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleFontChange = (key: string, value: string) => {
    setFonts((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!activeTheme) {
      toast.error(t('common.theme.settings.noActiveTheme'));
      return;
    }

    try {
      await updateMutation.mutateAsync({
        themeId: activeTheme.id.toString(),
        payload: {
          settings: {
            colors,
            fonts,
          },
        },
      });

      toast.success(t('common.theme.settings.saveSuccess'));
      setHasChanges(false);
    } catch (error) {
      toast.error(t('common.theme.settings.saveError'));
    }
  };

  if (!activeTheme) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(ROUTES.merchant.theme.navigation.list())}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {t('common.theme.settings.noActiveTheme')}
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push(ROUTES.merchant.theme.navigation.list())}
            >
              {t('common.theme.goToThemes')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(ROUTES.merchant.theme.navigation.list())}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('common.theme.settings.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('common.theme.settings.subtitle')}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updateMutation.isPending}
        >
          <Save className="mr-2 h-4 w-4" />
          {updateMutation.isPending ? t('common.saving') : t('common.save')}
        </Button>
      </div>

      {/* Active Theme Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t('common.theme.settings.editingTheme')}</CardTitle>
          <CardDescription>{activeTheme.name}</CardDescription>
        </CardHeader>
      </Card>

      {/* Color Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('common.theme.settings.colors')}</CardTitle>
          <CardDescription>
            {t('common.theme.settings.colorsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>{t('common.theme.settings.primaryColor')}</Label>
              <ColorPicker
                value={colors.primary}
                onChange={(value) => handleColorChange('primary', value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('common.theme.settings.secondaryColor')}</Label>
              <ColorPicker
                value={colors.secondary}
                onChange={(value) => handleColorChange('secondary', value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('common.theme.settings.accentColor')}</Label>
              <ColorPicker
                value={colors.accent}
                onChange={(value) => handleColorChange('accent', value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('common.theme.settings.backgroundColor')}</Label>
              <ColorPicker
                value={colors.background}
                onChange={(value) => handleColorChange('background', value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('common.theme.settings.textColor')}</Label>
              <ColorPicker
                value={colors.text}
                onChange={(value) => handleColorChange('text', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Font Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('common.theme.settings.typography')}</CardTitle>
          <CardDescription>
            {t('common.theme.settings.typographyDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>{t('common.theme.settings.headingFont')}</Label>
              <FontSelector
                value={fonts.heading}
                onChange={(value) => handleFontChange('heading', value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('common.theme.settings.bodyFont')}</Label>
              <FontSelector
                value={fonts.body}
                onChange={(value) => handleFontChange('body', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
