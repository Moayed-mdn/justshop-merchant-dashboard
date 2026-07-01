import type { Theme, ThemeListItem, ThemeListItemView, ThemeView } from '@/types/theme';

type ThemeRouteSource =
  | Pick<Theme, 'slug'>
  | Pick<ThemeListItem, 'slug'>
  | Pick<ThemeView, 'slug'>
  | Pick<ThemeListItemView, 'slug'>
  | null
  | undefined;

/**
 * Merchant-facing theme routes are strict slug-only identifiers.
 */
export function getThemeRouteParam(theme: ThemeRouteSource): string {
  if (!theme?.slug) {
    return '';
  }

  return theme.slug;
}

export function matchesThemeIdentifier(
  theme: ThemeRouteSource,
  identifier: string | null | undefined
): boolean {
  if (!theme?.slug || !identifier) {
    return false;
  }

  return theme.slug === identifier;
}
