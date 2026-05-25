import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { LoginCard } from '@/features/auth/components/LoginCard';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('login');
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function LoginPage() {
  return <LoginCard />;
}
