import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Toaster } from '@/components/ui/sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import '../globals.css';

function isLocalHostname(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.localhost')
  );
}

function resolveMetadataBaseHost(headerList: Headers): URL {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envSiteUrl) {
    return new URL(envSiteUrl);
  }

  const forwardedHost = headerList.get('x-forwarded-host');
  const host = forwardedHost ?? headerList.get('host');
  if (host) {
    const hostname = host.split(':')[0]?.toLowerCase() ?? '';
    const protocol = headerList.get('x-forwarded-proto') ?? (isLocalHostname(hostname) ? 'http' : 'https');
    return new URL(`${protocol}://${host}`);
  }

  const fallbackHost =
    process.env.NODE_ENV === 'development'
      ? `${process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'localhost'}:3000`
      : 'localhost:3000';
  const fallbackHostname = fallbackHost.split(':')[0]?.toLowerCase() ?? '';
  const fallbackProtocol = isLocalHostname(fallbackHostname) ? 'http' : 'https';

  return new URL(`${fallbackProtocol}://${fallbackHost}`);
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();

  return {
    metadataBase: resolveMetadataBaseHost(headerList),
    title: 'LaraTenant Commerce',
    description: 'Multi-tenant e-commerce platform',
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  
  // next-intl v4.x does not require setRequestLocale - removed per v4 requirements

  // Get messages for the current locale
  const messages = await getMessages();

  // Determine direction based on locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div lang={locale} dir={dir} className="min-h-full flex flex-col bg-background">
      <NuqsAdapter>
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </QueryProvider>
      </NuqsAdapter>
    </div>
  );
}
