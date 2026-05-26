import { useParams } from "react-router-dom";
import { useProjectDetails } from "@/features/project/project.hooks.ts";
import { ProjectHeader } from "@/features/project/components/ProjectHeader.tsx";
import { ProjectRisks } from "@/features/project/components/ProjectRisks.tsx";
import { ProjectMembersSideBar } from "@/features/project/components/ProjectMembersSideBar.tsx";
import { ProjectTimeline } from "@/features/project/components/ProjectTimeline.tsx";
import { CreateAssignmentModal } from "@/features/project/components/CreateAssignmentModal";
import { isAxiosError } from "axios";

export const ProjectDetailsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading, isError, error } = useProjectDetails(projectId || '');

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Ładowanie danych projektu...</div>;
  }

  if (isError) {
    if (isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 401)) {
      return (
        <div className="p-8 mx-auto max-w-2xl mt-12">
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center space-y-2">
            <h2 className="text-lg font-bold text-red-700">Brak dostępu</h2>
            <p>Nie masz odpowiednich uprawnień, aby wyświetlić szczegóły tego projektu.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-8 text-center text-red-500">
        Nie udało się pobrać danych projektu lub wystąpił błąd serwera.
      </div>
    );
  }

  if (!project || !projectId) {
    return <div className="p-8 text-center text-gray-500">Nie znaleziono projektu.</div>;
  }

  return (
    <div className="p-4 mx-auto space-y-6 sm:p-6 lg:p-8 w-full">
      <ProjectHeader details={project} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          <ProjectTimeline project={project}>
            <CreateAssignmentModal project={project} />
          </ProjectTimeline>

          <ProjectRisks projectId={project.id} />
        </div>

        <div className="space-y-6">
          <ProjectMembersSideBar projectId={project.id} />
        </div>
      </div>
    </div>
  );
};