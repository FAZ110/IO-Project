import type { ProjectCreationRequest } from "./project.types";

type Milestone = NonNullable<ProjectCreationRequest["milestones"]>[number];


export const generatePhasesFromMilestones = (milestones: Milestone[]) => {
    if (milestones.length === 0) return [];

    const sortedMilestones = [...milestones].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime());

    const phases = [];

    for (let i = 1; i < sortedMilestones.length; i++) {
        const nextMilestone = sortedMilestones[i];
        const prevMilestone = sortedMilestones[i - 1];

        phases.push({
            name: 'Faza (' + prevMilestone.name + ' - ' + nextMilestone.name + ')',
            startDate: prevMilestone.date,
            endDate: nextMilestone.date,
        });
    }

    return phases;
};
