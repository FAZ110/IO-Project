import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import type { PaginationState } from '@tanstack/react-table';
import { useUsersQuery } from '@/features/user-management/user-management.hooks';
import { UserStatus } from '@/features/user-management/user-management.types';
import type { UserRole } from '@/features/auth/auth.types';

export const useEmployeeRegistry = (pagination: PaginationState, resetPage: () => void) => {
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined);
  const [searchInput, setSearchInputState] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 400);

  const setSearchInput = (value: string) => {
    setSearchInputState(value);
    resetPage();
  };

  const handleRoleChange = (userRole: UserRole | undefined) => {
    setRoleFilter(userRole);
    resetPage();
  };

  const { users, isLoading, isError } = useUsersQuery(
    pagination.pageIndex,
    pagination.pageSize,
    {
      status: UserStatus.ACTIVE,
      userRole: roleFilter,
      search: debouncedSearch || undefined,
    }
  );

  return {
    users,
    isLoading,
    isError,
    searchInput,
    setSearchInput,
    roleFilter,
    handleRoleChange,
  };
};
