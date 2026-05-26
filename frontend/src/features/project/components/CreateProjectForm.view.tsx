import { useFieldArray, useFormContext } from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types.ts";
import type { SimpleUserResponse } from "@/features/user-management";
import type { GroupBasicResponse } from "@/features/project_group/project_group.types.ts";
import { UserAutocomplete } from "./UserAutocomplete.tsx";
import { StepBasicInformation } from "./StepBasicInformation.view.tsx";
import { StepMilestonesAndRisks } from "./StepMilestoneAndRisk.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { getNextDateFromToday } from "../project.utils.ts";

interface CreateProjectViewProps {
  onSubmitProject: () => Promise<void>;
  isPending: boolean;
  groups: GroupBasicResponse[];
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
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const today = getNextDateFromToday(0);

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
              <FormField
                control={control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data rozpoczęcia *</FormLabel>
                    <FormControl>
                      {/* BLOKADA Z PRZESZŁOŚCI: min={today} */}
                      <Input type="date" min={today} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data zakończenia *</FormLabel>
                    <FormControl>
                      {/* BLOKADA: Koniec nie może być przed startem (ani przed dzisiaj) */}
                      <Input type="date" min={startDate || today} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                milestonesFields={milestonesFields}
                appendMilestone={appendMilestone}
                removeMilestone={removeMilestone}
                projectStartDate={startDate}
                projectEndDate={endDate}
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