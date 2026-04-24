import type {UserResponse} from "@/features/user-management";

export interface ProjectCreationRequest {
    title: string;
    description: string;
    startDate: string;
    isActive: boolean;
    walletId?: number;
    programId?: number;
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

export interface ProjectDetailsResponse {
  id: string;
  title: string;
  description: string;
  startDate: string;
  isActive: boolean;
  manager: UserResponse
}

