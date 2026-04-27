import { useQuery } from "@tanstack/react-query";
import { projectGroupService } from "@/features/project_group/project_group.service.ts";
import { PROJECT_GROUP_KEYS } from "@/features/project_group/project_groups.keys.ts";

export const useProjectGroups = () => {
  return useQuery({
        queryKey: PROJECT_GROUP_KEYS.list(),
        queryFn: projectGroupService.getAll
  });
}