'use client';

const AUTH_CHANNEL_NAME = 'auth_session';
const AUTH_CHANNEL_SOURCE_KEY = 'auth_session_source';
const AUTH_CHANNEL_STORAGE_KEY = 'auth_session_message';

export type AuthChannelEventType =
  | 'login'
  | 'logout'
  | 'bootstrap-refresh'
  | 'active-store-changed';

export interface AuthChannelMessage {
  type: AuthChannelEventType;
  source: string;
  occurredAt: number;
  activeStoreId?: string | null;
}

export function getAuthChannelSource(): string {
  if (typeof window === 'undefined') {
    return 'server';
  }

  const existing = window.sessionStorage.getItem(AUTH_CHANNEL_SOURCE_KEY);
  if (existing) {
    return existing;
  }

  const source =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.sessionStorage.setItem(AUTH_CHANNEL_SOURCE_KEY, source);
  return source;
}

export function postAuthChannelMessage(
  type: AuthChannelEventType,
  options: { activeStoreId?: string | number | null } = {}
): void {
  const message: AuthChannelMessage = {
    type,
    source: getAuthChannelSource(),
    occurredAt: Date.now(),
    activeStoreId:
      options.activeStoreId === undefined ? undefined : options.activeStoreId === null ? null : String(options.activeStoreId),
  };

  if (typeof BroadcastChannel === 'undefined') {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_CHANNEL_STORAGE_KEY, JSON.stringify(message));
      window.localStorage.removeItem(AUTH_CHANNEL_STORAGE_KEY);
    }
    return;
  }

  const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
  channel.postMessage(message);
  channel.close();

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AUTH_CHANNEL_STORAGE_KEY, JSON.stringify(message));
    window.localStorage.removeItem(AUTH_CHANNEL_STORAGE_KEY);
  }
}

export function getAuthChannelStorageKey(): string {
  return AUTH_CHANNEL_STORAGE_KEY;
}

export function parseAuthChannelMessage(data: unknown): AuthChannelMessage | null {
  if (
    data === 'login' ||
    data === 'logout' ||
    data === 'bootstrap-refresh' ||
    data === 'active-store-changed'
  ) {
    return {
      type: data,
      source: '',
      occurredAt: 0,
    };
  }

  if (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    'source' in data &&
    (data.type === 'login' ||
      data.type === 'logout' ||
      data.type === 'bootstrap-refresh' ||
      data.type === 'active-store-changed') &&
    typeof data.source === 'string'
  ) {
    const occurredAt =
      'occurredAt' in data && typeof data.occurredAt === 'number' ? data.occurredAt : 0;
    const activeStoreId =
      'activeStoreId' in data &&
      (typeof data.activeStoreId === 'string' || data.activeStoreId === null)
        ? data.activeStoreId
        : undefined;

    return {
      type: data.type,
      source: data.source,
      occurredAt,
      activeStoreId,
    };
  }

  return null;
}
