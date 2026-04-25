import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints.ts';
import type { ProjectCreationRequest, Project, ProjectDetailsResponse, RiskResponse } from './project.types';

export const projectService = {
  getAllProjects: async () => {
    const { data } = await api.get<Project[]>(ENDPOINTS.PROJECT.GETALL);
    return data;
  },

  create: async (projectData: ProjectCreationRequest): Promise<string> => {
    const response = await api.post<string>(ENDPOINTS.PROJECT.CREATE, projectData);
    return response.data;
  },

  getDetails: async (id: string): Promise<ProjectDetailsResponse> => {
    const response = await api.get<ProjectDetailsResponse>(ENDPOINTS.PROJECT.DETAIL(id));
    return response.data;
  },

  getRisks: async (projectId: string): Promise<RiskResponse[]> => {
    const response = await api.get<RiskResponse[]>(ENDPOINTS.PROJECT.RISK.LIST(projectId));
    return response.data;
  }
};