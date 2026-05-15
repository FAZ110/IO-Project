import { useProjects } from '@/features/project/project.hooks';
import { DashboardProjectListView } from './DashboardProjectList.view';
import { useAllProjectGroups } from '@/features/project_group/project_group.hooks';
import { useMemo } from 'react';
import type { ProjectResponse } from '@/features/project/project.types';

export const DashboardProjectList = () => {
    const { data: projects = [], isLoading: isLoadingProjects, isError: isErrorProjects, refetch: refetchProjects } = useProjects();
    const { data: groups, isLoading: isLoadingGroups, isError: isErrorGroups, refetch: refetchGroups } = useAllProjectGroups();

    const groupedProjects = useMemo(() => {
        if (!projects || !groups) return { wallets: [], programs: [], unassigned: [] };

        const projectsByGroupId = projects.reduce((acc, project) => {
            const groupId = project.group?.id;

            if (groupId) {
                if (!acc[groupId]) {
                    acc[groupId] = [];
                }
                acc[groupId].push(project);
            }
            return acc;
        }, {} as Record<string, ProjectResponse[]>);

        const wallets = groups.wallets.map(wallet => ({
            ...wallet,
            projects: projectsByGroupId[wallet.id] || []
        }));

        const programs = groups.programs.map(program => ({
            ...program,
            projects: projectsByGroupId[program.id] || []
        }));

        const unassigned = projects.filter(p => !p.group);

        return { wallets, programs, unassigned };
    }, [projects, groups]);

    const isLoading = isLoadingProjects || isLoadingGroups;
    const isError = isErrorProjects || isErrorGroups;

    const refetch = () => {
        refetchProjects();
        refetchGroups();
    }

    return (
        <DashboardProjectListView
            wallets={groupedProjects.wallets}
            programs={groupedProjects.programs}
            unassignedProjects={groupedProjects.unassigned}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
        />
    );
};