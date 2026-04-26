import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {projectService} from "@/features/project/project.service.ts";
import {toast} from "sonner";
import {PROJECT_KEYS} from "@/features/project/project.keys.ts";
import type {CreateVacancyRequest, CreateAllocationRequest} from "./project.types";

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

export const useProjectVacancies = (projectId: string) => {
  return useQuery({
    queryKey: PROJECT_KEYS.vacancies(projectId),
    queryFn: () => projectService.getVacancies(projectId),
    enabled: !!projectId
  });
};

export const useCreateVacancy = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVacancyRequest) => projectService.createVacancy(projectId, data),
    onSuccess: () => {
      toast.success('Dodano nowy wakat.');
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.vacancies(projectId) });
    },
    onError: () => {
      toast.error('Nie udało się utworzyć wakatu.');
    }
  });
};

export const useCreateAllocationRequest = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vacancyId, data }: { vacancyId: string; data: CreateAllocationRequest }) => 
      projectService.createAllocationRequest(vacancyId, data),
    onSuccess: () => {
      toast.success('Złożono wniosek o pracownika.');
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.vacancies(projectId) });
    },
    onError: () => {
      toast.error('Wystąpił błąd podczas składania wniosku.');
    }
  });
};
