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
    DETAIL: (id: string) => `/project/${id}`,
    RISK: {
      LIST: (projectId: string) => `/project/${projectId}/risk`
    },
  },
  PROJECT_GROUP: {
    ALL_GROUPS: '/groups'
  }
} as const;