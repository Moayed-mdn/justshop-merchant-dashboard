'use client';

/**
 * Activity state store using Zustand.
 * Manages pending counts, notifications, and system status visibility.
 * 
 * Part of Heuristic 1: Visibility of System Status
 * Keep users informed about what's happening at all times.
 */

import { create } from 'zustand';

export interface ActivityState {
  pendingOrders: number;
  draftProducts: number;
  unreadNotifications: number;
  isStoreSwitching: boolean;
  isSaving: boolean;
}

export interface ActivityActions {
  setPendingOrders: (count: number) => void;
  setDraftProducts: (count: number) => void;
  setUnreadNotifications: (count: number) => void;
  setIsStoreSwitching: (isSwitching: boolean) => void;
  setIsSaving: (isSaving: boolean) => void;
  incrementPendingOrders: () => void;
  decrementPendingOrders: () => void;
  incrementUnreadNotifications: () => void;
  decrementUnreadNotifications: () => void;
}

export type ActivityStore = ActivityState & ActivityActions;

export const useActivityStore = create<ActivityStore>((set) => ({
  // Initial state
  pendingOrders: 0,
  draftProducts: 0,
  unreadNotifications: 0,
  isStoreSwitching: false,
  isSaving: false,

  // Actions
  setPendingOrders: (pendingOrders) => set({ pendingOrders }),
  setDraftProducts: (draftProducts) => set({ draftProducts }),
  setUnreadNotifications: (unreadNotifications) => set({ unreadNotifications }),
  setIsStoreSwitching: (isStoreSwitching) => set({ isStoreSwitching }),
  setIsSaving: (isSaving) => set({ isSaving }),
  
  incrementPendingOrders: () => set((state) => ({ pendingOrders: state.pendingOrders + 1 })),
  decrementPendingOrders: () => set((state) => ({ pendingOrders: Math.max(0, state.pendingOrders - 1) })),
  
  incrementUnreadNotifications: () => set((state) => ({ unreadNotifications: state.unreadNotifications + 1 })),
  decrementUnreadNotifications: () => set((state) => ({ unreadNotifications: Math.max(0, state.unreadNotifications - 1) })),
}));

// Selectors
export const selectPendingOrders = (state: ActivityStore): number => state.pendingOrders;
export const selectDraftProducts = (state: ActivityStore): number => state.draftProducts;
export const selectUnreadNotifications = (state: ActivityStore): number => state.unreadNotifications;
export const selectIsStoreSwitching = (state: ActivityStore): boolean => state.isStoreSwitching;
export const selectIsSaving = (state: ActivityStore): boolean => state.isSaving;
