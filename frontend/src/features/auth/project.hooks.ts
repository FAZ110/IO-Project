import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectService } from '../project/project.service'; 

export const useCreateProject = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      toast.success('Dodano projekt.');
      
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    
  });
};