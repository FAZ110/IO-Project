import type { UserRole } from '@/features/auth/auth.types';

export type UserStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED';

export type AdminAssignableRole = Exclude<UserRole, 'ADMINISTRATOR'>;

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
  role: UserRole;
  status: UserStatus;
  supervisorEmail: string | null;
}

export interface InviteUserRequest {
  email: string;
  role: AdminAssignableRole;
}
