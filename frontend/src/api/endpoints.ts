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
  },
  ADMIN: {
    INVITATIONS: '/admin/invitations',
  },
  PROJECT: {
    BASE: '/projects',
          DETAIL: (id: string) => `/project/${id}`,
          RISK: {
            LIST: (projectId: string) => `/project/${projectId}/risk`
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