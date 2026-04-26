import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QualificationStatus } from '../qualifications.types';
import type { QualificationResponse } from '../qualifications.types';

interface StatConfig {
  label: string;
  Icon: LucideIcon;
  cardClassName: string;
  activeClassName: string;
  iconClassName: string;
}

const STATS: Array<{ status: QualificationStatus } & StatConfig> = [
  {
    status: QualificationStatus.ACCEPTED,
    label: 'Zatwierdzone',
    Icon: CheckCircle2,
    cardClassName: 'border-green-200/70 bg-background text-foreground hover:border-green-300 hover:bg-green-50/40',
    activeClassName: 'border-green-400 bg-green-50/70 shadow-sm',
    iconClassName: 'text-green-600',
  },
  {
    status: QualificationStatus.WAITING,
    label: 'Oczekujące',
    Icon: Clock,
    cardClassName: 'border-amber-200/70 bg-background text-foreground hover:border-amber-300 hover:bg-amber-50/40',
    activeClassName: 'border-amber-400 bg-amber-50/70 shadow-sm',
    iconClassName: 'text-amber-600',
  },
  {
    status: QualificationStatus.REJECTED,
    label: 'Odrzucone',
    Icon: XCircle,
    cardClassName: 'border-red-200/70 bg-background text-foreground hover:border-red-300 hover:bg-red-50/40',
    activeClassName: 'border-red-400 bg-red-50/70 shadow-sm',
    iconClassName: 'text-red-600',
  },
];

interface QualificationStatsProps {
  qualifications: QualificationResponse[];
  activeFilter: QualificationStatus | null;
  onFilterChange: (status: QualificationStatus | null) => void;
  className?: string;
}

export const QualificationStats = ({
  qualifications,
  activeFilter,
  onFilterChange,
  className,
}: QualificationStatsProps) => {
  const counts = qualifications.reduce<Record<QualificationStatus, number>>(
    (accumulator, qualification) => {
      accumulator[qualification.status] += 1;
      return accumulator;
    },
    { ACCEPTED: 0, WAITING: 0, REJECTED: 0 },
  );

  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-x-auto',
        className,
      )}
    >
      {STATS.map(({ status, label, Icon, cardClassName, activeClassName, iconClassName }) => {
        const isActive = activeFilter === status;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onFilterChange(isActive ? null : status)}
            className={cn(
              'flex h-8 shrink-0 items-center gap-2 rounded-md border px-2.5 text-left transition-all cursor-pointer',
              cardClassName,
              isActive && activeClassName,
            )}
          >
            <Icon className={cn('size-4 shrink-0', iconClassName)} />
            <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
            <p className="ml-auto text-sm font-semibold tabular-nums text-foreground">
              {counts[status]}
            </p>
          </button>
        );
      })}
      {activeFilter && (
        <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border">
          Filtr aktywny
        </span>
      )}
    </div>
  );
};
