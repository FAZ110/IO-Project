import { useFieldArray, useFormContext } from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types.ts";
import type { SimpleUserResponse } from "@/features/user-management";
import { UserAutocomplete } from "./UserAutocomplete.tsx";
import { StepBasicInformation } from "./StepBasicInformation.view.tsx";
import { StepMilestonesAndRisks } from "./StepMilestoneAndRisk.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreateProjectViewProps {
    onSubmitProject: () => Promise<void>;
    isPending: boolean;
    groups: { id: string; name: string }[];
    foundSponsors: SimpleUserResponse[];
    foundCommittee: SimpleUserResponse[];
    onSponsorSearch: (query: string) => void;
    onCommitteeSearch: (query: string) => void;
}

export const CreateProjectView = ({
    onSubmitProject,
    isPending,
    groups,
    foundSponsors,
    foundCommittee,
    onSponsorSearch,
    onCommitteeSearch,
}: CreateProjectViewProps) => {
    const {
        register,
        control,
        formState: { errors, isValid },
        watch,
        setValue,
    } = useFormContext<ProjectCreationRequest>();

    const milestones = watch("milestones");

    const {
        fields: riskFields,
        append: appendRisk,
        remove: removeRisk,
    } = useFieldArray({ control, name: "risks" });

    const {
        fields: milestonesFields,
        append: appendMilestone,
        remove: removeMilestone,
    } = useFieldArray({ control, name: "milestones" });

    return (
        <div className="max-w-3xl mx-auto p-6 mt-10">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Utwórz Nowy Projekt</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        className="space-y-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmitProject();
                        }}
                    >
                        <StepBasicInformation register={register} errors={errors} groups={groups} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="startDate">Data rozpoczęcia *</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    {...register("startDate")}
                                    className={errors.startDate ? "border-destructive" : ""}
                                />
                                {errors.startDate?.message && (
                                    <p className="text-destructive text-xs">{errors.startDate.message as string}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="endDate">Data zakończenia *</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    {...register("endDate")}
                                    className={errors.endDate ? "border-destructive" : ""}
                                />
                                {errors.endDate?.message && (
                                    <p className="text-destructive text-xs">{errors.endDate.message as string}</p>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-base font-semibold">Uczestnicy Główni</h3>
                            <UserAutocomplete
                                label="Sponsorzy"
                                foundUsers={foundSponsors}
                                onSearch={onSponsorSearch}
                                control={control}
                                setValue={setValue}
                                roles="sponsors"
                            />
                            <UserAutocomplete
                                label="Komitet Sterujący"
                                foundUsers={foundCommittee}
                                onSearch={onCommitteeSearch}
                                control={control}
                                setValue={setValue}
                                roles="committee"
                            />
                        </div>

                        <Separator />

                        <div className="space-y-6">
                            <StepMilestonesAndRisks
                                register={register}
                                control={control}
                                errors={errors}
                                riskFields={riskFields}
                                appendRisk={appendRisk}
                                removeRisk={removeRisk}
                                milestones={milestones}
                                milestonesFields={milestonesFields}
                                appendMilestone={appendMilestone}
                                removeMilestone={removeMilestone}
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={isPending || !isValid}
                                className="w-full sm:w-auto px-8"
                            >
                                {isPending ? "Tworzenie..." : "Zapisz i utwórz projekt"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
