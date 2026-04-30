import type { BasicUserResponse, UserResponse } from "@/features/user-management";

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

export interface ProjectMembersResponse {
    sponsors: BasicUserResponse[];
    committees: BasicUserResponse[];
    employees: BasicUserResponse[];
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
    manager: UserResponse;
}

export interface ProjectRole {
    name: string;
    utilizationPercentages: number[];
}

export const ProjectRoleStatus = {
    OPEN: 'OPEN',
    PENDING: 'PENDING',
    FILLED: 'FILLED'
} as const;

export type ProjectRoleStatus = typeof ProjectRoleStatus[keyof typeof ProjectRoleStatus];

export interface ProjectRoleStatusResponse {
    id: string;
    roleName: string;
    status: ProjectRoleStatus;
    utilizationPercentages: number[];
}

export interface EmployeeAssignmentRequest {
    userId: string;
    projectId: string;
    roleId: string;
}