import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { PagedResponse, PaginationParams } from '@/api/api.types';
import type {InviteUserRequest, SimpleUserResponse, UserListParams, UserResponse} from './user-management.types';

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

  searchUsers: async (searchTerm: string): Promise<SimpleUserResponse[]> => {
    const res = await api.get<SimpleUserResponse[]>(ENDPOINTS.USERS.SEARCH_USERS, {
      params: {
        search: searchTerm
      }
    });
    return res.data;
  }
};
