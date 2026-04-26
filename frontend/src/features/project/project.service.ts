import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints.ts';
import type {
  ProjectCreationRequest, 
  ProjectDetailsResponse, 
  RiskResponse,
  VacancyResponse,
  CreateVacancyRequest,
  AllocationRequestResponse,
  CreateAllocationRequest
} from './project.types';

export const projectService = {
  create: async (projectData: ProjectCreationRequest): Promise<string> => {
    const response = await api.post<string>(ENDPOINTS.PROJECT.CREATE, projectData);
    return response.data;
  },

  getProjects: async (): Promise<ProjectDetailsResponse[]> => {
    const response = await api.get<ProjectDetailsResponse[]>(ENDPOINTS.PROJECT.LIST);
    return response.data;
  },

  getDetails: async (id: string): Promise<ProjectDetailsResponse> => {
    const response = await api.get<ProjectDetailsResponse>(ENDPOINTS.PROJECT.DETAIL(id));
    return response.data;
  },

  getRisks: async (projectId: string): Promise<RiskResponse[]> => {
    const response = await api.get<RiskResponse[]>(ENDPOINTS.PROJECT.RISK.LIST(projectId))
    return response.data;
  },

  getVacancies: async (projectId: string): Promise<VacancyResponse[]> => {
    const response = await api.get<VacancyResponse[]>(ENDPOINTS.PROJECT.VACANCIES.LIST(projectId));
    return response.data;
  },

  createVacancy: async (projectId: string, data: CreateVacancyRequest): Promise<VacancyResponse> => {
    const response = await api.post<VacancyResponse>(ENDPOINTS.PROJECT.VACANCIES.CREATE(projectId), data);
    return response.data;
  },

  createAllocationRequest: async (vacancyId: string, data: CreateAllocationRequest): Promise<AllocationRequestResponse> => {
    const response = await api.post<AllocationRequestResponse>(ENDPOINTS.VACANCIES.ALLOCATE(vacancyId), data);
    return response.data;
  }
};