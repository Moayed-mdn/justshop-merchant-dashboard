'use client';

import { MerchantPageHeader } from '@/features/merchant/components/MerchantPageHeader';
import { ProfileAvatarCard } from '@/features/merchant/settings/ProfileAvatarCard';
import { ProfileInfoCard } from '@/features/merchant/settings/ProfileInfoCard';
import { ProfilePasswordCard } from '@/features/merchant/settings/ProfilePasswordCard';
import { ProfileAccountCard } from '@/features/merchant/settings/ProfileAccountCard';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';

/**
 * Account Profile Settings Page.
 * Personal account settings accessible from the user menu (Shopify pattern).
 * Separate from merchant/store settings.
 */
export default function AccountProfilePage() {
  const t = useTranslations('settings.profile');

  return (
    <div className="space-y-8">
      <MerchantPageHeader
        title={t('title')}
        description={t('subtitle')}
      />

      {/* Profile Picture Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t('avatar.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('avatar.subtitle')}
          </p>
        </div>
        <ProfileAvatarCard />
      </div>

      <Separator />

      {/* Personal Information Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t('info.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('info.subtitle')}
          </p>
        </div>
        <ProfileInfoCard />
      </div>

      <Separator />

      {/* Change Password Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t('password.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('password.subtitle')}
          </p>
        </div>
        <ProfilePasswordCard />
      </div>

      <Separator />

      {/* Account Status & Connected Services Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t('account.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('account.subtitle')}
          </p>
        </div>
        <ProfileAccountCard />
      </div>
    </div>
  );
}
