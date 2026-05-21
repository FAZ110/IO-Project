import { UserRole } from '@/features/auth/auth.types';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { EmployeeRegistryTableRow } from './EmployeeRegistryTableRow';
import { useEmployeeRegistry } from './employee-registry.hooks';

const ROLE_OPTIONS: { label: string; value: UserRole | '' }[] = [
  { label: 'Wszystkie role', value: '' },
  { label: 'Pracownik', value: UserRole.COMMON },
  { label: 'Władze Wydziału', value: UserRole.AUTHORITY },
  { label: 'Kierownik Liniowy', value: UserRole.LINEAR_MANAGER },
  { label: 'Kierownik Projektu', value: UserRole.PROJECT_MANAGER },
];

const COLUMNS = ['Imię i nazwisko', 'E-mail', 'Rola'];

export const EmployeeRegistryTable = () => {
  const {
    users,
    isLoading,
    isError,
    setPage,
    searchInput,
    setSearchInput,
    filters,
    handleRoleChange,
  } = useEmployeeRegistry();

  if (isLoading) return <div className="py-8 text-center text-gray-500">Ładowanie...</div>;
  if (isError) return <div className="py-8 text-center text-red-500">Błąd pobierania pracowników</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Szukaj po imieniu, nazwisku lub e-mailu..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filters.userRole ?? ''}
          onChange={(e) => handleRoleChange((e.target.value as UserRole) || undefined)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ROLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto overflow-y-visible rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col} className="px-4 py-3">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!users || users.items.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-gray-400">
                  Brak pracowników spełniających kryteria
                </td>
              </tr>
            ) : (
              users.items.map((user) => (
                <EmployeeRegistryTableRow key={user.id} user={user} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {users && users.totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (users.hasPreviousPage) setPage(p => p - 1);
                }}
                className={!users.hasPreviousPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm font-medium text-slate-600 px-4">
                Strona {users.pageNumber + 1} z {users.totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (users.hasNextPage) setPage(p => p + 1);
                }}
                className={!users.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
