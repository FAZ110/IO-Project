import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { usePotentialSupervisors } from '../user-management.hooks';
import type { SimpleUserResponse } from '../user-management.types';

interface ManagerSelectorProps {
  onSelect: (id: string) => void;
  error?: string;
}

export const ManagerSelector = ({ onSelect, error }: ManagerSelectorProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<SimpleUserResponse | null>(null);

  const [debouncedSearch] = useDebounce(searchInput, 300);
  const { data: foundManagers = [] } = usePotentialSupervisors(debouncedSearch);

  const handleSelect = (manager: SimpleUserResponse) => {
    setSelectedManager(manager);
    setSearchInput('');
    setIsDropdownOpen(false);
    onSelect(manager.id);
  };

  const handleClear = () => {
    setSelectedManager(null);
    setSearchInput('');
    onSelect('');
  };

  return (
    <div className="relative">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Menedżer liniowy *
      </label>

      {selectedManager ? (
        <div className={`flex items-center justify-between px-4 py-2 border rounded-md bg-blue-50 ${error ? 'border-red-500' : 'border-gray-300'}`}>
          <span className="text-sm text-blue-800">
            {selectedManager.name} {selectedManager.surname}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 text-blue-500 hover:text-blue-800 cursor-pointer text-sm leading-none"
            aria-label="Wyczyść wybór"
          >
            ×
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Wyszukaj menedżera liniowego..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
          />

          {isDropdownOpen && searchInput && (
            <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-48 overflow-y-auto">
              {foundManagers.length > 0 ? (
                foundManagers.map((manager) => (
                  <li
                    key={manager.id}
                    className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
                    onMouseDown={() => handleSelect(manager)}
                  >
                    {manager.name} {manager.surname}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-400 text-sm italic">Brak wyników...</li>
              )}
            </ul>
          )}
        </>
      )}

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};
