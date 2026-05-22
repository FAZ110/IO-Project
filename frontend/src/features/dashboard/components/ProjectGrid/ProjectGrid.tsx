import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import type { ProjectResponse } from '@/features/project/project.types';
import {ProjectCardView} from "@/features/dashboard/components/ProjectCard/ProjectCard.view.tsx";

interface ProjectGridProps {
    projects: ProjectResponse[];
}

export const ProjectGrid = ({ projects }: ProjectGridProps) => {
    if (projects.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-500">Brak przypisanych projektów w tej grupie.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
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