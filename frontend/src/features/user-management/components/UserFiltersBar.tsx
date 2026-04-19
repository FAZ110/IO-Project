import type { UserRole } from '@/features/auth/auth.types';
import type { UserListParams, UserStatus } from '../user-management.types';

interface UserFiltersBarProps {
  filters: UserListParams;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (role: UserRole | undefined) => void;
  onStatusChange: (status: UserStatus | undefined) => void;
}

const ROLE_OPTIONS: { label: string; value: UserRole | '' }[] = [
  { label: 'Wszystkie role', value: '' },
  { label: 'Employee', value: 'COMMON' },
  { label: 'Authority', value: 'AUTHORITY' },
  { label: 'Line Manager', value: 'LINEAR_MANAGER' },
  { label: 'Project Manager', value: 'PROJECT_MANAGER' },
  { label: 'Administrator', value: 'ADMINISTRATOR' },
];

const STATUS_OPTIONS: { label: string; value: UserStatus | '' }[] = [
  { label: 'Wszystkie statusy', value: '' },
  { label: 'Aktywne', value: 'ACTIVE' },
  { label: 'Oczekujące', value: 'PENDING' },
  { label: 'Wygasłe', value: 'EXPIRED' },
];

export const UserFiltersBar = ({
  searchInput,
  filters,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}: UserFiltersBarProps) => (
  <div className="flex flex-wrap gap-3 mb-4">
    <input
      type="text"
      placeholder="Szukaj po imieniu, nazwisku lub e-mailu..."
      value={searchInput}
      onChange={(e) => onSearchChange(e.target.value)}
      className="flex-1 min-w-48 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <select
      value={filters.userRole ?? ''}
      onChange={(e) => onRoleChange((e.target.value as UserRole) || undefined)}
      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {ROLE_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    <select
      value={filters.status ?? ''}
      onChange={(e) => onStatusChange((e.target.value as UserStatus) || undefined)}
      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);
