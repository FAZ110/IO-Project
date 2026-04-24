export interface ProjectCreationRequest {
    title: string
    description: string;
    startDate: string;
    projectGroupId?: string | null;
    sponsors: string[];
    committee: string[];
    milestones: Milestone[];
    risks?: Risk[];
}

export interface Risk {
    name: string
    description: string
    probability: number
}

export interface Milestone {
    startDate: string
    endDate: string
}