import { useForm, useFieldArray } from 'react-hook-form';
import { CreateProjectView } from './CreateProjectForm.view.tsx';
import type { ProjectCreationRequest } from '../../project.types.ts';
import { useCreateProject } from '../../project.hooks.ts';
import {useProjectGroups} from "@/features/project_group/project_group.hooks.ts";
import {useState} from "react";
import {useSearchUsers} from "@/features/user-management/user-management.hooks.ts";

export const CreateProjectForm = () => {

  const { register, control, handleSubmit, formState: { errors }, setError, clearErrors, reset, setValue, getValues, watch, trigger } = useForm<ProjectCreationRequest>({
    mode: 'all',
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      projectGroupId: '',
      sponsors: [],
      committee: [],
      milestones: [],
      roles: [],
      risks: []
    }
  });

  const { data: groups = []} = useProjectGroups();

  const [userQuery, setUserQuery] = useState('');
  const { data: foundUsers = [] } = useSearchUsers(userQuery);

  const { fields: riskFields, append: appendRisk, remove: removeRisk } = useFieldArray({
    control,
    name: "risks"
  });

  const { fields: maileStonesFields, append: appendMileStone, remove: removeMileStone } = useFieldArray({
    control,
    name: "milestones",
    rules: {
      minLength: {
        value: 2,
        message: "Muszą być co najmniej dwa kamienie milowe"
    }
    }
  });

<<<<<<< HEAD:frontend/src/features/project/components/CreateProjectForm.tsx
  const mutation = useCreateProject(() => reset());
=======
  const mutation = useCreateProject();
  const navigate = useNavigate();
>>>>>>> 7eb1fea (Update form to create new project with roles time allocations):frontend/src/features/project/components/create_project/CreateProjectForm.tsx

  const onSubmit = (data: ProjectCreationRequest) => {
    let hasError = false;

    if (data.roles.length < 1) {
      setError("roles", {
        type: "manual",
        message: "Dodaj co najmniej jedną rolę"
      });
      hasError = true;
    } else {
      clearErrors("roles");
    }

    if (data.sponsors.length < 1) {
      setError("sponsors", {
        type: "manual",
        message: "Dodaj co najmniej jednego sponsora",
      });
      hasError = true;
    } else {
      clearErrors("sponsors");
    }

    if (data.committee.length < 1) {
      setError("committee", {
        type: "manual",
        message: "Dodaj co najmniej jedną osobę z komitetu",
      });
      hasError = true;
    } else {
      clearErrors("committee");
    }

  if (hasError) return;

    const payload = {
      ...data,
      startDate: data.milestones[0].date
    };

<<<<<<< HEAD:frontend/src/features/project/components/CreateProjectForm.tsx
    mutation.mutate(payload);
=======
    mutation.mutate(payload, {
      onSuccess: (newProjectId) =>  {
        reset();
        navigate(PATHS.PROJECT(newProjectId));
      }
    });
>>>>>>> 7eb1fea (Update form to create new project with roles time allocations):frontend/src/features/project/components/create_project/CreateProjectForm.tsx
  };

  return (
    <CreateProjectView
        register={register}
        setValue={setValue}
        getValues={getValues}
        milestones={watch("milestones")}
        errors={errors}
        setError={setError}
        clearErrors={clearErrors}
        trigger={trigger}
        onSubmit={handleSubmit(onSubmit)}
        isPending={mutation.isPending}

        groups={groups}

        foundUsers={foundUsers}
        onUserSearch={setUserQuery}

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