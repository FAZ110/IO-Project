import { useForm, FormProvider } from "react-hook-form";
import { CreateProjectView } from "./CreateProjectForm.view.tsx";
import type { CreateProjectFormData } from "../project.schema.ts";
import { useCreateProject } from "../project.hooks.ts";
import { useProjectGroups } from "@/features/project_group/project_group.hooks.ts";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useSearchUsers } from "@/features/user-management/user-management.hooks.ts";
import { PATHS } from "@/routes/paths.ts";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProjectFormSchema } from "../project.schema.ts";
import { getNextDateFromToday } from "../project.utils.ts";
import { projectService } from "../project.service.ts";

export const CreateProjectForm = () => {
  const methods = useForm<CreateProjectFormData>({
    resolver: zodResolver(CreateProjectFormSchema),
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
      startDate: getNextDateFromToday(0),
      endDate: getNextDateFromToday(30),
      projectGroupId: null,
      sponsors: [],
      committee: [],
      assignments: [],
      milestones: [],
      risks: [],
      roles: [],
    },
  });

  const { data: groups = [] } = useProjectGroups();

  const [sponsorsQuery, setSponsorsQuery] = useState("");
  const [sponsorsQueryValue] = useDebounce(sponsorsQuery, 300);

  const [committeeQuery, setCommitteeQuery] = useState("");
  const [committeeQueryValue] = useDebounce(committeeQuery, 300);

  const { data: foundSponsors = [] } = useSearchUsers(sponsorsQueryValue);
  const { data: foundCommittee = [] } = useSearchUsers(committeeQueryValue);

  const mutation = useCreateProject();
  const navigate = useNavigate();

  const onSubmit = methods.handleSubmit(async (data) => {
    const { assignments, roles: _roles, ...projectPayload } = data;

    mutation.mutate(projectPayload, {
      onSuccess: async (newProjectId) => {
        await Promise.all(
          assignments.map(({ userName: _userName, ...assignment }) =>
            projectService.createEmployeeAssignment(newProjectId, assignment)
          )
        );

        methods.reset();
        navigate(PATHS.PROJECT(newProjectId));
      },
    });
  });

  return (
    <FormProvider {...methods}>
      <CreateProjectView
        onSubmitProject={onSubmit}
        isPending={mutation.isPending}
        groups={groups}
        foundSponsors={foundSponsors}
        foundCommittee={foundCommittee}
        onSponsorSearch={setSponsorsQuery}
        onCommitteeSearch={setCommitteeQuery}
      />
    </FormProvider>
  );
};

export default CreateProjectForm;
