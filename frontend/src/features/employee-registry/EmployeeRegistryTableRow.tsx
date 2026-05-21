import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import type { UserResponse } from '@/features/user-management/user-management.types';
import { RoleBadge } from '@/features/user-management/components/RoleBadge';

interface EmployeeRegistryTableRowProps {
  user: UserResponse;
}

export const EmployeeRegistryTableRow = ({ user }: EmployeeRegistryTableRowProps) => {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(PATHS.EMPLOYEE_DETAILS(user.id), { state: { user } })}
      className="bg-white hover:bg-gray-50 cursor-pointer"
    >
      <td className="px-4 py-3 font-medium text-gray-900">
        {user.name && user.surname ? `${user.name} ${user.surname}` : '—'}
      </td>
      <td className="px-4 py-3 text-gray-600">{user.email}</td>
      <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
    </tr>
  );
};
