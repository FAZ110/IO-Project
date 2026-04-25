import type {UserResponse} from "@/features/user-management";

export interface ProjectCreationRequest {
    title: string;
    description: string;
    projectGroupId?: string | null;
    sponsors: string[];
    committee: string[];
    milestones: Milestone[];
    roles: ProjectRole[];
    risks?: Risk[];
}

export interface Risk {
    name: string;
    description: string;
    probability: number;
}

export interface RiskResponse {
  id: string
  name: string;
  description: string;
  probability: number;
}

export interface Milestone {
    date: string;
    name: string;
}

export interface ProjectDetailsResponse {
  id: string;
  title: string;
  description: string;
  startDate: string;
  isActive: boolean;
  manager: UserResponse
}

export interface ProjectRole {
  name: string,
  utilizationPercentages: number[]
}

