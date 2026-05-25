export const ROUTE_PARAMS = {
  USER_ID: 'userId',
  PROJECT_ID: 'projectId'
} as const;

export const QUERY_PARAMS = {
  ACTIVATION_TOKEN: 'token',
  EMAIL: 'email',
  REQUEST_ID: 'requestId',
  USER_ID: 'userId'
} as const;

export const PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: `/register`,
  PROFILE: `/profile`,
  PROJECT_REQUESTS: `/project-requests`,
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAILS: (userId: string) => `/admin/users/${userId}`,
  CREATE_PROJECT: `/create-project`,
  PROJECT: (id: string) => `/project/${id}`,
  QUALIFICATION_REQUESTS: '/qualification-requests',
  CREATE_PROJECT_GROUP: `/create-project-group`,
  NOTIFICATION: `notifications`,
  PROJECTS_REGISTRY: "/projects-registry",
  EMPLOYEES_REGISTRY: "/employees-registry",
  EMPLOYEE_DETAILS: (userId: string) => `/employees/${userId}`,
} as const;
