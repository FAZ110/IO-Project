import { useForm, FormProvider } from "react-hook-form";
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

export const CreateProjectForm = () => {
    const methods = useForm<ProjectCreationRequest>({
        resolver: zodResolver(CreateProjectFormSchema),
        mode: "all",
        defaultValues: {
            title: "",
            description: "",
            projectGroupId: "",
            sponsors: [],
            committee: [],
            milestones: [
                {
                    name: "",
                    date: "",
                },
                {
                    name: "",
                    date: "",
                }
            ],
            roles: [],
            risks: [],
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

    const onSubmit = methods.handleSubmit((data) => {

        mutation.mutate(data, {
            onSuccess: (newProjectId) => {
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
