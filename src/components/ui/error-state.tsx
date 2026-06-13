import { ReactNode } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { AlertCircle, WifiOff, ServerCrash, ShieldAlert } from 'lucide-react';

interface ErrorStateProps {
  type?: 'generic' | 'network' | 'server' | 'auth' | 'notfound';
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
}

const ERROR_CONFIGS = {
  generic: {
    icon: <AlertCircle className="h-12 w-12 text-destructive" />,
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
  network: {
    icon: <WifiOff className="h-12 w-12 text-muted-foreground" />,
    title: 'No internet connection',
    message: 'Please check your network connection and try again.',
  },
  server: {
    icon: <ServerCrash className="h-12 w-12 text-destructive" />,
    title: 'Server error',
    message: 'Our servers are having trouble. Please try again in a moment.',
  },
  auth: {
    icon: <ShieldAlert className="h-12 w-12 text-destructive" />,
    title: 'Authentication required',
    message: 'Your session has expired. Please sign in again.',
  },
  notfound: {
    icon: <AlertCircle className="h-12 w-12 text-muted-foreground" />,
    title: 'Not found',
    message: 'The resource you\'re looking for doesn\'t exist or has been removed.',
  },
};

/**
 * Production-ready error state component.
 * Provides clear, actionable feedback when something goes wrong.
 * Never exposes raw API errors to users.
 */
export function ErrorState({
  type = 'generic',
  title,
  message,
  onRetry,
  onBack,
  className,
}: ErrorStateProps) {
  const config = ERROR_CONFIGS[type];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border bg-card p-12 text-center',
        className
      )}
      role="alert"
    >
      <div className="mb-4">{config.icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title || config.title}</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        {message || config.message}
      </p>
      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry}>Try again</Button>
        )}
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Go back
          </Button>
        )}
        {!onRetry && !onBack && type === 'auth' && (
          <Button onClick={() => window.location.href = '/login'}>
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Inline error message for form fields or smaller contexts
 */
export function InlineError({ message, className }: { message: string; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive',
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <p>{message}</p>
    </div>
  );
}
