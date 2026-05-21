import { EmployeeRegistryTable } from '@/features/employee-registry';

export const EmployeeRegistryPage = () => {
  return (
    <div className="p-4 mx-auto space-y-6 sm:p-6 lg:p-8 w-full">
      <h1 className="text-2xl font-bold tracking-tight">Rejestr pracowników</h1>
      <EmployeeRegistryTable />
    </div>
  );
};
