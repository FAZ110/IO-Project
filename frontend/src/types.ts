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
    walletId?: number | string | null;
    programId?: number | string | null;
    risks?: RiskRequest[];
}