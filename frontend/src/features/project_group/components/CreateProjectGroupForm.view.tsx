import type { ProjectDetailsResponse } from "@/features/project/project.types.ts";
import type { ProjectGroupCreationRequest } from "../project_group.types.ts";
import { PROJECT_GROUP_TYPE_LABELS, PROJECT_GROUP_TYPE_VALUES } from "../project_group.types.ts";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { useState } from "react";

interface CreateProjectGroupFormProps {
  methods: UseFormReturn<ProjectGroupCreationRequest>;
  onSubmit: SubmitHandler<ProjectGroupCreationRequest>;
  foundProjects: ProjectDetailsResponse[];
  onSearchProjects: (query: string) => void;
}

export const CreateProjectGroupFormView = ({ methods, onSubmit, foundProjects, onSearchProjects }: CreateProjectGroupFormProps) => {
  const {
    register,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = methods;

  const [searchInput, setSearchInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProjectsById, setSelectedProjectsById] = useState<Record<string, ProjectDetailsResponse>>({});

  const selectedProjectIds = watch("projectIds") ?? [];

  const handleAddProject = (project: ProjectDetailsResponse) => {
    const currentIds = getValues("projectIds") ?? [];

    if (!currentIds.includes(project.id)) {
      setValue("projectIds", [...currentIds, project.id], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    setSelectedProjectsById((prev) => ({
      ...prev,
      [project.id]: project,
    }));

    setSearchInput("");
    onSearchProjects("");
    setIsDropdownOpen(false);
  };

  const handleRemoveProject = (projectId: string) => {
    const currentIds = getValues("projectIds") ?? [];

    setValue(
      "projectIds",
      currentIds.filter((id) => id !== projectId),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tworzenie portfela/programu</h2>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nazwa *
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Opis *
          </label>
          <textarea
            id="description"
            {...register("description")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

        <div>
          <label htmlFor="groupType" className="block text-sm font-medium text-gray-700">
            Typ *
          </label>
          <select id="groupType" {...register("groupType")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            {PROJECT_GROUP_TYPE_VALUES.map((value) => (
              <option key={value} value={value}>
                {PROJECT_GROUP_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="relative mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Dodaj projekt do portfela/programu (opcjonalne)</label>
          <input
            placeholder="Wyszukaj projekt..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              onSearchProjects(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500"
          />

          {isDropdownOpen && searchInput && (
            <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-48 overflow-y-auto">
              {foundProjects.length > 0 ? (
                foundProjects.map((project) => (
                  <li
                    key={project.id}
                    className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
                    onMouseDown={() => {
                      handleAddProject(project);
                    }}
                  >
                    <span className="text-blue-800 py-1 rounded-md text-sm font-bold">{project.title}</span>
                    <span className="mx-1">-</span>
                    <span className="font-semibold">
                      {project.manager.name} {project.manager.surname}
                    </span>
                    <span className="mx-1">-</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-400 text-sm italic">Brak wyników...</li>
              )}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {selectedProjectIds.map((projectId) => {
            const project = selectedProjectsById[projectId] ?? foundProjects.find((p) => p.id === projectId);
            if (!project) return null;

            return (
              <span key={projectId} className="flex items-center bg-blue-100 text-green-800 px-2 py-1 rounded text-xs">
                <span className="text-blue-800 py-1 rounded-md text-sm font-bold">{project.title}</span>
                <span className="mx-1">-</span>
                <span className="font-semibold">
                  {project.manager.name} {project.manager.surname}
                </span>
                <span className="ml-2 text-gray-500 text-xs">{new Date(project.startDate).toLocaleDateString()}</span>
                <button type="button" onClick={() => handleRemoveProject(projectId)} className="ml-2 text-red-500 hover:text-red-700">
                  <span aria-hidden="true" className="text-sm leading-none">
                    ×
                  </span>
                </button>
              </span>
            );
          })}
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Stwórz portfel/program
        </button>
      </form>
    </div>
  );
};
