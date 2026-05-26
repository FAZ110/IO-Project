import { EmployeeRegistryTable } from '@/features/employee-registry';
import { TablePageShell } from '@/components/layout/TablePageShell';

export const EmployeeRegistryPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-1">
      <TablePageShell title="Rejestr pracowników">
        <div className="p-4 sm:p-6">
          <EmployeeRegistryTable />
        </div>
      </TablePageShell>
    </div>
  );
};
