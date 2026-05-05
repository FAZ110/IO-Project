export const PROJECT_KEYS = {
    all: ['projects'] as const,
    list: () => [...PROJECT_KEYS.all, 'list'] as const,
    details: () => [...PROJECT_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...PROJECT_KEYS.details(), id] as const,
    search: (query: string) => [...PROJECT_KEYS.all, 'search', query] as const,

    risks: (projectId: string) => [...PROJECT_KEYS.detail(projectId), 'risks'] as const,
    members: (projectId: string) => [...PROJECT_KEYS.detail(projectId), 'members'] as const,
};

export const ROLES_KEYS = {
    all: ['roles'] as const,
    status: (projectId: string) => [...PROJECT_KEYS.detail(projectId), 'roles-status'] as const,
};