import type { ApiError } from '@/types/api';

interface ApiErrorPayload {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
  redirect?: string;
  logoutUrl?: string;
  action?: string;
}

/**
 * Custom Error class for API errors that properly preserves all properties
 * and makes them enumerable for logging and debugging.
 */
export class ApiErrorClass extends Error implements ApiError {
  public readonly status: number;
  public readonly code: string;
  public readonly errors: Record<string, string[]>;
  public readonly redirect?: string;
  public readonly logoutUrl?: string;
  public readonly action?: string;

  constructor(apiError: ApiError) {
    // Keep the original backend message for UI/toast messages
    super(apiError.message);
    this.name = 'ApiError';
    this.status = apiError.status;
    this.code = apiError.code;
    this.errors = apiError.errors;
    this.redirect = apiError.redirect;
    this.logoutUrl = apiError.logoutUrl;
    this.action = apiError.action;

    // Ensure the prototype chain is correct
    Object.setPrototypeOf(this, ApiErrorClass.prototype);
  }

  // Make the error serializable
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      errors: this.errors,
      redirect: this.redirect,
      logoutUrl: this.logoutUrl,
      action: this.action,
    };
  }

  // Custom toString for better console output (includes validation errors)
  toString() {
    const detailedMessage = this.message + 
      (Object.keys(this.errors).length > 0 
        ? `\nValidation errors: ${JSON.stringify(this.errors, null, 2)}`
        : '');
    return `${this.name} [${this.status}]: ${detailedMessage}`;
  }

  // Custom inspect for Node.js console
  [Symbol.for('nodejs.util.inspect.custom')]() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      errors: this.errors,
      ...(this.redirect && { redirect: this.redirect }),
      ...(this.logoutUrl && { logoutUrl: this.logoutUrl }),
      ...(this.action && { action: this.action }),
    };
  }
}

export const DEFAULT_JSON_HEADERS: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

export function buildHeaders(base: HeadersInit, overrides?: HeadersInit): Headers {
  const headers = new Headers(base);
  if (!overrides) {
    return headers;
  }

  const overrideHeaders = new Headers(overrides);
  overrideHeaders.forEach((value, key) => {
    headers.set(key, value);
  });

  return headers;
}

export function serializeJsonBody(body?: unknown): string | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  return JSON.stringify(body);
}

export function isJsonResponse(response: Response): boolean {
  const contentType = response.headers.get('content-type') ?? '';
  return contentType.includes('application/json') || contentType.includes('+json');
}

export async function parseResponseBody<T>(response: Response): Promise<T> {
  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  if (!isJsonResponse(response)) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text.trim()) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export async function toApiError(
  response: Response,
  fallbackMessage = 'Request failed'
): Promise<ApiErrorClass> {
  const payload =
    (await parseResponseBody<ApiErrorPayload>(response).catch(() => undefined)) ?? {};

  console.log('=== API ERROR DEBUG ===');
  console.log('Response Status:', response.status);
  console.log('Response Status Text:', response.statusText);
  console.log('Payload:', JSON.stringify(payload, null, 2));
  console.log('Payload.message:', payload.message);
  console.log('Fallback message:', fallbackMessage);
  console.log('======================');

  const apiError: ApiError = {
    message: payload.message ?? fallbackMessage,
    errors: payload.errors ?? {},
    status: response.status,
    code: payload.code ?? String(response.status),
    redirect: payload.redirect,
    logoutUrl: payload.logoutUrl,
    action: payload.action,
  };

  console.log('=== FINAL API ERROR ===');
  console.log('Final message:', apiError.message);
  console.log('======================');

  return new ApiErrorClass(apiError);
}
