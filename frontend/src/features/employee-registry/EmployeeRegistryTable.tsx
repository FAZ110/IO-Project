import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { UserRole } from '@/features/auth/auth.types';
import type { UserResponse } from '@/features/user-management/user-management.types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { useDataTableControls } from '@/lib/use-data-table-controls';
import { getEmployeeColumns } from './employee-registry.columns';
import { useEmployeeRegistry } from './employee-registry.hooks';

const ROLE_OPTIONS: { label: string; value: UserRole | 'all' }[] = [
  { label: 'Wszystkie role', value: 'all' },
  { label: 'Pracownik', value: UserRole.COMMON },
  { label: 'Władze Wydziału', value: UserRole.AUTHORITY },
  { label: 'Kierownik Liniowy', value: UserRole.LINEAR_MANAGER },
  { label: 'Kierownik Projektu', value: UserRole.PROJECT_MANAGER },
];

export const EmployeeRegistryTable = () => {
  const navigate = useNavigate();
  const tableControl = useDataTableControls(20);

  const { users, isLoading, isError, searchInput, setSearchInput, roleFilter, handleRoleChange } =
    useEmployeeRegistry(tableControl.pagination, tableControl.resetPage);

  const columns = useMemo(() => getEmployeeColumns(), []);

  if (isError) return (
    <div className="py-8 text-center text-destructive text-sm">
      Błąd pobierania pracowników.
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Szukaj po imieniu, nazwisku lub e-mailu..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 min-w-62.5"
        />
        <Select
          value={roleFilter ?? 'all'}
          onValueChange={(value) => handleRoleChange(value === 'all' ? null : value as UserRole)}
        >
          <SelectTrigger className="w-50">
            <SelectValue placeholder="Wszystkie role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={users?.items ?? []}
        isLoading={isLoading}
        control={tableControl}
        pageCount={users?.totalPages ?? 0}
        totalItems={users?.totalCount}
        onRowClick={(row: UserResponse) =>
          navigate(PATHS.EMPLOYEE_DETAILS(row.id), { state: { user: row } })
        }
      />
    </div>
  );
};
