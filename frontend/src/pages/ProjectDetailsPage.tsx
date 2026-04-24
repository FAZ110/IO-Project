import {useProjectDetails} from "@/features/project/project.hooks.ts";
import {useParams} from "react-router-dom";
import {ProjectHeader} from "@/features/project/components/ProjectHeader.tsx";

export const ProjectDetailsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading, isError } = useProjectDetails(projectId || '');

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Ładowanie danych projektu...</div>;
  }

  if (isError || !project) {
    return <div className="p-8 text-center text-red-500">Nie udało się znaleźć tego projektu.</div>;
  }

  return (
    <div className="p-4 mx-auto space-y-6 sm:p-6 lg:p-8 max-w-7xl">

      <ProjectHeader details={project} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="space-y-6 lg:col-span-2">

        </div>

        <div className="space-y-6">
        </div>

      </div>

    </div>
  );
};