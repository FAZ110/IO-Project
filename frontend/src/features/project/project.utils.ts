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
  const today = new Date();
  const nextDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
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
