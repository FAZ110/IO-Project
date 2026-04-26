import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {projectService} from "@/features/project/project.service.ts";
import {toast} from "sonner";
import {PROJECT_KEYS} from "@/features/project/project.keys.ts";
import type {CreateAllocationRequest} from "./project.types";

export const useProjects = () => {
  return useQuery({
    queryKey: PROJECT_KEYS.list(),
    queryFn: () => projectService.getProjects(),
  });
};

export const useProjectDetails = (id: string) => {
  return useQuery({
    queryKey: PROJECT_KEYS.detail(id),
    queryFn: () => projectService.getDetails(id),
    enabled: !!id
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      toast.success('Dodano projekt.');
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.list() });
    },
  });
};

export const useProjectRolesStatus = (projectId: string) => {
  return useQuery({
    queryKey: PROJECT_KEYS.rolesStatus(projectId),
    queryFn: () => projectService.getProjectRolesStatus(projectId),
    enabled: !!projectId
  });
};

export const useCreateAllocationRequest = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: CreateAllocationRequest }) => 
      projectService.createAllocationRequest(roleId, data),
    onSuccess: () => {
      toast.success('Złożono wniosek o pracownika.');
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.rolesStatus(projectId) });
    },
    onError: () => {
      toast.error('Wystąpił błąd podczas składania wniosku.');
    }
  });
};
