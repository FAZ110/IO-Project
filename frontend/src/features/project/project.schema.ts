import { z } from "zod";

export const CreateProjectFormSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  description: z.string().min(1, "Opis jest wymagany"),
  startDate: z.string().min(1, "Data rozpoczęcia jest wymagana"),
  endDate: z.string().min(1, "Data zakończenia jest wymagana"),
  projectGroupId: z.string().uuid().nullable().optional(),
  sponsors: z.array(z.string()).min(1, "Wymagany min. 1 sponsor"),
  committee: z.array(z.string()).min(1, "Wymagany min. 1 członek komitetu"),

  assignments: z.array(z.object({
    userId: z.string().uuid("Wybierz użytkownika"),
    userName: z.string(),
    roleName: z.string().min(1, "Rola jest wymagana"),
    startDate: z.string().min(1, "Data rozpoczęcia jest wymagana"),
    endDate: z.string().min(1, "Data zakończenia jest wymagana"),
    utilizationPercentage: z.number().min(0).max(100),
  })),

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

  roles: z.array(z.object({
    name: z.string().min(1),
    utilizationPercentages: z.array(z.number().min(0).max(100)),
  })),
});

export type CreateProjectFormData = z.infer<typeof CreateProjectFormSchema>;