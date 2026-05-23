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
    probability: z.number().min(1, "Minimum to 1").max(5, "Maksimum to 5"),
    impact: z.number().min(1, "Minimum to 1").max(5, "Maksimum to 5")
  })),
});

export type CreateProjectFormData = z.infer<typeof CreateProjectFormSchema>;

export const CreateAssignmentSchema = z.object({
  projectId: z.uuid("Nieprawidłowy format ID projektu"),
  userId: z.string().min(1, "Musisz wybrać pracownika"),
  roleName: z.string().min(2, "Nazwa roli jest za krótka"),
  utilizationPercentage: z.number().min(1).max(100),
  startDate: z.date({ error: "Data rozpoczęcia jest wymagana" }),
  endDate: z.date({ error: "Data zakończenia jest wymagana" }),
}).refine((data) => data.endDate > data.startDate, {
  message: "Data zakończenia musi być po dacie rozpoczęcia",
  path: ["endDate"],
});

export type CreateAssignmentFormData = z.infer<typeof CreateAssignmentSchema>;

