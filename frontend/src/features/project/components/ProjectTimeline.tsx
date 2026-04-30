import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

// interface ProjectTimelineProps {
//   projectId: string;
// }

// Dane tymczasowe
export const PROJECT_TIMELINE_MOCK_DATA = {
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

export type TimelineAssignment = (typeof PROJECT_TIMELINE_MOCK_DATA.assignments)[number];
export type TimelineMilestone = (typeof PROJECT_TIMELINE_MOCK_DATA.milestones)[number];
type Assignment = TimelineAssignment;
type ResizeDirection = "start" | "end";

interface ActiveResize {
  assignmentId: string;
  direction: ResizeDirection;
  rowWidth: number;
  initialX: number;
  initialStart: number;
  initialEnd: number;
}

interface ActiveMove {
  assignmentId: string;
  initialX: number;
  initialUserName: string;
  rowWidth: number;
  initialStart: number;
  initialEnd: number;
  rowRects: Array<{ userName: string; top: number; bottom: number }>;
}

interface MovePreview {
  assignmentId: string;
  userName: string;
  startMs: number;
  endMs: number;
}

interface ActiveMilestoneMove {
  milestoneId: string;
  initialX: number;
  initialDate: number;
  rowWidth: number;
}

interface IntervalAddPreview {
  userName: string;
  left: number;
  width: number;
  startMs: number;
  endMs: number;
}

export type SelectedElement =
  | { type: "none" }
  | { type: "milestone"; id: string }
  | { type: "assignment"; id: string };

export interface ProjectTimelineProps {
  projectStart: Date;
  projectEnd: Date;
  milestones: TimelineMilestone[];
  assignments: TimelineAssignment[];
  setMilestones: React.Dispatch<React.SetStateAction<TimelineMilestone[]>>;
  setAssignments: React.Dispatch<React.SetStateAction<TimelineAssignment[]>>;
  selectedElement: SelectedElement;
  setSelectedElement: React.Dispatch<React.SetStateAction<SelectedElement>>;
}

export const ProjectTimeline = ({
  projectStart,
  projectEnd,
  milestones,
  assignments,
  setMilestones,
  setAssignments,
  selectedElement,
  setSelectedElement,
}: ProjectTimelineProps) => {
  const [activeResize, setActiveResize] = useState<ActiveResize | null>(null);
  const [activeMove, setActiveMove] = useState<ActiveMove | null>(null);
  const [movePreview, setMovePreview] = useState<MovePreview | null>(null);
  const [activeMilestoneMove, setActiveMilestoneMove] = useState<ActiveMilestoneMove | null>(null);
  const [intervalAddPreview, setIntervalAddPreview] = useState<IntervalAddPreview | null>(null);
  const [dragOverUserName, setDragOverUserName] = useState<string | null>(null);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const placementAreaRef = useRef<HTMLDivElement | null>(null);

  const projectStartMs = projectStart.getTime();
  const projectEndMs = projectEnd.getTime();
  const projectDurationMs = projectEndMs - projectStartMs;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  const assignmentsByUser = useMemo(() => assignments.reduce((acc, curr) => {
    if (!acc[curr.userName]) acc[curr.userName] = [];
    acc[curr.userName].push(curr);
    return acc;
  }, {} as Record<string, TimelineAssignment[]>), [assignments]);

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
  const snapToDay = (timestamp: number) => Math.round(timestamp / ONE_DAY_MS) * ONE_DAY_MS;
  const intervalsOverlap = (startA: number, endA: number, startB: number, endB: number) => startA < endB && endA > startB;

  const getIntervalAddPlacement = (clientX: number, clientY: number) => {
    if (!isAddingMilestone || !placementAreaRef.current) {
      return null;
    }

    const rowElements = Array.from(document.querySelectorAll("[data-assignment-row][data-user-name]")) as HTMLDivElement[];
    const targetRow = rowElements.find((rowElement) => {
      const rowRect = rowElement.getBoundingClientRect();
      return clientY >= rowRect.top && clientY <= rowRect.bottom;
    });

    if (!targetRow) {
      setIntervalAddPreview(null);
      return null;
    }

    const rect = targetRow.getBoundingClientRect();
    const previewWidth = rect.width * (7 * ONE_DAY_MS / projectDurationMs);
    const width = clamp(previewWidth, 24, rect.width);
    const centeredLeft = clientX - rect.left - width / 2;
    const left = clamp(centeredLeft, 0, rect.width - width);
    const centeredStart = projectStartMs + ((left + width / 2) / rect.width) * projectDurationMs - (7 * ONE_DAY_MS) / 2;
    const startMs = clamp(snapToDay(centeredStart), projectStartMs, projectEndMs - 7 * ONE_DAY_MS);
    const endMs = startMs + 7 * ONE_DAY_MS;

    setIntervalAddPreview((prev) => {
      if (prev && prev.userName === targetRow.dataset.userName && prev.left === left && prev.width === width && prev.startMs === startMs && prev.endMs === endMs) {
        return prev;
      }

      return {
        userName: targetRow.dataset.userName ?? "",
        left,
        width,
        startMs,
        endMs,
      };
    });

    return {
      userName: targetRow.dataset.userName ?? "",
      left,
      width,
      startMs,
      endMs,
    };
  };

  const getClosestNonOverlappingStart = (
    desiredStart: number,
    duration: number,
    userName: string,
    assignmentId: string,
    sourceAssignments: TimelineAssignment[],
  ) => {
    const minStart = projectStartMs;
    const maxStart = projectEndMs - duration;
    const others = sourceAssignments
      .filter((item) => item.id !== assignmentId && item.userName === userName)
      .map((item) => ({
        start: item.startDate.getTime(),
        end: item.endDate.getTime(),
      }));

    let candidateStart = clamp(desiredStart, minStart, maxStart);

    for (let i = 0; i <= others.length; i += 1) {
      const candidateEnd = candidateStart + duration;
      const conflict = others.find((other) => intervalsOverlap(candidateStart, candidateEnd, other.start, other.end));
      if (!conflict) {
        return candidateStart;
      }

      const leftCandidate = clamp(conflict.start - duration, minStart, maxStart);
      const rightCandidate = clamp(conflict.end, minStart, maxStart);

      const leftOverlaps = others.some((other) =>
        intervalsOverlap(leftCandidate, leftCandidate + duration, other.start, other.end),
      );
      const rightOverlaps = others.some((other) =>
        intervalsOverlap(rightCandidate, rightCandidate + duration, other.start, other.end),
      );

      if (!leftOverlaps && !rightOverlaps) {
        candidateStart = Math.abs(leftCandidate - desiredStart) <= Math.abs(rightCandidate - desiredStart)
          ? leftCandidate
          : rightCandidate;
      } else if (!leftOverlaps) {
        candidateStart = leftCandidate;
      } else if (!rightOverlaps) {
        candidateStart = rightCandidate;
      } else {
        return candidateStart;
      }
    }

    return candidateStart;
  };

  const handleResizeStart = (
    event: React.MouseEvent<HTMLDivElement>,
    assignment: Assignment,
    direction: ResizeDirection,
  ) => {
    if (isAddingMilestone) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const row = (event.currentTarget.closest("[data-assignment-row]") as HTMLDivElement | null);
    if (!row) return;

    const rect = row.getBoundingClientRect();

    setActiveResize({
      assignmentId: assignment.id,
      direction,
      rowWidth: rect.width,
      initialX: event.clientX,
      initialStart: assignment.startDate.getTime(),
      initialEnd: assignment.endDate.getTime(),
    });
  };

  const handleMoveStart = (event: React.MouseEvent<HTMLDivElement>, assignment: Assignment) => {
    if (isAddingMilestone) {
      event.preventDefault();
      return;
    }

    if (event.button !== 0 || activeResize) return;

    event.preventDefault();

    const row = event.currentTarget.closest("[data-assignment-row]") as HTMLDivElement | null;
    if (!row) return;

    const rowRect = row.getBoundingClientRect();
    const rowElements = Array.from(document.querySelectorAll("[data-assignment-row][data-user-name]")) as HTMLDivElement[];
    const rowRects = rowElements.map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        userName: element.dataset.userName ?? "",
        top: rect.top,
        bottom: rect.bottom,
      };
    }).filter((rowInfo) => !!rowInfo.userName);

    setActiveMove({
      assignmentId: assignment.id,
      initialX: event.clientX,
      initialUserName: assignment.userName,
      rowWidth: rowRect.width,
      initialStart: assignment.startDate.getTime(),
      initialEnd: assignment.endDate.getTime(),
      rowRects,
    });

    setSelectedElement({ type: "assignment", id: assignment.id });

    setMovePreview({
      assignmentId: assignment.id,
      userName: assignment.userName,
      startMs: assignment.startDate.getTime(),
      endMs: assignment.endDate.getTime(),
    });
  };

  const handlePlacementAreaClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingMilestone || !placementAreaRef.current) return;

    const placement = getIntervalAddPlacement(event.clientX, event.clientY);
    if (!placement) return;

    const assignmentId = `a-${Date.now()}`;

    setAssignments((currentAssignments) => [
      ...currentAssignments,
      {
        id: assignmentId,
        userName: placement.userName,
        role: "Nowy przedział",
        startDate: new Date(placement.startMs),
        endDate: new Date(placement.endMs),
        utilization: 0,
      },
    ]);

    setSelectedElement({ type: "assignment", id: assignmentId });

    setIsAddingMilestone(false);
    setIntervalAddPreview(null);
  };

  const handleMilestoneMoveStart = (event: React.MouseEvent<HTMLDivElement>, milestoneId: string, milestoneDate: Date) => {
    if (isAddingMilestone || event.button !== 0 || !placementAreaRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const rect = placementAreaRef.current.getBoundingClientRect();

    setActiveMilestoneMove({
      milestoneId,
      initialX: event.clientX,
      initialDate: milestoneDate.getTime(),
      rowWidth: rect.width,
    });

    setSelectedElement({ type: "milestone", id: milestoneId });
  };

  const handleIntervalAxisMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    getIntervalAddPlacement(event.clientX, event.clientY);
  };

  const handleIntervalAxisMouseLeave = () => {
    setIntervalAddPreview(null);
  };

  useEffect(() => {
    if (!activeResize) return;

    let rafId: number | null = null;
    let lastMouseX = activeResize.initialX;

    const updateResize = (clientX: number) => {
      const deltaX = clientX - activeResize.initialX;
      const deltaRatio = activeResize.rowWidth ? deltaX / activeResize.rowWidth : 0;
      const deltaMs = deltaRatio * projectDurationMs;

      setAssignments((currentAssignments) => {
        let hasChanges = false;

        const updatedAssignments = currentAssignments.map((assignment) => {
          if (assignment.id !== activeResize.assignmentId) {
            return assignment;
          }

          let newStart = activeResize.initialStart;
          let newEnd = activeResize.initialEnd;

          if (activeResize.direction === "start") {
            newStart = snapToDay(activeResize.initialStart + deltaMs);
            newStart = clamp(newStart, projectStartMs, newEnd - ONE_DAY_MS);
          } else {
            newEnd = snapToDay(activeResize.initialEnd + deltaMs);
            newEnd = clamp(newEnd, newStart + ONE_DAY_MS, projectEndMs);
          }

          const siblings = currentAssignments.filter(
            (item) => item.id !== assignment.id && item.userName === assignment.userName,
          );

          if (activeResize.direction === "start") {
            const overlappingSibling = siblings.find((item) =>
              intervalsOverlap(newStart, newEnd, item.startDate.getTime(), item.endDate.getTime()),
            );

            if (overlappingSibling) {
              newStart = clamp(overlappingSibling.endDate.getTime(), projectStartMs, newEnd - ONE_DAY_MS);
            }
          } else {
            const overlappingSibling = siblings.find((item) =>
              intervalsOverlap(newStart, newEnd, item.startDate.getTime(), item.endDate.getTime()),
            );

            if (overlappingSibling) {
              newEnd = clamp(overlappingSibling.startDate.getTime(), newStart + ONE_DAY_MS, projectEndMs);
            }
          }

          if (newStart === assignment.startDate.getTime() && newEnd === assignment.endDate.getTime()) {
            return assignment;
          }

          hasChanges = true;

          return {
            ...assignment,
            startDate: new Date(newStart),
            endDate: new Date(newEnd),
          };
        });

        return hasChanges ? updatedAssignments : currentAssignments;
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      lastMouseX = event.clientX;

      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateResize(lastMouseX);
      });
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }

      updateResize(event.clientX);
      setActiveResize(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeResize, projectDurationMs, projectEndMs, projectStartMs]);

  useEffect(() => {
    if (!activeMove) return;

    let rafId: number | null = null;
    let lastMouseX = activeMove.initialX;
    let lastMouseY = activeMove.rowRects[0]?.top ?? 0;

    const getNextMoveState = (clientX: number, clientY: number) => {
      const deltaX = clientX - activeMove.initialX;
      const deltaRatio = activeMove.rowWidth ? deltaX / activeMove.rowWidth : 0;
      const deltaMs = deltaRatio * projectDurationMs;

      const duration = activeMove.initialEnd - activeMove.initialStart;
      const desiredStart = snapToDay(activeMove.initialStart + deltaMs);
      let nextStart = desiredStart;
      let nextEnd = nextStart + duration;

      if (nextStart < projectStartMs) {
        nextStart = projectStartMs;
        nextEnd = nextStart + duration;
      }

      if (nextEnd > projectEndMs) {
        nextEnd = projectEndMs;
        nextStart = nextEnd - duration;
      }

      const targetRow = activeMove.rowRects.find((row) => clientY >= row.top && clientY <= row.bottom);
      const nextUserName = targetRow?.userName ?? activeMove.initialUserName;

      nextStart = getClosestNonOverlappingStart(nextStart, duration, nextUserName, activeMove.assignmentId, assignments);
      nextEnd = nextStart + duration;

      return {
        assignmentId: activeMove.assignmentId,
        userName: nextUserName,
        startMs: nextStart,
        endMs: nextEnd,
      } as MovePreview;
    };

    const updateMovePreview = (clientX: number, clientY: number) => {
      const nextPreview = getNextMoveState(clientX, clientY);

      setDragOverUserName((prev) => (prev === nextPreview.userName ? prev : nextPreview.userName));
      setMovePreview((prev) => {
        if (
          prev
          && prev.assignmentId === nextPreview.assignmentId
          && prev.userName === nextPreview.userName
          && prev.startMs === nextPreview.startMs
          && prev.endMs === nextPreview.endMs
        ) {
          return prev;
        }

        return nextPreview;
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;

      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateMovePreview(lastMouseX, lastMouseY);
      });
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }

      const finalPreview = getNextMoveState(event.clientX, event.clientY);
      setMovePreview(finalPreview);

      setAssignments((currentAssignments) => {
        let hasChanges = false;

        const updatedAssignments = currentAssignments.map((assignment) => {
          if (assignment.id !== finalPreview.assignmentId) {
            return assignment;
          }

          const currentStart = assignment.startDate.getTime();
          const currentEnd = assignment.endDate.getTime();
          if (
            currentStart === finalPreview.startMs
            && currentEnd === finalPreview.endMs
            && assignment.userName === finalPreview.userName
          ) {
            return assignment;
          }

          hasChanges = true;
          return {
            ...assignment,
            userName: finalPreview.userName,
            startDate: new Date(finalPreview.startMs),
            endDate: new Date(finalPreview.endMs),
          };
        });

        return hasChanges ? updatedAssignments : currentAssignments;
      });

      setDragOverUserName(null);
      setMovePreview(null);
      setActiveMove(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeMove, assignments, projectDurationMs, projectEndMs, projectStartMs]);

  useEffect(() => {
    if (!activeMilestoneMove) return;

    let rafId: number | null = null;
    let lastMouseX = activeMilestoneMove.initialX;

    const updateMilestonePosition = (clientX: number) => {
      const deltaX = clientX - activeMilestoneMove.initialX;
      const deltaRatio = activeMilestoneMove.rowWidth ? deltaX / activeMilestoneMove.rowWidth : 0;
      const deltaMs = deltaRatio * projectDurationMs;

      const nextDateMs = clamp(
        snapToDay(activeMilestoneMove.initialDate + deltaMs),
        projectStartMs,
        projectEndMs,
      );

      setMilestones((currentMilestones) => {
        let hasChanges = false;

        const updatedMilestones = currentMilestones.map((milestone) => {
          if (milestone.id !== activeMilestoneMove.milestoneId) {
            return milestone;
          }

          if (milestone.date.getTime() === nextDateMs) {
            return milestone;
          }

          hasChanges = true;
          return {
            ...milestone,
            date: new Date(nextDateMs),
          };
        });

        return hasChanges ? updatedMilestones : currentMilestones;
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      lastMouseX = event.clientX;

      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateMilestonePosition(lastMouseX);
      });
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }

      updateMilestonePosition(event.clientX);
      setActiveMilestoneMove(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeMilestoneMove, projectDurationMs, projectEndMs, projectStartMs]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
            <CalendarDays className="h-5 w-5 text-indigo-500" />
            Harmonogram Projektu (Timeline)
          </CardTitle>

          <Button
            type="button"
            variant={isAddingMilestone ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAddingMilestone((prev) => !prev)}
            data-add-interval-button
          >
            Dodaj przedział
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 relative">
        <TooltipProvider>
          <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none mx-6">
            <div className="h-full border-l border-r border-slate-200 border-dashed relative">
              <span className="absolute -top-5 left-0 text-xs text-slate-400 font-medium">{projectStart.toLocaleDateString()}</span>
              <span className="absolute -top-5 right-0 text-xs text-slate-400 font-medium">{projectEnd.toLocaleDateString()}</span>
            </div>
          </div>

          <div
            ref={placementAreaRef}
            onClick={handlePlacementAreaClick}
            onMouseMove={handleIntervalAxisMouseMove}
            onMouseLeave={handleIntervalAxisMouseLeave}
            className={`space-y-8 relative z-10 mx-6 ${isAddingMilestone ? "cursor-crosshair" : ""}`}
          >
            <div className="relative h-16">
              {milestones.map((milestone) => {
                const position = calculatePositionAndWidth(milestone.date, milestone.date, projectStart, projectEnd);
                return (
                  <Tooltip key={milestone.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={`absolute top-0 -ml-2 group ${activeMilestoneMove?.milestoneId === milestone.id ? "cursor-grabbing" : "cursor-grab"}`}
                        style={{ left: position.left }}
                        onMouseDown={(event) => handleMilestoneMoveStart(event, milestone.id, milestone.date)}
                        onClick={() => setSelectedElement({ type: "milestone", id: milestone.id })}
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
              const movedAssignment = movePreview ? assignments.find((item) => item.id === movePreview.assignmentId) : null;
              const visibleAssignments = [
                ...userAssignments.filter((assignment) => assignment.id !== activeMove?.assignmentId),
                ...((movePreview?.userName === userName && movedAssignment) ? [movedAssignment] : []),
              ];

              return (
                <div key={index} className="relative flex items-center h-10 mt-4">
                  <div className="absolute -left-12 z-20">
                    <Avatar className="h-8 w-8 ring-2 ring-white">
                      <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div
                    className={`relative w-full h-full rounded-md border transition-colors ${
                      dragOverUserName === userName ? "bg-indigo-50 border-indigo-300" : "bg-slate-50 border-slate-100"
                    }`}
                    data-assignment-row
                    data-user-name={userName}
                  >
                    {isAddingMilestone && intervalAddPreview?.userName === userName && (
                      <div
                        className="absolute top-1 bottom-1 rounded-sm border-2 border-dashed border-indigo-300 bg-white/80 shadow-sm pointer-events-none flex items-center justify-center"
                        style={{ left: intervalAddPreview.left, width: intervalAddPreview.width }}
                      >
                        <Plus className="h-4 w-4 text-indigo-500" />
                      </div>
                    )}

                    {visibleAssignments.map((assignment) => {
                      const isActiveMoveAssignment = movePreview?.assignmentId === assignment.id;
                      const displayStartDate = isActiveMoveAssignment ? new Date(movePreview.startMs) : assignment.startDate;
                      const displayEndDate = isActiveMoveAssignment ? new Date(movePreview.endMs) : assignment.endDate;
                      const position = calculatePositionAndWidth(displayStartDate, displayEndDate, projectStart, projectEnd);

                      return (
                        <Tooltip key={assignment.id}>
                          <TooltipTrigger asChild>
                            <div
                              className={`group absolute top-1 bottom-1 bg-indigo-500 hover:bg-indigo-600 rounded-sm cursor-move transition-colors border border-indigo-700/20 flex items-center justify-center overflow-visible ${
                                activeMove?.assignmentId === assignment.id ? "opacity-60" : "opacity-100"
                              } ${selectedElement.type === "assignment" && selectedElement.id === assignment.id ? "ring-2 ring-indigo-300" : ""}`}
                              style={{ left: position.left, width: position.width }}
                              data-assignment-block
                              draggable={false}
                              onMouseDown={(event) => handleMoveStart(event, assignment)}
                              onClick={() => setSelectedElement({ type: "assignment", id: assignment.id })}
                            >
                              <div
                                className="absolute left-0 top-0 h-full w-2 bg-indigo-700/35 opacity-0 group-hover:opacity-100 cursor-ew-resize"
                                onMouseDown={(event) => handleResizeStart(event, assignment, "start")}
                              />

                              {/* Jeśli pasek jest dostatecznie szeroki, pokazujemy procent w środku */}
                              {parseFloat(position.width) > 10 && (
                                <span className="text-[10px] font-bold text-white/90">{assignment.utilization}%</span>
                              )}

                              <div
                                className="absolute right-0 top-0 h-full w-2 bg-indigo-700/35 opacity-0 group-hover:opacity-100 cursor-ew-resize"
                                onMouseDown={(event) => handleResizeStart(event, assignment, "end")}
                              />
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