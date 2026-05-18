import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { ProjectDetailsResponse } from "./project.types";
import { Link } from "react-router-dom";
import type { UserResponse } from "../user-management";
import { PATHS } from "@/routes/paths";
import type { SingleGroupResponse } from "../project_group/project_group.types";
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
      const manager = row.getValue("manager") as UserResponse;
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
    header: "Prrtfel/Program",
    meta: { className: "whitespace-normal break-all" },
    cell: ({ row }) => {
      const group = row.getValue("group") as SingleGroupResponse;
      if (!group) return <div>-</div>;

      const key = group.groupType as keyof typeof PROJECT_GROUP_TYPE_LABELS;
      const label = PROJECT_GROUP_TYPE_LABELS[key];

      return (
        <div className="whitespace-normal">
          <span className="break-all">{group.name ?? "-"}</span> <Badge variant="outline">{label}</Badge>
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
