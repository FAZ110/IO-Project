import type { UserRole } from '@/features/auth/auth.types';
import type { ChartInterval } from '@/features/employee-assignments/employee-assignments.types';

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
}

export interface UserListParams {
  userRole?: UserRole;
  status?: UserStatus;
  search?: string;
}

export interface UserWorkloadResponse {
  workload: ChartInterval[];
}