'use client';

/**
 * Asset grid component.
 * Displays assets in a responsive grid layout.
 */

import { AssetCard } from './AssetCard';
import type { StoreAssetView } from '@/types/asset';

interface AssetGridProps {
  assets: StoreAssetView[];
}

export function AssetGrid({ assets }: AssetGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
}
