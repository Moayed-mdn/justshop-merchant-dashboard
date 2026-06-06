'use client';

/**
 * Menu Item Node Component.
 * Displays a single menu item with nested children.
 */

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { useDeleteMenuItem } from '@/hooks/navigation/useNavigationMenuMutations';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import MenuItemDialog from './MenuItemDialog';
import type { NavigationMenuItemView } from '@/types/navigation';

interface Props {
  item: NavigationMenuItemView;
  storeId: string;
  menuId: string;
  onAddChild: (parentId: number) => void;
  level?: number;
}

export default function MenuItemNode({
  item,
  storeId,
  menuId,
  onAddChild,
  level = 0,
}: Props) {
  const t = useTranslations('theme.navigation.items');
  const locale = useLocale();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deleteMutation = useDeleteMenuItem(storeId, menuId);

  const hasChildren = item.children && item.children.length > 0;
  const label = item.label[locale] || item.label['en'] || Object.values(item.label)[0];

  const handleDelete = () => {
    if (confirm(t('deleteConfirm'))) {
      deleteMutation.mutate(String(item.id), {
        onSuccess: () => {
          toast.success(t('deleteSuccess'));
        },
        onError: (err: any) => {
          logger.error('Failed to delete menu item', { error: err });
          toast.error(err?.message ?? t('deleteError'));
        },
      });
    }
  };

  return (
    <div className="space-y-2">
      {/* Item Row */}
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border p-3',
          !item.isEnabled && 'opacity-50',
        )}
        style={{ marginLeft: `${level * 24}px` }}
      >
        {/* Expand/Collapse */}
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Label */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{label}</span>
            {!item.isEnabled && (
              <Badge variant="secondary" className="text-xs">
                {t('disabled')}
              </Badge>
            )}
            {item.target === '_blank' && (
              <Badge variant="outline" className="text-xs">
                {t('newTab')}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{item.url}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddChild(item.id)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="space-y-2">
          {item.children!.map((child) => (
            <MenuItemNode
              key={child.id}
              item={child}
              storeId={storeId}
              menuId={menuId}
              onAddChild={onAddChild}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <MenuItemDialog
        storeId={storeId}
        menuId={menuId}
        item={item}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
}
