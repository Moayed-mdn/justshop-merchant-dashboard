import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoginCard } from '@/features/auth/components/LoginCard';
import { getMe } from '@/lib/actions/auth.actions';
import { getPostLoginRedirect } from '@/lib/auth/redirects';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('login');
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // If authenticated, redirect to dashboard
  const user = await getMe();
  if (user) {
    redirect(getPostLoginRedirect(user, locale));
  }

  // Wrap with AuthProvider so LoginForm can access auth context
  return (
    <AuthProvider initialUser={user}>
      <LoginCard />
    </AuthProvider>
  );
}
