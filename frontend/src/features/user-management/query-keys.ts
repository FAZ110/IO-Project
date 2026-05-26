import type { UserListParams, UserSearchableRole } from './user-management.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const usersKeys = createQueryKeys('users', {
    list: (page: number, size: number, filters: UserListParams) => [page, size, filters],
    search: (searchTerm: string, role?: UserSearchableRole) => [searchTerm, role],
    workload: (userId?: string) => [userId],
    me: null,
    detail: (userId: string) => [userId],
    subordinates: (userId: string) => ['subordinates', userId],
    projects: (userId: string) => ['projects', userId],
    memberships: (userId: string) => ['memberships', userId],
    groups: (userId: string) => ['groups', userId],
})
