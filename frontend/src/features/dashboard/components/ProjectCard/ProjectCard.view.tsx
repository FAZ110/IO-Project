import type { ProjectResponse } from '@/features/project/project.types';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react'; 

interface ProjectCardViewProps {
  project: ProjectResponse;
}

export const ProjectCardView = ({ project }: ProjectCardViewProps) => {
  return (
    <div  
      className="group bg-white hover:shadow-lg transition-all border border-gray-200 rounded-xl p-5 flex flex-col gap-4 cursor-pointer"
    >
      <div className="flex justify-between items-start gap-4">
        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
          {project.title || "Nienazwany projekt"}
        </h3>
        
        <Badge 
          variant={project.isActive ? 'default' : 'secondary'}
          className={project.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200 border-transparent' : ''}
        >
          {project.isActive ? 'W toku' : project.isActive}
        </Badge>
      </div>

      <p className="text-gray-500 text-sm line-clamp-2 min-h-10 grow">
        {project.description || "Brak opisu projektu."}
      </p>

      {/* 2. Tymczasowo ukrywamy "members", bo nie wspiera tego backend. 
          Możemy odkomentować poniższy kod, gdy backend doda pole members. */}
      {/* <div className="flex items-center gap-4 mt-2">
         Tu kiedyś będą awatary członków
      </div> 
      */}

      <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <CalendarDays size={14} />
          <span>Utworzono: {project.startDate ? new Date(project.startDate).toLocaleDateString('pl-PL') : '-'}</span>
        </div>
      </div>
    </div>
  );
};