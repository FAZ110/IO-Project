import { useFieldArray, useFormContext } from "react-hook-form";
import { useState, useCallback } from "react";
import { useDebounce } from "use-debounce";
import type { SimpleUserResponse } from "@/features/user-management";
import { useSearchUsers } from "@/features/user-management/user-management.hooks.ts";
import type { CreateProjectFormData } from "../project.schema.ts";
import { UserAutocomplete } from "./UserAutocomplete.tsx";
import { StepMilestonesAndRisks } from "./StepMilestoneAndRisk.tsx";
import { getNextDateFromToday } from "../project.utils.ts";

export const StepAssignmentsRisksAndMilestones = () => {
    const {
        register,
        control,
        formState: { errors },
        watch,
    } = useFormContext<CreateProjectFormData>();

    const milestones = watch("milestones");

    const {
        fields: assignmentFields,
        append: appendAssignment,
        remove: removeAssignment,
    } = useFieldArray({ control, name: "assignments" });

    const {
        fields: riskFields,
        append: appendRisk,
        remove: removeRisk,
    } = useFieldArray({ control, name: "risks" });

    const {
        fields: milestonesFields,
        append: appendMilestone,
        remove: removeMilestone,
    } = useFieldArray({ control, name: "milestones" });

    const [assignmentQuery, setAssignmentQuery] = useState("");
    const [assignmentQueryDebounced] = useDebounce(assignmentQuery, 300);
    const { data: foundAssignmentUsers = [] } = useSearchUsers(assignmentQueryDebounced);

    const [usersById, setUsersById] = useState<Record<string, SimpleUserResponse>>({});
    const rememberUser = useCallback((user: SimpleUserResponse) => {
        setUsersById((prev) => ({ ...prev, [user.id]: user }));
    }, []);

    const [pendingAssignment, setPendingAssignment] = useState<{
        userId: string;
        userName: string;
        roleName: string;
        startDate: string;
        endDate: string;
        utilizationPercentage: number;
    }>({
        userId: "",
        userName: "",
        roleName: "",
        startDate: getNextDateFromToday(0),
        endDate: getNextDateFromToday(30),
        utilizationPercentage: 100,
    });

    const [showAddForm, setShowAddForm] = useState(false);

    const handleSelectUser = (user: SimpleUserResponse) => {
        rememberUser(user);
        setPendingAssignment((prev) => ({
            ...prev,
            userId: user.id,
            userName: `${user.name} ${user.surname}`,
        }));
    };

    const handleRemoveSelectedUser = () => {
        setPendingAssignment((prev) => ({ ...prev, userId: "", userName: "" }));
    };

    const handleAddAssignment = () => {
        if (!pendingAssignment.userId || !pendingAssignment.roleName) return;
        appendAssignment({ ...pendingAssignment });
        setPendingAssignment({
            userId: "",
            userName: "",
            roleName: "",
            startDate: getNextDateFromToday(0),
            endDate: getNextDateFromToday(30),
            utilizationPercentage: 100,
        });
        setAssignmentQuery("");
        setShowAddForm(false);
    };

    return (
        <>
            <div className="pt-2">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-gray-800">Przypisania Pracowników</h3>
                        <p className="text-sm text-gray-500">Przypisz pracowników do projektu — wnioski trafią do ich przełożonych.</p>
                    </div>
                    {!showAddForm && (
                        <button
                            type="button"
                            onClick={() => setShowAddForm(true)}
                            className="bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-700 cursor-pointer shrink-0"
                        >
                            + Dodaj pracownika
                        </button>
                    )}
                </div>

                {showAddForm && (
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 mb-4 space-y-3">
                        <UserAutocomplete
                            label="Pracownik"
                            foundUsers={foundAssignmentUsers}
                            onSearch={setAssignmentQuery}
                            selectedUserIds={pendingAssignment.userId ? [pendingAssignment.userId] : []}
                            usersById={usersById}
                            onAdd={handleSelectUser}
                            onRemove={handleRemoveSelectedUser}
                        />

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Rola w projekcie</label>
                            <input
                                type="text"
                                placeholder="np. Developer, Tester, Analityk"
                                value={pendingAssignment.roleName}
                                onChange={(e) => setPendingAssignment((prev) => ({ ...prev, roleName: e.target.value }))}
                                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Data od</label>
                                <input
                                    type="date"
                                    value={pendingAssignment.startDate}
                                    onChange={(e) => setPendingAssignment((prev) => ({ ...prev, startDate: e.target.value }))}
                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Data do</label>
                                <input
                                    type="date"
                                    value={pendingAssignment.endDate}
                                    onChange={(e) => setPendingAssignment((prev) => ({ ...prev, endDate: e.target.value }))}
                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Alokacja: {pendingAssignment.utilizationPercentage}%
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                step={5}
                                value={pendingAssignment.utilizationPercentage}
                                onChange={(e) => setPendingAssignment((prev) => ({ ...prev, utilizationPercentage: Number(e.target.value) }))}
                                className="w-full accent-blue-600"
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                            >
                                Anuluj
                            </button>
                            <button
                                type="button"
                                onClick={handleAddAssignment}
                                disabled={!pendingAssignment.userId || !pendingAssignment.roleName}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Dodaj
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {assignmentFields.map((field, index) => (
                        <div key={field.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-gray-800">{field.userName}</span>
                                <span className="text-xs text-gray-500">
                                    {field.roleName} · {field.startDate} – {field.endDate} · {field.utilizationPercentage}%
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeAssignment(index)}
                                className="text-red-500 hover:text-red-700 text-sm font-bold cursor-pointer ml-4"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                    ))}
                    {assignmentFields.length === 0 && !showAddForm && (
                        <p className="text-sm text-gray-400 italic">Brak przypisanych pracowników.</p>
                    )}
                </div>
            </div>

            <StepMilestonesAndRisks
                register={register}
                errors={errors}
                riskFields={riskFields}
                appendRisk={appendRisk}
                removeRisk={removeRisk}
                milestones={milestones}
                milestonesFields={milestonesFields}
                appendMilestone={appendMilestone}
                removeMilestone={removeMilestone}
            />
        </>
    );
};
