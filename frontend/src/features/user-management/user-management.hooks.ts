import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userManagementService } from './user-management.service';
import type { InviteUserRequest, UserListParams } from './user-management.types';
import { usersKeys } from './query-keys';

export const useUsersQuery = (page: number, size: number, filters: UserListParams = {}) =>
  useQuery({
    queryKey: usersKeys.list(page, size, filters).queryKey,
    queryFn: () => userManagementService.getUsers({ pageNumber: page, pageSize: size, ...filters }),
  });

export const useInviteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserRequest) => userManagementService.inviteUser(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys._def }),
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userManagementService.deleteUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys._def }),
  });
};

export const useResendInvitationMutation = () =>
  useMutation({
    mutationFn: (userId: string) => userManagementService.resendInvitation(userId),
  });

export const useSearchUsers = (searchTerm: string) => {
    return useQuery({
        queryKey: usersKeys.search(searchTerm).queryKey,
        queryFn: () => userManagementService.searchUsers(searchTerm),
        enabled: searchTerm.length >= 2
    });
}
