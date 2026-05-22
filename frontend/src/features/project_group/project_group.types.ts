import type { ProjectResponse } from "@/features/project/project.types";

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

export interface ProjectGroupResponse {
    id: string;
    name: string;
    projects: ProjectResponse[];
}

export interface AllGroupsResponse {
    wallets: ProjectGroupResponse[];
    programs: ProjectGroupResponse[];
    unassigned: ProjectResponse[];
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

export interface GroupBasicResponse {
    id: string;
    name: string;
    groupType: ProjectGroupType;
}