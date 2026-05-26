import { useState } from 'react';
import { Award, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionHeader } from '@/features/profile/components/SectionHeader';
import { useMyQualificationsQuery, useUserQualificationsQuery } from '../qualifications.hooks';
import type { QualificationStatus } from '../qualifications.types';
import { QualificationsList } from './QualificationsList';
import { QualificationStats } from './QualificationStats';
import { AddQualificationModal } from './AddQualificationModal';

interface QualificationsCardProps {
  userId?: string;
  readOnly?: boolean;
}

export const QualificationsCard = ({ userId, readOnly = false }: QualificationsCardProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<QualificationStatus | null>(null);

  const myQuery = useMyQualificationsQuery();
  const otherQuery = useUserQualificationsQuery(userId);
  const { data: qualifications, isLoading, isError } = userId ? otherQuery : myQuery;

  const filteredQualifications = activeFilter
    ? (qualifications ?? []).filter((q) => q.status === activeFilter)
    : (qualifications ?? []);

  const title = readOnly ? 'Kompetencje' : 'Moje kompetencje';
  const description = readOnly
    ? 'Zatwierdzone kompetencje pracownika.'
    : 'Zatwierdzone kompetencje są widoczne dla kierowników przy przydziale do projektów.';

  const total = qualifications?.length ?? 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <SectionHeader
          icon={Award}
          accent="purple"
          title={title}
          description={description}
          isOpen={isOpen}
          badge={
            total > 0 ? (
              <Badge variant="outline" className="font-semibold tabular-nums">
                {total}
              </Badge>
            ) : undefined
          }
        />

        <CollapsibleContent className="overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-1 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-top-1">
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 md:flex-row md:flex-nowrap md:items-center md:justify-between">
              {(qualifications?.length ?? 0) > 0 && (
                <QualificationStats
                  qualifications={qualifications ?? []}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              )}
              {!readOnly && (
                <div className="flex shrink-0 items-center gap-2 self-start md:self-auto">
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="cursor-pointer"
                  >
                    <Plus className="size-4" />
                    Dodaj kompetencję
                  </Button>
                </div>
              )}
            </div>

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
                <QualificationsList qualifications={filteredQualifications} readOnly={readOnly} />
              </>
            )}
          </CardContent>
        </CollapsibleContent>

        {!readOnly && (
          <AddQualificationModal
            open={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
            existingQualifications={qualifications ?? []}
          />
        )}
      </Card>
    </Collapsible>
  );
};
