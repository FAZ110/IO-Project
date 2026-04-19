import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userManagementService } from './user-management.service';
import type { InviteUserRequest } from './user-management.types';

const USERS_QUERY_KEY = ['admin', 'users'] as const;

export const useUsersQuery = (page: number, size: number) =>
  useQuery({
    queryKey: [...USERS_QUERY_KEY, page, size],
    queryFn: () => userManagementService.getUsers({ pageNumber: page, pageSize: size }),
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
