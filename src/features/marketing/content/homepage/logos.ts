// =============================================================================
// Homepage — Logo Cloud Content
//
// Logo items for LogoCloudSection.
//
// Rules:
//   - only real brand assets when available
//   - placeholder entries use name only — no fake brand imagery
//   - src paths are relative to /public
//   - width/height prevent CLS — match actual asset dimensions
//   - replace placeholder entries before production launch
//
// Page wiring pattern:
//   const logos = getLogoItems()
//   <LogoCloudSection
//     items={logos}
//     label={t('home.logos.label')}
//   />
// =============================================================================

import type { LogoItem } from '@/features/marketing/types'

export function getLogoItems(): LogoItem[] {
  // Replace with real partner/customer logo assets before launch.
  // Placeholder entries intentionally have generic names.
  return [
    { name: 'Brand One',   src: '/next.svg',   width: 110, height: 32 },
    { name: 'Brand Two',   src: '/vercel.svg', width: 100, height: 32 },
    { name: 'Brand Three', src: '/globe.svg',  width: 32,  height: 32 },
    { name: 'Brand Four',  src: '/window.svg', width: 32,  height: 32 },
    { name: 'Brand Five',  src: '/file.svg',   width: 32,  height: 32 },
  ]
}
