'use client';

import { CheckCircle2, ChevronRight, LayoutDashboard, Package, Palette } from 'lucide-react';
import { useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { useBootstrapStore } from '@/stores/bootstrapStore';

const SETUP_STEPS = [
  { num: 1, label: 'Verify email' },
  { num: 2, label: 'Create store' },
  { num: 3, label: 'Setup' },
] as const;

function SetupProgress() {
  return (
    <nav aria-label="Setup progress" className="mb-8 flex items-center justify-center gap-3">
      {SETUP_STEPS.map((step, idx) => (
        <span key={step.num} className="flex items-center gap-3">
          {idx > 0 && <span className="h-px w-6 bg-primary" />}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              step.num < 3
                ? 'bg-primary/10 text-primary'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {step.num < 3 ? (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <span>{step.num}</span>
            )}
            <span className="hidden sm:inline">{step.label}</span>
          </span>
        </span>
      ))}
    </nav>
  );
}

interface ActionCard {
  icon: typeof Package;
  title: string;
  description: string;
  href: string;
}

const ACTIONS: ActionCard[] = [
  {
    icon: Package,
    title: 'Add your first product',
    description: 'Start building your catalog with a product listing.',
    href: ROUTES.merchant.products.new(),
  },
  {
    icon: Palette,
    title: 'Customize your storefront',
    description: 'Choose a theme and style that fits your brand.',
    href: ROUTES.merchant.theme.overview(),
  },
  {
    icon: LayoutDashboard,
    title: 'Go to dashboard',
    description: 'View orders, manage products, and explore your workspace.',
    href: ROUTES.merchant.dashboard(),
  },
];

export function SetupCompleteStep() {
  const router = useRouter();
  const bootstrap = useBootstrapStore((state) => state.bootstrap);
  const storeName = bootstrap?.active_store?.name ?? bootstrap?.stores?.[0]?.name ?? 'your store';

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="mx-auto w-full max-w-lg space-y-8">
        <SetupProgress />

        {/* Celebration */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">{storeName} is ready!</h1>
          <p className="mx-auto max-w-sm text-muted-foreground">
            Your store has been set up and is ready for business. What would you like to do first?
          </p>
        </div>

        {/* Action cards */}
        <div className="space-y-3">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.href}
                type="button"
                onClick={() => router.push(action.href)}
                className="flex w-full items-center gap-4 rounded-xl border bg-card p-4 text-left shadow-sm transition hover:border-primary/40 hover:bg-accent"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Secondary link */}
        <p className="text-center text-sm text-muted-foreground">
          Or{' '}
          <button
            type="button"
            onClick={() => router.push(ROUTES.merchant.settings())}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            explore your store settings
          </button>
        </p>
      </div>
    </div>
  );
}
