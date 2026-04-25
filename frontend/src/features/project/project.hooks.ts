import { useMutation, useQuery } from '@tanstack/react-query';
import { projectService } from '@/features/project/project.service.ts';
import { toast } from 'sonner';
import { PROJECT_KEYS } from '@/features/project/project.keys.ts';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects', 'all'],
    queryFn: projectService.getAllProjects,
  });
};

export const useProjectDetails = (id: string) => {
  return useQuery({
    queryKey: PROJECT_KEYS.detail(id),
    queryFn: () => projectService.getDetails(id),
    enabled: !!id
  });
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      toast.success('Dodano projekt.');
    },
  });
};