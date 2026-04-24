export interface ProjectCreationRequest {
    title: string
    description: string;
    startDate: string;
    isActive: boolean;
    walletId?: number;
    programId?: number;
    risks?: Risk[];
}

export interface Risk {
    name: string
    description: string
    probability: number
}


export interface RiskResponse extends Risk {
  id: string; // UUID
}


export interface SingleGroupResponse {
  id: string; // UUID
  name: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  start_date: string;
}