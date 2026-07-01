import type { ApiError } from '@/types/api';

interface FormatApiErrorMessageOptions {
  fallbackMessage: string;
  fieldMessages?: Record<string, string>;
}

export function formatApiErrorMessage(
  error: ApiError | null | undefined,
  { fallbackMessage, fieldMessages = {} }: FormatApiErrorMessageOptions
): string {
  const validationErrors = error?.errors ?? {};

  for (const [field, messages] of Object.entries(validationErrors)) {
    if (!Array.isArray(messages) || messages.length === 0) {
      continue;
    }

    return fieldMessages[field] ?? messages[0] ?? fallbackMessage;
  }

  const message = error?.message?.trim();
  if (!message) {
    return fallbackMessage;
  }

  if (
    message === 'Validation failed.' ||
    /SQLSTATE|Integrity constraint violation|Validation errors:/i.test(message)
  ) {
    return fallbackMessage;
  }

  return message;
}
