import type {UserResponse} from "@/features/user-management";

export interface ProjectCreationRequest {
    title: string;
    description: string;
    startDate: string;
    isActive: boolean;
    walletId?: number;
    programId?: number;
    risks?: Risk[];
    milestones?: Milestone[];
    roles?: Role[];
}

export interface Risk {
    name: string;
    description: string;
    probability: number;
}

export interface Milestone {
    name: string;
    date: string;
}

export interface Role {
    name: string;
    utilizationPercentages: number[];
}

export interface RiskResponse {
  id: string
  name: string;
  description: string;
  probability: number;
}

export interface ProjectDetailsResponse {
  id: string;
  title: string;
  description: string;
  startDate: string;
  isActive: boolean;
  manager: UserResponse
}

export interface ProjectRoleStatusResponse {
  id: string;
  roleName: string;
  status: 'OPEN' | 'PENDING' | 'FILLED';
  utilizationPercentages: number[];
}

export interface CreateAllocationRequest {
  requestedEmployeeId: string;
  justification: string;
}

export interface AllocationRequestResponse {
  id: string;
  projectRoleId: string;
  requestedEmployeeId: string;
  createdById: string;
  justification: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}
