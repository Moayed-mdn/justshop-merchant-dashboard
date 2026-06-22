'use client';

/**
 * RHF-bound wrapper over LocalizedInput for form fields.
 * Connects a react-hook-form path to the LocalizedInput component.
 */

import { useFormContext } from 'react-hook-form';
import { LocalizedInput } from './LocalizedInput';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';
import type { LocalizedString } from '@/types/marketing-page';

interface LocalizedTextFieldProps {
  name: string; // RHF path, e.g. "sections.0.content.headline"
  placeholder?: Partial<Record<string, string>>;
  multiline?: boolean;
  rows?: number;
  id?: string;
}

export function LocalizedTextField({
  name,
  placeholder,
  multiline = false,
  rows = 3,
  id,
}: LocalizedTextFieldProps) {
  const { watch, setValue } = useFormContext<MarketingPageFormValues>();

  const value = (watch(name as any) ?? { en: '', ar: '' }) as LocalizedString;

  const handleChange = (nextValue: LocalizedString) => {
    setValue(name as any, nextValue, { shouldDirty: true });
  };

  return (
    <LocalizedInput
      id={id}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      multiline={multiline}
      rows={rows}
    />
  );
}
