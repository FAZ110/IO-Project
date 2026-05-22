import {
  LayoutDashboard,
  ClipboardList,
  FolderPlus,
  ShieldAlert,
  GraduationCap, PlusSquare, FolderOpen, Briefcase
} from 'lucide-react';
import { UserRole } from '@/features/auth/auth.types';
import { PATHS } from '@/routes/paths';

export interface NavItem {
  label: string;
  path?: string;
  icon: React.ElementType;
  roles?: UserRole[];
  isCritical?: boolean;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: PATHS.ROOT,
    icon: LayoutDashboard,
    roles: [UserRole.COMMON, UserRole.PROJECT_MANAGER, UserRole.LINEAR_MANAGER, UserRole.AUTHORITY],
  },
  {
    label: 'Rejestry',
    icon: FolderOpen,
    roles: [UserRole.AUTHORITY, UserRole.LINEAR_MANAGER, UserRole.PROJECT_MANAGER, UserRole.COMMON],
    children: [
      // TODO: Gdy juz beda rejestry mozna tutaj odkomentowac
      { label: 'Rejestr projektów', path: PATHS.PROJECTS_REGISTRY, icon: Briefcase },
      // { label: 'Rejestr pracowników', path: PATHS.EMPLOYEES_REGISTRY, icon: Users },
    ]
  },
  {
    label: 'Wnioski',
    icon: ClipboardList,
    roles: [UserRole.LINEAR_MANAGER, UserRole.AUTHORITY],
    children: [
      { label: 'Projektowe', path: PATHS.PROJECT_REQUESTS, icon: ClipboardList },
      { label: 'Kwalifikacyjne', path: PATHS.QUALIFICATION_REQUESTS, icon: GraduationCap },
    ]
  },
  {
    label: 'Utwórz',
    icon: FolderPlus,
    roles: [UserRole.PROJECT_MANAGER, UserRole.AUTHORITY],
    children: [
      { label: 'Nowy projekt', path: PATHS.CREATE_PROJECT, icon: PlusSquare },
      { label: 'Nowy portfel/program', path: PATHS.CREATE_PROJECT_GROUP, icon: FolderPlus },
    ]
  },
  {
    label: 'Panel Admina',
    path: PATHS.ADMIN_USERS,
    icon: ShieldAlert,
    roles: [UserRole.ADMINISTRATOR],
    isCritical: true,
  }
];