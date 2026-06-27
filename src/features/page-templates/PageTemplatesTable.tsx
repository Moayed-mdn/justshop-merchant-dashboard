'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { MoreVertical, Copy, Trash2, Edit } from 'lucide-react';
import { DuplicatePageTemplateDialog } from './DuplicatePageTemplateDialog';
import { useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import type { PageTemplateView } from '@/types/theme';

interface PageTemplatesTableProps {
  templates: PageTemplateView[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  deletingId: string | null;
  onConfirmDelete: (id: string) => void;
  onCloseDelete: () => void;
  isDeleting: boolean;
}

export function PageTemplatesTable({
  templates,
  isLoading,
  error,
  onDelete,
  deletingId,
  onConfirmDelete,
  onCloseDelete,
  isDeleting,
}: PageTemplatesTableProps) {
  const t = useTranslations();
  const router = useRouter();
  const [showDuplicateDialog, setShowDuplicateDialog] = useState<PageTemplateView | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">{t('error')}: {error}</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">
          {t('theme.templates.noTemplates')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('theme.templates.table.name')}</TableHead>
              <TableHead>{t('theme.templates.table.type')}</TableHead>
              <TableHead>{t('theme.templates.table.handle')}</TableHead>
              <TableHead>{t('theme.templates.table.sections')}</TableHead>
              <TableHead>{t('theme.templates.table.default')}</TableHead>
              <TableHead>{t('theme.templates.table.pagesCount')}</TableHead>
              <TableHead className="text-right">{t('theme.templates.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs capitalize">
                    {template.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm font-mono">
                  {template.handle}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {Object.keys(template.sections).length}
                </TableCell>
                <TableCell>
                  {template.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      {t('theme.templates.default')}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {template.pagesCount}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 hover:bg-accent hover:text-accent-foreground"
                      aria-label={t('theme.templates.table.actions')}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(ROUTES.merchant.templates.edit(template.id.toString()))}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t('theme.templates.table.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowDuplicateDialog(template)}>
                        <Copy className="mr-2 h-4 w-4" />
                        {t('theme.duplicate')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(template.id.toString())}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => { if (!open) onCloseDelete(); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('theme.templates.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('theme.templates.deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && onConfirmDelete(deletingId)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t('loading') : t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Duplicate Dialog */}
      {showDuplicateDialog && (
        <DuplicatePageTemplateDialog
          template={showDuplicateDialog}
          onClose={() => setShowDuplicateDialog(null)}
        />
      )}
    </>
  );
}
