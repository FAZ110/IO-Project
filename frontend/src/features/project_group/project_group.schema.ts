import { z } from "zod";
import { PROJECT_GROUP_TYPE_VALUES } from "./project_group.types";

export const CreateProjectGroupFormSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  description: z.string().min(1, "Opis jest wymagany"),
  groupType: z.enum(PROJECT_GROUP_TYPE_VALUES, "Wybierz typ grupy projektowej"),
  projectIds: z.array(z.string()),
});

export type CreateProjectGroupFormData = z.infer<typeof CreateProjectGroupFormSchema>;
