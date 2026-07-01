'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useShippingMethods, useDeleteShippingMethod } from '@/hooks/shipping/useShippingMethods';
import { ShippingMethodDialog } from './ShippingMethodDialog';
import type { ShippingMethod } from '@/types/shipping';

interface ShippingMethodsListProps {
  storeSlug: string;
}

export function ShippingMethodsList({ storeSlug }: ShippingMethodsListProps) {
  const t = useTranslations('shipping');
  const { data: methods, isLoading } = useShippingMethods(storeSlug);
  const deleteMutation = useDeleteShippingMethod(storeSlug);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [deletingMethod, setDeletingMethod] = useState<ShippingMethod | null>(null);

  const handleEdit = (method: ShippingMethod) => {
    setEditingMethod(method);
    setDialogOpen(true);
  };

  const handleDelete = (method: ShippingMethod) => {
    setDeletingMethod(method);
  };

  const confirmDelete = () => {
    if (deletingMethod) {
      deleteMutation.mutate(deletingMethod.id.toString());
      setDeletingMethod(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingMethod(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">{t('common.loading')}</div>
        </CardContent>
      </Card>
    );
  }

  const isEmpty = !methods || methods.length === 0;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('methods.title')}</CardTitle>
              <CardDescription>{t('methods.subtitle')}</CardDescription>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('methods.addNew')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('methods.empty')}</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                {t('methods.emptyDescription')}
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('methods.addNew')}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('methods.table.name')}</TableHead>
                  <TableHead>{t('methods.table.price')}</TableHead>
                  <TableHead>{t('methods.table.delivery')}</TableHead>
                  <TableHead>{t('methods.table.status')}</TableHead>
                  <TableHead className="text-right">{t('methods.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methods.map((method) => (
                  <TableRow key={method.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{method.name}</div>
                        {method.description && (
                          <div className="text-sm text-muted-foreground">{method.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{method.formatted_price}</TableCell>
                    <TableCell>{method.delivery_estimate}</TableCell>
                    <TableCell>
                      <Badge variant={method.is_active ? 'default' : 'secondary'}>
                        {method.is_active ? t('methods.status.active') : t('methods.status.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(method)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(method)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ShippingMethodDialog
        storeSlug={storeSlug}
        method={editingMethod}
        open={dialogOpen}
        onOpenChange={handleDialogClose}
      />

      <AlertDialog open={!!deletingMethod} onOpenChange={() => setDeletingMethod(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('methods.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('methods.confirmDeleteDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
