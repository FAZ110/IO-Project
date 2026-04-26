import { useState } from 'react';
import { Award, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useMyQualificationsQuery } from '../qualifications.hooks';
import type { QualificationStatus } from '../qualifications.types';
import { QualificationsList } from './QualificationsList';
import { QualificationStats } from './QualificationStats';
import { AddQualificationModal } from './AddQualificationModal';

export const QualificationsCard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<QualificationStatus | null>(null);
  const { data: qualifications, isLoading, isError } = useMyQualificationsQuery();

  const filteredQualifications = activeFilter
    ? (qualifications ?? []).filter((q) => q.status === activeFilter)
    : (qualifications ?? []);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <CollapsibleTrigger className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-lg text-left transition-colors hover:bg-muted/40">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Award className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>Moje kompetencje</CardTitle>
                <ChevronDown
                  className={cn('size-4 shrink-0 transition-transform', isOpen && 'rotate-180')}
                />
              </div>
              <CardDescription>
                Zatwierdzone kompetencje są widoczne dla kierowników przy przydziale do projektów.
              </CardDescription>
            </div>
          </CollapsibleTrigger>
        </CardHeader>

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
              <div className="flex shrink-0 items-center gap-2 self-start md:self-auto">
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="cursor-pointer"
                >
                  <Plus className="size-4" />
                  Dodaj kompetencję
                </Button>
              </div>
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
                <QualificationsList qualifications={filteredQualifications} />
              </>
            )}
          </CardContent>
        </CollapsibleContent>

        <AddQualificationModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          existingQualifications={qualifications ?? []}
        />
      </Card>
    </Collapsible>
  );
};
