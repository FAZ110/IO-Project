import type { SimpleUserResponse } from "@/features/user-management";
import { useState, useMemo } from "react";
import { type UseFormGetValues, type UseFormSetValue } from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types";

interface UserAutocompleteProps {
    label: string;
    foundUsers: SimpleUserResponse[];
    onSearch: (query: string) => void;
    setValue: UseFormSetValue<ProjectCreationRequest>;
    getValues: UseFormGetValues<ProjectCreationRequest>;
    clearErrors: (name: keyof ProjectCreationRequest) => void;
    roles: "committee" | "sponsors";
    usersById: Record<string, SimpleUserResponse>;
    onRememberUser: (user: SimpleUserResponse) => void; 
}

export const UserAutocomplete = ({
    label,
    foundUsers,
    onSearch,
    setValue,
    getValues,
    clearErrors,
    roles,
    usersById,
    onRememberUser,

}: UserAutocompleteProps) => {

    const [searchInput, setSearchInput] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const mergedUsersById = useMemo(() => {
      const next = { ...usersById };
      for (const user of foundUsers) {
      next[user.id] = user;
      }
      return next;
    }, [usersById, foundUsers]);

    const selectedUserIds = getValues(roles);

    const selectedUsers = useMemo(() => {
        return selectedUserIds
            .map((id) => {
                const known = mergedUsersById[id];
                if (known) return known;
                return { id, name: "Wybrany", surname: "użytkownik" } as SimpleUserResponse;
            });
    }, [selectedUserIds, mergedUsersById]);

    const handleAddUser = (user: SimpleUserResponse) => {
        const currentIds = getValues(roles);

        if (!currentIds.includes(user.id)) {
            setValue(roles, [...currentIds, user.id], {
                shouldValidate: true,
                shouldDirty: true,
            });
            clearErrors(roles);
        }

        onRememberUser(user);
        setSearchInput("");
        onSearch("");
        setIsDropdownOpen(false);
    };

    const handleRemoveUser = (userId: string) => {
        const currentIds = getValues(roles);
        const nextIds = currentIds.filter((id) => id !== userId);

        setValue(roles, nextIds, {
            shouldValidate: true,
            shouldDirty: true,
        });
        clearErrors(roles);
    };

    return (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
          <input
              placeholder={`Wyszukaj (${label.toLocaleLowerCase()})...`}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                onSearch(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500"
          />

          {isDropdownOpen && searchInput && (
              <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-48 overflow-y-auto">
                {foundUsers.length > 0 ?
                  foundUsers.map(user => (
                    <li key={user.id} className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
                        onMouseDown={() => handleAddUser(user)}>
                      {user.name} {user.surname}
                    </li>
                )) : (
                  <li className="p-2 text-gray-400 text-sm italic">Brak wyników...</li>
                )}
              </ul>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedUsers.map(userId => (
                <span key={userId.id} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                  {userId.name} {userId.surname}
                  <button type="button" onClick={() => handleRemoveUser(userId.id)} className="ml-1 text-blue-500 hover:text-blue-800 cursor-pointer">
                    <span aria-hidden="true" className="text-sm leading-none">×</span>
                  </button>
                </span>
            ))}
          </div>
        </div>
    )
}