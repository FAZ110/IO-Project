import type { SimpleUserResponse, UserResponse } from "@/features/user-management";
import type { EmployeeAssignmentStatus } from "@/features/employee-assignments/employee-assignments.types";
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
  impact: number;
}

export interface RiskResponse extends Risk {
  id: string;
  value: number;
}

export interface ProjectResponse {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  group?: GroupBasicResponse | null;
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
  group?: GroupBasicResponse | null;
}

export interface ProjectTimelineResponse {
  milestones: Milestone[];
  assignments: EmployeeWithAssignmentsResponse[];
}

export interface EmployeeWithAssignmentsResponse {
  userId: string;
  name: string;
  surname: string;
  email: string;
  assignments: ProjectAssignmentResponse[];
}

export interface ProjectAssignmentResponse {
  id: string;
  roleName: string;
  startDate: string;
  endDate: string;
  utilizationPercentage: number;
  status: EmployeeAssignmentStatus;
}

export interface CreateEmployeeAssignmentRequest {
  projectId: string;
  userId: string;
  startDate: string;
  endDate: string;
  utilizationPercentage: number;
  roleName: string;
}

export interface SearchProjectsRequest {
  query?: string;
  unassignedOnly?: boolean;
  groupId?: string;
  isActive?: boolean;
}