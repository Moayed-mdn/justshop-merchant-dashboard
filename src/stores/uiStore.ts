'use client';

/**
 * UI state store using Zustand.
 * Manages sidebar, theme, and RTL direction state.
 * 
 * IMPORTANT: locale source of truth is next-intl (useLocale hook).
 * Zustand only tracks 'direction' for RTL CSS application.
 * 
 * PERSISTENCE: Sidebar state and theme are saved to localStorage
 * for user preference retention across sessions.
 */

import { create } from 'zustand';
import { useEffect } from 'react';
import { FEATURES } from '@/config/features';

// Storage keys for persistence
const STORAGE_KEYS = {
  sidebarCollapsed: 'ui:sidebarCollapsed',
  theme: 'ui:theme',
} as const;

// Safe localStorage helpers (works in SSR)
const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage errors
    }
  },
};

// Get initial state from localStorage or defaults
const getInitialState = (): Partial<UiState> => {
  const state: Partial<UiState> = {};
  
  const savedCollapsed = safeStorage.getItem(STORAGE_KEYS.sidebarCollapsed);
  if (savedCollapsed !== null) {
    state.sidebarCollapsed = savedCollapsed === 'true';
  }
  
  const savedTheme = safeStorage.getItem(STORAGE_KEYS.theme);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    state.theme = savedTheme;
  }
  
  return state;
};

export interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  direction: 'ltr' | 'rtl';
  commandPaletteOpen: boolean;
}

export interface UiActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setDirection: (locale: 'en' | 'ar') => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export type UiStore = UiState & UiActions;

const initialState = getInitialState();

export const useUiStore = create<UiStore>((set, get) => ({
  // Initial state (with persisted values)
  sidebarOpen: false,
  sidebarCollapsed: initialState.sidebarCollapsed ?? false,
  theme: initialState.theme ?? 'light',
  direction: 'ltr',
  commandPaletteOpen: false,

  // Actions
  toggleSidebar: () => set((state) => {
    const newCollapsed = !state.sidebarCollapsed;
    safeStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(newCollapsed));
    return { sidebarCollapsed: newCollapsed };
  }),
  
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  
  setSidebarCollapsed: (sidebarCollapsed) => {
    safeStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(sidebarCollapsed));
    set({ sidebarCollapsed });
  },
  
  setTheme: (theme) => {
    safeStorage.setItem(STORAGE_KEYS.theme, theme);
    // Apply theme to document
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    set({ theme });
  },
  
  setDirection: (locale) =>
    set({
      direction: FEATURES.enableRTL ? (locale === 'ar' ? 'rtl' : 'ltr') : 'ltr',
    }),
    
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));

// Selectors
export const selectSidebarOpen = (state: UiStore): boolean => state.sidebarOpen;
export const selectSidebarCollapsed = (state: UiStore): boolean => state.sidebarCollapsed;
export const selectTheme = (state: UiStore): 'light' | 'dark' => state.theme;
export const selectDirection = (state: UiStore): 'ltr' | 'rtl' => state.direction;
export const selectIsDarkMode = (state: UiStore): boolean => state.theme === 'dark';
export const selectIsRTL = (state: UiStore): boolean => state.direction === 'rtl';
export const selectCommandPaletteOpen = (state: UiStore): boolean => state.commandPaletteOpen;

/**
 * Hook to initialize persisted theme on client.
 * Applies the saved theme to the document root on mount.
 */
export function useInitializeTheme() {
  const theme = useUiStore(selectTheme);
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
}
