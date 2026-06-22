'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { ShieldAlert, Trash2, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Profile Account Management Card.
 * Shows account status and dangerous actions like account deletion.
 */
export function ProfileAccountCard() {
  const t = useTranslations('settings.profile.account');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const user = useBootstrapStore((state) => state.user);

  // Note: Account deletion would require implementing the backend endpoint properly
  // and handling the logout flow. For now, we'll show the UI structure.
  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with password confirmation
    // This would call the deleteAccount API and then logout
    console.log('Account deletion requested');
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <CardTitle>{t('title')}</CardTitle>
          </div>
          <CardDescription>
            {t('subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Status */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t('statusTitle')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('statusDescription')}
                </p>
              </div>
              <Badge variant="default">
                <CheckCircle2 className="me-1 h-3 w-3" />
                {t('statusActive')}
              </Badge>
            </div>
          </div>

          {/* Connected Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">{t('connectedServices')}</h4>
            
            {/* Password Status */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t('passwordAuth')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('passwordAuthDesc')}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">
                <CheckCircle2 className="me-1 h-3 w-3" />
                {t('enabled')}
              </Badge>
            </div>

            {/* Google Status - placeholder */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t('googleAccount')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('googleAccountDesc')}
                  </p>
                </div>
              </div>
              <Badge variant="outline">
                <XCircle className="me-1 h-3 w-3" />
                {t('notConnected')}
              </Badge>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4">
            <div>
              <h4 className="text-sm font-medium text-destructive">{t('dangerZone')}</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('dangerZoneDesc')}
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="me-2 h-4 w-4" />
              {t('deleteAccountButton')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                {t('deleteConfirmWarning')}
              </p>
              <p className="text-sm font-medium">{t('deleteIncludesTitle')}</p>
              <ul className="list-inside list-disc space-y-1 text-sm">
                <li>{t('deleteIncludesStores')}</li>
                <li>{t('deleteIncludesProducts')}</li>
                <li>{t('deleteIncludesBilling')}</li>
                <li>{t('deleteIncludesThemes')}</li>
              </ul>
              <p className="mt-3 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {t('deleteIrreversible')}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('deleteConfirmButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
