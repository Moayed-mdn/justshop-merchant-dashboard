/**
 * Edit product page content (async RSC).
 * Fetches product data and renders the edit form.
 */

import { serverFetch } from '@/lib/api/server';
import { API_ROUTES } from '@/config/routes';
import type { ApiResponse } from '@/types/api';
import type { AdminProduct } from '@/types/product';
import { mapProductDetail } from '@/lib/mappers/products';
import { logger } from '@/lib/logger';
import { getTranslations } from 'next-intl/server';
import EditProductForm from './EditProductForm';

interface Props {
  storeSlug: string;
  productId: string;
}

export default async function EditProductContent({ storeSlug, productId }: Props) {
  const t = await getTranslations('products');

  try {
    const response = await serverFetch<ApiResponse<AdminProduct>>(
      API_ROUTES.store(storeSlug).products().detail(productId)
    );

    const product = mapProductDetail(response.data, storeSlug);

    return <EditProductForm product={product} storeSlug={storeSlug} />;
  } catch (error) {
    logger.error('Failed to load product detail', error);

    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
        <p className="text-destructive">{t('table.empty')}</p>
      </div>
    );
  }
}
