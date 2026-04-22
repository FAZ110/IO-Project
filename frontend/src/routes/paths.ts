export const ROUTE_PARAMS = {
  USER_ID: 'userId',
} as const;

export const QUERY_PARAMS = {
  ACTIVATION_TOKEN: 'token',
} as const;

export const PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: `/register`,
  PROFILE: `/profile`,
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAILS: (userId: string) => `/admin/users/${userId}`,
  CREATEPROJECT: `/create-project`
} as const;