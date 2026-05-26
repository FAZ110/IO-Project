import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { PagedResponse, PaginationParams } from '@/api/api.types';
import type { ProjectDetailsResponse } from '@/features/project/project.types';
import type {InviteUserRequest, OwnedGroupResponse, SimpleUserResponse, UserListParams, UserProjectMembershipResponse, UserResponse, UserSearchableRole, UserWorkloadResponse} from './user-management.types';

export const userManagementService = {
  getUsers: async (params: PaginationParams & UserListParams = {}): Promise<PagedResponse<UserResponse>> => {
    const res = await api.get<PagedResponse<UserResponse>>(ENDPOINTS.USERS.LIST, { params });
    return res.data;
  },

  inviteUser: async (data: InviteUserRequest): Promise<void> => {
    await api.post(ENDPOINTS.ADMIN.INVITATIONS, data);
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(ENDPOINTS.USERS.DETAIL(userId));
  },

  resendInvitation: async (userId: string): Promise<void> => {
    await api.post(ENDPOINTS.USERS.RESEND_INVITATION, { userId });
  },

  searchUsers: async (searchTerm: string, userRole?: UserSearchableRole): Promise<SimpleUserResponse[]> => {
    const res = await api.get<SimpleUserResponse[]>(ENDPOINTS.USERS.SEARCH_USERS, {
      params: { search: searchTerm, ...(userRole ? { userRole } : {}) }
    });
    return res.data;
  },

  getUserWorkload: async (userId?: string): Promise<UserWorkloadResponse> => {
    const res = await api.get<UserWorkloadResponse>(ENDPOINTS.USERS.WORKLOAD(userId));
    return res.data;
  },

  getUser: async (userId: string): Promise<UserResponse> => {
    const res = await api.get<UserResponse>(ENDPOINTS.USERS.DETAIL(userId));
    return res.data;
  },

  getMyProfile: async (): Promise<UserResponse> => {
    const res = await api.get<UserResponse>(ENDPOINTS.ME.PROFILE);
    return res.data;
  },

  getSubordinates: async (userId: string): Promise<UserResponse[]> => {
    const res = await api.get<UserResponse[]>(ENDPOINTS.USERS.SUBORDINATES(userId));
    return res.data;
  },

  getManagedProjects: async (userId: string): Promise<ProjectDetailsResponse[]> => {
    const res = await api.get<ProjectDetailsResponse[]>(ENDPOINTS.USERS.PROJECTS(userId));
    return res.data;
  },

  getProjectMemberships: async (userId: string): Promise<UserProjectMembershipResponse[]> => {
    const res = await api.get<UserProjectMembershipResponse[]>(ENDPOINTS.USERS.MEMBERSHIPS(userId));
    return res.data;
  },

  getOwnedGroups: async (userId: string): Promise<OwnedGroupResponse[]> => {
    const res = await api.get<OwnedGroupResponse[]>(ENDPOINTS.USERS.GROUPS(userId));
    return res.data;
  },
};
