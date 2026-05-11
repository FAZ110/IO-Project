export const PROJECT_GROUP_KEYS = {
    all: ['projectGroups'] as const,
    list: () => [...PROJECT_GROUP_KEYS.all, 'list'] as const,
    create: () => [...PROJECT_GROUP_KEYS.all, 'create'] as const,
};