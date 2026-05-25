import type { ProjectCreationRequest, SearchProjectsRequest } from "./project.types";

type Milestone = NonNullable<ProjectCreationRequest["milestones"]>[number];

export const generatePhasesFromMilestones = (milestones: Milestone[]) => {
  if (milestones.length === 0) return [];

  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const phases = [];

  for (let i = 1; i < sortedMilestones.length; i++) {
    const nextMilestone = sortedMilestones[i];
    const prevMilestone = sortedMilestones[i - 1];

    phases.push({
      name: "Faza (" + prevMilestone.name + " - " + nextMilestone.name + ")",
      startDate: prevMilestone.date,
      endDate: nextMilestone.date,
    });
  }

  return phases;
};

export const getNextDateFromToday = (days: number) => {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString().split("T")[0];
};

export const normalizeProjectSearchRequest = (request: SearchProjectsRequest): SearchProjectsRequest => {
  const query = request.query?.trim();

  return {
    ...request,
    query: query && query.length >= 2 ? query : undefined,
    groupId: request.groupId || undefined,
  };
};

export const hasProjectSearchFilters = (request: SearchProjectsRequest): boolean => {
  const normalized = normalizeProjectSearchRequest(request);

  return Boolean(normalized.query || normalized.unassignedOnly !== undefined || normalized.groupId || normalized.isActive !== undefined);
};

export const buildProjectSearchParams = (request: SearchProjectsRequest): Record<string, string | boolean> => {
  const normalized = normalizeProjectSearchRequest(request);

  return {
    ...(normalized.query ? { query: normalized.query } : {}),
    ...(normalized.unassignedOnly !== undefined ? { unassignedOnly: normalized.unassignedOnly } : {}),
    ...(normalized.groupId ? { groupId: normalized.groupId } : {}),
    ...(normalized.isActive !== undefined ? { isActive: normalized.isActive } : {}),
  };
};

export const getRiskDetails = (value: number) => {
  if (value >= 15) return {
    label: "Krytyczne",
    borderLine: "bg-rose-500",
    badge: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200",
    barColor: "bg-rose-500"
  };
  if (value >= 10) return {
    label: "Wysokie",
    borderLine: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
    barColor: "bg-orange-500"
  };
  if (value >= 5) return {
    label: "Średnie",
    borderLine: "bg-amber-400",
    badge: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
    barColor: "bg-amber-400"
  };
  return {
    label: "Niskie",
    borderLine: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
    barColor: "bg-emerald-500"
  };
};