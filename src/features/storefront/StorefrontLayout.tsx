'use client';

import { useRuntimeNavigation, useRuntimeTheme } from '@/hooks/runtime';

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  useRuntimeNavigation();
  const { data: theme } = useRuntimeTheme();

  const themeVars = theme?.tokens
    ? {
        '--color-primary': theme.tokens.colorPrimary,
        '--color-secondary': theme.tokens.colorSecondary,
        '--color-accent': theme.tokens.colorAccent,
        '--color-surface': theme.tokens.colorSurface,
        '--color-text': theme.tokens.colorText,
        '--font-body': theme.tokens.fontBody,
        '--font-heading': theme.tokens.fontHeading,
      } as React.CSSProperties
    : undefined;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={themeVars}
    >
      {children}
    </div>
  );
}
