import { useState } from 'react';
import { Award, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyQualificationsQuery } from '../qualifications.hooks';
import type { QualificationStatus } from '../qualifications.types';
import { QualificationsList } from './QualificationsList';
import { QualificationStats } from './QualificationStats';
import { AddQualificationModal } from './AddQualificationModal';

export const QualificationsCard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<QualificationStatus | null>(null);
  const { data: qualifications, isLoading, isError } = useMyQualificationsQuery();

  const filteredQualifications = activeFilter
    ? (qualifications ?? []).filter((q) => q.status === activeFilter)
    : (qualifications ?? []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Award className="size-5" />
          </div>
          <div>
            <CardTitle>Moje kompetencje</CardTitle>
            <CardDescription>
              Zatwierdzone kompetencje są widoczne dla kierowników przy przydziale do projektów.
            </CardDescription>
          </div>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="cursor-pointer">
          <Plus className="size-4" />
          Dodaj kompetencję
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {isLoading && (
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          </div>
        )}

        {isError && (
          <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            Nie udało się pobrać kompetencji. Odśwież stronę i spróbuj ponownie.
          </p>
        )}

        {!isLoading && !isError && (
          <>
            {(qualifications?.length ?? 0) > 0 && (
              <QualificationStats
                qualifications={qualifications ?? []}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            )}
            <QualificationsList qualifications={filteredQualifications} />
          </>
        )}
      </CardContent>

      <AddQualificationModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        existingQualifications={qualifications ?? []}
      />
    </Card>
  );
};
