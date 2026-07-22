'use client';
// Reason: wizard with client state + mutations

/**
 * Create product page entry point.
 *
 * Thin wrapper — wires CreateProductWizard to:
 * - storeSlug from page props
 * - available locales (defaults to ['en', 'ar'] matching the app config)
 * - onSuccess redirect to the edit page
 */

import { useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { CreateProductWizard } from '@/features/products/creation/CreateProductWizard';

interface Props {
  storeSlug: string;
}

// Locales supported by the admin editor.
// Must match config('content.editable_locales') on the backend.
const EDITOR_LOCALES = ['en', 'ar'];

export default function CreateProductForm({ storeSlug }: Props) {
  const router = useRouter();

  return (
    <CreateProductWizard
      storeSlug={storeSlug}
      availableLocales={EDITOR_LOCALES}
      onSuccess={(productId) => {
        router.push(ROUTES.merchant.products.edit(String(productId)));
      }}
    />
  );
}
