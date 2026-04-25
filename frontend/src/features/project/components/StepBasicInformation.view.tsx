import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types";
import { useState } from "react";

interface StepBasicInformationViewProps {
    register: UseFormRegister<ProjectCreationRequest>;
    errors: FieldErrors<ProjectCreationRequest>;
    setValue: UseFormSetValue<ProjectCreationRequest>;
    groups: { id: string; name: string }[];
}

export const StepBasicInformation = ({ 
    register, 
    errors, 
    setValue, 
    groups
}: StepBasicInformationViewProps) => {

    const [groupSearch, setGroupSearch] = useState("");
    const [showGroupDropdown, setShowGroupDropdown] = useState(false);

    const filteredGroups = groups.filter((g) => g.name.toLowerCase().includes(groupSearch.toLowerCase()));

    return <div className="space-y-4">
                {/* TYTUŁ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa *</label>
                    <input
                        {...register("title")}
                        type="text"
                        className={`w-full border rounded p-2 focus:ring-blue-500 ${errors.title ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                </div>

                {/* OPIS */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opis *</label>
                    <textarea
                        {...register("description")}
                        rows={3}
                        className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                </div>

                {/* --- WYSZUKIWANIE PORTFELA/PROJEKTU --- */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grupa Projektowa - portfele/programy (opcjonalnie)
                    </label>
                    <input
                        placeholder={"Wpisz nazwę portfela/programu..."}
                        value={groupSearch}
                        onChange={(e) => {
                            setGroupSearch(e.target.value);
                            setShowGroupDropdown(true);
                            if (e.target.value === "") setValue("projectGroupId", null, { shouldValidate: true });
                        }}
                        onFocus={() => setShowGroupDropdown(true)}
                        type="text"
                        className={`w-full border rounded p-2 focus:ring-blue-500 ${errors.projectGroupId ? "border-red-500" : "border-gray-300"}`}
                    />

                    <input type="hidden" {...register("projectGroupId")} />

                    {showGroupDropdown && groupSearch.length > 0 && (
                        <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-48 overflow-y-auto">
                            {filteredGroups.length > 0 ? (
                                filteredGroups.map((group) => (
                                    <li
                                        key={group.id}
                                        className="p-2 hover:bg-blue-100 cursor-pointer text-sm transition-colors"
                                        onClick={() => {
                                            setGroupSearch(group.name);
                                            setValue("projectGroupId", group.id);
                                            setShowGroupDropdown(false);
                                        }}
                                    >
                                        {group.name}
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-gray-400 text-sm italic">Brak wyników...</li>
                            )}
                        </ul>
                    )}

                    {errors.projectGroupId && <span className="text-red-500 text-xs">{errors.projectGroupId.message}</span>}
                </div>
            </div>
}
