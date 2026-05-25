import { useFieldArray, useFormContext } from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types.ts";
import { useState, useCallback } from "react";
import type { SimpleUserResponse } from "@/features/user-management";
import { UserAutocomplete } from "./UserAutocomplete.tsx";
import { StepBasicInformation } from "./StepBasicInformation.view.tsx";
import { StepMilestonesAndRisks } from "./StepMilestoneAndRisk.tsx";
import { Button } from "@/components/ui/button";

interface CreateProjectViewProps {
  onSubmitProject: () => Promise<void>;
  isPending: boolean;
  groups: { id: string; name: string }[];
  foundSponsors: SimpleUserResponse[];
  foundCommittee: SimpleUserResponse[];
  onSponsorSearch: (query: string) => void;
  onCommitteeSearch: (query: string) => void;
  message?: string;
}

export const CreateProjectView = ({
                                    onSubmitProject,
                                    isPending,
                                    groups,
                                    foundSponsors,
                                    foundCommittee,
                                    onSponsorSearch,
                                    onCommitteeSearch,
                                    message
                                  }: CreateProjectViewProps) => {
  const {
    register,
    control,
    formState: { errors, isValid },
    clearErrors,
    watch,
    setValue,
    getValues,
  } = useFormContext<ProjectCreationRequest>();

  const milestones = watch("milestones");

  const {
    fields: riskFields,
    append: appendRisk,
    remove: removeRisk,
  } = useFieldArray({
    control,
    name: "risks",
  });

  const {
    fields: milestonesFields,
    append: appendMilestone,
    remove: removeMilestone,
  } = useFieldArray({
    control,
    name: "milestones",
  });

  const [usersById, setUsersById] = useState<Record<string, SimpleUserResponse>>({});

  const rememberUser = useCallback((user: SimpleUserResponse) => {
    setUsersById((prev) => ({ ...prev, [user.id]: user }));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Utwórz Nowy Projekt</h2>

      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes("Błąd") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      <form className="space-y-8 text-left" onSubmit={(e) => { e.preventDefault(); onSubmitProject(); }}>

        <div className="space-y-6">
          <StepBasicInformation register={register} errors={errors} groups={groups} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data rozpoczęcia</label>
              <input
                type="date"
                {...register("startDate")}
                className={`w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.startDate ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.startDate?.message && <p className="text-red-500 text-sm mt-1">{errors.startDate.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data zakończenia</label>
              <input
                type="date"
                {...register("endDate")}
                className={`w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.endDate ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.endDate?.message && <p className="text-red-500 text-sm mt-1">{errors.endDate.message as string}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Uczestnicy Główni</h3>

          <div>
            <UserAutocomplete
              label="Sponsorzy"
              foundUsers={foundSponsors}
              onSearch={onSponsorSearch}
              setValue={setValue}
              getValues={getValues}
              roles="sponsors"
              clearErrors={clearErrors}
              usersById={usersById}
              onRememberUser={rememberUser}
            />
            {errors.sponsors?.message && <p className="text-red-500 text-sm mt-2">{errors.sponsors.message}</p>}
          </div>

          <div>
            <UserAutocomplete
              label="Komitet Sterujący"
              foundUsers={foundCommittee}
              onSearch={onCommitteeSearch}
              setValue={setValue}
              getValues={getValues}
              roles="committee"
              clearErrors={clearErrors}
              usersById={usersById}
              onRememberUser={rememberUser}
            />
            {errors.committee?.message && <p className="text-red-500 text-sm mt-2">{errors.committee.message}</p>}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <StepMilestonesAndRisks
            register={register}
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

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <Button
            type="submit"
            disabled={isPending || !isValid}
            className="w-full sm:w-auto px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isPending ? "Tworzenie..." : "Zapisz i utwórz projekt"}
          </Button>
        </div>
      </form>
    </div>
  );
};