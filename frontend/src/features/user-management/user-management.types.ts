import type { UserRole } from '@/features/auth/auth.types';

export type UserStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED';

export const AdminAssignableRole = {
  COMMON: 'COMMON',
  AUTHORITY: 'AUTHORITY',
  LINEAR_MANAGER: 'LINEAR_MANAGER',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
} as const;
export type AdminAssignableRole = typeof AdminAssignableRole[keyof typeof AdminAssignableRole];

export const UserSearchableRole = {
  COMMON: 'COMMON',
  AUTHORITY: 'AUTHORITY',
  LINEAR_MANAGER: 'LINEAR_MANAGER',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  ADMINISTRATOR: 'ADMINISTRATOR',
} as const;
export type UserSearchableRole = typeof UserSearchableRole[keyof typeof UserSearchableRole];

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
  role: UserRole;
  status: UserStatus;
  supervisorEmail: string | null;
}

export interface SimpleUserResponse {
  id: string,
  name: string,
  surname: string
}

export interface BasicUserResponse {
  id: string,
  email: string,
  name: string,
  surname: string
}

export interface InviteUserRequest {
  email: string;
  role: AdminAssignableRole;
  supervisorId?: string;
}

export interface UserListParams {
  userRole?: UserRole;
  status?: UserStatus;
  search?: string;
}
