import { useState } from 'react';
import { ChevronDown, FolderOpen, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { ProjectGroupResponse } from '@/features/project_group/project_group.types';
import { ProjectGrid } from "@/features/dashboard/components/ProjectGrid/ProjectGrid.tsx";
import { Button } from '@/components/ui/button';
import { useReportDownload } from '@/features/report/report.hooks';

interface GroupSectionProps {
  title: string;
  groups: ProjectGroupResponse[];
  icon: React.ElementType;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

export const GroupSection = ({
                               title,
                               groups,
                               icon: Icon,
                               badgeVariant = "default"
                             }: GroupSectionProps) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => groups.reduce((acc, g) => ({ ...acc, [g.id]: true }), {})
  );
  const { downloadReport, isDownloading } = useReportDownload();

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownload = (groupId: string, groupName: string) => {
    const filename = `zestawienie_${groupName.toLowerCase().replace(/\s+/g, '_')}.csv`;
    downloadReport(`/groups/${groupId}/reports/projects/csv`, filename);
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
            <div className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors">
              <CollapsibleTrigger className="flex items-center gap-3 flex-grow">
                <FolderOpen className="w-5 h-5 text-gray-400" />
                <span className="font-semibold text-gray-800">{group.name}</span>
                <Badge variant={badgeVariant} className="ml-2">
                  {group.projects.length} {group.projects.length === 1 ? 'projekt' : (group.projects.length > 1 && group.projects.length < 5) ? 'projekty' : 'projektów'}
                </Badge>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openGroups[group.id] ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-sm text-gray-600 hover:text-gray-900"
                onClick={() => handleDownload(group.id, group.name)}
                disabled={isDownloading}
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                Pobierz zestawienie (CSV)
              </Button>
            </div>

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