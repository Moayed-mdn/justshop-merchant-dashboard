'use client';

import { use, useEffect } from 'react';
import { useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { Loader2 } from 'lucide-react';

/**
 * Legacy Route Redirect: /merchant/hero-banners/[id]
 * Redirects to: /merchant/hero-banners/[id]/edit
 * 
 * This maintains backward compatibility for old bookmarks/links
 * that used the combined detail/edit pattern.
 */
export default function LegacyHeroBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.merchant.heroBanners.edit(id));
  }, [id, router]);

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Redirecting...</h2>
        <p className="text-sm text-muted-foreground">
          Taking you to the edit page...
        </p>
      </div>
    </div>
  );
}
