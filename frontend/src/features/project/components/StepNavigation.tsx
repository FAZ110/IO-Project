interface StepNavigationProps {
    isPending: boolean;
    currentStep: number;
    totalSteps: number;
    handleNextStep: () => void;
    handlePrevStep: () => void;
    handleSubmitProject: () => void | Promise<void>;
}

export const StepNavigation = ({
    isPending,
    currentStep,
    totalSteps,
    handleNextStep,
    handlePrevStep,
    handleSubmitProject,
}: StepNavigationProps) => {
    return (
        <div className="mt-8 flex justify-between border-t pt-4">
            {currentStep > 1 ? (
                <button type="button" onClick={handlePrevStep} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Wstecz
                </button>
            ) : (
                <div></div>
            )}

            {currentStep < totalSteps ? (
                <button type="button" onClick={handleNextStep} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Dalej
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handleSubmitProject}
                    disabled={isPending}
                    className={`text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200  ${isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                    {isPending ? "Zapisywanie..." : "Zapisz Projekt"}
                </button>
            )}
        </div>
    );
};
