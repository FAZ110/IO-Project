import { useState } from 'react';
import { CheckCircle2, ChevronDown, Clock, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { QualificationStatus } from '../qualifications.types';
import type { QualificationResponse } from '../qualifications.types';

interface StatConfig {
  label: string;
  Icon: LucideIcon;
  cardClassName: string;
  activeClassName: string;
}

const STATS: Array<{ status: QualificationStatus } & StatConfig> = [
  {
    status: QualificationStatus.ACCEPTED,
    label: 'Zatwierdzone',
    Icon: CheckCircle2,
    cardClassName: 'bg-green-50 text-green-700 ring-green-200 hover:bg-green-100',
    activeClassName: 'ring-2 ring-green-500 bg-green-100',
  },
  {
    status: QualificationStatus.WAITING,
    label: 'Oczekujące',
    Icon: Clock,
    cardClassName: 'bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100',
    activeClassName: 'ring-2 ring-amber-500 bg-amber-100',
  },
  {
    status: QualificationStatus.REJECTED,
    label: 'Odrzucone',
    Icon: XCircle,
    cardClassName: 'bg-red-50 text-red-700 ring-red-200 hover:bg-red-100',
    activeClassName: 'ring-2 ring-red-500 bg-red-100',
  },
];

interface QualificationStatsProps {
  qualifications: QualificationResponse[];
  activeFilter: QualificationStatus | null;
  onFilterChange: (status: QualificationStatus | null) => void;
}

export const QualificationStats = ({ qualifications, activeFilter, onFilterChange }: QualificationStatsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const counts = qualifications.reduce<Record<QualificationStatus, number>>(
    (accumulator, qualification) => {
      accumulator[qualification.status] += 1;
      return accumulator;
    },
    { ACCEPTED: 0, WAITING: 0, REJECTED: 0 },
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="group/stats flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground cursor-pointer">
        <span className="flex items-center gap-2">
          Podsumowanie statusów
          {activeFilter && (
            <span className="text-xs text-muted-foreground/60">(filtr aktywny)</span>
          )}
        </span>
        <ChevronDown className={cn('size-4 transition-transform', isOpen && 'rotate-180')} />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-1 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-top-1">
        <div className="grid gap-2 pt-2 sm:grid-cols-3">
          {STATS.map(({ status, label, Icon, cardClassName, activeClassName }) => {
            const isActive = activeFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => onFilterChange(isActive ? null : status)}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 ring-1 ring-inset transition-all cursor-pointer text-left',
                  cardClassName,
                  isActive && activeClassName,
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate text-xs font-medium">{label}</span>
                <span className="ml-auto text-sm font-semibold tabular-nums">{counts[status]}</span>
              </button>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
