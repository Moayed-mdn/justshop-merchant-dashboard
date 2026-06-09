'use client';

/**
 * Menu Items Tree Component.
 * Displays menu items in a hierarchical tree structure.
 * Supports add, edit, delete operations.
 * TODO: Add drag-and-drop reordering with @dnd-kit/core
 */

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MenuItemNode from './MenuItemNode';
import MenuItemDialog from './MenuItemDialog';
import type { NavigationMenuItemView } from '@/types/navigation';

interface Props {
  storeId: string;
  menuId: string;
  items: NavigationMenuItemView[];
}

export default function MenuItemsTree({ storeId, menuId, items }: Props) {
  const t = useTranslations('theme.navigation.items');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [parentIdForNew, setParentIdForNew] = useState<number | null>(null);

  const handleAddRootItem = () => {
    setParentIdForNew(null);
    setIsAddDialogOpen(true);
  };

  const handleAddChildItem = (parentId: number) => {
    setParentIdForNew(parentId);
    setIsAddDialogOpen(true);
  };

  if (!items || items.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
          <p className="mb-4 text-muted-foreground">{t('noItems')}</p>
          <Button onClick={handleAddRootItem} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {t('addFirst')}
          </Button>
        </div>

        <MenuItemDialog
          storeId={storeId}
          menuId={menuId}
          parentId={parentIdForNew}
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Root Item Button */}
      <Button onClick={handleAddRootItem} size="sm" variant="outline">
        <Plus className="mr-2 h-4 w-4" />
        {t('addItem')}
      </Button>

      {/* Menu Items List */}
      <div className="space-y-2">
        {items.map((item) => (
          <MenuItemNode
            key={item.id}
            item={item}
            storeId={storeId}
            menuId={menuId}
            onAddChild={handleAddChildItem}
          />
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <MenuItemDialog
        storeId={storeId}
        menuId={menuId}
        parentId={parentIdForNew}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
