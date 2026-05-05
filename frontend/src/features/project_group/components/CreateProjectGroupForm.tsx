import { useForm} from "react-hook-form";
import type { ProjectGroupCreationRequest } from "../project_group.types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths.ts";
import { CreateProjectGroupFormSchema } from "../project_group.schema.ts";
import { useSearchProjects } from "@/features/project/project.hooks.ts";
import { useCreateProjectGroup } from "../project_group.hooks.ts";
import { CreateProjectGroupFormView } from "./CreateProjectGroupForm.view.tsx";


export const CreateProjectGroupForm = () => {
    const methods = useForm<ProjectGroupCreationRequest>({
      resolver: zodResolver(CreateProjectGroupFormSchema),
      defaultValues: {
          name: "",
          description: "",
          groupType: "WALLET",
          projectIds: [],
      }
    });

    const [projectQuery, setProjectQuery] = useState("");
    const [projectQueryValue] = useDebounce(projectQuery, 300);

    const { data: foundProjects = [] } = useSearchProjects(projectQueryValue);

    const mutation = useCreateProjectGroup();
    const navigate = useNavigate();

    const onSubmit = (data: ProjectGroupCreationRequest) => {
        mutation.mutate(data, {
            onSuccess: () => {
                methods.reset();
                navigate(PATHS.ROOT);
            }
            }
          );
    };

    return (
        <CreateProjectGroupFormView 
            methods={methods}
            onSubmit={onSubmit} 
            foundProjects={foundProjects}
            onSearchProjects={setProjectQuery}
        />
    )

}

export default CreateProjectGroupForm;