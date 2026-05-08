import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userManagementService } from './user-management.service';
import type { InviteUserRequest, UserListParams } from './user-management.types';
import { usersKeys } from './query-keys';

export const useUsersQuery = (page: number, size: number, filters: UserListParams = {}) => {
  const usersQuery = useQuery({
    queryKey: usersKeys.list(page, size, filters).queryKey,
    queryFn: () => userManagementService.getUsers({ pageNumber: page, pageSize: size, ...filters }),
  });

  return {
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
  }
}

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
  const usersQuery = useQuery({
    queryKey: usersKeys.search(searchTerm).queryKey,
    queryFn: () => userManagementService.searchUsers(searchTerm),
    enabled: searchTerm.length >= 2
  });

  return {
    users: usersQuery.data,
    isLoadingUsers: usersQuery.isLoading,
    isErrorUsers: usersQuery.isError,
  }
}


export const useUserWorkload = (userId?: string) => {
  const workloadQuery = useQuery({
    queryKey: usersKeys.workload(userId).queryKey,
    queryFn: () => userManagementService.getUserWorkload(userId),
    enabled: !!userId
  });

  return {
    userWorkload: workloadQuery.data?.workload,
    isLoadingWorkload: workloadQuery.isLoading,
    isErrorWorkload: workloadQuery.isError,
  };
}