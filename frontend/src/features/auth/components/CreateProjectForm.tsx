import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { CreateProjectView } from './CreateProjectForm.view';
import { createProject } from '../../project/project.service';
import type { ProjectCreationRequest } from '../../project/project.types';

export const CreateProjectForm = () => {
  const [message, setMessage] = useState('');

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<ProjectCreationRequest>({
    mode: 'all',
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      isActive: true,
      walletId: undefined,
      programId: undefined,
      risks: []
    }
  });

  const { fields: riskFields, append: appendRisk, remove: removeRisk } = useFieldArray({
    control,
    name: "risks"
  });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: (newProjectId) => {
      setMessage(`Sukces! Projekt został utworzony. ID: ${newProjectId}`);
      reset(); 
    },
    onError: (error) => {
      console.error('Błąd podczas tworzenia projektu:', error);
      setMessage('Błąd: Nie udało się utworzyć projektu.');
    }
  });

  const onSubmit = (data: ProjectCreationRequest) => {
    setMessage(''); 
    
    const payload = {
      ...data,
      walletId: data.walletId ? Number(data.walletId) : undefined,
      programId: data.programId ? Number(data.programId) : undefined,
    };

    mutation.mutate(payload);
  };

  return (
    <CreateProjectView
      register={register}
      onSubmit={handleSubmit(onSubmit)} 
      isPending={mutation.isPending}
      errors={errors}
      riskFields={riskFields}
      appendRisk={appendRisk}
      removeRisk={removeRisk}
      message={message}
    />
  );
};

export default CreateProjectForm;