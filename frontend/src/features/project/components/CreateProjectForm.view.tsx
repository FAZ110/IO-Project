import type { FieldErrors, UseFormRegister, FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";
import type { ProjectCreationRequest } from "../project.types.ts";

interface CreateProjectViewProps {
  register: UseFormRegister<ProjectCreationRequest>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  errors: FieldErrors<ProjectCreationRequest>;
  
  riskFields: FieldArrayWithId<ProjectCreationRequest, "risks", "id">[];
  appendRisk: UseFieldArrayAppend<ProjectCreationRequest, "risks">;
  removeRisk: UseFieldArrayRemove;
  
  roleFields: FieldArrayWithId<ProjectCreationRequest, "roles", "id">[];
  appendRole: UseFieldArrayAppend<ProjectCreationRequest, "roles">;
  removeRole: UseFieldArrayRemove;
  
  message?: string;
}

const today = new Date().toISOString().split('T')[0];

export const CreateProjectView = ({ 
  register, 
  onSubmit, 
  isPending, 
  errors, 
  riskFields,
  appendRisk, 
  removeRisk,
  roleFields,
  appendRole,
  removeRole,
  message 
}: CreateProjectViewProps) => (
  <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Utwórz Nowy Projekt</h2>
    
    {message && (
      <div className={`p-4 mb-4 rounded ${message.includes('Błąd') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        {message}
      </div>
    )}

    <form onSubmit={onSubmit} className="space-y-6 text-left">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa *</label>
          <input
            {...register('title', { required: 'Tytuł jest wymagany' })}
            type="text"
            className={`w-full border rounded p-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opis *</label>
          <textarea
            {...register('description', { required: 'Opis jest wymagany' })}
            rows={3}
            className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Startu *</label>
            <input
                {...register('startDate', { 
                    required: 'Data jest wymagana', 
                    validate: (value) => value >= today || 'Data nie może być z przeszłości'
                })}
                type="date"
                min={today} 
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
            />
            {errors.startDate && <span className="text-red-500 text-xs">{errors.startDate.message}</span>}
          </div>
          <div className="flex items-center mt-6">
            <input
              {...register('isActive')}
              type="checkbox"
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Projekt aktywny</label>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Potrzebni pracownicy (Wakaty)</h3>
          <button
            type="button"
            onClick={() => appendRole({ name: '', utilizationPercentages: [100] })}
            className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 cursor-pointer shadow-sm"
          >
            + Dodaj Stanowisko
          </button>
        </div>

        {roleFields.length === 0 && (
          <p className="text-sm text-gray-500 mb-4">Nie dodano jeszcze żadnych stanowisk. Użyj przycisku powyżej, aby zaplanować wakaty w projekcie.</p>
        )}

        <div className="space-y-4">
          {roleFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Nazwa roli / stanowiska (np. Senior Frontend Developer)</label>
                <input
                  {...register(`roles.${index}.name` as const, { required: "Nazwa roli jest wymagana" })}
                  type="text"
                  placeholder="Wpisz nazwę stanowiska..."
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                type="button" 
                onClick={() => removeRole(index)} 
                className="mt-4 text-red-500 hover:text-red-700 text-sm font-bold cursor-pointer"
              >
                X Usuń
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Ryzyka Projektu</h3>
          <button
            type="button"
            onClick={() => appendRisk({ name: '', description: '', probability: 0 })}
            className="bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-700 cursor-pointer"
          >
            + Dodaj Ryzyko
          </button>
        </div>

        <div className="space-y-4">
          {riskFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
              <button type="button" onClick={() => removeRisk(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-bold cursor-pointer">
                X Usuń
              </button>

              <div className="grid grid-cols-2 gap-4 mb-3 pr-8">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nazwa Ryzyka</label>
                  <input
                    {...register(`risks.${index}.name` as const, { required: true })}
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prawdopodobieństwo (0-100)</label>
                  <input
                    {...register(`risks.${index}.probability` as const, { valueAsNumber: true, min: 0, max: 100 })}
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

      <button disabled={isPending} type="submit" className={`w-full text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200 mt-6 ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}>
        {isPending ? 'Zapisywanie...' : 'Zapisz Projekt'}
      </button>
    </form>
  </div>
);