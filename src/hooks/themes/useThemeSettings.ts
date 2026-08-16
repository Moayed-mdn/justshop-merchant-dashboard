'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/config/routes';
import { queryKeys } from '@/lib/queryKeys';
import type { Theme, ColorScheme } from '@/types/theme';
import type { ApiError } from '@/types/api';

interface UpdateThemeSettingsPayload {
  settings: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      text?: string;
      textMuted?: string;
      border?: string;
      success?: string;
      error?: string;
      warning?: string;
    };
    color_schemes?: {
      [key: string]: ColorScheme;
    };
    fonts?: {
      heading?: string;
      body?: string;
    };
    typography?: {
      headingFont?: string;
      bodyFont?: string;
      headingWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
      bodyWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
      baseFontSize?: 'sm' | 'base' | 'lg';
      lineHeight?: 'tight' | 'normal' | 'relaxed';
      letterSpacing?: 'tight' | 'normal' | 'wide';
    };
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    direction?: 'ltr' | 'rtl';
    tagline?: string;
    buttons?: {
      primary?: ButtonSettings;
      secondary?: ButtonSettings;
      outline?: ButtonSettings;
    };
  };
}

export interface ButtonSettings {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  paddingX: 'sm' | 'md' | 'lg' | 'xl';
  paddingY: 'sm' | 'md' | 'lg';
  fontSize: 'sm' | 'base' | 'lg';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  hoverEffect: 'opacity' | 'darken' | 'lift' | 'scale';
}

export interface ColorSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  error: string;
  warning: string;
}

export interface TypographySettings {
  headingFont: string;
  bodyFont: string;
  headingWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  bodyWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  baseFontSize: 'sm' | 'base' | 'lg';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  letterSpacing: 'tight' | 'normal' | 'wide';
}

export function useUpdateThemeSettings(storeSlug: string, themeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<Theme, ApiError, UpdateThemeSettingsPayload>({
    mutationFn: async (payload: UpdateThemeSettingsPayload) => {
      const response = await apiClient.put<{ data: Theme }>(
        API_ROUTES.store(storeSlug).themes().updateSettings(themeSlug),
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeSlug).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.themes(storeSlug).detail(themeSlug),
      });
      queryClient.setQueryData(
        queryKeys.themes(storeSlug).detail(themeSlug),
        data
      );
    },
  });
}
