import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userManagementService } from './user-management.service';
import type { InviteUserRequest, UserListParams } from './user-management.types';
import { USERS_QUERY_KEY } from './query-keys';

export const useUsersQuery = (page: number, size: number, filters: UserListParams = {}) =>
  useQuery({
    queryKey: [...USERS_QUERY_KEY, page, size, filters],
    queryFn: () => userManagementService.getUsers({ pageNumber: page, pageSize: size, ...filters }),
  });

export const useInviteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserRequest) => userManagementService.inviteUser(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userManagementService.deleteUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
  });
};

export const useResendInvitationMutation = () =>
  useMutation({
    mutationFn: (userId: string) => userManagementService.resendInvitation(userId),
  });
