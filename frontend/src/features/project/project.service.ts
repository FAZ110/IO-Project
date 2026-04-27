import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints.ts';
import type {
    ProjectCreationRequest,
    ProjectResponse,
    ProjectDetailsResponse,
    ProjectRoleStatusResponse,
    EmployeeAssignmentRequest
} from './project.types';

export const projectService = {
    getAllProjects: async (): Promise<ProjectResponse[]> => {
        const { data } = await api.get<ProjectResponse[]>(ENDPOINTS.PROJECT.BASE);
        return data;
    },

    create: async (projectData: ProjectCreationRequest): Promise<string> => {
        const response = await api.post<string>(ENDPOINTS.PROJECT.BASE, projectData);
        return response.data;
    },

    getDetails: async (id: string): Promise<ProjectDetailsResponse> => {
        const response = await api.get<ProjectDetailsResponse>(ENDPOINTS.PROJECT.DETAIL(id));
        return response.data;
    },

    getProjectRolesStatus: async (projectId: string): Promise<ProjectRoleStatusResponse[]> => {
        const response = await api.get<ProjectRoleStatusResponse[]>(ENDPOINTS.PROJECT.ROLES.STATUS_LIST(projectId));
        return response.data;
    },

    createEmployeeAssignment: async (data: EmployeeAssignmentRequest): Promise<void> => {
        await api.post<void>('/employee/requests', data);
    }
};