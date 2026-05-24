import type { ColumnDef } from '@tanstack/react-table';
import type { UserResponse } from '@/features/user-management/user-management.types';
import { RoleBadge } from '@/features/user-management/components/RoleBadge';

export const getEmployeeColumns = (): ColumnDef<UserResponse>[] => [
  {
    accessorKey: 'name',
    header: 'Imię i nazwisko',
    cell: ({ row }) => {
      const { name, surname } = row.original;
      return name && surname ? `${name} ${surname}` : '—';
    },
  },
  {
    accessorKey: 'email',
    header: 'E-mail',
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Rola',
    cell: ({ row }) => <RoleBadge role={row.original.role} />,
  },
];
