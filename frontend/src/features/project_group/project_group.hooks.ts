import { useQuery, useMutation } from "@tanstack/react-query";
import { projectGroupService } from "@/features/project_group/project_group.service.ts";
import { PROJECT_GROUP_KEYS } from "@/features/project_group/project_groups.keys.ts";
import { toast } from "sonner";

export const useProjectGroups = () => {
  return useQuery({
    queryKey: PROJECT_GROUP_KEYS.list(),
    queryFn: projectGroupService.getAll,
  });
};

export const useProjectGroupsWithType = () => {
  return useQuery({
    queryKey: PROJECT_GROUP_KEYS.listWithType(),
    queryFn: async () => {
      const response = await projectGroupService.getGroupsWithType();
      return response;
    },
  });
};

export const useAllProjectGroups = () => {
  return useQuery({
    queryKey: [...PROJECT_GROUP_KEYS.list(), 'all'],
    queryFn: projectGroupService.getAllGroups
  });
}

export const useCreateProjectGroup = () => {
  return useMutation({
    mutationFn: projectGroupService.createGroup,
    onSuccess: () => {
      toast.success("Dodano grupę projektową.");
    },
  });
};
