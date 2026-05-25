'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OnboardingStep = 'identity' | 'config' | 'review' | 'provisioning' | 'completed';

interface OnboardingState {
  currentStep: OnboardingStep;
  storeData: {
    name: string;
    slug: string;
    locale: string;
    timezone: string;
    currency: string;
  };
  isProvisioning: boolean;
  provisioningStoreId: string | null;
}

interface OnboardingActions {
  setStep: (step: OnboardingStep) => void;
  updateStoreData: (data: Partial<OnboardingState['storeData']>) => void;
  setProvisioning: (isProvisioning: boolean, storeId?: string | null) => void;
  resetOnboarding: () => void;
}

export type OnboardingStore = OnboardingState & OnboardingActions;

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 'identity',
      storeData: {
        name: '',
        slug: '',
        locale: 'en',
        timezone: 'UTC',
        currency: 'USD',
      },
      isProvisioning: false,
      provisioningStoreId: null,

      setStep: (currentStep) => set({ currentStep }),
      updateStoreData: (data) => set((state) => ({
        storeData: { ...state.storeData, ...data }
      })),
      setProvisioning: (isProvisioning, provisioningStoreId = null) => 
        set({ isProvisioning, provisioningStoreId }),
      resetOnboarding: () => set({
        currentStep: 'identity',
        storeData: {
          name: '',
          slug: '',
          locale: 'en',
          timezone: 'UTC',
          currency: 'USD',
        },
        isProvisioning: false,
        provisioningStoreId: null,
      }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
