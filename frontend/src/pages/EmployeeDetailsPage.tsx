import { useLocation, useParams } from 'react-router-dom';
import { ROUTE_PARAMS } from '@/routes/paths';
import type { UserResponse } from '@/features/user-management/user-management.types';
import { RoleBadge } from '@/features/user-management/components/RoleBadge';

export const EmployeeDetailsPage = () => {
  const { [ROUTE_PARAMS.USER_ID]: userId } = useParams();
  const location = useLocation();
  const user = location.state?.user as UserResponse | undefined;

  const fullName = user?.name && user?.surname ? `${user.name} ${user.surname}` : userId;

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{fullName}</h1>
          {user && (
            <div className="mt-1 flex items-center gap-2 text-gray-500 text-sm">
              <span>{user.email}</span>
              <span>·</span>
              <RoleBadge role={user.role} />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 p-6 text-center text-gray-400">
          Profil kompetencyjny pracownika — w trakcie realizacji
        </div>
      </div>
    </div>
  );
};
