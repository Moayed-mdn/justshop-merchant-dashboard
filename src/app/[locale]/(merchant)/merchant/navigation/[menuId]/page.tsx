'use client';

import { use } from 'react';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import NavigationMenuEditor from '@/features/theme/navigation/NavigationMenuEditor';
import { useTranslations } from 'next-intl';
import { getStoreRouteParam } from '@/lib/stores/route-param';

interface Props {
  params: Promise<{
    menuId: string;
  }>;
}

/**
 * Navigation Menu Editor Page.
 * Displays the menu editor with drag-and-drop tree for the selected menu.
 */
export default function NavigationMenuEditorPage({ params }: Props) {
  const { menuId } = use(params);
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('theme.navigation');

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('editor.title')}</h1>
        </div>
        <WorkspaceEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NavigationMenuEditor 
        storeSlug={getStoreRouteParam(activeStore)} 
        menuId={menuId}
      />
    </div>
  );
}
