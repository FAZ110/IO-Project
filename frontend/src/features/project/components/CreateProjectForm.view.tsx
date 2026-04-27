import { useFieldArray, useFormContext } from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types.ts";
import { useState, useCallback } from "react";
import type { SimpleUserResponse } from "@/features/user-management";
import { UserAutocomplete } from "./UserAutocomplete.tsx";
import { StepProgressTracker } from "./StepProgressTracker.tsx";
import { StepBasicInformation } from "./StepBasicInformation.view.tsx";
import { StepMilestonesAndRisks } from "./StepMilestoneAndRisk.tsx";
import { StepNavigation } from "./StepNavigation.tsx";
import { StepRoleUtilization } from "./StepRoleUtilization.tsx";

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
    const {
        fields: roleFields,
        append: appendRole,
        remove: removeRole,
    } = useFieldArray({
        control,
        name: "roles",
    });

    const [usersById, setUsersById] = useState<Record<string, SimpleUserResponse>>({});

    const rememberUser = useCallback((user: SimpleUserResponse) => {
        setUsersById((prev) => ({ ...prev, [user.id]: user }));
    }, []);

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 2;

    const handleNextStep = async () => {
        if (currentStep !== 1) return;

        const isValid = await trigger(["title", "description", "sponsors", "committee", "milestones"]);

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
                        {/* --- PODSTAWOWE INFORMACJE --- */}
                        <StepBasicInformation register={register} errors={errors} groups={groups} />

                        {/* --- SPONSORZY --- */}
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

                        {/* --- KKOMITET STERUJACY --- */}
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
                    <>
                        <StepRoleUtilization roleFields={roleFields} appendRole={appendRole} removeRole={removeRole} />

                        {errors.roles?.message && <p className="text-red-500 text-sm mt-2">{errors.roles.message}</p>}
                    </>
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
