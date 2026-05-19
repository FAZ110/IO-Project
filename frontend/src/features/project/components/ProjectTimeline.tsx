import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Check, HelpCircle, MapPin } from "lucide-react";
import type { ProjectDetailsResponse } from "../project.types";
import { useTimeline } from "../project.hooks";
import { EmployeeAssignmentStatus } from "@/features/employee-assignments/employee-assignments.types";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import type { ReactNode } from "react";

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
  children?: ReactNode;
}

export const ProjectTimeline = ({ project, children }: ProjectTimelineProps) => {
  const { data: timelineData } = useTimeline(project.id);
  const navigate = useNavigate();

  const projectStart = new Date(project.startDate);
  const projectEnd = new Date(project.endDate);

  const milestones = timelineData?.milestones ?? [];
  const assignmentsByUser = timelineData?.assignments ?? [];
  const markerGuideHeight = Math.max(assignmentsByUser.length * 56, 80);

  const getAssignmentStatusClasses = (status: EmployeeAssignmentStatus) => status === EmployeeAssignmentStatus.ACCEPTED
    ? "bg-emerald-500/95 hover:bg-emerald-600 border-emerald-800/35 ring-1 ring-inset ring-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]"
    : status === EmployeeAssignmentStatus.PENDING
      ? "bg-amber-400/95 hover:bg-amber-500 border-amber-700/30 ring-1 ring-inset ring-white/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
      : "bg-indigo-500/95 hover:bg-indigo-600 border-indigo-800/35 ring-1 ring-inset ring-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]";

  const getAssignmentStatusIcon = (status: EmployeeAssignmentStatus) => status === EmployeeAssignmentStatus.ACCEPTED
    ? <Check className="h-4 w-4 text-white" />
    : status === EmployeeAssignmentStatus.PENDING
      ? <HelpCircle className="h-4 w-4 text-white" />
      : null;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 border-b flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
          <CalendarDays className="h-5 w-5 text-indigo-500" />
          Harmonogram projektu
        </CardTitle>
        {children}
      </CardHeader>
      <CardContent className="pt-6 pb-5">
        <TooltipProvider>
          <div className="relative pl-0 pr-2 sm:pr-6">
            <div className="space-y-6 relative z-10">

              <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-3 sm:gap-4">
                <div />
                <div className="relative h-7 pr-2 sm:pr-6 border-l border-r border-slate-200 border-dashed">
                  <span className="absolute -top-5 left-0 text-xs text-slate-400 font-medium">{projectStart.toLocaleDateString()}</span>
                  <span className="absolute -top-5 right-0 text-xs text-slate-400 font-medium">{projectEnd.toLocaleDateString()}</span>
                  {milestones.map((milestone, index) => {
                    const milestoneDate = new Date(milestone.date);
                    const position = calculatePositionAndWidth(milestoneDate, milestoneDate, projectStart, projectEnd);
                    return (
                      <Tooltip key={`${milestone.name}-${milestone.date}-${index}`}>
                        <TooltipTrigger asChild>
                          <div
                            className="absolute top-0 -translate-x-1/2 cursor-pointer group"
                            style={{ left: position.left }}
                          >
                            <MapPin className="h-5 w-5 text-rose-500 fill-white group-hover:fill-rose-100 transition-colors" />
                            <div className="w-px h-full bg-rose-200 absolute left-1/2 -translate-x-1/2 top-5 pointer-events-none" style={{ height: `${markerGuideHeight}px` }} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] z-50 bg-white border shadow-md text-slate-800">
                          <p className="font-semibold">{milestone.name}</p>
                          <p className="text-xs text-slate-500 mb-1">{milestoneDate.toLocaleDateString()}</p>
                          <p className="text-sm">{milestone.description ?? ""}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>

              {assignmentsByUser.map((employee) => {
                const userName = `${employee.name} ${employee.surname}`;
                const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
                
                return (
                  <div key={employee.userId} className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-3 sm:gap-4">
                    <div className="z-20 flex items-center justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            // todo: do zmiany dla kogos kto robi profile uzytkownikow
                            onClick={() => navigate(PATHS.ADMIN_USER_DETAILS(employee.userId))}
                            className="group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-transform hover:scale-105"
                          >
                            <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm transition-colors group-hover:ring-indigo-300 group-hover:shadow-md">
                              <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-700">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="z-50 bg-slate-800 text-white border-0 shadow-md px-2 py-1 text-xs rounded-md" style={{ pointerEvents: 'none' }}>
                          <p className="font-medium text-center whitespace-nowrap">{userName}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="relative h-10 w-full rounded-md border border-slate-100 bg-slate-50/80 overflow-hidden">
                      {employee.assignments.map((assignment) => {
                        const assignmentStartDate = new Date(assignment.startDate);
                        const assignmentEndDate = new Date(assignment.endDate);
                        const position = calculatePositionAndWidth(assignmentStartDate, assignmentEndDate, projectStart, projectEnd);
                        return (
                          <Tooltip key={assignment.id}>
                            <TooltipTrigger asChild>
                              <div
                                className={`absolute top-1 bottom-1 rounded-sm cursor-pointer transition-colors border flex items-center justify-center overflow-hidden ${getAssignmentStatusClasses(assignment.status)}`}
                                style={{ left: position.left, width: position.width }}
                              >
                                {getAssignmentStatusIcon(assignment.status)}
                                {parseFloat(position.width) > 12 && (
                                  <span className="ml-1 text-xs font-bold text-white/90">{assignment.utilizationPercentage}%</span>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="z-50 bg-slate-700 text-white rounded-md shadow-md px-3 py-2.5 flex flex-col space-y-2 border border-slate-500 [&_svg]:hidden">
                              <div className="text-xs font-semibold text-amber-300">{assignment.roleName}</div>
                              <div className="text-xs text-slate-300 leading-tight">
                                {assignmentStartDate.toLocaleDateString()} - {assignmentEndDate.toLocaleDateString()}
                              </div>
                              <div className="text-sm font-semibold text-white pt-1 border-t border-slate-600">
                                Zaangażowanie: <span className="text-amber-300 font-bold">{assignment.utilizationPercentage}%</span>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};