import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import type {AllGroupsResponse, SingleGroupResponse} from "@/features/project_group/project_group.types.ts";

export const fetchProjectGroups = async (): Promise<SingleGroupResponse[]> => {
    const { data } = await apiClient.get<AllGroupsResponse>(ENDPOINTS.PROJECT_GROUP.LIST_ALL);
    return [ ...data.wallets, ...data.programs];
};