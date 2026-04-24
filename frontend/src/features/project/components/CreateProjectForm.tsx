import { useForm, useFieldArray } from 'react-hook-form';
import { CreateProjectView } from './CreateProjectForm.view.tsx';
import type { ProjectCreationRequest } from '../project.types.ts';
import { useCreateProject } from '../project.hooks.ts';
import {useProjectGroups} from "@/features/project_group/project_group.hooks.ts";
import {useState} from "react";
import {useSearchUsers} from "@/features/user-management/user-management.hooks.ts";

export const CreateProjectForm = () => {

  const { register, control, handleSubmit, formState: { errors }, reset, setValue, getValues, watch } = useForm<ProjectCreationRequest>({
    mode: 'all',
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      projectGroupId: '',
      sponsors: [],
      committee: [],
      milestones: [],
      risks: []
    }
  });

  const { data: groups = []} = useProjectGroups();

  const [sponsorQuery, setSponsorQuery] = useState('');
  const { data: foundSponsors = [] } = useSearchUsers(sponsorQuery);

  const { fields: riskFields, append: appendRisk, remove: removeRisk } = useFieldArray({
    control,
    name: "risks"
  });

  const { fields: maileStonesFields, append: appendMileStone, remove: removeMileStone } = useFieldArray({
    control,
    name: "milestones"
  });

  const mutation = useCreateProject(() => reset());

  const onSubmit = (data: ProjectCreationRequest) => {

    const payload = {
      ...data
    };

    mutation.mutate(payload);
  };

  return (
    <CreateProjectView
        register={register}
        setValue={setValue}
        getValues={getValues}
        milestones={watch("milestones")}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        isPending={mutation.isPending}

        groups={groups}

        foundSponsors={foundSponsors}
        onSponsorSearch={setSponsorQuery}

        riskFields={riskFields}
        appendRisk={appendRisk}
        removeRisk={removeRisk}

        maileStonesFields={maileStonesFields}
        appendMileStone={appendMileStone}
        removeMileStone={removeMileStone}
    />
  );
};

export default CreateProjectForm;