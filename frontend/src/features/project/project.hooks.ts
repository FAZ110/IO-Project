import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/features/project/project.service.ts';
import { toast } from 'sonner';
import {PROJECT_KEYS, ROLES_KEYS} from '@/features/project/project.keys.ts';
import type { AssignmentCreateRequest } from './project.types';

export const useProjects = () => {
    return useQuery({
        queryKey: PROJECT_KEYS.all,
        queryFn: projectService.getAllProjects,
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
            queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
        },
    });
};

export const useProjectRisks = (id: string) => {
    return useQuery({
        queryKey: PROJECT_KEYS.risks(id),
        queryFn: () => projectService.getRisks(id),
        enabled: !!id
    });
};

export const useProjectMembers = (id: string) => {
    return useQuery({
        queryKey: PROJECT_KEYS.members(id),
        queryFn: () => projectService.getProjectMembers(id),
        enabled: !!id
    });
};

export const useProjectRolesStatus = (projectId: string) => {
    return useQuery({
        queryKey: ROLES_KEYS.status(projectId),
        queryFn: () => projectService.getProjectRolesStatus(projectId),
        enabled: !!projectId
    });
};

export const useCreateEmployeeAssignment = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AssignmentCreateRequest) =>
            projectService.createEmployeeAssignment(projectId, data),
        onSuccess: () => {
            toast.success('Złożono wniosek o pracownika.');
            queryClient.invalidateQueries({ queryKey: ROLES_KEYS.status(projectId) });
        },
        onError: () => {
            toast.error('Wystąpił błąd podczas składania wniosku.');
        }
    });
};