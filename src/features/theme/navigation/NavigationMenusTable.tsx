'use client';

/**
 * Navigation Menus table component.
 * Displays list of navigation menus with edit/delete actions.
 */

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { Edit, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { NavigationMenuListItemView } from '@/types/navigation';
import type { PaginationMeta } from '@/types/api';

interface Props {
  menus: NavigationMenuListItemView[];
  pagination?: PaginationMeta;
  page: number;
  onPageChange: (page: number) => void;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  isLoading: boolean;
  onDelete: (menuId: string) => void;
}

export default function NavigationMenusTable({
  menus,
  pagination,
  page,
  onPageChange,
  isLoading,
  onDelete,
}: Props) {
  const t = useTranslations('theme.navigation');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!menus || menus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-muted-foreground">{t('noMenus')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.name')}</TableHead>
              <TableHead>{t('table.handle')}</TableHead>
              <TableHead>{t('table.description')}</TableHead>
              <TableHead className="text-center">{t('table.itemsCount')}</TableHead>
              <TableHead className="text-right">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus.map((menu) => (
              <TableRow key={menu.id}>
                <TableCell className="font-medium">{menu.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{menu.handle}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {menu.description || '—'}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{menu.itemsCount}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={ROUTES.merchant.navigation.edit(String(menu.id))}
                      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                    >
                      <Edit className="h-4 w-4" />
                      {t('table.edit')}
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(String(menu.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                      {t('table.delete')}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('pagination.showing', {
              from: (page - 1) * pagination.per_page + 1,
              to: Math.min(page * pagination.per_page, pagination.total),
              total: pagination.total,
            })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              {t('pagination.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === pagination.total_pages}
            >
              {t('pagination.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
