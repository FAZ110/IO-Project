import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import type {AllGroupsResponse, SingleGroupResponse, ProjectGroupCreationRequest, ProjectGroupCreatedResponse} from "@/features/project_group/project_group.types.ts";

export const projectGroupService = {
    getAll: async (): Promise<SingleGroupResponse[]> => {
        const { data } = await apiClient.get<AllGroupsResponse>(ENDPOINTS.PROJECT_GROUP.LIST_ALL);
        return [ ...data.wallets, ...data.programs];
    },

    createGroup: async (projectGroupData: ProjectGroupCreationRequest): Promise<string> => {
        const response = await apiClient.post<ProjectGroupCreatedResponse>(ENDPOINTS.PROJECT_GROUP.CREATE, projectGroupData);
        return response.data.id;
    }
};