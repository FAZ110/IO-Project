import type { ProjectResponse } from '@/features/project/project.types';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { ProjectCardView } from '../ProjectCard/ProjectCard.view';

interface DashboardProjectListViewProps {
  projects: ProjectResponse[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const DashboardProjectListView = ({ 
  projects, 
  isLoading, 
  isError, 
  onRetry 
}: DashboardProjectListViewProps) => {
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <p className="animate-pulse">Ładowanie projektów...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg border border-red-200 flex flex-col items-start gap-4">
        <p>Nie udało się pobrać listy projektów.</p>
        <button 
          onClick={onRetry} 
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
        <p className="text-gray-500">Brak przypisanych projektów.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {projects.map((project) => (
      <Link 
        key={project.id} 
        to={PATHS.PROJECT(project.id)} 
        className="block hover:opacity-90 transition-opacity" 
      >
        <ProjectCardView project={project} />
      </Link>
    ))}
  </div>
  );
};