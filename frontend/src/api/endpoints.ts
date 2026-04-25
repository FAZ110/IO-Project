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
    CREATE: '/project',
    DETAIL: (id: string) => `/project/${id}`,
    RISK: {
      LIST: (projectId: string) => `/project/${projectId}/risk`
    }
  },
  EMPLOYEE: {
    REQUESTS: '/employee/requests',
    REQUEST_DETAIL: (id: string) => `/employee/requests/${id}`,
    ACCEPT_REQUEST: (id: string) => `/employee/requests/${id}/accept`,
    REJECT_REQUEST: (id: string) => `/employee/requests/${id}/reject`
  }
} as const;