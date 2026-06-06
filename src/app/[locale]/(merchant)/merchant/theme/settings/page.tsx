/**
 * Theme settings page.
 * Server component that wraps the client-side theme settings content.
 */

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ThemeSettingsContent } from '@/features/theme/settings/ThemeSettingsContent';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: t('theme.settings.title'),
  };
}

export default function ThemeSettingsPage() {
  return <ThemeSettingsContent />;
}
