import type { SimpleUserResponse } from "@/features/user-management";
import { useState, useMemo, useCallback } from "react";
import { type Control, type UseFormSetValue, useWatch } from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface UserAutocompleteProps {
    label: string;
    foundUsers: SimpleUserResponse[];
    onSearch: (query: string) => void;
    control: Control<ProjectCreationRequest>;
    setValue: UseFormSetValue<ProjectCreationRequest>;
    roles: "committee" | "sponsors";
}

export const UserAutocomplete = ({
    label,
    foundUsers,
    onSearch,
    control,
    setValue,
    roles,
}: UserAutocompleteProps) => {
    const [searchInput, setSearchInput] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const selectedUserIds = useWatch({ control, name: roles }) ?? [];

    const foundUsersById = useMemo(() => {
        const map: Record<string, SimpleUserResponse> = {};
        for (const user of foundUsers) map[user.id] = user;
        return map;
    }, [foundUsers]);

    const [knownUsersById, setKnownUsersById] = useState<Record<string, SimpleUserResponse>>({});

    const mergedUsersById = useMemo(
        () => ({ ...knownUsersById, ...foundUsersById }),
        [knownUsersById, foundUsersById]
    );

    const selectedUsers = useMemo(
        () =>
            selectedUserIds.map(
                (id) =>
                    mergedUsersById[id] ?? ({ id, name: "Wybrany", surname: "użytkownik" } as SimpleUserResponse)
            ),
        [selectedUserIds, mergedUsersById]
    );

    const handleAddUser = useCallback((user: SimpleUserResponse) => {
        if (!selectedUserIds.includes(user.id)) {
            setValue(roles, [...selectedUserIds, user.id], { shouldValidate: true, shouldDirty: true });
        }
        setKnownUsersById((prev) => ({ ...prev, [user.id]: user }));
        setSearchInput("");
        onSearch("");
        setIsDropdownOpen(false);
    }, [selectedUserIds, setValue, roles, onSearch]);

    const handleRemoveUser = useCallback((userId: string) => {
        setValue(
            roles,
            selectedUserIds.filter((id) => id !== userId),
            { shouldValidate: true, shouldDirty: true }
        );
    }, [selectedUserIds, setValue, roles]);

    return (
        <div className="relative">
            <Label className="mb-1">
                {label} <span className="text-muted-foreground font-normal">(opcjonalnie)</span>
            </Label>
            <Input
                placeholder={`Wyszukaj ${label.toLowerCase()}...`}
                value={searchInput}
                onChange={(e) => {
                    setSearchInput(e.target.value);
                    onSearch(e.target.value);
                    setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            />

            {isDropdownOpen && searchInput && (
                <ul className="absolute z-50 w-full bg-popover border border-border mt-1 rounded-lg shadow-md max-h-48 overflow-y-auto">
                    {foundUsers.length > 0 ? (
                        foundUsers.map((user) => (
                            <li
                                key={user.id}
                                className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                                onMouseDown={() => handleAddUser(user)}
                            >
                                {user.name} {user.surname}
                                <span className="text-muted-foreground ml-1 text-xs">({user.email})</span>
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-muted-foreground text-sm italic">Brak wyników...</li>
                    )}
                </ul>
            )}

            {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUsers.map((user) => (
                        <Badge key={user.id} variant="secondary" className="h-auto py-1 px-2 gap-1">
                            {user.name} {user.surname}
                            <button
                                type="button"
                                onClick={() => handleRemoveUser(user.id)}
                                className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer"
                                aria-label={`Usuń ${user.name} ${user.surname}`}
                            >
                                <X className="size-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
};
