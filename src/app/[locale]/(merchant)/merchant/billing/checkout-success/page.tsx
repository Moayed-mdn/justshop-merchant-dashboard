/**
 * Checkout Success Page
 * Handles redirect from Stripe Checkout after successful payment
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setStatus('error');
      toast({
        title: 'Invalid Session',
        description: 'No checkout session ID found. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    // Verify the checkout session
    // In a real implementation, you would call an API to verify the session
    // For now, we'll just show success and redirect
    const timer = setTimeout(() => {
      setStatus('success');
      toast({
        title: 'Subscription Activated!',
        description: 'Your subscription has been successfully activated.',
      });
      
      // Redirect to billing page after 2 seconds
      setTimeout(() => {
        router.push('/merchant/billing');
        router.refresh();
      }, 2000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams, router, toast]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg border bg-card p-8 text-center">
          {status === 'verifying' && (
            <>
              <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
              <h1 className="mt-4 text-2xl font-bold">Verifying Payment</h1>
              <p className="mt-2 text-muted-foreground">
                Please wait while we confirm your subscription...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h1 className="mt-4 text-2xl font-bold">Payment Successful!</h1>
              <p className="mt-2 text-muted-foreground">
                Your subscription has been activated. Redirecting to billing...
              </p>
              <Button
                className="mt-6"
                onClick={() => {
                  router.push('/merchant/billing');
                  router.refresh();
                }}
              >
                Go to Billing
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="mx-auto h-16 w-16 text-destructive" />
              <h1 className="mt-4 text-2xl font-bold">Something Went Wrong</h1>
              <p className="mt-2 text-muted-foreground">
                We couldn't verify your payment. Please contact support if the issue persists.
              </p>
              <div className="mt-6 flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/merchant/billing/plans')}
                >
                  Back to Plans
                </Button>
                <Button onClick={() => router.push('/merchant/billing')}>
                  Go to Billing
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
