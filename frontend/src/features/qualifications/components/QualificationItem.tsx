import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { QualificationResponse } from '../qualifications.types';
import { QualificationStatusBadge } from './QualificationStatusBadge';

interface QualificationItemProps {
  qualification: QualificationResponse;
  onDelete?: (id: string) => void;
  isDeleting: boolean;
}

export const QualificationItem = ({ qualification, onDelete, isDeleting }: QualificationItemProps) => (
  <li className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/30">
    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
      {qualification.name}
    </span>

    <QualificationStatusBadge status={qualification.status} />

    {onDelete && (
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(qualification.id)}
        disabled={isDeleting}
        aria-label={`Usuń kompetencję ${qualification.name}`}
        className="text-muted-foreground hover:text-destructive cursor-pointer"
      >
        <Trash2 className="size-4" />
      </Button>
    )}
  </li>
);
