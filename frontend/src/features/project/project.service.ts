import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import type { ProjectCreationRequest } from './project.types';

export const createProject = async (projectData: ProjectCreationRequest): Promise<string> => {
    const response = await apiClient.post<string>(ENDPOINTS.PROJECT.CREATE, projectData);
    return response.data;
};