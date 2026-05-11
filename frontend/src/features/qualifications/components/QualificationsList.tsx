import { Sparkles } from 'lucide-react';
import { useDeleteQualificationMutation } from '../qualifications.hooks';
import type { QualificationResponse } from '../qualifications.types';
import { QualificationItem } from './QualificationItem';

interface QualificationsListProps {
  qualifications: QualificationResponse[];
}

export const QualificationsList = ({ qualifications }: QualificationsListProps) => {
  const deleteMutation = useDeleteQualificationMutation();

  if (qualifications.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
        <Sparkles className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Brak kompetencji</p>
        <p className="text-sm text-muted-foreground">
          Dodaj swoją pierwszą umiejętność
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {qualifications.map((qualification) => (
        <QualificationItem
          key={qualification.id}
          qualification={qualification}
          onDelete={(id) => deleteMutation.mutate(id)}
          isDeleting={deleteMutation.isPending && deleteMutation.variables === qualification.id}
        />
      ))}
    </ul>
  );
};
