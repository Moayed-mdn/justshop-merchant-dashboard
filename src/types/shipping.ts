/**
 * Shipping-related TypeScript types matching backend API.
 */

/**
 * Shipping Method Type.
 * Represents a delivery option (e.g., "Standard Shipping", "Express Delivery").
 */
export interface ShippingMethod {
  id: number;
  store_id: number;
  name: string;
  code: string;
  description: string | null;
  price: number;
  currency: string;
  min_order_amount: number | null;
  max_order_amount: number | null;
  estimated_delivery_days: number | null;
  min_delivery_days: number | null;
  max_delivery_days: number | null;
  delivery_estimate: string;
  formatted_price: string;
  is_active: boolean;
  sort_order: number;
  zones?: ShippingZone[];
  created_at: string;
  updated_at: string;
}

/**
 * Shipping Zone Type.
 * Groups countries/regions for shipping method assignment.
 */
export interface ShippingZone {
  id: number;
  store_id: number;
  name: string;
  countries: string[];
  country_count: number;
  regions: Record<string, string[]> | null;
  postal_code_patterns: Record<string, string[]> | null;
  is_active: boolean;
  methods?: ShippingMethod[];
  methods_with_pricing?: ZoneMethodPricing[];
  created_at: string;
  updated_at: string;
}

/**
 * Zone-Method Pricing.
 * Shows pricing information for a method within a specific zone.
 */
export interface ZoneMethodPricing {
  id: number;
  name: string;
  base_price: number;
  price_override: number | null;
  effective_price: number;
  is_active: boolean;
}

/**
 * Store Address Settings.
 * Configures address validation and allowed countries for a store.
 */
export interface StoreAddressSetting {
  id: number;
  store_id: number;
  allowed_countries: string[];
  required_fields: string[];
  validation_rules: Record<string, any> | null;
  require_phone: boolean;
  require_company: boolean;
  allow_po_boxes: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Payload for creating a shipping method.
 */
export interface CreateShippingMethodPayload {
  name: string;
  code?: string;
  description?: string;
  price: number;
  currency?: string;
  min_order_amount?: number;
  max_order_amount?: number;
  estimated_delivery_days?: number;
  min_delivery_days?: number;
  max_delivery_days?: number;
  is_active?: boolean;
  sort_order?: number;
}

/**
 * Payload for updating a shipping method.
 */
export interface UpdateShippingMethodPayload {
  name?: string;
  code?: string;
  description?: string;
  price?: number;
  currency?: string;
  min_order_amount?: number;
  max_order_amount?: number;
  estimated_delivery_days?: number;
  min_delivery_days?: number;
  max_delivery_days?: number;
  is_active?: boolean;
  sort_order?: number;
}

/**
 * Payload for creating a shipping zone.
 */
export interface CreateShippingZonePayload {
  name: string;
  countries: string[];
  regions?: Record<string, string[]>;
  postal_code_patterns?: Record<string, string[]>;
  is_active?: boolean;
}

/**
 * Payload for updating a shipping zone.
 */
export interface UpdateShippingZonePayload {
  name?: string;
  countries?: string[];
  regions?: Record<string, string[]>;
  postal_code_patterns?: Record<string, string[]>;
  is_active?: boolean;
}

/**
 * Payload for updating store address settings.
 */
export interface UpdateStoreAddressSettingsPayload {
  allowed_countries?: string[];
  required_fields?: string[];
  validation_rules?: Record<string, any>;
  require_phone?: boolean;
  require_company?: boolean;
  allow_po_boxes?: boolean;
}

/**
 * Payload for assigning a method to a zone.
 */
export interface AssignMethodToZonePayload {
  method_id: number;
  price_override?: number | null;
}

/**
 * Payload for updating zone-method price override.
 */
export interface UpdateZoneMethodPricePayload {
  price_override?: number | null;
}

/**
 * Country option for select dropdowns.
 */
export interface CountryOption {
  code: string;
  name: string;
  region?: string;
}

/**
 * Common country groups by region.
 */
export const COUNTRY_GROUPS: Record<string, CountryOption[]> = {
  'North America': [
    { code: 'US', name: 'United States', region: 'North America' },
    { code: 'CA', name: 'Canada', region: 'North America' },
    { code: 'MX', name: 'Mexico', region: 'North America' },
  ],
  'Europe': [
    { code: 'GB', name: 'United Kingdom', region: 'Europe' },
    { code: 'DE', name: 'Germany', region: 'Europe' },
    { code: 'FR', name: 'France', region: 'Europe' },
    { code: 'IT', name: 'Italy', region: 'Europe' },
    { code: 'ES', name: 'Spain', region: 'Europe' },
    { code: 'NL', name: 'Netherlands', region: 'Europe' },
    { code: 'BE', name: 'Belgium', region: 'Europe' },
    { code: 'AT', name: 'Austria', region: 'Europe' },
    { code: 'CH', name: 'Switzerland', region: 'Europe' },
    { code: 'SE', name: 'Sweden', region: 'Europe' },
    { code: 'NO', name: 'Norway', region: 'Europe' },
    { code: 'DK', name: 'Denmark', region: 'Europe' },
    { code: 'FI', name: 'Finland', region: 'Europe' },
    { code: 'IE', name: 'Ireland', region: 'Europe' },
    { code: 'PT', name: 'Portugal', region: 'Europe' },
  ],
  'Asia Pacific': [
    { code: 'AU', name: 'Australia', region: 'Asia Pacific' },
    { code: 'NZ', name: 'New Zealand', region: 'Asia Pacific' },
    { code: 'JP', name: 'Japan', region: 'Asia Pacific' },
    { code: 'CN', name: 'China', region: 'Asia Pacific' },
    { code: 'HK', name: 'Hong Kong', region: 'Asia Pacific' },
    { code: 'SG', name: 'Singapore', region: 'Asia Pacific' },
    { code: 'MY', name: 'Malaysia', region: 'Asia Pacific' },
    { code: 'TH', name: 'Thailand', region: 'Asia Pacific' },
    { code: 'PH', name: 'Philippines', region: 'Asia Pacific' },
    { code: 'ID', name: 'Indonesia', region: 'Asia Pacific' },
    { code: 'VN', name: 'Vietnam', region: 'Asia Pacific' },
    { code: 'IN', name: 'India', region: 'Asia Pacific' },
    { code: 'KR', name: 'South Korea', region: 'Asia Pacific' },
  ],
  'Middle East': [
    { code: 'AE', name: 'United Arab Emirates', region: 'Middle East' },
    { code: 'SA', name: 'Saudi Arabia', region: 'Middle East' },
    { code: 'KW', name: 'Kuwait', region: 'Middle East' },
    { code: 'QA', name: 'Qatar', region: 'Middle East' },
    { code: 'BH', name: 'Bahrain', region: 'Middle East' },
    { code: 'OM', name: 'Oman', region: 'Middle East' },
    { code: 'IL', name: 'Israel', region: 'Middle East' },
    { code: 'TR', name: 'Turkey', region: 'Middle East' },
  ],
  'Latin America': [
    { code: 'BR', name: 'Brazil', region: 'Latin America' },
    { code: 'AR', name: 'Argentina', region: 'Latin America' },
    { code: 'CL', name: 'Chile', region: 'Latin America' },
    { code: 'CO', name: 'Colombia', region: 'Latin America' },
    { code: 'PE', name: 'Peru', region: 'Latin America' },
    { code: 'VE', name: 'Venezuela', region: 'Latin America' },
    { code: 'EC', name: 'Ecuador', region: 'Latin America' },
  ],
  'Africa': [
    { code: 'ZA', name: 'South Africa', region: 'Africa' },
    { code: 'EG', name: 'Egypt', region: 'Africa' },
    { code: 'NG', name: 'Nigeria', region: 'Africa' },
    { code: 'KE', name: 'Kenya', region: 'Africa' },
    { code: 'MA', name: 'Morocco', region: 'Africa' },
  ],
};

/**
 * Get all countries as flat list.
 */
export function getAllCountries(): CountryOption[] {
  return Object.values(COUNTRY_GROUPS).flat();
}

/**
 * Get country name by code.
 */
export function getCountryName(code: string): string {
  const country = getAllCountries().find(c => c.code === code);
  return country?.name || code;
}

/**
 * Address field options for required fields configuration.
 */
export const ADDRESS_FIELDS = [
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'company', label: 'Company' },
  { value: 'address_line_1', label: 'Address Line 1' },
  { value: 'address_line_2', label: 'Address Line 2' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State/Province' },
  { value: 'postal_code', label: 'Postal Code' },
  { value: 'country', label: 'Country' },
  { value: 'phone', label: 'Phone' },
] as const;
