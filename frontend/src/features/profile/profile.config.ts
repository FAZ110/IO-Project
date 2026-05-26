import { UserRole } from '@/features/auth/auth.types';

export interface ProfileSectionFlags {
  qualifications: boolean;
  memberships: boolean;
  workload: boolean;
  subordinates: boolean;
  projects: boolean;
  ownedGroups: boolean;
}

export const getProfileSections = (role: UserRole): ProfileSectionFlags => ({
  qualifications: role === UserRole.COMMON,
  memberships: role === UserRole.COMMON,
  workload: role === UserRole.COMMON,
  subordinates: role === UserRole.LINEAR_MANAGER || role === UserRole.AUTHORITY,
  projects: role === UserRole.PROJECT_MANAGER || role === UserRole.AUTHORITY,
  ownedGroups: role === UserRole.PROJECT_MANAGER || role === UserRole.AUTHORITY,
});

export const hasProfileSections = (role: UserRole): boolean =>
  Object.values(getProfileSections(role)).some(Boolean);
