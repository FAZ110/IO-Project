import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import type { UserResponse } from '../user-management.types';
import { UserStatusBadge } from './UserStatusBadge';
import { RoleBadge } from './RoleBadge';
import { UserActionsDropdown } from './UserActionsDropdown';

interface UserTableRowProps {
  user: UserResponse;
  onDelete: (userId: string) => void;
  onResend: (userId: string) => void;
  isDeleting: boolean;
  isResending: boolean;
}

export const UserTableRow = ({ user, onDelete, onResend, isDeleting, isResending }: UserTableRowProps) => {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(PATHS.ADMIN_USER_DETAILS(user.id))}
      className="bg-white hover:bg-gray-50 cursor-pointer"
    >
      <td className="px-4 py-3 font-medium text-gray-900">
        {user.name && user.surname ? `${user.name} ${user.surname}` : '—'}
      </td>
      <td className="px-4 py-3 text-gray-600">{user.email}</td>
      <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
      <td className="px-4 py-3"><UserStatusBadge status={user.status} /></td>
      <td className="px-4 py-3 text-right">
        <UserActionsDropdown
          user={user}
          onDelete={onDelete}
          onResend={onResend}
          isDeleting={isDeleting}
          isResending={isResending}
        />
      </td>
    </tr>
  );
};
