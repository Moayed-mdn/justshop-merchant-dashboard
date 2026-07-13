'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useRouter } from '@/lib/navigation';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { useMutation } from '@tanstack/react-query';
import { deleteAccount } from '@/lib/api/profile';
import { logoutSession } from '@/lib/api/auth';
import { ROUTES } from '@/config/routes';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, Trash2, CheckCircle2 } from 'lucide-react';

/**
 * Profile Account Management Card.
 * Shows account status and dangerous actions like account deletion.
 */
export function ProfileAccountCard() {
  const t = useTranslations('settings');
  const tCommon = useTranslations();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [password, setPassword] = useState('');

  const deleteMutation = useMutation({
    mutationFn: (pwd: string) => deleteAccount(pwd),
    onSuccess: async () => {
      toast.success(t('profile.account.deleteSuccess'));
      setShowDeleteDialog(false);
      setPassword('');
      await logoutSession();
      router.push(ROUTES.auth.login());
    },
    onError: (error: any) => {
      logger.error('Account deletion failed', error);
      toast.error(error.message || t('profile.account.deleteError'));
    },
  });

  const handleDeleteAccount = () => {
    if (!password.trim()) {
      toast.error(t('profile.account.passwordRequired'));
      return;
    }
    deleteMutation.mutate(password);
  };

  return (
    <>
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <CardTitle>{t('profile.account.title')}</CardTitle>
          </div>
          <CardDescription>
            {t('profile.account.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Status */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t('profile.account.statusTitle')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('profile.account.statusDescription')}
                </p>
              </div>
              <Badge variant="default">
                <CheckCircle2 className="me-1 h-3 w-3" />
                {t('profile.account.statusActive')}
              </Badge>
            </div>
          </div>

          {/* Connected Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">{t('profile.account.connectedServices')}</h4>
            
            {/* Password Status */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t('profile.account.passwordAuth')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('profile.account.passwordAuthDesc')}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">
                <CheckCircle2 className="me-1 h-3 w-3" />
                {t('profile.account.enabled')}
              </Badge>
            </div>

            {/* Google Status - Commented out: has_google_linked not available in BootstrapUser */}
            {/* 
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
            */}
          </div>

          {/* Danger Zone */}
          <div className="space-y-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4">
            <div>
              <h4 className="text-sm font-medium text-destructive">{t('profile.account.dangerZone')}</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('profile.account.dangerZoneDesc')}
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setPassword('');
                setShowDeleteDialog(true);
              }}
            >
              <Trash2 className="me-2 h-4 w-4" />
              {t('profile.account.deleteAccountButton')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('profile.account.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p>
                    {t('profile.account.deleteConfirmWarning')}
                  </p>
                  <p className="text-sm font-medium">{t('profile.account.deleteIncludesTitle')}</p>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    <li>{t('profile.account.deleteIncludesStores')}</li>
                    <li>{t('profile.account.deleteIncludesProducts')}</li>
                    <li>{t('profile.account.deleteIncludesBilling')}</li>
                    <li>{t('profile.account.deleteIncludesThemes')}</li>
                  </ul>
                  <div className="mt-3 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm font-medium text-destructive">
                    {t('profile.account.deleteIrreversible')}
                  </div>
                </div>
                
                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="delete-password">{t('profile.account.enterPassword') || 'Enter your password to confirm'}</Label>
                  <Input
                    id="delete-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('profile.account.passwordPlaceholder') || 'Your password'}
                    autoFocus
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPassword('')}>
              {t('profile.account.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending 
                ? tCommon('loading') 
                : t('profile.account.deleteConfirmButton')
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
