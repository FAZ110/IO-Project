// @ts-nocheck — komponent zarezerwowany na przyszłość (moduł ról nie jest jeszcze podłączony)
import { type FieldArrayWithId, type UseFieldArrayAppend, type UseFieldArrayRemove, useFormContext } from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types";
import { useState } from "react";
import { generatePhasesFromMilestones } from "../project.utils";

interface StepRoleUtilizationProps {
    roleFields: FieldArrayWithId<ProjectCreationRequest, "roles", "id">[];
    appendRole: UseFieldArrayAppend<ProjectCreationRequest, "roles">;
    removeRole: UseFieldArrayRemove;
}

export const StepRoleUtilization = ({ 
    roleFields, 
    appendRole, 
    removeRole
}: StepRoleUtilizationProps) => {
    const { register, getValues, clearErrors, formState: { errors } } = useFormContext<ProjectCreationRequest>();

    const [roleInput, setRoleInput] = useState("");

    const handleAddRole = () => {
        appendRole({
            name: roleInput,
            utilizationPercentages: [],
        });
        setRoleInput("");
        clearErrors("roles");
    };

    const phases = generatePhasesFromMilestones(getValues("milestones"));

    const getUtilizationErrorMessage = (roleIndex: number, phaseIndex: number) => {
        const error = errors.roles?.[roleIndex]?.utilizationPercentages?.[phaseIndex];

        if (!error) {
            return null;
        }

        return "message" in error ? error.message : null;
    };

    return (
        <div className="relative">
            <h3 className="block text-sm font-medium text-gray-700 mb-1">Role Projektowe *</h3>
            <div className="flex items-center gap-3">
                <input
                    placeholder="Podaj nazwę roli projektowej"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (roleInput.trim() === "") return;
                                handleAddRole();
                            }
                        }   
                    }
                    className="flex-1 border border-gray-300 rounded p-2 focus:ring-blue-500"
                />
                <button
                    type="button"
                    onClick={() => {
                        if (roleInput.trim() === "") return;
                        handleAddRole();
                    }}
                    className="shrink-0 bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-gray-700"
                >
                    Dodaj Role
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
                {roleFields.map((role, index) => (
                    <span key={role.id} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {role.name}
                        <button
                            type="button"
                            onClick={() => removeRole(index)}
                            className="ml-1 text-blue-500 hover:text-blue-800 cursor-pointer"
                        >
                            <span aria-hidden="true" className="text-sm leading-none">
                                ×
                            </span>
                        </button>
                    </span>
                ))}
            </div>

            <div className="mt-4 border-t pt-4">
                <h3 className="block text-sm font-medium text-gray-700 mb-1">Alokacja Ról *</h3>

                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Rola</th>
                            {phases.map((phase, index) => (
                                <th key={index} className="align-center px-4 py-2 text-sm text-gray-600">
                                    {phase.name}
                                    <br />
                                    <span className="text-xs text-gray-400">
                                        ({phase.startDate} - {phase.endDate})
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {roleFields.map((role, roleIndex) => {
                            return (
                                <tr key={role.id}>
                                    <td className="align-center border px-4 py-2 text-sm">{role.name}</td>
                                    {phases.map((phase, phaseIndex) => (
                                        <td key={phase.name} className="border px-4 py-2">
                                            <input
                                                type="number"
                                                defaultValue={0}
                                                {...register(`roles.${roleIndex}.utilizationPercentages.${phaseIndex}` as const, {
                                                    valueAsNumber: true,
                                                    min: 0,
                                                    max: 100
                                                    },
                                                )}
                                                className={`w-full rounded p-1 text-sm focus:ring-2 focus:ring-blue-500 ${getUtilizationErrorMessage(roleIndex, phaseIndex) ? "border border-red-500" : "border border-gray-300"}`}
                                            />
                                            {getUtilizationErrorMessage(roleIndex, phaseIndex) && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {getUtilizationErrorMessage(roleIndex, phaseIndex)}
                                                </p>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                    {errors.roles && (
                        <tfoot>
                            <tr>
                                <td colSpan={phases.length + 1} className="text-red-500 text-sm pt-2">
                                    {errors.roles.message}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
};
