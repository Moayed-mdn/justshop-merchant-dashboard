'use client';

/**
 * Resource Picker Component
 * 
 * Smart picker for selecting pages, categories, or products to link in navigation.
 * Shows search, filtered list, and preview of selected resource.
 */

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Search, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  useNavigationPages,
  useNavigationCategories,
  useNavigationProducts,
} from '@/hooks/navigation/useNavigationResources';
import type { NavigationMenuItem } from '@/types/navigation';
import { cn } from '@/lib/utils';

interface Props {
  storeId: string;
  type: 'page' | 'category' | 'product';
  selectedId: number | null;
  onSelect: (resource: {
    id: number;
    label: { en: string; ar: string };
    url: string;
    resourceType: string;
  }) => void;
}

export default function ResourcePicker({ storeId, type, selectedId, onSelect }: Props) {
  const locale = useLocale();
  const t = useTranslations('theme.navigation.resourcePicker');
  const [search, setSearch] = useState('');

  // Fetch resources based on type
  const { data: pages, isLoading: loadingPages } = useNavigationPages(
    storeId,
    type === 'page' ? search : undefined
  );
  const { data: categories, isLoading: loadingCategories } = useNavigationCategories(
    storeId,
    type === 'category' ? search : undefined
  );
  const { data: products, isLoading: loadingProducts } = useNavigationProducts(
    storeId,
    type === 'product' ? search : undefined
  );

  // Get data and loading state based on type
  const resourceData = type === 'page' 
    ? pages 
    : type === 'category' 
    ? categories 
    : products;
  
  const isLoading = type === 'page' 
    ? loadingPages 
    : type === 'category' 
    ? loadingCategories 
    : loadingProducts;

  // Get resource type class name
  const getResourceTypeClass = () => {
    return `App\\Models\\${type === 'page' ? 'Cms\\Marketing\\Store\\StoreMarketingPage' : type === 'category' ? 'Category' : 'Product'}`;
  };

  // Handle resource selection
  const handleSelect = (resource: any) => {
    const label = type === 'page'
      ? resource.title
      : type === 'category'
      ? resource.name
      : resource.name;

    onSelect({
      id: resource.id,
      label: label,
      url: resource.url,
      resourceType: getResourceTypeClass(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!resourceData || resourceData.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {t('noResources', { type: t(`type.${type}`) })}
        </p>
        <Button variant="link" size="sm" className="mt-2">
          <ExternalLink className="mr-2 h-4 w-4" />
          {t('createNew', { type: t(`type.${type}`) })}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder', { type: t(`type.${type}`) })}
          className="pl-9"
        />
      </div>

      {/* Resource List */}
      <ScrollArea className="h-[300px] rounded-lg border">
        <div className="p-2 space-y-1">
          {resourceData.map((resource: any) => {
            const isSelected = resource.id === selectedId;
            const displayLabel = locale === 'ar'
              ? (type === 'page' ? resource.title.ar : resource.name?.ar) || 
                (type === 'page' ? resource.title.en : resource.name?.en)
              : (type === 'page' ? resource.title.en : resource.name?.en);

            return (
              <button
                key={resource.id}
                onClick={() => handleSelect(resource)}
                className={cn(
                  'w-full rounded-md p-3 text-left transition-colors',
                  'hover:bg-accent',
                  isSelected && 'bg-primary/10 ring-2 ring-primary'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {displayLabel}
                      </p>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {resource.url}
                    </p>
                    {type === 'page' && resource.status && (
                      <Badge
                        variant={resource.status === 'published' ? 'default' : 'secondary'}
                        className="mt-1 text-xs"
                      >
                        {resource.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Selected Resource Preview */}
      {selectedId && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-900">
                {t('selected')}
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                {resourceData.find((r: any) => r.id === selectedId)?.url}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        {t('helpText', { type: t(`type.${type}`) })}
      </p>
    </div>
  );
}

