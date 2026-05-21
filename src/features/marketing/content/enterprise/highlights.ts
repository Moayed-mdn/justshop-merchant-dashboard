// =============================================================================
// Enterprise Page — Highlight Content
//
// Shared highlight collections for the /enterprise marketing page.
// Text is localized at the page level; this file owns structural ids only.
// =============================================================================

import type { HighlightItem } from '@/features/marketing/types'

const CAPABILITY_IDS = [
  'multi-store-operations',
  'advanced-permissions',
  'localized-commerce',
  'centralized-management',
  'integration-ready',
  'analytics-visibility',
] as const

const SECURITY_IDS = [
  'ssr-delivery',
  'secure-authentication',
  'tenant-isolation',
  'scalable-infrastructure',
] as const

const GLOBAL_IDS = [
  'locale-first-routing',
  'multilingual-storefronts',
  'regional-operations',
  'market-expansion',
] as const

function getHighlight(
  t: (key: string) => string,
  path: string,
  id: string,
): HighlightItem {
  return {
    id,
    eyebrow: t(`${path}.items.${id}.eyebrow`),
    title: t(`${path}.items.${id}.title`),
    description: t(`${path}.items.${id}.description`),
    points: [
      t(`${path}.items.${id}.pointOne`),
      t(`${path}.items.${id}.pointTwo`),
    ],
  }
}

export function getEnterpriseCapabilities(
  t: (key: string) => string,
): HighlightItem[] {
  return CAPABILITY_IDS.map((id) =>
    getHighlight(t, 'enterprisePage.capabilities', id),
  )
}

export function getEnterpriseSecurityHighlights(
  t: (key: string) => string,
): HighlightItem[] {
  return SECURITY_IDS.map((id) =>
    getHighlight(t, 'enterprisePage.security', id),
  )
}

export function getEnterpriseGlobalHighlights(
  t: (key: string) => string,
): HighlightItem[] {
  return GLOBAL_IDS.map((id) =>
    getHighlight(t, 'enterprisePage.global', id),
  )
}
