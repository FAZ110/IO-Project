"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { QualificationRequestResponse } from "./qualifications.types"



interface ColumnActions {
  onVerify?: (userSummary: QualificationRequestResponse) => void
}

export const getColumns = ({ onVerify }: ColumnActions): ColumnDef<QualificationRequestResponse>[] => [
  {
    accessorFn: (row) => `${row.employeeName} ${row.employeeSurname}`,
    id: "fullName",
    header: "Imię i nazwisko",
  },
  {
    accessorKey: "qualificationsCount",
    header: "Status wniosków",
    cell: ({ row }) => {
      const count = row.original.qualificationsCount;

      return (
        <Badge
          variant="outline"
          className="border-amber-500 text-amber-700 bg-amber-50 font-medium"
        >
          {count} {count === 1 ? 'WNIOSEK' : 'WNIOSKI'} OCZEKUJĄCE
        </Badge>
      );
    },
  },
  {
  id: "actions",
  header: () => <div className="text-right px-4">Akcje</div>,
  cell: ({ row }) => {
    const userSummary = row.original;

    return (
      <div className="flex justify-end px-4">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2" // gap-2 przyda się, jeśli dodasz ikonkę
          onClick={() => onVerify?.(userSummary)}
        >
          {/* Opcjonalnie: <Eye className="h-4 w-4" /> */}
          Weryfikuj
        </Button>
      </div>
    );
  },
},
]