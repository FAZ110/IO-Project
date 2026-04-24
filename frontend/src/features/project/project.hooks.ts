// project.hooks.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createProject } from './project.service.ts';

export const useCreateProject = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success('Dodano projekt.');
      
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    
  });
};