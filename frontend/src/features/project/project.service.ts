import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints.ts';
import type {
    ProjectCreationRequest,
    ProjectResponse,
    ProjectDetailsResponse,
    CreateEmployeeAssignmentRequest,
    RiskResponse,
    ProjectMembersResponse,
    ProjectTimelineResponse
} from './project.types';

export const projectService = {
    getAllProjects: async (): Promise<ProjectResponse[]> => {
        const { data } = await api.get<ProjectResponse[]>(ENDPOINTS.PROJECT.BASE);
        return data;
    },

    createProject: async (projectData: ProjectCreationRequest): Promise<string> => {
        const response = await api.post<string>(ENDPOINTS.PROJECT.BASE, projectData);
        return response.data;
    },

    getDetails: async (id: string): Promise<ProjectDetailsResponse> => {
        const response = await api.get<ProjectDetailsResponse>(ENDPOINTS.PROJECT.DETAILS(id).BASE);
        return response.data;
    },

    getProjectMembers: async (id: string): Promise<ProjectMembersResponse> => {
        const response = await api.get<ProjectMembersResponse>(ENDPOINTS.PROJECT.DETAILS(id).MEMBERS);
        return response.data;
    },

    getRisks: async (projectId: string): Promise<RiskResponse[]> => {
        const response = await api.get<RiskResponse[]>(ENDPOINTS.PROJECT.DETAILS(projectId).RISKS);
        return response.data;
    },

    createEmployeeAssignment: async (data: CreateEmployeeAssignmentRequest): Promise<void> => {
        await api.post<void>(ENDPOINTS.PROJECT.DETAILS(data.projectId).ASSIGNMENTS, data);
    },

  searchProjectsWithinGroup: async (searchTerm: string): Promise<ProjectDetailsResponse[]> => {
    const response = await api.get<ProjectDetailsResponse[]>(ENDPOINTS.PROJECT.BASE, {
      params: {
        query: searchTerm,
        unassignedOnly: true
      }
    });
    return response.data;
  },

    getProjectTimeline: async (projectId: string) => {
        const response = await api.get<ProjectTimelineResponse>(ENDPOINTS.PROJECT.DETAILS(projectId).TIMELINE);
        return response.data;
    }
};