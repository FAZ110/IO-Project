import { Briefcase, Crown, ShieldCheck, User, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/features/auth/auth.types';

const config: Record<UserRole, { label: string; className: string; Icon: LucideIcon }> = {
  COMMON: {
    label: 'Pracownik',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
    Icon: User,
  },
  AUTHORITY: {
    label: 'Władze Wydziału',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
    Icon: Crown,
  },
  LINEAR_MANAGER: {
    label: 'Kierownik Liniowy',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    Icon: Users,
  },
  PROJECT_MANAGER: {
    label: 'Kierownik Projektu',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Icon: Briefcase,
  },
  ADMINISTRATOR: {
    label: 'Administrator',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    Icon: ShieldCheck,
  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  COMMON: config.COMMON.label,
  AUTHORITY: config.AUTHORITY.label,
  LINEAR_MANAGER: config.LINEAR_MANAGER.label,
  PROJECT_MANAGER: config.PROJECT_MANAGER.label,
  ADMINISTRATOR: config.ADMINISTRATOR.label,
};

export const RoleBadge = ({ role }: { role: UserRole }) => {
  const { label, className, Icon } = config[role];

  return (
    <Badge variant="outline" className={className}>
      <Icon className="size-3" />
      {label}
    </Badge>
  );
};
