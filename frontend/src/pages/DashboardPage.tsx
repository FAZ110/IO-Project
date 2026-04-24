import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/features/project/project.service';
import { ProjectCard } from '@/features/dashboard/components/ProjectCard/ProjectCard';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Plus, Search } from 'lucide-react';

export const DashboardPage = () => {
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: projectService.getAllProjects
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Nagłówek */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Projekty</h1>
          <p className="text-muted-foreground">Masz {projects?.length || 0} aktywnych projektów w tym semestrze.</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} /> Nowy Projekt
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 py-4 border-y">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            placeholder="Szukaj projektu..." 
            className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:ring-2 ring-primary outline-none"
          />
        </div>
        <div className="flex gap-2 bg-muted p-1 rounded-lg">
          <Button variant="ghost" size="sm" className="bg-background shadow-sm px-3"><LayoutGrid size={16} /></Button>
          <Button variant="ghost" size="sm" className="px-3"><List size={16} /></Button>
        </div>
      </div>

      {/* Siatka Projektów */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[220px] rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-destructive bg-destructive/10 rounded-xl border border-destructive/20">
          Wystąpił błąd podczas ładowania danych z API. Sprawdź połączenie z backendem.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};