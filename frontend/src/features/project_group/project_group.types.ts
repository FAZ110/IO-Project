export interface SingleGroupResponse {
    id: string,
    name: string
}

export interface AllGroupsResponse {
    wallets: SingleGroupResponse[],
    programs: SingleGroupResponse[]
}