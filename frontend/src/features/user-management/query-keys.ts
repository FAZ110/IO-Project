import type { UserListParams } from './user-management.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const usersKeys = createQueryKeys('users', {
    list: (page: number, size: number, filters: UserListParams) => [page, size, filters],
    search: (searchTerm: string) => [searchTerm],
})
