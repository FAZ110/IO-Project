import { useEffect, useState } from 'react';
import { useDeleteUserMutation, useResendInvitationMutation, useUsersQuery } from '../user-management.hooks';
import type { UserListParams, UserStatus } from '../user-management.types';
import type { UserRole } from '@/features/auth/auth.types';
import { UserTableView } from './UserTable.view';
import { UserFiltersBar } from './UserFiltersBar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const PAGE_SIZE = 20;

export const UserTable = () => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<UserListParams>({});
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

  const handleStatusChange = (status: UserStatus | undefined) => {
    setFilters(prev => ({ ...prev, status }));
    setPage(0);
  };

  const { data, isLoading, isError } = useUsersQuery(page, PAGE_SIZE, filters);
  const deleteMutation = useDeleteUserMutation();
  const resendMutation = useResendInvitationMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const handleDelete = (userId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return;
    setDeletingId(userId);
    deleteMutation.mutate(userId, { onSettled: () => setDeletingId(null) });
  };

  const handleResend = (userId: string) => {
    setResendingId(userId);
    resendMutation.mutate(userId, { onSettled: () => setResendingId(null) });
  };

  if (isLoading) return <div className="py-8 text-center text-gray-500">Ładowanie...</div>;
  if (isError)   return <div className="py-8 text-center text-red-500">Błąd pobierania użytkowników</div>;

  return (
    <div className="space-y-4">
      <UserFiltersBar
        filters={filters}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
      />
      <UserTableView
        users={data?.items ?? []}
        onDelete={handleDelete}
        onResend={handleResend}
        isDeleting={deleteMutation.isPending}
        deletingId={deletingId}
        isResending={resendMutation.isPending}
        resendingId={resendingId}
      />
      {data && data.totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>

            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (data?.hasPreviousPage) setPage(p => p - 1);
                }}
                className={!data.hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

ont            <PaginationItem>
              <span className="text-sm font-medium text-slate-600 px-4">
                Strona {data.pageNumber + 1} z {data.totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (data?.hasNextPage) setPage(p => p + 1);
                }}
                className={!data.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
