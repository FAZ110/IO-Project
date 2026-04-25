import { useFieldArray, useFormContext } from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types.ts";
import { useState } from "react";
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
    foundUsers: SimpleUserResponse[];
    onUserSearch: (query: string) => void;
    message?: string;
}

export const CreateProjectView = ({ onSubmitProject, isPending, groups, foundUsers, onUserSearch, message }: CreateProjectViewProps) => {
    const {
        register,
        control,
        formState: { errors },
        clearErrors,
        watch,
        setValue,
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
        fields: maileStonesFields,
        append: appendMileStone,
        remove: removeMileStone,
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

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 2;

    const [selectedSponsors, setSelectedSponsors] = useState<SimpleUserResponse[]>([]);
    const [selectedCommittee, setSelectedCommittee] = useState<SimpleUserResponse[]>([]);

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
                        <StepBasicInformation register={register} errors={errors} setValue={setValue} groups={groups} />

                        {/* --- SPONSORZY --- */}
                        <UserAutocomplete
                            label="Sponsorzy"
                            foundUsers={foundUsers}
                            selectedUsers={selectedSponsors}
                            setSelectedUsers={setSelectedSponsors}
                            onSearch={onUserSearch}
                            setValue={setValue}
                            roles="sponsors"
                            clearErrors={clearErrors}
                        />

                        {errors.sponsors?.message && <p className="text-red-500 text-sm mt-2">{errors.sponsors.message}</p>}

                        {/* --- KKOMITET STERUJACY --- */}
                        <UserAutocomplete
                            label="Komitet Sterujący"
                            foundUsers={foundUsers}
                            selectedUsers={selectedCommittee}
                            setSelectedUsers={setSelectedCommittee}
                            onSearch={onUserSearch}
                            setValue={setValue}
                            roles="committee"
                            clearErrors={clearErrors}
                        />

                        {errors.committee?.message && <p className="text-red-500 text-sm mt-2">{errors.committee.message}</p>}

                        <StepMilestonesAndRisks
                            register={register}
                            errors={errors}
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
