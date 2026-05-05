import { 
  LayoutDashboard,
  ClipboardList,
  FolderPlus,
  ShieldAlert
} from 'lucide-react';
import { UserRole } from '@/features/auth/auth.types';
import { PATHS } from '@/routes/paths';

export interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles?: UserRole[];
  isCritical?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: PATHS.ROOT,
    icon: LayoutDashboard,
  },
  {
    label: 'Wnioski',
    path: PATHS.REQUESTS,
    icon: ClipboardList,
    roles: [UserRole.LINEAR_MANAGER],
  },
  {
    label: 'Nowy projekt',
    path: PATHS.CREATE_PROJECT,
    icon: FolderPlus,
    roles: [UserRole.PROJECT_MANAGER],
  },
  {
    label: 'Panel Admina',
    path: PATHS.ADMIN_USERS,
    icon: ShieldAlert,
    roles: [UserRole.ADMINISTRATOR],
    isCritical: true,
  },
  {
    label: "Nowy portfel/program",
    path: PATHS.CREATE_PROJECT_GROUP,
    icon: FolderPlus,
    roles: [UserRole.PROJECT_MANAGER]
  }
];