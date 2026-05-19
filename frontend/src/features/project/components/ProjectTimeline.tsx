import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, MapPin } from "lucide-react";
import type { ProjectDetailsResponse } from "../project.types";
import { useProjectAssignments } from "../project.hooks";

// Dane tymczasowe
const MOCK_DATA = {
  projectStart: new Date("2026-04-01"),
  projectEnd: new Date("2026-07-31"),
  milestones: [
    { id: "m1", name: "Faza Testów", description: "Zakończenie pierwszej iteracji programistycznej i start QA", date: new Date("2026-05-15") },
    { id: "m2", name: "Akceptacja UAT", description: "Odbiór modułów przez klienta biznesowego", date: new Date("2026-06-20") },
    { id: "m3", name: "Wdrożenie PROD", description: "Zrzut na środowisko produkcyjne", date: new Date("2026-07-28") },
  ],
  assignments: [
    { id: "a1", userName: "Jan Kowalski", role: "Programista Java", startDate: new Date("2026-04-10"), endDate: new Date("2026-05-20"), utilization: 100 },
    { id: "a2", userName: "Jan Kowalski", role: "Wsparcie QA", startDate: new Date("2026-06-01"), endDate: new Date("2026-07-15"), utilization: 20 },
    { id: "a3", userName: "Anna Nowak", role: "UX Designer", startDate: new Date("2026-04-01"), endDate: new Date("2026-04-30"), utilization: 50 },
  ]
};

const calculatePositionAndWidth = (start: Date, end: Date, projectStart: Date, projectEnd: Date) => {
  const totalProjectDuration = projectEnd.getTime() - projectStart.getTime();
  const taskDuration = end.getTime() - start.getTime();
  const timeOffset = start.getTime() - projectStart.getTime();

  const widthPercent = Math.min(Math.max((taskDuration / totalProjectDuration) * 100, 0), 100);
  const leftPercent = Math.min(Math.max((timeOffset / totalProjectDuration) * 100, 0), 100);

  return { left: `${leftPercent}%`, width: `${widthPercent}%` };
};

interface ProjectTimelineProps {
  project: ProjectDetailsResponse;
}

export const ProjectTimeline = ({ project }: ProjectTimelineProps) => {
  const { projectStart, projectEnd, milestones, assignments } = MOCK_DATA;
  const { assignments: _ } = useProjectAssignments(project.id);

  const assignmentsByUser = assignments.reduce((acc, curr) => {
    if (!acc[curr.userName]) acc[curr.userName] = [];
    acc[curr.userName].push(curr);
    return acc;
  }, {} as Record<string, typeof assignments>);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
          <CalendarDays className="h-5 w-5 text-indigo-500" />
          Harmonogram Projektu (Timeline)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 relative">
        <TooltipProvider>
          <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none mx-6">
            <div className="h-full border-l border-r border-slate-200 border-dashed relative">
              <span className="absolute -top-5 left-0 text-xs text-slate-400 font-medium">{projectStart.toLocaleDateString()}</span>
              <span className="absolute -top-5 right-0 text-xs text-slate-400 font-medium">{projectEnd.toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-8 relative z-10 mx-6">

            <div className="relative h-6">
              {milestones.map((milestone) => {
                const position = calculatePositionAndWidth(milestone.date, milestone.date, projectStart, projectEnd);
                return (
                  <Tooltip key={milestone.id}>
                    <TooltipTrigger asChild>
                      <div
                        className="absolute top-0 -ml-2 cursor-pointer group"
                        style={{ left: position.left }}
                      >
                        <MapPin className="h-5 w-5 text-rose-500 fill-white group-hover:fill-rose-100 transition-colors" />
                        <div className="w-px h-full bg-rose-200 absolute left-1/2 -ml-px top-5 pointer-events-none" style={{ height: '500px' }} /> {/* Pionowa linia w dół */}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px] z-50 bg-white border shadow-md text-slate-800">
                      <p className="font-semibold">{milestone.name}</p>
                      <p className="text-xs text-slate-500 mb-1">{milestone.date.toLocaleDateString()}</p>
                      <p className="text-sm">{milestone.description}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {Object.entries(assignmentsByUser).map(([userName, userAssignments], index) => {
              const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

              return (
                <div key={index} className="relative flex items-center h-10 mt-4">
                  <div className="absolute -left-12 z-20">
                    <Avatar className="h-8 w-8 ring-2 ring-white">
                      <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="relative w-full h-full bg-slate-50 rounded-md border border-slate-100">
                    {userAssignments.map((assignment) => {
                      const position = calculatePositionAndWidth(assignment.startDate, assignment.endDate, projectStart, projectEnd);

                      return (
                        <Tooltip key={assignment.id}>
                          <TooltipTrigger asChild>
                            <div
                              className="absolute top-1 bottom-1 bg-indigo-500 hover:bg-indigo-600 rounded-sm cursor-pointer transition-colors border border-indigo-700/20 flex items-center justify-center overflow-hidden"
                              style={{ left: position.left, width: position.width }}
                            >
                              {/* Jeśli pasek jest dostatecznie szeroki, pokazujemy procent w środku */}
                              {parseFloat(position.width) > 10 && (
                                <span className="text-[10px] font-bold text-white/90">{assignment.utilization}%</span>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="z-50 bg-white border shadow-md text-slate-800">
                            <p className="font-semibold">{assignment.role}</p>
                            <p className="text-xs text-slate-500 mb-1">
                              {assignment.startDate.toLocaleDateString()} - {assignment.endDate.toLocaleDateString()}
                            </p>
                            <p className="text-sm">Zaangażowanie: <span className="font-bold">{assignment.utilization}%</span></p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};