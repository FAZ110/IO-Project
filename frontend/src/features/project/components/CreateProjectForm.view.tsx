import {
    type FieldErrors,
    type UseFormRegister,
    type FieldArrayWithId,
    type UseFieldArrayAppend,
    type UseFieldArrayRemove,
    type UseFormSetValue,
    type UseFormGetValues,
} from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types.ts";
import { useState } from "react";
import type { SimpleUserResponse } from "@/features/user-management";
import { UserAutocomplite } from "@/features/project/components/UserAutocomplite.tsx";

interface CreateProjectViewProps {
    register: UseFormRegister<ProjectCreationRequest>;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isPending: boolean;
    errors: FieldErrors<ProjectCreationRequest>;

    riskFields: FieldArrayWithId<ProjectCreationRequest, "risks", "id">[];
    appendRisk: UseFieldArrayAppend<ProjectCreationRequest, "risks">;
    removeRisk: UseFieldArrayRemove;

    maileStonesFields: FieldArrayWithId<ProjectCreationRequest, "milestones", "id">[];
    appendMileStone: UseFieldArrayAppend<ProjectCreationRequest, "milestones">;
    removeMileStone: UseFieldArrayRemove;
    milestones: ProjectCreationRequest["milestones"];

    groups: { id: string; name: string }[];

    foundSponsors: SimpleUserResponse[];
    onSponsorSearch: (query: string) => void;

    setValue: UseFormSetValue<ProjectCreationRequest>;
    getValues: UseFormGetValues<ProjectCreationRequest>;

    message?: string;
}

const today = new Date().toISOString().split("T")[0];

export const CreateProjectView = ({
    register,
    onSubmit,
    isPending,
    errors,
    riskFields,
    appendRisk,
    removeRisk,
    message,
    setValue,
    getValues,
    groups,
    foundSponsors,
    onSponsorSearch,
    milestones,
    maileStonesFields,
    appendMileStone,
    removeMileStone,
}: CreateProjectViewProps) => {
    const [groupSearch, setGroupSearch] = useState("");
    const [showGroupDropdown, setShowGroupDropdown] = useState(false);
    const filteredGroups = groups.filter((g) => g.name.toLowerCase().includes(groupSearch.toLowerCase()));

    const [selectedSponsors, setSelectedSponsors] = useState<SimpleUserResponse[]>([]);
    const [selectedCommittee, setSelectedCommittee] = useState<SimpleUserResponse[]>([]);

    const handleAddSponsor = (user: SimpleUserResponse) => {
        if (!selectedSponsors.find((s) => s.id === user.id)) {
            const newList = [...selectedSponsors, user];
            setSelectedSponsors(newList);
            setValue(
                "sponsors",
                newList.map((s) => s.id),
            );
        }
    };

    const handleRemoveSponsor = (sponsorId: string) => {
        const newList = selectedSponsors.filter((s) => s.id !== sponsorId);
        setSelectedSponsors(newList);
        setValue(
            "sponsors",
            newList.map((s) => s.id),
        );
    };

    const handleAddCommittee = (user: SimpleUserResponse) => {
        if (!selectedCommittee.find((s) => s.id === user.id)) {
            const newList = [...selectedCommittee, user];
            setSelectedCommittee(newList);
            setValue(
                "committee",
                newList.map((s) => s.id),
            );
        }
    };
    const handleRemoveCommittee = (userId: string) => {
        const newList = selectedCommittee.filter((s) => s.id !== userId);
        setSelectedCommittee(newList);
        setValue(
            "committee",
            newList.map((s) => s.id),
        );
    };

    const lastMilestone = milestones[milestones.length - 1];
    const canAddNext = milestones.length === 0 || (Boolean(lastMilestone?.endDate) && Boolean(lastMilestone?.startDate));

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Utwórz Nowy Projekt</h2>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes("Błąd") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {message}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6 text-left">
                <div className="space-y-4">
                    {/* Tytuł */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa *</label>
                        <input
                            {...register("title", {
                                required: "Tytuł jest wymagany",
                            })}
                            type="text"
                            className={`w-full border rounded p-2 focus:ring-blue-500 ${errors.title ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                    </div>

                    {/* Opis */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Opis *</label>
                        <textarea
                            {...register("description", {
                                required: "Opis jest wymagany",
                            })}
                            rows={3}
                            className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                    </div>

                    {/* Data */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Startu *</label>
                            <input
                                {...register("startDate", {
                                    required: "Data jest wymagana",
                                    validate: (value) => value >= today || "Data nie może być z przeszłości",
                                })}
                                type="date"
                                min={today}
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.startDate && <span className="text-red-500 text-xs">{errors.startDate.message}</span>}
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
                                    if (e.target.value === "") setValue("projectGroupId", "");
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

                    {/* --- Sponsorzy --- */}
                    <UserAutocomplite
                        label="Sponsorzy"
                        foundUsers={foundSponsors}
                        onSearch={onSponsorSearch}
                        selecedUsers={selectedSponsors}
                        onAddUser={handleAddSponsor}
                        onRemoveUser={handleRemoveSponsor}
                    />

                    {/* --- Komitet sterujący --- */}
                    <UserAutocomplite
                        label="Komitet Sterujący"
                        foundUsers={foundSponsors}
                        onSearch={onSponsorSearch}
                        selecedUsers={selectedCommittee}
                        onAddUser={handleAddCommittee}
                        onRemoveUser={handleRemoveCommittee}
                    />

                    {/** Kamienie milowe **/}
                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Kamienie Milowe</h3>
                            <button
                                disabled={!canAddNext}
                                type="button"
                                onClick={() => {
                                    const milestones = getValues("milestones") || [];
                                    const lastMilestone = milestones[milestones.length - 1];
                                    const lastEndDate = lastMilestone?.endDate || today;

                                    appendMileStone({
                                        startDate: lastEndDate,
                                        endDate: "",
                                    });
                                }}
                                className={`bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-700 ${
                                    !canAddNext ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                }`}
                            >
                                + Dodaj Kamień Milowy
                            </button>
                        </div>

                        <div className="space-y-4">
                            {maileStonesFields.map((field, index) => {
                                const previousEndDate = index > 0 ? getValues(`milestones.${index - 1}.endDate`) : null;
                                const minStartDate = previousEndDate || today;
                                const minEndDate = getValues(`milestones.${index}.startDate`) || today;

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
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Data startu</label>
                                                <input
                                                    {...register(`milestones.${index}.startDate` as const, {
                                                        required: "Data startu jest wymagana",
                                                        validate: (value) => {
                                                            if (index > 0) {
                                                                const previousEndDate = getValues(`milestones.${index - 1}.endDate`);
                                                                const currentEndDate = getValues(`milestones.${index}.endDate`);

                                                                if (currentEndDate && value > currentEndDate) return "Data startu nie może być późniejsza niż data końca tego kamienia milowego";
                                                                
                                                                if (!previousEndDate) return "Uzupełnij datę końca poprzedniego kamienia milowego";

                                                                if (value < previousEndDate) return "Data startu nie może być wcześniejsza niż data końca poprzedniego kamienia milowego";
                                                            }

                                                            return true;
                                                        },
                                                    })}
                                                    type="date"
                                                    min={minStartDate}
                                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.milestones?.[index]?.startDate && (
                                                    <span className="text-red-500 text-xs">
                                                        {errors.milestones[index].startDate.message}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Data końca</label>
                                                <input
                                                    {...register(`milestones.${index}.endDate` as const, {
                                                        required: "Data końca jest wymagana",
                                                        validate: (value) => {
                                                            const startDate = getValues(`milestones.${index}.startDate`);
                                                            return (
                                                                value >= startDate || "Data końca nie może być wcześniej niż data startu"
                                                            );
                                                        },
                                                    })}
                                                    type="date"
                                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                                                    min={minEndDate}
                                                />
                                                {errors.milestones?.[index]?.endDate && (
                                                    <span className="text-red-500 text-xs">{errors.milestones[index].endDate.message}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- SEKCJA RYZYK --- */}
                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Ryzyka Projektu</h3>
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
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Prawdopodobieństwo (0-100 %)
                                            </label>
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

                    {/* Submit */}
                    <button
                        disabled={isPending}
                        type="submit"
                        className={`w-full text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200 mt-6 ${isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
                    >
                        {isPending ? "Zapisywanie..." : "Zapisz Projekt"}
                    </button>
                </div>
            </form>
        </div>
    );
};
