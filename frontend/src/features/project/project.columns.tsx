import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { ProjectDetailsResponse } from "./project.types";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { PROJECT_GROUP_TYPE_LABELS } from "../project_group/project_group.types";


export const getColumns = (): ColumnDef<ProjectDetailsResponse>[] => [
  {
    accessorKey: "title",
    header: "Nazwa projektu",
    meta: { className: "whitespace-normal break-all", style: { width: "360px" } },
    cell: ({ row }) => {
      const project = row.original;
      return (
        <Link to={PATHS.PROJECT(project.id)} className="text-blue-600 hover:underline w-full whitespace-normal break-all">
          {project.title}
        </Link>
      );
    },
    size: 360,
  },
  {
    accessorKey: "manager",
    header: "Kierownik projektu",
    meta: { className: "whitespace-normal break-all" },
    cell: ({ row }) => {
      const manager = row.original.manager;
      return (
        <div>
          {manager.name} {manager.surname}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "group",
    header: "Portfel/Program",
    meta: { className: "whitespace-normal break-all" },
    cell: ({ row }) => {
      const group = row.original.group
      if (!group) return <div>-</div>;

      return (
        <div className="whitespace-normal">
          <span className="break-all">{group.name ?? "-"}</span> <Badge variant="outline">{PROJECT_GROUP_TYPE_LABELS[group.groupType]}</Badge>
        </div>
      );
    },
    size: 140,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    meta: { className: "whitespace-normal text-center break-all" },
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return <Badge variant={isActive ? "green" : "red"}>{isActive ? "Aktywny" : "Nieaktywny"}</Badge>;
    },
    size: 80,
  },
];
