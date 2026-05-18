import { useProjects } from '@/features/project/project.hooks';
import { DashboardProjectListView } from './DashboardProjectList.view';
import { useAllProjectGroups } from '@/features/project_group/project_group.hooks';

export const DashboardProjectList = () => {
    const { data: projects = [], isLoading: isLoadingProjects, isError: isErrorProjects, refetch: refetchProjects } = useProjects();
    const { data: groups, isLoading: isLoadingGroups, isError: isErrorGroups, refetch: refetchGroups } = useAllProjectGroups();

    const isLoading = isLoadingProjects || isLoadingGroups;
    const isError = isErrorProjects || isErrorGroups;

    const refetch = () => {
        void refetchProjects();
        void refetchGroups();
    }

    const unassignedProjects = projects ? projects.filter(p => !p.group) : [];

    return (
        <DashboardProjectListView
            wallets={groups?.wallets || []}
            programs={groups?.programs || []}
            unassignedProjects={unassignedProjects}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
        />
    );
};