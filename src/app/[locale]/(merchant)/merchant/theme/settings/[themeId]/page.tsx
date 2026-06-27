/**
 * Theme settings page.
 * Server component that wraps the client-side theme settings content.
 */

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ThemeSettingsContent } from '@/features/theme/settings/ThemeSettingsContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: t('theme.settings.title'),
  };
}

export default async function ThemeSettingsPage({
  params,
}: {
  params: Promise<{ locale: string; themeId: string }>;
}) {
  const { themeId } = await params;
  
  return <ThemeSettingsContent themeId={themeId} />;
}
