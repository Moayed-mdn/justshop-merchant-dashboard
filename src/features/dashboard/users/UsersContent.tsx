'use client';
// Reason: needs nuqs state sync and debounced search

/**
 * Users list page content (client component).
 * Manages filters, debounce, and pagination state via URL.
 */

import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { parseAsStringLiteral } from 'nuqs';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useUsers } from '@/hooks/users/useUsers';
import type { UserFilters as UserFiltersType } from '@/schemas/users';
import { useTranslations } from 'next-intl';
import { logger } from '@/lib/logger';
import { ShieldOff } from 'lucide-react';
import UsersTable from './UsersTable';
import UserFilters from './UserFilters';
import CreateUserDialog from './CreateUserDialog';

interface Props {
  storeSlug: string;
  initialFilters: UserFiltersType;
}

const ALLOWED_ROLES = ['all', 'store_admin', 'staff'] as const;
const statusOptions = ['all', 'active', 'inactive'] as const;

export default function UsersContent({ storeSlug, initialFilters }: Props) {
  const t = useTranslations('users');

  // Nuqs state management
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(initialFilters.search));
  const [role, setRole] = useQueryState(
    'role',
    parseAsStringLiteral(ALLOWED_ROLES).withDefault(
      initialFilters.role as (typeof ALLOWED_ROLES)[number]
    )
  );
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringLiteral(statusOptions).withDefault(
      initialFilters.status as (typeof statusOptions)[number]
    )
  );
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(initialFilters.page));
  const [perPage, setPerPage] = useQueryState('perPage', parseAsInteger.withDefault(initialFilters.perPage));

  // Debounce search
  const debouncedSearch = useDebounce(search, 300);

  // Build filters object with debounced search
  const filters: UserFiltersType = {
    search: debouncedSearch,
    role,
    status,
    page,
    perPage,
  };

  // Fetch data
  const { data, isLoading, error } = useUsers(storeSlug, filters);

  // Error handling — 403 means the user lacks permission to list users,
  // show a graceful empty state instead of logging noisy console errors.
  if (error) {
    const httpStatus = (error as { status?: number }).status;
    if (httpStatus === 403) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShieldOff className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-6 text-lg font-semibold">{t('accessDenied')}</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {t('accessDeniedMessage')}
          </p>
        </div>
      );
    }
    logger.error('Failed to load users', error);
  }

  // Handler functions that reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (page !== 1) setPage(1);
  };

  const handleRoleChange = (value: string | null) => {
    if (value) {
      setRole(value as (typeof ALLOWED_ROLES)[number]);
      if (page !== 1) setPage(1);
    }
  };

  const handleStatusChange = (value: string | null) => {
    if (value) {
      setStatus(value as (typeof statusOptions)[number]);
      if (page !== 1) setPage(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <CreateUserDialog storeSlug={storeSlug} />
      </div>
      
      <UserFilters
        search={search}
        onSearchChange={handleSearchChange}
        role={role}
        onRoleChange={handleRoleChange}
        status={status}
        onStatusChange={handleStatusChange}
      />

      <UsersTable
        users={data?.data ?? []}
        pagination={data?.meta.pagination}
        page={page}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
        isLoading={isLoading}
        storeSlug={storeSlug}
      />
    </div>
  );
}
