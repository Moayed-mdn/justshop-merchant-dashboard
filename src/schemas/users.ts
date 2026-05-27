/**
 * Zod schemas for user filters.
 * Validates URL params parsed by nuqs.
 */

import { z } from 'zod';

export const UserFiltersSchema = z.object({
  search: z.string().optional().default(''),
  role: z.enum(['all', 'store_admin', 'staff']).default('all'),
  status: z.enum(['all', 'active', 'inactive']).default('all'),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(10),
});

export type UserFilters = z.infer<typeof UserFiltersSchema>;

/**
 * Zod schema for creating a merchant user.
 */
export const CreateMerchantUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string().min(8, 'Password confirmation must be at least 8 characters'),
  role: z.enum(['store_admin', 'staff']),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
});

export type CreateMerchantUserValues = z.infer<typeof CreateMerchantUserSchema>;
