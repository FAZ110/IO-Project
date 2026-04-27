import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {projectService} from "@/features/project/project.service.ts";
import {toast} from "sonner";
import {PROJECT_KEYS} from "@/features/project/project.keys.ts";
import type {EmployeeAssignmentRequest} from "./project.types";

export const useProjects = () => {
    return useQuery({
        queryKey: PROJECT_KEYS.list(),
        queryFn: () => projectService.getAllProjects(),
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

export const useCreateEmployeeAssignment = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: EmployeeAssignmentRequest) =>
            projectService.createEmployeeAssignment(data),
        onSuccess: () => {
            toast.success('Złożono wniosek o pracownika.');
            queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.rolesStatus(projectId) });
        },
        onError: () => {
            toast.error('Wystąpił błąd podczas składania wniosku.');
        }
    });
};
