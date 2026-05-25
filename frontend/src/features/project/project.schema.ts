import { z } from "zod";

export const CreateProjectFormSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  description: z.string().min(1, "Opis jest wymagany"),
  startDate: z.string().min(1, "Data rozpoczęcia jest wymagana"),
  endDate: z.string().min(1, "Data zakończenia jest wymagana"),
  projectGroupId: z.string().uuid().nullable().optional(),
  sponsors: z.array(z.string()),
  committee: z.array(z.string()),

  milestones: z.array(z.object({
    name: z.string().min(1, "Milestone musi mieć nazwe"),
    date: z.string().min(1, "Milestone musi mieć date"),
    description: z.string().optional()
  })),

  risks: z.array(z.object({
    name: z.string().min(1, "Ryzyko musi mieć nazwe"),
    description: z.string().min(1, "Ryzyko musi mieć opis"),
    probability: z.number().min(1, "Minimum to 1").max(5, "Maksimum to 5"),
    impact: z.number().min(1, "Minimum to 1").max(5, "Maksimum to 5")
  })),
}).refine(
  (data) => !data.startDate || !data.endDate || data.endDate >= data.startDate,
  { message: "Data zakończenia musi być po dacie rozpoczęcia", path: ["endDate"] }
);

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

