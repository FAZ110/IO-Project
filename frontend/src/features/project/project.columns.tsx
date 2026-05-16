import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import type { ProjectDetailsResponse } from "./project.types"
import { Link } from "react-router-dom"
import type { UserResponse } from "../user-management"
import { PATHS } from "@/routes/paths"

export const getColumns = (): ColumnDef<ProjectDetailsResponse>[] => [
  {
    accessorKey: "title",
    header: "Nazwa projektu",
    cell: ({ row }) => {
      const project = row.original
      return (
        <Link
          to={PATHS.PROJECT(project.id)}
          className="text-blue-600 hover:underline font-medium"
        >
          {project.title}
        </Link>
      )
    },
  },
  {
    accessorKey: "manager",
    header: "Kierownik projektu",
    cell: ({ row }) => {
      const manager = row.getValue("manager") as UserResponse
      return (
        <div>
          {manager.name} {manager.surname}
        </div>
      )
    }
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      return (
        <Badge variant={isActive ? "green" : "red"}>
          {isActive ? "Aktywny" : "Nieaktywny"}
        </Badge>
      )
    },
  },
]
