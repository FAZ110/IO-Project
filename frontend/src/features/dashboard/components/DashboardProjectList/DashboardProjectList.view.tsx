import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { ProjectCardView } from '../ProjectCard/ProjectCard.view';
import type { ProjectResponse } from '@/features/project/project.types';
import type { SingleGroupResponse } from '@/features/project_group/project_group.types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Folder, Briefcase, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface GroupWithProjects extends SingleGroupResponse {
  projects: ProjectResponse[];
}

interface DashboardProjectListViewProps {
  wallets: GroupWithProjects[];
  programs: GroupWithProjects[];
  unassignedProjects: ProjectResponse[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const ProjectGrid = ({ projects }: { projects: ProjectResponse[] }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
        <p className="text-gray-500">Brak przypisanych projektów w tej grupie.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
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

const GroupSection = ({ 
  title, 
  groups, 
  icon: Icon,
  badgeVariant = "default"
}: { 
  title: string, 
  groups: GroupWithProjects[], 
  icon: React.ElementType,
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    groups.reduce((acc, g) => ({ ...acc, [g.id]: true }), {})
  );

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (groups.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
        <Icon className="w-6 h-6 text-blue-600" />
        {title}
      </h3>
      <Separator className="mb-6" />
      
      <div className="space-y-4">
        {groups.map(group => (
          <Collapsible 
            key={group.id} 
            open={openGroups[group.id]} 
            onOpenChange={() => toggleGroup(group.id)}
            className="border rounded-lg bg-white shadow-sm overflow-hidden"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-5 h-5 text-gray-400" />
                <span className="font-semibold text-gray-800">{group.name}</span>
                <Badge variant={badgeVariant} className="ml-2">
                  {group.projects.length} {group.projects.length === 1 ? 'projekt' : (group.projects.length > 1 && group.projects.length < 5) ? 'projekty' : 'projektów'}
                </Badge>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openGroups[group.id] ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="p-4 bg-gray-50/50 border-t">
                <ProjectGrid projects={group.projects} />
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

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