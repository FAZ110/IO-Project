import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import type { ProjectCreationRequest, Project } from './project.types';


export const projectService = {
  getAllProjects: async () => {
    const { data } = await apiClient.get<Project[]>(ENDPOINTS.PROJECT.GETALL);
    return data;
  },

  createProject: async (projectData: ProjectCreationRequest): Promise<string> => {
    const response = await apiClient.post<string>(ENDPOINTS.PROJECT.CREATE, projectData);
    return response.data;
    }
}