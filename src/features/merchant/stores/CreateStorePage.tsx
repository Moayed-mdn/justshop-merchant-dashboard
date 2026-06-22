'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { CreateStoreStep } from '@/features/setup/components/CreateStoreStep';
import { WorkspaceProvisioningView } from '../components/WorkspaceProvisioningView';
import { UpgradePromptDialog } from '@/components/billing';
import { canCreateStore } from '@/lib/billing/store-guard';
import { useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Store } from 'lucide-react';
import Link from 'next/link';

/**
 * Create Store Page for the Merchant Workspace.
 * Handles creating additional stores for an existing merchant.
 */
export function CreateStorePage() {
  const t = useTranslations('stores.create');
  const router = useRouter();
  const stores = useBootstrapStore((state) => state.stores);
  const [showProvisioning, setShowProvisioning] = useState(false);
  const [quotaCheck, setQuotaCheck] = useState<{
    allowed: boolean;
    reason?: string;
    currentCount?: number;
    limit?: number;
  } | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  useEffect(() => {
    // If merchant has zero stores, they belong in the /setup flow
    if (stores.length === 0) {
      router.push(ROUTES.setup());
    }
  }, [router, stores.length]);

  useEffect(() => {
    async function checkQuota() {
      if (stores.length === 0) return;
      
      const result = await canCreateStore();
      setQuotaCheck(result);

      if (!result.allowed) {
        setShowUpgradeDialog(true);
      }
    }

    checkQuota();
  }, [stores.length]);

  if (stores.length === 0) {
    return null; // Redirecting
  }

  if (showProvisioning) {
    return <WorkspaceProvisioningView />;
  }

  if (!quotaCheck) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">{t('checkingLimits')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quotaCheck.allowed) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <CardTitle>{t('limitReachedTitle')}</CardTitle>
                <CardDescription>
                  {t('limitReachedDescription')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{t('currentUsage')}</p>
                  <p className="text-2xl font-bold">
                    {quotaCheck.currentCount || 0} / {quotaCheck.limit || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('storesCreated')}</p>
                </div>
                <Store className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {t('upgradePrompt')}
            </p>

            <div className="flex gap-2">
              <Button asChild>
                <Link href={ROUTES.merchant.billing.plans()}>{t('viewPlans')}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={ROUTES.merchant.stores.list()}>{t('backToStores')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <UpgradePromptDialog
          open={showUpgradeDialog}
          onOpenChange={setShowUpgradeDialog}
          limitType="stores"
          currentPlan="Current Plan"
          requiredPlan="Higher Plan"
          currentCount={quotaCheck.currentCount || 0}
          limit={quotaCheck.limit || 0}
        />
      </div>
    );
  }

  return (
    <div className="workspace-create-store-page">
      {/* 
        We reuse CreateStoreStep. 
        Note: It has some internal min-h-screen styling that we might 
        want to override in the future, but for now we follow the 
        instruction not to modify the component itself.
      */}
      <CreateStoreStep onSuccess={() => setShowProvisioning(true)} />
    </div>
  );
}
