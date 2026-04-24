import { useForm, useFieldArray } from 'react-hook-form';
import { CreateProjectView } from './CreateProjectForm.view.tsx';
import type { ProjectCreationRequest } from '../project.types.ts';
import { useCreateProject } from '../project.hooks.ts';
import {PATHS} from "@/routes/paths.ts";
import {useNavigate} from "react-router-dom";

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

  const mutation = useCreateProject();
  const navigate = useNavigate();

  const onSubmit = (data: ProjectCreationRequest) => {
    
    const payload = {
      ...data,
      walletId: data.walletId ? Number(data.walletId) : undefined,
      programId: data.programId ? Number(data.programId) : undefined,
    };

    mutation.mutate(payload, {
      onSuccess: (newProjectId) =>  {
        reset();
        navigate(PATHS.PROJECT(newProjectId));
      }
    });
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