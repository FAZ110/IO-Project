import { useForm, useFieldArray } from 'react-hook-form';
import { CreateProjectView } from './CreateProjectForm.view.tsx';
import type { ProjectCreationRequest } from '../project.types.ts';
import { useCreateProject } from '../project.hooks.ts';

export const CreateProjectForm = () => {

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

  const mutation = useCreateProject(() => reset());

  const onSubmit = (data: ProjectCreationRequest) => {
    
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
    />
  );
};

export default CreateProjectForm;