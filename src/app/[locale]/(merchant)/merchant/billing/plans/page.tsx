/**
 * Plan Selection Page
 * Browse and select subscription plans
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Choose Your Plan',
  description: 'Select the perfect subscription plan for your business',
};

export default function PlansPage() {
  return <PlansPageClient />;
}

import { PlansPageClient } from './PlansPageClient';
