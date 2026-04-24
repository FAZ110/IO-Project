// src/features/dashboard/components/ProjectCard/ProjectCard.tsx
import type { Project } from '@/features/project/project.types';
import { useNavigate } from 'react-router-dom';
import { ProjectCardView } from './ProjectCard.view.tsx';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  return <ProjectCardView project={project} onClick={handleCardClick} />;
};