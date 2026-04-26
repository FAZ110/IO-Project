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
    LIST: '/projects',
    CREATE: '/project',
    DETAIL: (id: string) => `/project/${id}`,
    RISK: {
      LIST: (projectId: string) => `/project/${projectId}/risk`
    },
    VACANCIES: {
      LIST: (projectId: string) => `/project/${projectId}/vacancies`,
      CREATE: (projectId: string) => `/project/${projectId}/vacancies`,
    }
  },
  VACANCIES: {
    ALLOCATE: (vacancyId: string) => `/vacancies/${vacancyId}/allocation-requests`
  }
} as const;