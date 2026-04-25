import type { Dispatch, SetStateAction } from "react";
import type { UseFormGetValues, UseFormTrigger } from "react-hook-form";
import type { ProjectCreationRequest } from "../../project.types";

interface StepNavigationProps {
    getValues: UseFormGetValues<ProjectCreationRequest>;
    setError: (name: keyof ProjectCreationRequest, error: { type: string; message: string }) => void;
    clearErrors: (name: keyof ProjectCreationRequest) => void;
    isPending: boolean;
    trigger: UseFormTrigger<ProjectCreationRequest>;
    currentStep: number;
    setCurrentStep: Dispatch<SetStateAction<number>>;
    totalSteps: number;
}

export const StepNavigation = ({ 
    getValues,
    setError,
    clearErrors,
    isPending,
    trigger,
    currentStep,
    setCurrentStep,
    totalSteps
}: StepNavigationProps) => {
 
    const handleNextStep = async () => {
        if (currentStep !== 1) return;

        const baseValid = await trigger(["title", "description", "sponsors", "committee", "milestones"]);
        const values = getValues();
        const hasMinMilestones = (values.milestones?.length ?? 0) >= 2;
        const hasSponsor = (values.sponsors?.length ?? 0) >= 1;
        const hasCommittee = (values.committee?.length ?? 0) >= 1;

        const isStepValid = baseValid && hasMinMilestones && hasSponsor && hasCommittee;

        if (!hasMinMilestones) {
            setError("milestones", { type: "manual", message: "Dodaj co najmniej 2 kamienie milowe" });
        } else {
            clearErrors("milestones");
        }

        if (!hasSponsor) {
            setError("sponsors", { type: "manual", message: "Dodaj co najmniej jednego sponsora" });
        } else {
            clearErrors("sponsors");
        }

        if (!hasCommittee) {
            setError("committee", { type: "manual", message: "Dodaj co najmniej jedną osobę z komitetu" });
        } else {
            clearErrors("committee");
        }

        if (isStepValid) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    return (
        <div className="mt-8 flex justify-between border-t pt-4">
            {currentStep > 1 ? (
                <button type="button" onClick={handlePrevStep} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Wstecz
                </button>
            ) : <div></div> }

            {currentStep < totalSteps ? (
                <button type="button" onClick={handleNextStep} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Dalej
                </button>
            ) : (
                <button 
                    type="submit" 
                    className={`text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200  ${isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}>
                    {isPending ? "Zapisywanie..." : "Zapisz Projekt"}
                </button>
            )}
        </div>
    );
    
}