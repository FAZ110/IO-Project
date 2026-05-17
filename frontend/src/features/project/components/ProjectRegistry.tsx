import { useDebounce } from "use-debounce";
import { useState } from "react";
import { useSearchProjects } from "../project.hooks.ts";
import { useProjectGroupsWithType } from "../../project_group/project_group.hooks.ts";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "../project.columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ProjectRegistry = () => {
  const [projectQuery, setProjectQuery] = useState("");
  const [projectQueryValue] = useDebounce(projectQuery, 300);

  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");

  const { data: projects = [], isLoading } = useSearchProjects({
    query: projectQueryValue,
    unassignedOnly: undefined,
    groupId: selectedWalletId || selectedProgramId || undefined,
    isActive: undefined,
  });

  const { data: groupsData } = useProjectGroupsWithType();

  const columns = getColumns();

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Szukaj po nazwie projektu..."
          value={projectQuery}
          onChange={(e) => setProjectQuery(e.target.value)}
          className="flex-1"
        />

        <div className="flex flex-col gap-1 w-48">
          <Select
            value={selectedWalletId || "all-wallets"}
            onValueChange={(value) => {
              setSelectedWalletId(value === "all-wallets" ? "" : value);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Wszystkie portfele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-wallets">Wszystkie portfele</SelectItem>
              {groupsData?.wallets.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1 w-48">
          <Select
            value={selectedProgramId || "all-programs"}
            onValueChange={(value) => {
              setSelectedProgramId(value === "all-programs" ? "" : value);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Wszystkie programy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-programs">Wszystkie programy</SelectItem>
              {groupsData?.programs.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => {
            setProjectQuery("");
            setSelectedWalletId("");
            setSelectedProgramId("");
          }}
        >
          Wyczyść filtry
        </Button>
      </div>

      {isLoading ? <div>Ładowanie...</div> : <DataTable columns={columns} data={projects} />}
    </div>
  );
};
