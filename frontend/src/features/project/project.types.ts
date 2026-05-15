import type { SimpleUserResponse, UserResponse } from "@/features/user-management";
import type { GroupBasicResponse } from '@/features/project_group/project_group.types';

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
    group?: GroupBasicResponse | null;
    manager: UserResponse;
}

export interface Milestone {
    date: string;
    name: string;
    description?: string;
    group?: GroupBasicResponse | null;
}

export interface ProjectDetailsResponse {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    manager: UserResponse;
    group?: GroupBasicResponse | null;
}

export interface CreateEmployeeAssignmentRequest {
    projectId: string;
    userId: string;
    startDate: string;
    endDate: string;
    utilizationPercentage: number;
    roleName: string;
}