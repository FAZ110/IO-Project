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