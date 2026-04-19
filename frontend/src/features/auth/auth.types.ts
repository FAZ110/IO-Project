export const UserRole = {
  COMMON: 'COMMON',
  AUTHORITY: 'AUTHORITY',
  LINEAR_MANAGER: 'LINEAR_MANAGER',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  ADMINISTRATOR: 'ADMINISTRATOR',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface JwtPayload {
    sub: string;
    role: UserRole;
    iat: number;
    exp: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    activationToken: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
}