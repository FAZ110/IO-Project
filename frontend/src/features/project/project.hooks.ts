import {useMutation, useQuery} from "@tanstack/react-query";
import {projectService} from "@/features/project/project.service.ts";
import {toast} from "sonner";

export const useProjectDetails = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getDetails(id),
    enabled: !!id
  });
}

export const useCreateProject = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      toast.success('Dodano projekt.');

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },

  });
};