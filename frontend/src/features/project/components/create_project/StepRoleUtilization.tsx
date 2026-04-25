import type { UseFormGetValues, UseFormSetValue, FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProjectCreationRequest, Role } from "../../project.types";
import { useState } from "react";
import { generatePhasesFromMilestones } from "../../project.utils";


interface StepRoleUtilizationProps {
    setValue: UseFormSetValue<ProjectCreationRequest>;
    getValues: UseFormGetValues<ProjectCreationRequest>;
    clearErrors: (name: keyof ProjectCreationRequest) => void;
    register: UseFormRegister<ProjectCreationRequest>;
}

export const StepRoleUtilization = ({ 
    setValue,
    getValues,
    clearErrors,
    register
}: StepRoleUtilizationProps) => {
    const [roleInput, setRoleInput] = useState("");
    const [roles, setRoles] = useState<Role[]>([]);

    const handleRemoveRole = (roleIndex: number) => {
        const values = getValues();
        setValue("roles", values.roles.filter((_, i) => i !== roleIndex));
        setRoles(roles.filter((_, i) => i !== roleIndex));
    }
    
    const handleAddRole = () => {
        const values = getValues();
        const newRole: Role = {
            name: roleInput,
            utilizationPercentages: [],
        };
        setRoles([...roles, newRole]);
        setValue("roles", [...values.roles, newRole]);
        setRoleInput("");
        clearErrors("roles");
    }

    const phases = generatePhasesFromMilestones(getValues("milestones"));

    const isAnyRoleOverallocated = roles.some(role => {
        const total = (role.utilizationPercentages || []).reduce((sum, val) => sum + (val || 0), 0);
        return total > 100;
    });

    return (
        <div className="relative">
            <h3 className="block text-sm font-medium text-gray-700 mb-1">Role Projektowe *</h3>
            <div className="flex items-center gap-3">
                <input
                    placeholder="Podaj nazwę roli projektowej"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
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
                {roles.map((role, index) => (
                    <span key={role.name} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {role.name}
                        <button type="button" onClick={() => handleRemoveRole(index)}
                        className="ml-1 text-blue-500 hover:text-blue-800 cursor-pointer">
                        <span aria-hidden="true" className="text-sm leading-none">×</span>
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
                            {phases.map((phase) => (
                                <th key={phase.name} className="align-center px-4 py-2 text-sm text-gray-600">
                                    {phase.name}
                                    <br />
                                    <span className="text-xs text-gray-400">({phase.startDate} - {phase.endDate})</span>
                                </th>
                            ))}
                            <th>Suma</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role, roleIndex) => {
                            const totalUtilization = role.utilizationPercentages.reduce((sum, val) => sum + (val || 0), 0);
                            const isOverallocated = totalUtilization > 100;

                            return (<tr key={role.name}>
                                    <td className="align-center border px-4 py-2 text-sm">{role.name}</td>
                                    {phases.map((phase, phaseIndex) => (
                                        <td key={phase.name} className="border px-4 py-2">
                                            <input
                                                type="number"
                                                value={role.utilizationPercentages[phaseIndex] ?? 0}
                                                {...register(`roles.${roleIndex}.utilizationPercentages.${phaseIndex}` as const, {
                                                    valueAsNumber: true,
                                                    min: 0,
                                                    max: 100,
                                                    
                                                    onChange: (e) => {
                                                        const newUtilization = [...role.utilizationPercentages];
                                                        newUtilization[phaseIndex] = e.target.value === "" ? 0 : Number(e.target.value);
                                                        
                                                        setRoles(prevRoles => {
                                                            const updatedRoles = [...prevRoles];
                                                            updatedRoles[roleIndex] = {
                                                                ...updatedRoles[roleIndex],
                                                                utilizationPercentages: newUtilization,
                                                            };
                                                            return updatedRoles;
                                                        });

                                                        const values = getValues();
                                                        const updatedRole: Role = {
                                                            ...values.roles[roleIndex],
                                                            utilizationPercentages: newUtilization,
                                                        };
                                                        setValue(`roles.${roleIndex}`, updatedRole);
                                                    }
                                                })}
                                                className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                    ))}
                                    <td className={`border px-4 py-3 text-sm font-bold text-right ${isOverallocated ? 'text-red-600' : 'text-gray-800'}`}>
                                        {totalUtilization.toFixed(1)}%
                                    </td>
                                </tr>
                            );})}
                    </tbody>
                </table>
                {isAnyRoleOverallocated && (
                    <p className="text-red-500 text-sm mt-2 font-medium text-center">
                        Suma alokacji dla jednej z ról przekracza 100%. Popraw wartości przed zapisaniem.
                    </p>
                )}
            </div>
        </div>
    );
}