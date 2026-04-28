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
  ME: {
    QUALIFICATIONS: '/me/qualifications',
    QUALIFICATION: (id: string) => `/me/qualifications/${id}`,
    PASSWORD: '/me/password',
  },
  SKILLS: '/skills',
  ADMIN: {
    INVITATIONS: '/admin/invitations',
  },
  PROJECT: {
    BASE: '/projects',
          DETAIL: (id: string) => `/projects/${id}`,
          RISK: {
            LIST: (projectId: string) => `/projects/${projectId}/risks`
          },
          MEMBERS: (projectId: string) => `/projects/${projectId}/members`
  },
  PROJECT_GROUP: {
    LIST_ALL: '/groups',
    WALLETS: '/groups/wallets',
    PROGRAMS: '/groups/programs',
    DETAIL: (groupId: string) => `/groups/${groupId}`,
    CREATE: '/groups',
  },
  EMPLOYEE: {
    ASSIGNMENTS: '/employee/assignments',
    ASSIGNMENT_DETAIL: (id: string) => `/employee/assignments/${id}`,
    ACCEPT_ASSIGNMENT: (id: string) => `/employee/assignments/${id}/accept`,
    REJECT_ASSIGNMENT: (id: string) => `/employee/assignments/${id}/reject`
  }
} as const;