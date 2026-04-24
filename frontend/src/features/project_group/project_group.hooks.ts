import { useQuery } from "@tanstack/react-query";
import { fetchProjectGroups } from "@/features/project_group/project_group.service.ts";

export const useProjectGroups = () => {
  return useQuery({
        queryKey: ['projectGroups'],
        queryFn: fetchProjectGroups
  });
}