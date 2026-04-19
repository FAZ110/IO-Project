export type UserRole = 'COMMON' | 'AUTHORITY' | 'LINEAR_MANAGER' | 'PROJECT_MANAGER' | 'ADMINISTRATOR';

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