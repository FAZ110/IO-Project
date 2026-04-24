// src/features/project/project.hooks.ts
import { useQuery } from '@tanstack/react-query';
import { projectService } from './project.service';


export const useProjects = () => {
  return useQuery({
    queryKey: ['projects', 'all'],
    queryFn: projectService.getAllProjects,
  });
};