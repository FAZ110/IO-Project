import { useState, useEffect } from 'react';
import { useUsersQuery } from '@/features/user-management/user-management.hooks';
import type { UserListParams } from '@/features/user-management/user-management.types';
import type { UserRole } from '@/features/auth/auth.types';

const PAGE_SIZE = 20;

export const useEmployeeRegistry = () => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<UserListParams>({ status: 'ACTIVE' });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput || undefined }));
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleRoleChange = (userRole: UserRole | undefined) => {
    setFilters(prev => ({ ...prev, userRole }));
    setPage(0);
  };

  const { users, isLoading, isError } = useUsersQuery(page, PAGE_SIZE, filters);

  return {
    users,
    isLoading,
    isError,
    page,
    setPage,
    searchInput,
    setSearchInput,
    filters,
    handleRoleChange,
  };
};
