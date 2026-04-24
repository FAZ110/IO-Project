// src/features/dashboard/components/DashboardProjectList/DashboardProjectList.tsx
import { useProjects } from '@/features/project/project.hooks';
import { DashboardProjectListView } from './DashboardProjectList.view.tsx';

export const DashboardProjectList = () => {
  const { data: projects = [], isLoading, isError, refetch } = useProjects();

  return (
    <DashboardProjectListView 
      projects={projects} 
      isLoading={isLoading} 
      isError={isError}
      onRetry={refetch}
    />
  );
};