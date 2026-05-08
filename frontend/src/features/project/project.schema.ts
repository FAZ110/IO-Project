import { z } from "zod";

export const CreateProjectFormSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  description: z.string().min(1, "Opis jest wymagany"),
  startDate: z.string().min(1, "Data rozpoczęcia jest wymagana"),
  endDate: z.string().min(1, "Data zakończenia jest wymagana"),
  projectGroupId: z.string().uuid().nullable().optional(),
  sponsors: z.array(z.string()).min(1, "Wymagany min. 1 sponsor"),
  committee: z.array(z.string()).min(1, "Wymagany min. 1 członek komitetu"),

  milestones: z.array(z.object({
    name: z.string().min(1),
    date: z.string().min(1),
    description: z.string().optional()
  })),

  risks: z.array(z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    probability: z.number()
  })),
});

export type CreateProjectFormData = z.infer<typeof CreateProjectFormSchema>;