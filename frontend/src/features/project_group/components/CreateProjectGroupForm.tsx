import { FormProvider, useForm} from "react-hook-form";
import type { CreateProjectGroupFormData } from "../project_group.schema.ts";
import { type ProjectGroupCreationRequest } from "../project_group.types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths.ts";
import { CreateProjectGroupFormSchema } from "../project_group.schema.ts";
import { useSearchProjects } from "@/features/project/project.hooks.ts";
import { useCreateProjectGroup } from "../project_group.hooks.ts";
import { CreateProjectGroupFormView } from "./CreateProjectGroupForm.view.tsx";
import { ProjectGroupType } from "../project_group.types.ts";


export const CreateProjectGroupForm = () => {
    const methods = useForm<CreateProjectGroupFormData>({
      resolver: zodResolver(CreateProjectGroupFormSchema),
      defaultValues: {
          name: "",
          description: "",
          groupType: ProjectGroupType.WALLET,
          projectIds: [],
      }
    });

    const [projectQuery, setProjectQuery] = useState("");
    const [projectQueryValue] = useDebounce(projectQuery, 300);

    const { data: foundProjects = [] } = useSearchProjects({
        query: projectQueryValue,
        unassignedOnly: false,
        groupId: "",
        isActive: undefined
    });

    const unassignedProjects = foundProjects.filter(project => !project.group);

    const mutation = useCreateProjectGroup();
    const navigate = useNavigate();

    const onSubmit = (data: CreateProjectGroupFormData) => {
        const payload: ProjectGroupCreationRequest = {
            name: data.name,
            description: data.description,
            groupType: data.groupType,
            projectIds: data.projectIds,
        };

        mutation.mutate(payload, {
            onSuccess: () => {
                methods.reset();
                navigate(PATHS.ROOT);
            }
            }
          );
    };

    return (
        <FormProvider {...methods}>
            <CreateProjectGroupFormView
                onSubmit={onSubmit}
                foundProjects={unassignedProjects}
                onSearchProjects={setProjectQuery}
            />
        </FormProvider>
    )
}

export default CreateProjectGroupForm;