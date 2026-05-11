import type { UserStatus } from '../user-management.types';

const config: Record<UserStatus, { label: string; className: string }> = {
  ACTIVE:  { label: 'Aktywne',    className: 'bg-green-100 text-green-800' },
  PENDING: { label: 'Oczekujące', className: 'bg-yellow-100 text-yellow-800' },
  EXPIRED: { label: 'Wygasłe',    className: 'bg-red-100 text-red-800' },
};

export const UserStatusBadge = ({ status }: { status: UserStatus }) => {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};
