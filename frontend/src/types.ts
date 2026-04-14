export interface RiskRequest {
    name: string
    description: string
    probability: number
}

export interface ProjectCreationRequest{
    title: string
    description: string;
    startDate: string;
    isActive: boolean;
    walletId?: number;
    programId?: number;
    risks?: RiskRequest[];
}