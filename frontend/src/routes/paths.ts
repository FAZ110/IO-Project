export const ROUTE_PARAMS = {
  ACTIVATION_TOKEN: 'activationToken',
} as const;

export const PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: `/register/:${ROUTE_PARAMS.ACTIVATION_TOKEN}`,
} as const;