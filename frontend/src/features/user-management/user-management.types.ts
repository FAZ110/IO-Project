import type { UserRole } from '@/features/auth/auth.types';
import type { ChartInterval } from '@/features/employee-assignments/employee-assignments.types';

export const UserStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
} as const;
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

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
  supervisor: SimpleUserResponse | null;
}

export interface SimpleUserResponse {
  id: string,
  name: string,
  surname: string
  email: string
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

export interface UserWorkloadResponse {
  workload: ChartInterval[];
}

export interface UserProjectRoleResponse {
  roleName: string;
  startDate: string;
  endDate: string;
  utilizationPercentage: number;
}

export interface OwnedGroupResponse {
  id: string;
  name: string;
  description: string;
  groupType: import('@/features/project_group/project_group.types').ProjectGroupType;
  projectCount: number;
  activeProjectCount: number;
  isOwner: boolean;
}

export interface UserProjectMembershipResponse {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  group: import('@/features/project_group/project_group.types').GroupBasicResponse | null;
  roles: UserProjectRoleResponse[];
}