import { useState } from 'react';
import { useDeleteUserMutation, useResendInvitationMutation, useUsersQuery } from '../user-management.hooks';
import { UserTableView } from './UserTable.view';
import { Pagination } from '@/components/ui';

const PAGE_SIZE = 20;

export const UserTable = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useUsersQuery(page, PAGE_SIZE);
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
        <Pagination
          page={data.pageNumber}
          totalPages={data.totalPages}
          hasNext={data.hasNextPage}
          hasPrevious={data.hasPreviousPage}
          onNext={() => setPage(p => p + 1)}
          onPrevious={() => setPage(p => p - 1)}
        />
      )}
    </div>
  );
};
