import { useDebounce } from "use-debounce";
import { useState } from "react";
import { useSearchProjects } from "../project.hooks.ts";
import { useProjectGroupsWithType } from "../../project_group/project_group.hooks.ts";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "../project.columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const ProjectRegistry = () => {
  const [projectQuery, setProjectQuery] = useState("");
  const [projectQueryValue] = useDebounce(projectQuery, 300);

  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [unassignedOnly, setUnassignedOnly] = useState(false);

  const { data: projects = [], isLoading } = useSearchProjects({
    query: projectQueryValue,
    unassignedOnly: unassignedOnly ? true : undefined,
    groupId: unassignedOnly ? undefined : selectedWalletId || selectedProgramId || undefined,
    isActive: selectedStatus === "active" ? true : selectedStatus === "inactive" ? false : undefined,
  });

  const { data: groupsData } = useProjectGroupsWithType();

  const columns = getColumns();

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px] flex items-center gap-2">
          <Input
            placeholder="Szukaj po nazwie projektu..."
            value={projectQuery}
            onChange={(e) => setProjectQuery(e.target.value)}
            className="flex-1"
          />

          <Button
            onClick={() => {
              setProjectQuery("");
              setSelectedWalletId("");
              setSelectedProgramId("");
              setSelectedStatus("");
              setUnassignedOnly(false);
            }}
          >
            Wyczyść filtry
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center w-full">
          <div className="flex flex-col gap-1 w-full">
            <Select
              value={selectedWalletId || "all-wallets"}
              onValueChange={(value) => {
                const newWalletId = value === "all-wallets" ? "" : value.trim();
                setSelectedWalletId(newWalletId);
                if (newWalletId || unassignedOnly) {
                  setSelectedProgramId("");
                  setUnassignedOnly(false);
                }
              }}
              disabled={!!selectedProgramId || unassignedOnly}
            >
              <SelectTrigger className={`w-full ${selectedProgramId || unassignedOnly ? "opacity-50 cursor-not-allowed" : ""}`}>
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

          <div className="flex flex-col gap-1 w-full">
            <Select
              value={selectedProgramId || "all-programs"}
              onValueChange={(value) => {
                const newProgramId = value === "all-programs" ? "" : value.trim();
                setSelectedProgramId(newProgramId);
                if (newProgramId || unassignedOnly) {
                  setSelectedWalletId("");
                  setUnassignedOnly(false);
                }
              }}
              disabled={!!selectedWalletId || unassignedOnly}
            >
              <SelectTrigger className={`w-full ${selectedWalletId || unassignedOnly ? "opacity-50 cursor-not-allowed" : ""}`}>
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

          <div className="flex items-center gap-2">
            <Switch
              checked={unassignedOnly}
              onCheckedChange={(val) => {
                const checked = Boolean(val);
                setUnassignedOnly(checked);
                if (checked) {
                  setSelectedWalletId("");
                  setSelectedProgramId("");
                }
              }}
              disabled={!!selectedWalletId || !!selectedProgramId}
            />
            <div className="text-sm">Tylko bez grupy</div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Select
              value={selectedStatus || "all-statuses"}
              onValueChange={(value) => {
                setSelectedStatus(value === "all-statuses" ? "all-statuses" : value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wszystkie statusy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">Wszystkie statusy</SelectItem>
                <SelectItem value="active">Aktywne</SelectItem>
                <SelectItem value="inactive">Nieaktywne</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? <div>Ładowanie...</div> : <DataTable columns={columns} data={projects} />}
    </div>
  );
};
