import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import type { ProjectResponse } from "./project.types"
import { Link } from "react-router-dom"
import { PATHS } from "@/routes/paths"

export const getColumns = (): ColumnDef<ProjectResponse>[] => [
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
