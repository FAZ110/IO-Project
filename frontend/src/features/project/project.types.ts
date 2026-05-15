import type { SimpleUserResponse, UserResponse } from "@/features/user-management";

export interface ProjectCreationRequest {
    title: string;
    description: string;
    projectGroupId?: string | null;
    startDate: string;
    endDate: string;
    sponsors: string[];
    committee: string[];
    milestones: Milestone[];
    risks: Risk[];
}

export interface ProjectMembersResponse {
    sponsors: SimpleUserResponse[];
    committees: SimpleUserResponse[];
    employees: SimpleUserResponse[];
}

export interface Risk {
    name: string;
    description: string;
    probability: number;
}

export interface RiskResponse extends Risk {
    id: string;
}

export interface SingleGroupResponse {
    id: string;
    name: string;
}

export interface ProjectResponse {
    id: string;
    title: string;
    description: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
    groupId?: string | null;
}

export interface Milestone {
    date: string;
    name: string;
    description?: string;
}

export interface ProjectDetailsResponse {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    manager: UserResponse;
    groupId?: string | null;
}

export interface CreateEmployeeAssignmentRequest {
    projectId: string;
    userId: string;
    startDate: string;
    endDate: string;
    utilizationPercentage: number;
    roleName: string;
}