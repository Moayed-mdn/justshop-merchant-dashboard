import MerchantCustomerDetailContent from '@/features/dashboard/users/MerchantCustomerDetailContent';

/**
 * Merchant Workspace — Customer Detail Page (Server Component).
 * Canonical route: /merchant/customers/[id]
 */
export default function MerchantCustomerDetailPage() {
  return (
    <div className="space-y-6">
      <MerchantCustomerDetailContent />
    </div>
  );
}
