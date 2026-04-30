import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * ONE_DAY_MS;
const MILESTONE_AXIS_HEIGHT = 44;
const ASSIGNMENT_ROW_HEIGHT = 40;

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
  initialRole: string;
  rowWidth: number;
  initialStart: number;
  initialEnd: number;
  rowRects: Array<{ role: string; top: number; bottom: number }>;
}

interface MovePreview {
  assignmentId: string;
  role: string;
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
  role: string;
  left: number;
  width: number;
  startMs: number;
  endMs: number;
}

export type SelectedElementType = "MILESTONE" | "ASSIGNMENT";

export interface SelectedElement {
  id: string;
  type: SelectedElementType;
}

export interface ProjectTimelineProps {
  projectStart: Date;
  projectEnd: Date;
  milestones: TimelineMilestone[];
  assignments: TimelineAssignment[];
  setMilestones: React.Dispatch<React.SetStateAction<TimelineMilestone[]>>;
  setAssignments: React.Dispatch<React.SetStateAction<TimelineAssignment[]>>;
  selectedElement: SelectedElement | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<SelectedElement | null>>;
}

interface RoleRowData {
  role: string;
  assignments: TimelineAssignment[];
  isPlaceholder: boolean;
}

const getAssignmentRole = (assignment: TimelineAssignment) => assignment.role || assignment.userName;

const getRoleInitial = (role: string) => role.trim().charAt(0).toUpperCase();

const getRowElements = () => Array.from(document.querySelectorAll("[data-assignment-row][data-role]")) as HTMLDivElement[];

const buildRoleRows = (assignments: TimelineAssignment[], roleOrder: string[], placeholderRoles: string[]): RoleRowData[] => {
  const groupedAssignments = assignments.reduce((acc, curr) => {
    const role = getAssignmentRole(curr);
    if (!acc[role]) acc[role] = [];
    acc[role].push(curr);
    return acc;
  }, {} as Record<string, TimelineAssignment[]>);

  const orderedRoles = Array.from(new Set([
    ...roleOrder,
    ...placeholderRoles,
    ...Object.keys(groupedAssignments),
  ]));

  return orderedRoles.map((role) => ({
    role,
    assignments: groupedAssignments[role] ?? [],
    isPlaceholder: placeholderRoles.includes(role),
  }));
};

const getRoleRowClasses = (dragOverRole: string | null, role: string) => (
  dragOverRole === role ? "bg-indigo-50 border-indigo-300" : "bg-slate-50 border-slate-100"
);

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
  const [dragOverRole, setDragOverRole] = useState<string | null>(null);
  const [placeholderRoles, setPlaceholderRoles] = useState<string[]>([]);
  const [roleOrder, setRoleOrder] = useState<string[]>(() => Array.from(new Set(assignments.map(getAssignmentRole))));
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const placementAreaRef = useRef<HTMLDivElement | null>(null);

  const projectStartMs = projectStart.getTime();
  const projectEndMs = projectEnd.getTime();
  const projectDurationMs = projectEndMs - projectStartMs;

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
  const snapToDay = (timestamp: number) => Math.round(timestamp / ONE_DAY_MS) * ONE_DAY_MS;
  const intervalsOverlap = (startA: number, endA: number, startB: number, endB: number) => startA < endB && endA > startB;
  const roleRows = useMemo(() => buildRoleRows(assignments, roleOrder, placeholderRoles), [assignments, placeholderRoles, roleOrder]);

  const getIntervalAddPlacement = (clientX: number, clientY: number) => {
    if (!isAddingMilestone || !placementAreaRef.current) {
      return null;
    }

    const rowElements = getRowElements();
    const targetRow = rowElements.find((rowElement) => {
      const rowRect = rowElement.getBoundingClientRect();
      return clientY >= rowRect.top && clientY <= rowRect.bottom;
    });

    if (!targetRow) {
      setIntervalAddPreview(null);
      return null;
    }

    const rect = targetRow.getBoundingClientRect();
    const previewWidth = rect.width * (ONE_WEEK_MS / projectDurationMs);
    const width = clamp(previewWidth, 24, rect.width);
    const centeredLeft = clientX - rect.left - width / 2;
    const left = clamp(centeredLeft, 0, rect.width - width);
    const centeredStart = projectStartMs + ((left + width / 2) / rect.width) * projectDurationMs - ONE_WEEK_MS / 2;
    const startMs = clamp(snapToDay(centeredStart), projectStartMs, projectEndMs - ONE_WEEK_MS);
    const endMs = startMs + ONE_WEEK_MS;

    setIntervalAddPreview((prev) => {
      if (prev && prev.role === targetRow.dataset.role && prev.left === left && prev.width === width && prev.startMs === startMs && prev.endMs === endMs) {
        return prev;
      }

      return {
        role: targetRow.dataset.role ?? "",
        left,
        width,
        startMs,
        endMs,
      };
    });

    return {
      role: targetRow.dataset.role ?? "",
      left,
      width,
      startMs,
      endMs,
    };
  };

  const getClosestNonOverlappingStart = (
    desiredStart: number,
    duration: number,
    role: string,
    assignmentId: string,
    sourceAssignments: TimelineAssignment[],
  ) => {
    const minStart = projectStartMs;
    const maxStart = projectEndMs - duration;
    const others = sourceAssignments
      .filter((item) => item.id !== assignmentId && getAssignmentRole(item) === role)
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
    const rowElements = getRowElements();
    const rowRects = rowElements.map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        role: element.dataset.role ?? "",
        top: rect.top,
        bottom: rect.bottom,
      };
    }).filter((rowInfo) => !!rowInfo.role);

    setActiveMove({
      assignmentId: assignment.id,
      initialX: event.clientX,
      initialRole: getAssignmentRole(assignment),
      rowWidth: rowRect.width,
      initialStart: assignment.startDate.getTime(),
      initialEnd: assignment.endDate.getTime(),
      rowRects,
    });

    setSelectedElement({ type: "ASSIGNMENT", id: assignment.id });

    setMovePreview({
      assignmentId: assignment.id,
      role: getAssignmentRole(assignment),
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
        userName: placement.role,
        role: placement.role,
        startDate: new Date(placement.startMs),
        endDate: new Date(placement.endMs),
        utilization: 0,
      },
    ]);

    setSelectedElement({ type: "ASSIGNMENT", id: assignmentId });

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

    setSelectedElement({ type: "MILESTONE", id: milestoneId });
  };

  const handleIntervalAxisMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    getIntervalAddPlacement(event.clientX, event.clientY);
  };

  const handleIntervalAxisMouseLeave = () => {
    setIntervalAddPreview(null);
  };

  const handleAddRolePlaceholder = () => {
    setPlaceholderRoles((currentRoles) => {
      const nextRole = `Nowa rola ${currentRoles.length + 1}`;
      setRoleOrder((currentRoleOrder) => (currentRoleOrder.includes(nextRole) ? currentRoleOrder : [...currentRoleOrder, nextRole]));
      return [...currentRoles, nextRole];
    });
  };

  useEffect(() => {
    setRoleOrder((currentRoleOrder) => {
      const nextRoleOrder = [...currentRoleOrder];
      const seenRoles = new Set(nextRoleOrder);
      let hasChanges = false;

      for (const role of assignments.map(getAssignmentRole)) {
        if (!seenRoles.has(role)) {
          seenRoles.add(role);
          nextRoleOrder.push(role);
          hasChanges = true;
        }
      }

      for (const role of placeholderRoles) {
        if (!seenRoles.has(role)) {
          seenRoles.add(role);
          nextRoleOrder.push(role);
          hasChanges = true;
        }
      }

      return hasChanges ? nextRoleOrder : currentRoleOrder;
    });
  }, [assignments, placeholderRoles]);

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
      const nextRole = targetRow?.role ?? activeMove.initialRole;

      nextStart = getClosestNonOverlappingStart(nextStart, duration, nextRole, activeMove.assignmentId, assignments);
      nextEnd = nextStart + duration;

      return {
        assignmentId: activeMove.assignmentId,
        role: nextRole,
        startMs: nextStart,
        endMs: nextEnd,
      } as MovePreview;
    };

    const updateMovePreview = (clientX: number, clientY: number) => {
      const nextPreview = getNextMoveState(clientX, clientY);

      setDragOverRole((prev) => (prev === nextPreview.role ? prev : nextPreview.role));
      setMovePreview((prev) => {
        if (
          prev
          && prev.assignmentId === nextPreview.assignmentId
          && prev.role === nextPreview.role
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
            && getAssignmentRole(assignment) === finalPreview.role
          ) {
            return assignment;
          }

          hasChanges = true;
          return {
            ...assignment,
            userName: finalPreview.role,
            role: finalPreview.role,
            startDate: new Date(finalPreview.startMs),
            endDate: new Date(finalPreview.endMs),
          };
        });

        return hasChanges ? updatedAssignments : currentAssignments;
      });

      setDragOverRole(null);
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
    <Card className="w-full overflow-visible">
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
      <CardContent className="pt-6 relative overflow-visible">
        <TooltipProvider>
          <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none mx-6">
            <div className="h-full border-l border-r border-slate-200 border-dashed relative">
              <span className="absolute top-1 left-0 text-xs text-slate-400 font-medium">{projectStart.toLocaleDateString()}</span>
              <span className="absolute top-1 right-0 text-xs text-slate-400 font-medium">{projectEnd.toLocaleDateString()}</span>
            </div>
          </div>

          <div
            ref={placementAreaRef}
            onClick={handlePlacementAreaClick}
            onMouseMove={handleIntervalAxisMouseMove}
            onMouseLeave={handleIntervalAxisMouseLeave}
            className={`space-y-5 relative z-10 mx-6 ${isAddingMilestone ? "cursor-crosshair" : ""}`}
          >
            <div className="relative" style={{ height: MILESTONE_AXIS_HEIGHT }}>
              {milestones.map((milestone) => {
                const position = calculatePositionAndWidth(milestone.date, milestone.date, projectStart, projectEnd);
                return (
                  <div
                    key={milestone.id}
                    className={`absolute top-0 -ml-3 group ${activeMilestoneMove?.milestoneId === milestone.id ? "cursor-grabbing" : "cursor-grab"}`}
                    style={{ left: position.left }}
                    onMouseDown={(event) => handleMilestoneMoveStart(event, milestone.id, milestone.date)}
                    onClick={() => setSelectedElement({ type: "MILESTONE", id: milestone.id })}
                  >
                    <MapPin className="h-6 w-6 text-rose-500 fill-white group-hover:fill-rose-100 transition-colors" />
                    <div className="w-px h-8 bg-rose-200 absolute left-1/2 -ml-px top-6 pointer-events-none" />
                  </div>
                );
              })}
            </div>

            {roleRows.map(({ role, assignments: roleAssignments, isPlaceholder }) => {
              const initials = isPlaceholder ? "" : getRoleInitial(role);
              const movedAssignment = movePreview ? assignments.find((item) => item.id === movePreview.assignmentId) : null;
              const visibleAssignments = [
                ...roleAssignments.filter((assignment) => assignment.id !== activeMove?.assignmentId),
                ...((movePreview?.role === role && movedAssignment) ? [movedAssignment] : []),
              ];

              return (
                <div key={role} className="relative mt-2 flex items-center pl-12" style={{ height: ASSIGNMENT_ROW_HEIGHT }}>
                  <div className="absolute left-0 z-20">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-8 w-8 ring-2 ring-white">
                          <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent className="z-50 bg-white border shadow-md text-slate-800">
                        <p className="font-semibold">{role}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div
                    className={`relative h-full w-full rounded-md border transition-colors ${getRoleRowClasses(dragOverRole, role)}`}
                    data-assignment-row
                    data-role={role}
                  >
                    {isAddingMilestone && intervalAddPreview?.role === role && (
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
                        <div
                          key={assignment.id}
                          className={`group absolute top-1 bottom-1 bg-indigo-500 hover:bg-indigo-600 rounded-sm cursor-move transition-colors border border-indigo-700/20 flex items-center justify-center overflow-visible ${
                            activeMove?.assignmentId === assignment.id ? "opacity-60" : "opacity-100"
                          } ${selectedElement?.type === "ASSIGNMENT" && selectedElement.id === assignment.id ? "ring-2 ring-indigo-300" : ""}`}
                          style={{ left: position.left, width: position.width }}
                          data-assignment-block
                          draggable={false}
                          onMouseDown={(event) => handleMoveStart(event, assignment)}
                          onClick={() => setSelectedElement({ type: "ASSIGNMENT", id: assignment.id })}
                        >
                          <div
                            className="absolute left-0 top-0 h-full w-2 bg-indigo-700/35 opacity-0 group-hover:opacity-100 cursor-ew-resize"
                            onMouseDown={(event) => handleResizeStart(event, assignment, "start")}
                          />

                          {parseFloat(position.width) > 10 && (
                            <span className="text-[10px] font-bold text-white/90">{assignment.utilization}%</span>
                          )}

                          <div
                            className="absolute right-0 top-0 h-full w-2 bg-indigo-700/35 opacity-0 group-hover:opacity-100 cursor-ew-resize"
                            onMouseDown={(event) => handleResizeStart(event, assignment, "end")}
                          />
                        </div>
                      );
                    })}

                  </div>
                </div>
              );
            })}

            <button
              type="button"
              className="relative mt-2 flex w-full items-center gap-3 pl-12 text-left"
              style={{ height: ASSIGNMENT_ROW_HEIGHT }}
              onClick={handleAddRolePlaceholder}
              aria-label="Dodaj nową rolę"
            >
              <div className="absolute left-0 z-20">
                <Avatar className="h-8 w-8 border-2 border-dashed border-slate-300 bg-white shadow-none ring-0">
                  <AvatarFallback className="bg-white" />
                </Avatar>
              </div>

              <div className="flex h-full flex-1 items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-white/80 shadow-none transition-colors hover:bg-slate-50">
                <Plus className="h-4 w-4 text-slate-400" />
              </div>
            </button>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};