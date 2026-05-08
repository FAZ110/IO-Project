export const PROJECT_GROUP_TYPE_VALUES = ["WALLET", "PROGRAM"] as const;

export type ProjectGroupType = (typeof PROJECT_GROUP_TYPE_VALUES)[number];

export const PROJECT_GROUP_TYPE_LABELS: Record<ProjectGroupType, string> = {
    WALLET: "Portfel",
    PROGRAM: "Program",
};

export const ProjectGroupType = {
    Wallet: 'WALLET',
    Program: 'PROGRAM'
} as const;


export interface SingleGroupResponse {
    id: string,
    name: string
}

export interface AllGroupsResponse {
    wallets: SingleGroupResponse[],
    programs: SingleGroupResponse[]
}

export interface ProjectGroupCreationRequest {
    name: string,
    description: string
    groupType: ProjectGroupType,
    projectIds: string[]
}