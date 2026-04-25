import {
    type FieldErrors,
    type UseFormRegister,
    type FieldArrayWithId,
    type UseFieldArrayAppend,
    type UseFieldArrayRemove,
    type UseFormSetValue,
    type UseFormGetValues,
    type UseFormTrigger,
} from "react-hook-form";
import type { ProjectCreationRequest} from "../../project.types.ts";
import { useState } from "react";
import type { SimpleUserResponse } from "@/features/user-management";
import { UserAutocomplite } from "./UserAutocomplite.tsx";
import { StepProgressTracker } from "./StepProgressTracker.tsx";
import { StepBasicInformation } from "./StepBasicInformation.view.tsx";
import { StepMilestonesAndRisks } from "./StepMilestoneAndRisk.tsx";
import { StepNavigation } from "./StepNavigation.tsx";
import { StepRoleUtilization } from "./StepRoleUtilization.tsx";

interface CreateProjectViewProps {
    register: UseFormRegister<ProjectCreationRequest>;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isPending: boolean;
    errors: FieldErrors<ProjectCreationRequest>;
    setError: (name: keyof ProjectCreationRequest, error: { type: string; message: string }) => void;
    clearErrors: (name?: keyof ProjectCreationRequest) => void;
    trigger: UseFormTrigger<ProjectCreationRequest>;

    riskFields: FieldArrayWithId<ProjectCreationRequest, "risks", "id">[];
    appendRisk: UseFieldArrayAppend<ProjectCreationRequest, "risks">;
    removeRisk: UseFieldArrayRemove;

    maileStonesFields: FieldArrayWithId<ProjectCreationRequest, "milestones", "id">[];
    appendMileStone: UseFieldArrayAppend<ProjectCreationRequest, "milestones">;
    removeMileStone: UseFieldArrayRemove;
    milestones: ProjectCreationRequest["milestones"];

    groups: { id: string; name: string }[];

    foundUsers: SimpleUserResponse[];
    onUserSearch: (query: string) => void;

    setValue: UseFormSetValue<ProjectCreationRequest>;
    getValues: UseFormGetValues<ProjectCreationRequest>;

    message?: string;
}

export const CreateProjectView = ({
    register,
    onSubmit,
    isPending,
    errors,
    trigger,
    riskFields,
    appendRisk,
    removeRisk,
    message,
    setValue,
    setError,
    getValues,
    clearErrors,
    groups,
    foundUsers,
    onUserSearch,
    milestones,
    maileStonesFields,
    appendMileStone,
    removeMileStone,
}: CreateProjectViewProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 2;

    const [selectedSponsors, setSelectedSponsors] = useState<SimpleUserResponse[]>([]);
    const [selectedCommittee, setSelectedCommittee] = useState<SimpleUserResponse[]>([]);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Utwórz Nowy Projekt</h2>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes("Błąd") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {message}
                </div>
            )}

            <StepProgressTracker currentStep={currentStep} steps={["Podstawowe informacje", "Role i alokacja czasu"]} />

            <form onSubmit={onSubmit} className="space-y-6 text-left">
                {currentStep === 1 && (
                    <>
                        {/* --- PODSTAWOWE INFORMACJE --- */}
                        <StepBasicInformation
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            groups={groups}
                        />

                        {/* --- SPONSORZY --- */}
                        <UserAutocomplite
                            label="Sponsorzy"
                            foundUsers={foundUsers}
                            selectedUsers={selectedSponsors}
                            setSelectedUsers={setSelectedSponsors}
                            onSearch={onUserSearch}
                            setValue={setValue}
                            roles="sponsors"
                            clearErrors={clearErrors}
                        />

                        {errors.sponsors?.message && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.sponsors.message}
                            </p>
                        )}

                        {/* --- KKOMITET STERUJACY --- */}
                        <UserAutocomplite
                            label="Komitet Sterujący"
                            foundUsers={foundUsers}
                            selectedUsers={selectedCommittee}
                            setSelectedUsers={setSelectedCommittee}
                            onSearch={onUserSearch}
                            setValue={setValue}
                            roles="committee"
                            clearErrors={clearErrors}

                        />
                        
                        {errors.committee?.message && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.committee.message}
                            </p>
                        )}

                        <StepMilestonesAndRisks
                            register={register}
                            errors={errors}
                            getValues={getValues}
                            riskFields={riskFields}
                            appendRisk={appendRisk}
                            removeRisk={removeRisk}
                            milestones={milestones}
                            maileStonesFields={maileStonesFields}
                            appendMileStone={appendMileStone}
                            removeMileStone={removeMileStone}
                        />
                     </>
                )}

                {currentStep === 2 && (
                    <>
                    <StepRoleUtilization
                        setValue={setValue}
                        getValues={getValues}
                        clearErrors={clearErrors}
                        register={register}
                    />

                    {errors.roles?.message && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.roles.message}
                        </p>
                    )}
                    </>
                )}

                <StepNavigation 
                    getValues={getValues}
                    setError={setError}
                    clearErrors={clearErrors}
                    isPending={isPending}
                    trigger={trigger}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    totalSteps={totalSteps}
                />
            </form>
        </div>
    );
};
