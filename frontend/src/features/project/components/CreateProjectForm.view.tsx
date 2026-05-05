import { useFieldArray, useFormContext } from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types.ts";
import { useState, useCallback } from "react";
import type { SimpleUserResponse } from "@/features/user-management";
import { UserAutocomplete } from "./UserAutocomplete.tsx";
import { StepProgressTracker } from "./StepProgressTracker.tsx";
import { StepBasicInformation } from "./StepBasicInformation.view.tsx";
import { StepMilestonesAndRisks } from "./StepMilestoneAndRisk.tsx";
import { StepNavigation } from "./StepNavigation.tsx";

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

export const CreateProjectView = ({ onSubmitProject, isPending, groups, foundSponsors, foundCommittee, onSponsorSearch, onCommitteeSearch, message }: CreateProjectViewProps) => {
  const {
    register,
    control,
    formState: { errors },
    clearErrors,
    watch,
    setValue,
    getValues,
    trigger,
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


  // const {
  //   fields: roleFields,
  //   append: appendRole,
  //   remove: removeRole,
  // } = useFieldArray({
  //   control,
  //   name: "roles",
  // });

  const [usersById, setUsersById] = useState<Record<string, SimpleUserResponse>>({});

  const rememberUser = useCallback((user: SimpleUserResponse) => {
    setUsersById((prev) => ({ ...prev, [user.id]: user }));
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const handleNextStep = async () => {
    if (currentStep !== 1) return;

    const isValid = await trigger(["title", "description", "startDate", "endDate", "sponsors", "committee", "milestones"]);

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Utwórz Nowy Projekt</h2>

      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes("Błąd") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      <StepProgressTracker currentStep={currentStep} steps={["Podstawowe informacje", "Role i alokacja czasu"]} />

      <form className="space-y-6 text-left">
        {currentStep === 1 && (
          <>
            <StepBasicInformation register={register} errors={errors} groups={groups} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data rozpoczęcia</label>
                <input
                  type="date"
                  {...register("startDate")}
                  className={`w-full border rounded px-3 py-2 ${errors.startDate ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.startDate?.message && <p className="text-red-500 text-sm mt-1">{errors.startDate.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data zakończenia</label>
                <input
                  type="date"
                  {...register("endDate")}
                  className={`w-full border rounded px-3 py-2 ${errors.endDate ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.endDate?.message && <p className="text-red-500 text-sm mt-1">{errors.endDate.message as string}</p>}
              </div>
            </div>

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
          </>
        )}

        {currentStep === 2 && (
          <div className="py-12 text-center bg-gray-50 rounded-lg border border-gray-200 border-dashed">
            <h3 className="text-lg font-medium text-gray-700">Role i alokacja czasu (Wkrótce)</h3>
            <p className="text-gray-500 mt-2">
              Moduł składania wniosków i doboru ról zostanie uruchomiony w późniejszym etapie.
              Możesz zapisać projekt bez przypisywania zasobów.
            </p>
            {/* Wyciszony komponent - zakomentowany na wszelki wypadek */}
            {/* <StepRoleUtilization roleFields={roleFields} appendRole={appendRole} removeRole={removeRole} /> */}
          </div>
        )}

        <StepNavigation
          isPending={isPending}
          currentStep={currentStep}
          totalSteps={totalSteps}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          handleSubmitProject={onSubmitProject}
        />
      </form>
    </div>
  );
};