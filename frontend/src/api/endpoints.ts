export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: `/auth/register`,
    REFRESH: `/auth/refresh`,
    LOGOUT: `/auth/logout`
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    RESEND_INVITATION: '/users/invitation',
    SEARCH_USERS: '/users/search'
  },
  ADMIN: {
    INVITATIONS: '/admin/invitations',
  },
  PROJECT: {
    CREATE: '/project',
    BASE: '/projects',
          DETAIL: (id: string) => `/projects/${id}`,
          RISK: {
            LIST: (projectId: string) => `/projects/${projectId}/risk`
          },
  },
  PROJECT_GROUP: {
    LIST_ALL: '/groups',
    WALLETS: '/groups/wallets',
    PROGRAMS: '/groups/programs',
    DETAIL: (groupId: string) => `/groups/${groupId}`,
    CREATE: '/groups',
  }
} as const;