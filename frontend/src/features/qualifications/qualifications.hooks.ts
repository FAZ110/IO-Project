import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { qualificationsService } from './qualifications.service';
import type { AddQualificationRequest } from './qualifications.types';
import { queryKeys } from '@/api';

export const useMyQualificationsQuery = () =>
  useQuery({
    queryKey: queryKeys.qualifications.mine.queryKey,
    queryFn: qualificationsService.getMyQualifications,
  });

export const useAddQualificationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddQualificationRequest) => qualificationsService.addQualifications(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.qualifications.mine.queryKey }),
  });
};

export const useDeleteQualificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => qualificationsService.deleteQualification(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.qualifications.mine.queryKey }),
  });
};

export const useSkillSuggestionsQuery = (query: string) =>
  useQuery({
    queryKey: queryKeys.qualifications.suggestions(query).queryKey,
    queryFn: () => qualificationsService.searchSkills(query),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });

export const useWaitingQualificationsSummaryQuery = () => {
  const waitingQualificationsQuery = useQuery({
    queryKey: queryKeys.approvals.waitingSummary.queryKey,
    queryFn: qualificationsService.getUsersWithWaitingQualifications
  });

  return {
    waitingQualificationsSummary: waitingQualificationsQuery.data,
    isLoading: waitingQualificationsQuery.isPending
  }
}

export const useQualificationDetailsQuery = (userId: string) => {
  const qualificationsQuery = useQuery({
    queryKey: queryKeys.approvals.details(userId).queryKey,
    queryFn: () => qualificationsService.getQualificationRequestDetails(userId),
    enabled: !!userId, // zapytanie uruchomi się tylko gdy mamy userId
  });

  return {
    rowDetails: qualificationsQuery.data,
    isLoading: qualificationsQuery.isPending
  }
}

export const useUpdateQualifications = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: qualificationsService.updateQualificationRequests,
    onSuccess: () => {
      queryClient.invalidateQueries();
    }
  });

  return {
    updateQualifications: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  }
}
