export const ROUTE_PARAMS = {
  USER_ID: 'userId',
  PROJECT_ID: 'projectId'
} as const;

export const QUERY_PARAMS = {
  ACTIVATION_TOKEN: 'token',
  EMAIL: 'email'
} as const;

export const PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: `/register`,
  PROFILE: `/profile`,
  REQUESTS: `/requests`,
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAILS: (userId: string) => `/admin/users/${userId}`,
  CREATE_PROJECT: `/create-project`,
  CREATE_PROJECT_GROUP: `/create-project-group`,
  PROJECT: (id: string) => `project/${id}`
} as const;