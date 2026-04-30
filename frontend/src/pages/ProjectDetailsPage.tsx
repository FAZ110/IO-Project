import {useProjectDetails} from "@/features/project/project.hooks.ts";
import {useParams} from "react-router-dom";
import {ProjectHeader} from "@/features/project/components/ProjectHeader.tsx";
import {ProjectRisks} from "@/features/project/components/ProjectRisks.tsx";
import {ProjectMembersSideBar} from "@/features/project/components/ProjectMembersSideBar.tsx";
import {
  PROJECT_TIMELINE_MOCK_DATA,
  ProjectTimeline,
  type SelectedElement,
  type TimelineAssignment,
  type TimelineMilestone,
} from "@/features/project/components/ProjectTimeline.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useMemo, useState} from "react";

const formatDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateInputValue = (value: string) => {
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const ProjectDetailsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading, isError } = useProjectDetails(projectId || '');
  const [milestones, setMilestones] = useState<TimelineMilestone[]>(() => PROJECT_TIMELINE_MOCK_DATA.milestones);
  const [assignments, setAssignments] = useState<TimelineAssignment[]>(() => PROJECT_TIMELINE_MOCK_DATA.assignments);
  const [selectedElement, setSelectedElement] = useState<SelectedElement>({ type: "none" });

  const selectedMilestone = useMemo(
    () => (selectedElement.type === "milestone"
      ? milestones.find((item) => item.id === selectedElement.id) ?? null
      : null),
    [milestones, selectedElement],
  );

  const selectedAssignment = useMemo(
    () => (selectedElement.type === "assignment"
      ? assignments.find((item) => item.id === selectedElement.id) ?? null
      : null),
    [assignments, selectedElement],
  );

  const handleMilestoneDateChange = (milestoneId: string, value: string) => {
    const parsedDate = parseDateInputValue(value);
    if (!parsedDate) return;

    setMilestones((currentMilestones) => currentMilestones.map((milestone) => (
      milestone.id === milestoneId
        ? { ...milestone, date: parsedDate }
        : milestone
    )));
  };

  const handleMilestoneDescriptionChange = (milestoneId: string, value: string) => {
    setMilestones((currentMilestones) => currentMilestones.map((milestone) => (
      milestone.id === milestoneId
        ? { ...milestone, description: value }
        : milestone
    )));
  };

  const handleAssignmentUtilizationChange = (assignmentId: string, value: number) => {
    const utilization = Math.min(Math.max(value, 0), 100);

    setAssignments((currentAssignments) => currentAssignments.map((assignment) => (
      assignment.id === assignmentId
        ? { ...assignment, utilization }
        : assignment
    )));
  };

  const handleAssignmentStartDateChange = (assignmentId: string, value: string) => {
    const parsedDate = parseDateInputValue(value);
    if (!parsedDate) return;

    setAssignments((currentAssignments) => currentAssignments.map((assignment) => {
      if (assignment.id !== assignmentId) return assignment;

      const nextStart = parsedDate;
      return {
        ...assignment,
        startDate: nextStart,
      };
    }));
  };

  const handleAssignmentEndDateChange = (assignmentId: string, value: string) => {
    const parsedDate = parseDateInputValue(value);
    if (!parsedDate) return;

    setAssignments((currentAssignments) => currentAssignments.map((assignment) => {
      if (assignment.id !== assignmentId) return assignment;

      const nextEnd = parsedDate;
      return {
        ...assignment,
        endDate: nextEnd,
      };
    }));
  };

  const handleAssignmentDelete = (assignmentId: string) => {
    setAssignments((currentAssignments) => currentAssignments.filter((assignment) => assignment.id !== assignmentId));
    setSelectedElement((currentSelectedElement) => (
      currentSelectedElement.type === "assignment" && currentSelectedElement.id === assignmentId
        ? { type: "none" }
        : currentSelectedElement
    ));
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Ładowanie danych projektu...</div>;
  }

  if (isError || !project) {
    return <div className="p-8 text-center text-red-500">Nie udało się znaleźć tego projektu.</div>;
  }

  return (
    <div className="p-4 mx-auto space-y-6 sm:p-6 lg:p-8 max-w-7xl">

      <ProjectHeader details={project} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProjectTimeline
            projectStart={PROJECT_TIMELINE_MOCK_DATA.projectStart}
            projectEnd={PROJECT_TIMELINE_MOCK_DATA.projectEnd}
            milestones={milestones}
            assignments={assignments}
            setMilestones={setMilestones}
            setAssignments={setAssignments}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
          />

          <Card className="w-full h-[220px]">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg text-slate-800">Panel edycji</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 h-[calc(220px-57px)] overflow-auto">
              {selectedElement.type === "none" && (
                <div className="h-full flex items-center justify-center text-center">
                  <p className="text-sm text-slate-500">wybierz element żeby zmodyfikować</p>
                </div>
              )}

              {selectedMilestone && selectedElement.type === "milestone" && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-800">Edycja kamienia milowego</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="text-xs text-slate-600">
                      Data
                      <input
                        type="date"
                        className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                        value={formatDateInputValue(selectedMilestone.date)}
                        onChange={(event) => handleMilestoneDateChange(selectedMilestone.id, event.target.value)}
                      />
                    </label>

                    <label className="text-xs text-slate-600 sm:col-span-1">
                      Opis
                      <input
                        type="text"
                        className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                        value={selectedMilestone.description}
                        onChange={(event) => handleMilestoneDescriptionChange(selectedMilestone.id, event.target.value)}
                        placeholder="Opis kamienia milowego"
                      />
                    </label>
                  </div>
                </div>
              )}

              {selectedAssignment && selectedElement.type === "assignment" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">Edycja assignmentu</p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleAssignmentDelete(selectedAssignment.id)}
                    >
                      Usuń przedział
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="text-xs text-slate-600">
                      Procent
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                        value={selectedAssignment.utilization}
                        onChange={(event) => handleAssignmentUtilizationChange(selectedAssignment.id, Number(event.target.value))}
                      />
                    </label>

                    <label className="text-xs text-slate-600">
                      Data startu
                      <input
                        type="date"
                        className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                        value={formatDateInputValue(selectedAssignment.startDate)}
                        onChange={(event) => handleAssignmentStartDateChange(selectedAssignment.id, event.target.value)}
                      />
                    </label>

                    <label className="text-xs text-slate-600">
                      Data konca
                      <input
                        type="date"
                        className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                        value={formatDateInputValue(selectedAssignment.endDate)}
                        onChange={(event) => handleAssignmentEndDateChange(selectedAssignment.id, event.target.value)}
                      />
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <ProjectRisks projectId={project.id} />
        </div>


        <div className="space-y-6">
          <ProjectMembersSideBar projectId={project.id} />
        </div>
      </div>

    </div>
  );
};