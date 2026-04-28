import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { qualificationsService } from './qualifications.service';
import { MY_QUALIFICATIONS_QUERY_KEY, SKILL_SUGGESTIONS_QUERY_KEY } from './query-keys';
import type { AddQualificationRequest } from './qualifications.types';

export const useMyQualificationsQuery = () =>
  useQuery({
    queryKey: MY_QUALIFICATIONS_QUERY_KEY,
    queryFn: qualificationsService.getMyQualifications,
  });

export const useAddQualificationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddQualificationRequest) => qualificationsService.addQualifications(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_QUALIFICATIONS_QUERY_KEY }),
  });
};

export const useDeleteQualificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => qualificationsService.deleteQualification(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_QUALIFICATIONS_QUERY_KEY }),
  });
};

export const useSkillSuggestionsQuery = (query: string) =>
  useQuery({
    queryKey: SKILL_SUGGESTIONS_QUERY_KEY(query),
    queryFn: () => qualificationsService.searchSkills(query),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
