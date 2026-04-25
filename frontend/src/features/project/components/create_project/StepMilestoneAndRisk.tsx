import {
    type FieldArrayWithId,
    type FieldErrors,
    type UseFieldArrayAppend,
    type UseFieldArrayRemove,
    type UseFormGetValues,
    type UseFormRegister,
} from "react-hook-form";
import type { ProjectCreationRequest } from "../../project.types";

interface StepMilestonesAndRisksProps {
    register: UseFormRegister<ProjectCreationRequest>;
    errors: FieldErrors<ProjectCreationRequest>;
    getValues: UseFormGetValues<ProjectCreationRequest>;
    milestones: ProjectCreationRequest["milestones"];

    maileStonesFields: FieldArrayWithId<ProjectCreationRequest, "milestones", "id">[];
    appendMileStone: UseFieldArrayAppend<ProjectCreationRequest, "milestones">;
    removeMileStone: UseFieldArrayRemove;

    riskFields: FieldArrayWithId<ProjectCreationRequest, "risks", "id">[];
    appendRisk: UseFieldArrayAppend<ProjectCreationRequest, "risks">;
    removeRisk: UseFieldArrayRemove;
}

const today = new Date().toISOString().split("T")[0];

export const StepMilestonesAndRisks = ({
    register,
    errors,
    getValues,
    milestones,
    maileStonesFields,
    appendMileStone,
    removeMileStone,
    riskFields,
    appendRisk,
    removeRisk,
}: StepMilestonesAndRisksProps) => {
    const showMilestoneWarning = milestones.length < 2;

    return (
        <>
            <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-gray-800">Kamienie Milowe *</h3>
                        <p className="text-sm text-gray-500">Minimum 2 kamienie milowe, aby określić poczatek i koniec projektu.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            appendMileStone({
                                date: "",
                                name: "",
                            });
                        }}
                        className="bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-700"
                    >
                        + Dodaj Kamien Milowy
                    </button>
                </div>

                <div className="space-y-4">
                    {maileStonesFields.map((field, index) => {
                        const lastMilestone = milestones[index - 1];
                        const minDate = lastMilestone ? lastMilestone.date : getValues("startDate") || today;

                        return (
                            <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                                <button
                                    type="button"
                                    onClick={() => removeMileStone(index)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-bold cursor-pointer"
                                >
                                    <span aria-hidden="true" className="text-sm leading-none">
                                        X
                                    </span>
                                </button>

                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Nazwa kamienia milowego</label>
                                        <input
                                            {...register(`milestones.${index}.name` as const, {
                                                required: "Nazwa kamienia milowego jest wymagana",
                                            })}
                                            type="text"
                                            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.milestones?.[index]?.name && (
                                            <span className="text-red-500 text-xs">{errors.milestones[index].name.message}</span>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Data startu</label>
                                        <input
                                            {...register(`milestones.${index}.date` as const, {
                                                required: "Data startu jest wymagana",
                                                validate: (value) => {
                                                    if (minDate && value < minDate) {
                                                        return `Data kamienia milowego musi być późniejsza niż ${minDate}`;
                                                    }
                                                    if (value === "") {
                                                        return "Data startu jest wymagana";
                                                    }
                                                    return true;
                                                }
                                            })}
                                            type="date"
                                            min={minDate}
                                            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        />

                                        {errors.milestones?.[index]?.date && (
                                            <span className="text-red-500 text-xs">{errors.milestones[index].date.message}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {showMilestoneWarning && <p className="text-red-500 text-sm mt-2">Musza byc co najmniej dwa kamienie milowe</p>}

            <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Ryzyka Projektu (opcjonalnie)</h3>
                    <button
                        type="button"
                        onClick={() =>
                            appendRisk({
                                name: "",
                                description: "",
                                probability: 0,
                            })
                        }
                        className="bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-700 cursor-pointer"
                    >
                        + Dodaj Ryzyko
                    </button>
                </div>

                <div className="space-y-4">
                    {riskFields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                            <button
                                type="button"
                                onClick={() => removeRisk(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-bold cursor-pointer"
                            >
                                <span aria-hidden="true" className="text-sm leading-none">
                                    X
                                </span>
                            </button>

                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Nazwa Ryzyka</label>
                                    <input
                                        {...register(`risks.${index}.name` as const, { required: true })}
                                        type="text"
                                        className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Prawdopodobienstwo (0-100 %)</label>
                                    <input
                                        {...register(`risks.${index}.probability` as const, {
                                            valueAsNumber: true,
                                            min: 0,
                                            max: 100,
                                        })}
                                        type="number"
                                        className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Opis Ryzyka</label>
                                <textarea
                                    {...register(`risks.${index}.description` as const, { required: true })}
                                    rows={2}
                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
