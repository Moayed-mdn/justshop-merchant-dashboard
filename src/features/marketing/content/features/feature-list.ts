// =============================================================================
// Features Page — Core Feature Grid Content
//
// Feature list for the dedicated /features marketing page.
// Strings are localized at the page level while this file owns structural ids
// and visual icon choices.
// =============================================================================

import type { FeatureItem } from '@/features/marketing/types'

const FEATURE_IDS = [
  'product-management',
  'inventory',
  'variants',
  'multilingual-commerce',
  'analytics',
  'orders',
  'customer-management',
  'payments',
  'seo',
  'storefront-customization',
  'media-management',
  'permissions',
] as const

const FEATURE_ICONS: Record<(typeof FEATURE_IDS)[number], string> = {
  'product-management': '🗂️',
  'inventory': '📦',
  'variants': '🧩',
  'multilingual-commerce': '🌐',
  'analytics': '📊',
  'orders': '🧾',
  'customer-management': '👥',
  'payments': '💳',
  'seo': '🔎',
  'storefront-customization': '🎨',
  'media-management': '🖼️',
  'permissions': '🔐',
}

export function getExtendedFeatures(
  t: (key: string) => string,
): FeatureItem[] {
  return FEATURE_IDS.map((id) => ({
    id,
    icon: FEATURE_ICONS[id],
    title: t(`featuresPage.grid.items.${id}.title`),
    description: t(`featuresPage.grid.items.${id}.description`),
  }))
}
