export interface ProjectCreationRequest {
    title: string
    description: string;
    startDate: string;
    projectGroupId?: string | null;
    sponsors: string[];
    committee: string[];
    milestones: Milestone[];
    roles: Role[];
    risks?: Risk[];
}

export interface Risk {
    name: string
    description: string
    probability: number
}

export interface Milestone {
<<<<<<< HEAD
    startDate: string
    endDate: string
}
=======
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

export interface Role {
  name: string,
  utilizationPercentages: number[]
}

>>>>>>> 7eb1fea (Update form to create new project with roles time allocations)
