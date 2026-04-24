import type {UserResponse} from "@/features/user-management";

export interface ProjectCreationRequest {
    title: string;
    description: string;
    startDate: string;
    projectGroupId?: string | null;
    sponsors: string[];
    committee: string[];
    milestones: Milestone[];
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
    startDate: string
    endDate: string
}

export interface ProjectDetailsResponse {
  id: string;
  title: string;
  description: string;
  startDate: string;
  isActive: boolean;
  manager: UserResponse
}

