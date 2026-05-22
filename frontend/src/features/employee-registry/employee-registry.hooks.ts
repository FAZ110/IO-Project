import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useUsersQuery } from '@/features/user-management/user-management.hooks';
import type { UserRole } from '@/features/auth/auth.types';

const PAGE_SIZE = 20;

export const useEmployeeRegistry = () => {
  const [page, setPage] = useState(0);
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined);
  const [searchInput, setSearchInputState] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 400);

  const setSearchInput = (value: string) => {
    setSearchInputState(value);
    setPage(0);
  };

  const handleRoleChange = (userRole: UserRole | undefined) => {
    setRoleFilter(userRole);
    setPage(0);
  };

  const { users, isLoading, isError } = useUsersQuery(page, PAGE_SIZE, {
    status: 'ACTIVE',
    userRole: roleFilter,
    search: debouncedSearch || undefined,
  });

  return {
    users,
    isLoading,
    isError,
    setPage,
    searchInput,
    setSearchInput,
    roleFilter,
    handleRoleChange,
  };
};
