'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import type { HeroBanner } from '@/lib/api/hero-banners';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Image, Palette } from 'lucide-react';

interface Props {
  banners:   HeroBanner[];
  isLoading: boolean;
  storeId:   string;
  onDelete:  (bannerId: string) => void;
  onRestore: (bannerId: string) => void;
}

export default function HeroBannersTable({
  banners,
  isLoading,
  storeId,
  onDelete,
  onRestore,
}: Props) {
  const t = useTranslations('heroBanners');

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t('table.empty')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">{t('table.position')}</TableHead>
            <TableHead className="w-16">{t('table.type')}</TableHead>
            <TableHead>{t('table.title')}</TableHead>
            <TableHead className="hidden md:table-cell">{t('table.cta')}</TableHead>
            <TableHead className="w-24">{t('table.status')}</TableHead>
            <TableHead className="text-right">{t('table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => {
            const enTranslation = banner.translations.find((tr) => tr.locale === 'en');
            const isDeleted = !!banner.deleted_at;

            return (
              <TableRow key={banner.id} className={isDeleted ? 'opacity-60' : ''}>

                {/* Position */}
                <TableCell className="font-mono text-sm">
                  {banner.position}
                </TableCell>

                {/* Visual Type */}
                <TableCell>
                  {banner.visual_type === 'image' ? (
                    <Image className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Palette className="h-4 w-4 text-muted-foreground" />
                  )}
                </TableCell>

                {/* Title */}
                <TableCell>
                  <div className="font-medium">
                    {enTranslation?.title || '—'}
                  </div>
                  {enTranslation?.subtitle && (
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {enTranslation.subtitle}
                    </div>
                  )}
                </TableCell>

                {/* CTA */}
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {enTranslation?.cta_text || '—'}
                </TableCell>

                {/* Status */}
                <TableCell>
                  {isDeleted ? (
                    <Badge variant="destructive" className="text-xs">
                      {t('status.deleted')}
                    </Badge>
                  ) : banner.is_active ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                      {t('status.active')}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {t('status.inactive')}
                    </Badge>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!isDeleted ? (
                      <>
                        <Link
                          href={ROUTES.merchant.heroBanners.edit(String(banner.id))}
                          className="inline-flex shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-transparent bg-clip-padding h-7 gap-1 px-2.5 text-[0.8rem] hover:bg-muted hover:text-foreground"
                        >
                          {t('table.edit')}
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2.5 text-[0.8rem] text-destructive hover:text-destructive"
                          onClick={() => onDelete(String(banner.id))}
                        >
                          {t('table.delete')}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-[0.8rem]"
                        onClick={() => onRestore(String(banner.id))}
                      >
                        {t('table.restore')}
                      </Button>
                    )}
                  </div>
                </TableCell>

              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
