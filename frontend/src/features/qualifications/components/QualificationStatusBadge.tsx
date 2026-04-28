import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QualificationStatus } from '../qualifications.types';

const config: Record<QualificationStatus, { label: string; className: string; Icon: LucideIcon }> = {
  ACCEPTED: {
    label: 'Zatwierdzona',
    className: 'bg-green-100 text-green-700 border-green-200',
    Icon: CheckCircle2,
  },
  WAITING: {
    label: 'Oczekująca',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    Icon: Clock,
  },
  REJECTED: {
    label: 'Odrzucona',
    className: 'bg-red-100 text-red-700 border-red-200',
    Icon: XCircle,
  },
};

export const QualificationStatusBadge = ({ status }: { status: QualificationStatus }) => {
  const { label, className, Icon } = config[status];

  return (
    <Badge variant="outline" className={className}>
      <Icon className="size-3" />
      {label}
    </Badge>
  );
};
