import { useForm } from "react-hook-form";
import { CreateProjectView } from "./CreateProjectForm.view.tsx";
import type { ProjectCreationRequest } from "../project.types.ts";
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
import { Form } from "@/components/ui/form";

export const CreateProjectForm = () => {
  const methods = useForm<ProjectCreationRequest>({
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
      milestones: [],
      risks: []
    },
  });

  const { data: groups = [] } = useProjectGroups();

  const [sponsorsQuery, setSponsorsQuery] = useState("");
  const [sponsorsQueryValue] = useDebounce(sponsorsQuery, 300);

  const [committeeQuery, setCommitteeQuery] = useState("");
  const [committeeQueryValue] = useDebounce(committeeQuery, 300);

  const { users: foundSponsors = [] } = useSearchUsers(sponsorsQueryValue);
  const { users: foundCommittee = [] } = useSearchUsers(committeeQueryValue);

  const mutation = useCreateProject();
  const navigate = useNavigate();

  const onSubmit = methods.handleSubmit((data) => {
    mutation.mutate(data, {
      onSuccess: (newProjectId) => {
        methods.reset();
        navigate(PATHS.PROJECT(newProjectId));
      },
    });
  });

  return (
    <Form {...methods}>
      <CreateProjectView
        onSubmitProject={onSubmit}
        isPending={mutation.isPending}
        groups={groups}
        foundSponsors={foundSponsors}
        foundCommittee={foundCommittee}
        onSponsorSearch={setSponsorsQuery}
        onCommitteeSearch={setCommitteeQuery}
      />
    </Form>
  );
};

export default CreateProjectForm;