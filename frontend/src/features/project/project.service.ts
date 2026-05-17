import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints.ts";
import type {
  ProjectCreationRequest,
  ProjectDetailsResponse,
  CreateEmployeeAssignmentRequest,
  RiskResponse,
  ProjectMembersResponse,
  SearchProjectsRequest,
} from "./project.types";
import { buildProjectSearchParams } from "./project.utils";

export const projectService = {
  getAllProjects: async (): Promise<ProjectDetailsResponse[]> => {
    const { data } = await api.get<ProjectDetailsResponse[]>(ENDPOINTS.PROJECT.BASE);
    return data;
  },

  create: async (projectData: ProjectCreationRequest): Promise<string> => {
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

  searchProjects: async (request: SearchProjectsRequest): Promise<ProjectDetailsResponse[]> => {
    const params = buildProjectSearchParams(request);

    const { data } = await api.get<ProjectDetailsResponse[]>(ENDPOINTS.PROJECT.BASE, {
      params,
    });

    return data;
  },
};
