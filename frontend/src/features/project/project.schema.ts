import {z} from "zod";

export const CreateProjectFormSchema = z.object({
    title: z.string().min(1, "Tytuł jest wymagany"),
    description: z.string().min(1, "Opis jest wymagany"),
    projectGroupId: z.uuid().nullable().optional(),
    sponsors: z.array(z.string()).min(1, "Dodaj co najmniej jednego sponsora"),
    committee: z.array(z.string()).min(1, "Dodaj co najmniej jedną osobę z komitetu"),
    milestones: z.array(z.object({
        name: z.string().min(1, "Tytuł kamienia milowego jest wymagany"),
        date: z.string().min(1, "Termin kamienia milowego jest wymagany")
    })).min(2, "Dodaj co najmniej 2 kamienie milowe"),
    roles: z.array(z.object({
        name: z.string().min(1, "Nazwa roli jest wymagana"),
        utilizationPercentages: z.array(z.number().min(0, "Utilizacja musi być liczbą dodatnią").max(100, "Utilizacja nie może przekraczać 100"))
    })).min(1, "Dodaj co najmniej jedną rolę"),
    risks: z.array(z.object({
        name: z.string().min(1, "Nazwa ryzyka jest wymagana"),
        description: z.string().min(1, "Opis ryzyka jest wymagany"),
        probability: z.number().min(0, "Prawdopodobieństwo musi być liczbą dodatnią").max(100, "Prawdopodobieństwo nie może przekraczać 100")
    })).optional(),
});

export type CreateProjectFormData = z.infer<typeof CreateProjectFormSchema>;