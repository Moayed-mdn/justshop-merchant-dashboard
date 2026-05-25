import { CreateStoreWizard } from '@/features/onboarding/components/CreateStoreWizard';

export default async function CreateStorePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-muted/30">
      <CreateStoreWizard />
    </div>
  );
}
