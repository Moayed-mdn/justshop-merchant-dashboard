'use client';

import { useRouter } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';

interface LocaleErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleErrorPage({ error, reset }: LocaleErrorPageProps) {
  const router = useRouter();
  void error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-xl rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">
          The dashboard hit an unexpected problem, but your session and routing state can still be recovered safely.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Retry first. If the problem continues, reopen a safe route and refresh bootstrap from there.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={reset}>
            Retry
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(ROUTES.dashboard.home())}>
            Dashboard home
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(ROUTES.auth.login())}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
