import { useProjects } from '@/features/project/project.hooks';
import { DashboardProjectListView } from './DashboardProjectList.view';
import { useAllProjectGroups } from '@/features/project_group/project_group.hooks';

interface DashboardProjectListProps {
  searchQuery: string;
}

export const DashboardProjectList = ({ searchQuery }: DashboardProjectListProps) => {
    const { data: projects = [], isLoading: isLoadingProjects, isError: isErrorProjects, refetch: refetchProjects } = useProjects();
    const { data: groups, isLoading: isLoadingGroups, isError: isErrorGroups, refetch: refetchGroups } = useAllProjectGroups();

    const isLoading = isLoadingProjects || isLoadingGroups;
    const isError = isErrorProjects || isErrorGroups;

    const refetch = () => {
        void refetchProjects();
        void refetchGroups();
    }

    const filteredProjects = projects ? projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())) : [];

    const unassignedProjects = filteredProjects.filter(p => !p.group);

    const filteredWallets = groups?.wallets.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.projects.some(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))).map(w => ({
        ...w,
        projects: w.projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || w.name.toLowerCase().includes(searchQuery.toLowerCase()))
    })) || [];

    const filteredPrograms = groups?.programs.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.projects.some(proj => proj.title.toLowerCase().includes(searchQuery.toLowerCase()))).map(prog => ({
        ...prog,
        projects: prog.projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || prog.name.toLowerCase().includes(searchQuery.toLowerCase()))
    })) || [];

    return (
        <DashboardProjectListView
            wallets={filteredWallets}
            programs={filteredPrograms}
            unassignedProjects={unassignedProjects}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
        />
    );
};