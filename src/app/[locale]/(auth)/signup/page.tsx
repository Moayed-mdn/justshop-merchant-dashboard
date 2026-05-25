import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { SignupCard } from '@/features/auth/components/SignupCard';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('signup');
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function SignupPage() {
  return <SignupCard />;
}
