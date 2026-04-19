export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: `/auth/register`,
    REFRESH: `/auth/refresh`,
    LOGOUT: `/auth/logout`
  },
  ADMIN: {
    USERS: '/admin/users',
    USER: (id: string) => `/admin/users/${id}`,
    INVITATIONS: '/admin/invitations',
  },
  PROJECT: {
    CREATE: '/project'
  }
} as const;