import type { UserResponse } from '../user-management.types';
import { UserTableRow } from './UserTableRow';

interface UserTableViewProps {
  users: UserResponse[];
  onDelete: (userId: string) => void;
  onResend: (userId: string) => void;
  isDeleting: boolean;
  deletingId: string | null;
  isResending: boolean;
  resendingId: string | null;
}

const COLUMNS = ['Imię i nazwisko', 'E-mail', 'Rola', 'Status konta', 'Akcje'];

export const UserTableView = ({ users, onDelete, onResend, isDeleting, deletingId, isResending, resendingId }: UserTableViewProps) => (
  <div className="overflow-x-auto overflow-y-visible rounded-lg border border-gray-200">
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
        <tr>
          {COLUMNS.map((col, i) => (
            <th key={col} className={`px-4 py-3 ${i === COLUMNS.length - 1 ? 'text-right' : ''}`}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {users.length === 0 ? (
          <tr>
            <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-gray-400">
              Brak użytkowników w systemie
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onDelete={onDelete}
              onResend={onResend}
              isDeleting={isDeleting && deletingId === user.id}
              isResending={isResending && resendingId === user.id}
            />
          ))
        )}
      </tbody>
    </table>
  </div>
);
