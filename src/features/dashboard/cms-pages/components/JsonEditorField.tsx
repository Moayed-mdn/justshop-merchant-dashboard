'use client';

/**
 * JSON editor field with validation.
 * Used by Custom section editor for raw content/settings editing.
 */

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface JsonEditorFieldProps {
  label: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  rows?: number;
}

export function JsonEditorField({
  label,
  value,
  onChange,
  rows = 8,
}: JsonEditorFieldProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Tracks the object reference we last handed back via onChange, so the
  // sync effect below can tell "value changed because the form was reset
  // out from under us (e.g. after a save)" apart from "value changed
  // because I just typed it in myself". Without this distinction, either
  // the textarea goes stale after MarketingPageForm's post-save
  // reset(buildDefaultValues(page)) — silently editing on top of data the
  // server no longer has — or every keystroke fights the cursor position.
  const lastEmittedRef = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (value === lastEmittedRef.current) return;
    try {
      setText(JSON.stringify(value, null, 2));
      setError(null);
    } catch {
      setText('{}');
    }
  }, [value]);

  const handleChange = (newText: string) => {
    setText(newText);

    try {
      const parsed = JSON.parse(newText);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        setError(null);
        lastEmittedRef.current = parsed;
        onChange(parsed);
      } else {
        setError('Must be a JSON object');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        rows={rows}
        className="font-mono text-xs"
        placeholder="{}"
      />
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
