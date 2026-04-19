import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { PagedResponse, PaginationParams } from '@/api/api.types';
import type { UserRole } from '@/features/auth/auth.types';
import type { InviteUserRequest, UserResponse } from './user-management.types';

export const userManagementService = {
  getUsers: async (params: PaginationParams & { userRole?: UserRole } = {}): Promise<PagedResponse<UserResponse>> => {
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
};
