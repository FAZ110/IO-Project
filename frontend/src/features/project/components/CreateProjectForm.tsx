import { useForm, useFieldArray } from 'react-hook-form';
import { CreateProjectView } from './CreateProjectForm.view.tsx';
import type { ProjectCreationRequest } from '../project.types.ts';
import { useCreateProject } from '../project.hooks.ts';
import { PATHS } from "@/routes/paths.ts";
import { useNavigate } from "react-router-dom";

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
      risks: [],
      roles: [] // roles represent our vacancies at creation
    }
  });

  const { fields: riskFields, append: appendRisk, remove: removeRisk } = useFieldArray({
    control,
    name: "risks"
  });

  const { fields: roleFields, append: appendRole, remove: removeRole } = useFieldArray({
    control,
    name: "roles"
  });

  const mutation = useCreateProject();
  const navigate = useNavigate();

  const onSubmit = (data: ProjectCreationRequest) => {
    
    // Create dummy milestones to pass backend validation
    const startDate = new Date(data.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6); // default 6-month project length
    
    // Ensure all roles have utilization percentages matching the segment count (we have 1 segment -> [100])
    const mappedRoles = (data.roles || []).map(r => ({
      name: r.name,
      utilizationPercentages: [100] // hardcoded 100% utilization for 1 segment for simplicity
    }));

    const payload = {
      ...data,
      walletId: data.walletId ? Number(data.walletId) : undefined,
      programId: data.programId ? Number(data.programId) : undefined,
      milestones: [
        { name: 'Start', date: data.startDate },
        { name: 'Koniec', date: endDate.toISOString().split('T')[0] }
      ],
      roles: mappedRoles
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
      roleFields={roleFields}
      appendRole={appendRole}
      removeRole={removeRole}
    />
  );
};

export default CreateProjectForm;