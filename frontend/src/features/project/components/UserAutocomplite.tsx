import type { SimpleUserResponse } from "@/features/user-management";
import { useState } from "react";

interface UserAutocompliteProps {
    label: string;
    foundUsers: SimpleUserResponse[];
    onSearch: (query: string) => void;
    selecedUsers: SimpleUserResponse[];
    onAddUser: (user: SimpleUserResponse) => void;
    onRemoveUser: (userId: string) => void;
}

export const UserAutocomplite = ({
    label,
    foundUsers,
    onSearch,
    selecedUsers,
    onAddUser,
    onRemoveUser
}: UserAutocompliteProps) => {

    const [searchInput, setSearchInput] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
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
                        onMouseDown={() => onAddUser(user)}>
                      {user.name} {user.surname}
                    </li>
                )) : (
                  <li className="p-2 text-gray-400 text-sm italic">Brak wyników...</li>
                )}
              </ul>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {selecedUsers.map(user => (
                <span key={user.id} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                  {user.name} {user.surname}
                  <button type="button" onClick={() => onRemoveUser(user.id)} className="ml-1 text-blue-500 hover:text-blue-800 cursor-pointer">
                    <span aria-hidden="true" className="text-sm leading-none">×</span>
                  </button>
                </span>
            ))}
          </div>
        </div>
    )
}