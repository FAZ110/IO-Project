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
  id: string; 
}


export interface SingleGroupResponse {
  id: string; 
  name: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  startDate: string;
}