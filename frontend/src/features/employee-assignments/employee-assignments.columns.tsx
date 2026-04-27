"use client"

import type { ColumnDef, TableMeta } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EmployeeAssignmentStatus, type EmployeeAssignment } from "./employee-assignments.types"

interface ColumnActions {
  onVerify?: (assignment: EmployeeAssignment) => void
  onReject?: (assignment: EmployeeAssignment) => void
}

export const getColumns = ({ onVerify, onReject }: ColumnActions): ColumnDef<EmployeeAssignment>[] => [
  {
    accessorFn: (row) => `${row.employeeName} ${row.employeeSurname}`,
    id: "fullName",
    header: "Imię i nazwisko",
  },
  {
    accessorKey: "projectRoleName",
    header: "Rola",
  },
  {
    accessorKey: "projectName",
    header: "Projekt",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const variant = status === EmployeeAssignmentStatus.ACCEPTED ? "default" : "secondary"

      return (<Badge variant={variant}>{status}</Badge>)
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Akcje</div>,
    cell: ({ row }) => {
      const assignment = row.original;

      return (
        <div className="flex justify-end">
          <div className="flex items-center -space-x-px">
            <Button
              variant="outline"
              size="sm"
              className="rounded-r-none h-8"
              onClick={() => onVerify?.(assignment)}
            >
              Weryfikuj
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-l-none h-8 px-2 border-l-0"
                >
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onReject?.(assignment)}
                >
                  Odrzuć
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )
    },
  },
]