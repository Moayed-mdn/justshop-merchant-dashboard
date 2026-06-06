/**
 * Google Fonts options for theme customization.
 * Popular, web-safe fonts that work well across different languages.
 */

import type { FontOption } from '@/types/theme';

export const GOOGLE_FONTS: FontOption[] = [
  // Sans-serif fonts
  { name: 'Inter', value: 'Inter', category: 'sans-serif' },
  { name: 'Roboto', value: 'Roboto', category: 'sans-serif' },
  { name: 'Open Sans', value: 'Open Sans', category: 'sans-serif' },
  { name: 'Lato', value: 'Lato', category: 'sans-serif' },
  { name: 'Montserrat', value: 'Montserrat', category: 'sans-serif' },
  { name: 'Poppins', value: 'Poppins', category: 'sans-serif' },
  { name: 'Raleway', value: 'Raleway', category: 'sans-serif' },
  { name: 'Work Sans', value: 'Work Sans', category: 'sans-serif' },
  { name: 'Nunito', value: 'Nunito', category: 'sans-serif' },
  { name: 'DM Sans', value: 'DM Sans', category: 'sans-serif' },

  // Serif fonts
  { name: 'Playfair Display', value: 'Playfair Display', category: 'serif' },
  { name: 'Merriweather', value: 'Merriweather', category: 'serif' },
  { name: 'Lora', value: 'Lora', category: 'serif' },
  { name: 'PT Serif', value: 'PT Serif', category: 'serif' },
  { name: 'Crimson Text', value: 'Crimson Text', category: 'serif' },

  // Display fonts
  { name: 'Bebas Neue', value: 'Bebas Neue', category: 'display' },
  { name: 'Oswald', value: 'Oswald', category: 'display' },
  { name: 'Archivo Black', value: 'Archivo Black', category: 'display' },

  // Monospace fonts
  { name: 'JetBrains Mono', value: 'JetBrains Mono', category: 'monospace' },
  { name: 'Fira Code', value: 'Fira Code', category: 'monospace' },
];

/**
 * Get fonts filtered by category.
 */
export function getFontsByCategory(category?: FontOption['category']): FontOption[] {
  if (!category) return GOOGLE_FONTS;
  return GOOGLE_FONTS.filter((font) => font.category === category);
}

/**
 * Get font by value.
 */
export function getFontByValue(value: string): FontOption | undefined {
  return GOOGLE_FONTS.find((font) => font.value === value);
}

/**
 * Default font values.
 */
export const DEFAULT_FONTS = {
  heading: 'Inter',
  body: 'Inter',
};

/**
 * Default color values.
 */
export const DEFAULT_COLORS = {
  primary: '#3b82f6',
  secondary: '#6366f1',
  accent: '#ec4899',
  background: '#ffffff',
  text: '#1f2937',
};
