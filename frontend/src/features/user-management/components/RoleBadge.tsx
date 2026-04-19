import type { UserRole } from '@/features/auth/auth.types';

const labels: Record<UserRole, string> = {
  COMMON:          'Employee',
  AUTHORITY:       'Authority',
  LINEAR_MANAGER:  'Linear Manager',
  PROJECT_MANAGER: 'Project Manager',
  ADMINISTRATOR:   'Administrator',
};

export const RoleBadge = ({ role }: { role: UserRole }) => (
  <span className="text-sm text-gray-700">{labels[role]}</span>
);
