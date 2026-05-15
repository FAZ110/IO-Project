import { Briefcase, Folder } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { ProjectResponse } from '@/features/project/project.types';
import {GroupSection, type GroupWithProjects} from "@/features/dashboard/components/GroupSection/GroupSection.tsx";
import {ProjectGrid} from "@/features/dashboard/components/ProjectGrid/ProjectGrid.tsx";

export interface DashboardProjectListViewProps {
    wallets: GroupWithProjects[];
    programs: GroupWithProjects[];
    unassignedProjects: ProjectResponse[];
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
}

export const DashboardProjectListView = ({
                                             wallets,
                                             programs,
                                             unassignedProjects,
                                             isLoading,
                                             isError,
                                             onRetry
                                         }: DashboardProjectListViewProps) => {

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                <p className="animate-pulse">Ładowanie widoku...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 bg-red-50 text-red-600 rounded-lg border border-red-200 flex flex-col items-start gap-4">
                <p>Nie udało się pobrać danych.</p>
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Spróbuj ponownie
                </button>
            </div>
        );
    }

    const hasAnyProjectsOrGroups = wallets.length > 0 || programs.length > 0 || unassignedProjects.length > 0;

    if (!hasAnyProjectsOrGroups) {
        return (
            <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-500">Brak przypisanych projektów i grup.</p>
            </div>
        );
    }

    return (
        <div className="pb-10">
            <GroupSection
                title="Twoje Portfele"
                groups={wallets}
                icon={Briefcase}
                badgeVariant="default"
            />

            <GroupSection
                title="Twoje Programy"
                groups={programs}
                icon={Folder}
                badgeVariant="secondary"
            />

            {unassignedProjects.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                        Projekty nieprzypisane do grup
                    </h3>
                    <Separator className="mb-6" />
                    <ProjectGrid projects={unassignedProjects} />
                </div>
            )}
        </div>
    );
};