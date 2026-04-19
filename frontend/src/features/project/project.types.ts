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