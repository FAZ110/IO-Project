import {
  type FieldArrayWithId,
  type FieldErrors,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  type UseFormRegister,
} from "react-hook-form";
import type { CreateProjectFormData } from "../project.schema";
import { getNextDateFromToday } from "../project.utils.ts";

interface StepMilestonesAndRisksProps {
  register: UseFormRegister<CreateProjectFormData>;
  errors: FieldErrors<CreateProjectFormData>;
  milestones: CreateProjectFormData["milestones"];

  milestonesFields: FieldArrayWithId<CreateProjectFormData, "milestones", "id">[];
  appendMilestone: UseFieldArrayAppend<CreateProjectFormData, "milestones">;
  removeMilestone: UseFieldArrayRemove;

  riskFields: FieldArrayWithId<CreateProjectFormData, "risks", "id">[];
  appendRisk: UseFieldArrayAppend<CreateProjectFormData, "risks">;
  removeRisk: UseFieldArrayRemove;
}

export const StepMilestonesAndRisks = ({
                                         register,
                                         errors,
                                         milestones,
                                         milestonesFields,
                                         appendMilestone,
                                         removeMilestone,
                                         riskFields,
                                         appendRisk,
                                         removeRisk,
                                       }: StepMilestonesAndRisksProps) => {
  return (
    <>
      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-gray-800">Kamienie Milowe</h3>
            <p className="text-sm text-gray-500">Dodaj kluczowe etapy realizacji projektu.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              appendMilestone({
                date: "",
                name: "",
                description: "",
              });
            }}
            className="bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-700 cursor-pointer"
          >
            + Dodaj Kamień Milowy
          </button>
        </div>

        <div className="space-y-4">
          {milestonesFields.map((field, index) => {
            const lastMilestone = milestones[index - 1];
            const minDate = lastMilestone?.date ?? getNextDateFromToday(0);

            return (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                <button
                  type="button"
                  onClick={() => removeMilestone(index)}
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
                        required: "Nazwa jest wymagana",
                      })}
                      type="text"
                      placeholder="np. Analiza wymagań"
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.milestones?.[index]?.name && (
                      <span className="text-red-500 text-xs">{errors.milestones[index].name.message}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Data realizacji</label>
                    <input
                      {...register(`milestones.${index}.date` as const, {
                        required: "Data jest wymagana",
                        validate: (value) => {
                          if (minDate && value < minDate) {
                            return `Data musi być po ${minDate}`;
                          }
                          return true;
                        },
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

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Opis (opcjonalnie)</label>
                  <textarea
                    {...register(`milestones.${index}.description` as const)}
                    rows={2}
                    placeholder="Krótki opis celu tego etapu..."
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {errors.milestones && typeof errors.milestones.message === "string" && (
        <p className="text-red-500 text-sm mt-2">{errors.milestones.message}</p>
      )}

      <div className="pt-6 border-t border-gray-200 mt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-gray-800">Ryzyka Projektu</h3>
            <p className="text-sm text-gray-500">Dodaj ryzyka projektu.</p>
          </div>
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
                    {...register(`risks.${index}.name` as const, { required: "Nazwa ryzyka jest wymagana" })}
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.risks?.[index]?.name && (
                    <span className="text-red-500 text-xs">{errors.risks[index].name.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prawdopodobieństwo (%)</label>
                  <input
                    {...register(`risks.${index}.probability` as const, {
                      valueAsNumber: true,
                      min: { value: 0, message: "Min 0%" },
                      max: { value: 100, message: "Max 100%" },
                      required: true,
                    })}
                    type="number"
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.risks?.[index]?.probability && (
                    <span className="text-red-500 text-xs">{errors.risks[index].probability.message}</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Opis Ryzyka</label>
                <textarea
                  {...register(`risks.${index}.description` as const, { required: "Opis jest wymagany" })}
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