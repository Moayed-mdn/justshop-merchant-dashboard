'use client';

export const CREATE_STORE_DRAFT_STORAGE_KEY = 'dashboard.create-store-draft';

export interface CreateStoreDraft {
  name: string;
  slug: string;
}

export function loadCreateStoreDraft(): CreateStoreDraft | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedDraft = window.localStorage.getItem(CREATE_STORE_DRAFT_STORAGE_KEY);
  if (!storedDraft) {
    return null;
  }

  try {
    const parsedDraft = JSON.parse(storedDraft) as Partial<CreateStoreDraft>;
    return {
      name: typeof parsedDraft.name === 'string' ? parsedDraft.name : '',
      slug: typeof parsedDraft.slug === 'string' ? parsedDraft.slug : '',
    };
  } catch {
    window.localStorage.removeItem(CREATE_STORE_DRAFT_STORAGE_KEY);
    return null;
  }
}

export function persistCreateStoreDraft(draft: CreateStoreDraft): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!draft.name && !draft.slug) {
    window.localStorage.removeItem(CREATE_STORE_DRAFT_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(CREATE_STORE_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function clearCreateStoreDraft(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(CREATE_STORE_DRAFT_STORAGE_KEY);
}

export function clearDashboardClientStorage(): void {
  clearCreateStoreDraft();
}
