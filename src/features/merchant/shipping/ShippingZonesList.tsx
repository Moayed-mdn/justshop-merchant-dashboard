'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
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
import { useShippingZones, useDeleteShippingZone } from '@/hooks/shipping/useShippingZones';
import { ShippingZoneDialog } from './ShippingZoneDialog';
import type { ShippingZone } from '@/types/shipping';

interface ShippingZonesListProps {
  storeSlug: string;
}

export function ShippingZonesList({ storeSlug }: ShippingZonesListProps) {
  const t = useTranslations('shipping');
  const { data: zones, isLoading } = useShippingZones(storeSlug);
  const deleteMutation = useDeleteShippingZone(storeSlug);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [deletingZone, setDeletingZone] = useState<ShippingZone | null>(null);

  const handleEdit = (zone: ShippingZone) => {
    setEditingZone(zone);
    setDialogOpen(true);
  };

  const handleDelete = (zone: ShippingZone) => {
    setDeletingZone(zone);
  };

  const confirmDelete = () => {
    if (deletingZone) {
      deleteMutation.mutate(deletingZone.id.toString());
      setDeletingZone(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingZone(null);
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

  const isEmpty = !zones || zones.length === 0;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('zones.title')}</CardTitle>
              <CardDescription>{t('zones.subtitle')}</CardDescription>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('zones.addNew')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('zones.empty')}</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                {t('zones.emptyDescription')}
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('zones.addNew')}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('zones.table.name')}</TableHead>
                  <TableHead>{t('zones.table.countries')}</TableHead>
                  <TableHead>{t('zones.table.methods')}</TableHead>
                  <TableHead>{t('zones.table.status')}</TableHead>
                  <TableHead className="text-right">{t('zones.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.map((zone) => (
                  <TableRow key={zone.id}>
                    <TableCell className="font-medium">{zone.name}</TableCell>
                    <TableCell>
                      {t('zones.countryCount', { count: zone.country_count })}
                    </TableCell>
                    <TableCell>
                      {zone.methods_with_pricing 
                        ? t('zones.methodCount', { count: zone.methods_with_pricing.length })
                        : t('zones.methodCount', { count: 0 })
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={zone.is_active ? 'default' : 'secondary'}>
                        {zone.is_active ? t('methods.status.active') : t('methods.status.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(zone)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(zone)}
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

      <ShippingZoneDialog
        storeSlug={storeSlug}
        zone={editingZone}
        open={dialogOpen}
        onOpenChange={handleDialogClose}
      />

      <AlertDialog open={!!deletingZone} onOpenChange={() => setDeletingZone(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('zones.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('zones.confirmDeleteDescription')}</AlertDialogDescription>
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
