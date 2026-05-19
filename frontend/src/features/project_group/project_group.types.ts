export const PROJECT_GROUP_TYPE_VALUES = ["WALLET", "PROGRAM"] as const;

export type ProjectGroupType = (typeof PROJECT_GROUP_TYPE_VALUES)[number];

export const ProjectGroupType = {
    WALLET: "WALLET",
    PROGRAM: "PROGRAM",
} as const;

export const PROJECT_GROUP_TYPE_LABELS: Record<ProjectGroupType, string> = {
    WALLET: "Portfel",
    PROGRAM: "Program",
};

export interface SingleGroupResponse {
    id: string,
    name: string,
    groupType: ProjectGroupType
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

export interface ProjectGroupCreatedResponse {
    id: string
}