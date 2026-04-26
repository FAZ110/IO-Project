import React from 'react';

interface StepProgressTrackerProps {
    currentStep: number;
    steps: string[];
}

export const StepProgressTracker = ({ 
    currentStep, 
    steps
}: StepProgressTrackerProps) => {
    return (
        <div className="flex items-center mb-10 w-full px-15">
            {steps.map((label, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;

                return (
                    <React.Fragment key={label}>
                        <div className="relative flex flex-col items-center">
                            
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 shadow-sm z-10 ${
                                isCompleted 
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : isCurrent 
                                    ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-100'
                                    : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                                {isCompleted ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    stepNumber
                                )}
                            </div>
                            
                            <span className={`absolute top-12 text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                                isCurrent 
                                    ? 'text-blue-700 font-bold' 
                                    : isCompleted 
                                    ? 'text-gray-800' 
                                    : 'text-gray-400'
                            }`}>
                                {label}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <div className={`flex-auto border-t-2 transition-all duration-500 mx-2 ${
                                isCompleted ? 'border-blue-600' : 'border-gray-200'
                            }`}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}