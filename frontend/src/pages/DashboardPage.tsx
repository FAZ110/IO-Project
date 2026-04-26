import { useProjects } from '@/features/project/project.hooks';
import { PATHS } from '@/routes/paths';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { data: projects, isLoading, isError } = useProjects();

  return (
    <div className="p-4 mx-auto space-y-6 sm:p-6 lg:p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Twoje Projekty</h1>
        <Link 
          to={PATHS.CREATE_PROJECT} 
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Utwórz nowy projekt
        </Link>
      </div>

      {isLoading && <div className="text-center text-gray-500">Ładowanie projektów...</div>}
      {isError && <div className="text-center text-red-500">Nie udało się załadować projektów.</div>}
      
      {!isLoading && !isError && projects?.length === 0 && (
        <div className="text-center py-10 bg-white rounded shadow-sm border">
          <p className="text-gray-500 mb-4">Nie masz jeszcze żadnych projektów.</p>
          <Link to={PATHS.CREATE_PROJECT} className="text-blue-600 underline">Utwórz pierwszy projekt</Link>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map(project => (
          <Link 
            key={project.id} 
            to={PATHS.PROJECT(project.id)}
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">{project.title}</h5>
            <p className="font-normal text-gray-700 line-clamp-2 mb-4">{project.description}</p>
            <div className="text-sm text-gray-500">
              Start: {new Date(project.startDate).toLocaleDateString()}
            </div>
            <div className="mt-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded ${project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {project.isActive ? 'Aktywny' : 'Zakończony'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
