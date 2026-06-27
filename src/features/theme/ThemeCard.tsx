'use client';

/**
 * Theme card component.
 * Displays single theme with status badge and actions.
 */

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import {
  usePublishTheme,
  useDeleteTheme,
} from '@/hooks/themes/useThemeMutations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
import { MoreVertical, Check, Copy, Trash2, Sparkles, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from '@/lib/navigation';
import { DuplicateThemeDialog } from './DuplicateThemeDialog';
import { ROUTES } from '@/config/routes';
import type { ThemeListItemView } from '@/types/theme';

interface ThemeCardProps {
  theme: ThemeListItemView;
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  const activeStoreId = activeStore ? String(activeStore.id) : null;

  const publishMutation = usePublishTheme(activeStoreId!);
  const deleteMutation = useDeleteTheme(activeStoreId!);

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(theme.id.toString());
      toast.success(t('common.theme.publishSuccess'));
    } catch (error) {
      toast.error(t('common.theme.publishError'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(theme.id.toString());
      toast.success(t('common.theme.deleteSuccess'));
    } catch (error) {
      toast.error(t('common.theme.deleteError'));
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleCustomize = () => {
    router.push(ROUTES.merchant.theme.settings(theme.id.toString()));
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="relative pb-0">
          {/* Status Badges */}
          <div className="flex items-center gap-2 mb-3">
            {theme.isActive && (
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                {t('common.theme.active')}
              </Badge>
            )}
            {theme.isPublished ? (
              <Badge variant="secondary">
                {t('common.theme.published')}
              </Badge>
            ) : (
              <Badge variant="outline">{t('common.theme.draft')}</Badge>
            )}
          </div>

          {/* Actions Menu */}
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 hover:bg-accent hover:text-accent-foreground"
                aria-label={t('common.actions')}
              >
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!theme.isActive && (
                  <>
                    <DropdownMenuItem onClick={handlePublish}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t('common.theme.publish')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => setShowDuplicateDialog(true)}>
                  <Copy className="mr-2 h-4 w-4" />
                  {t('common.theme.duplicate')}
                </DropdownMenuItem>
                {!theme.isActive && (
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('common.delete')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Theme Preview Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center text-muted-foreground text-sm">
              {t('common.theme.preview')}
            </div>
          </div>

          {/* Theme Info */}
          <div>
            <h3 className="font-semibold text-lg mb-1">{theme.name}</h3>
            {theme.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {theme.description}
              </p>
            )}
            {theme.sectionsCount !== undefined && (
              <p className="text-xs text-muted-foreground mt-2">
                {theme.sectionsCount} {t('common.theme.sections')}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            className="w-full"
            variant={theme.isActive ? "outline" : "default"}
            onClick={handleCustomize}
          >
            <Palette className="mr-2 h-4 w-4" />
            {t('common.theme.customize')}
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.theme.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('common.theme.deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Duplicate Dialog */}
      {showDuplicateDialog && (
        <DuplicateThemeDialog
          theme={theme}
          onClose={() => setShowDuplicateDialog(false)}
        />
      )}
    </>
  );
}
