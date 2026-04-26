import { useState } from 'react';
import { Award, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  useDeleteQualificationsMutation,
  useMyQualificationsQuery,
} from '../qualifications.hooks';
import { QualificationStatus } from '../qualifications.types';
import type { QualificationResponse } from '../qualifications.types';
import { QualificationsList } from './QualificationsList';
import { QualificationStats } from './QualificationStats';
import { AddQualificationModal } from './AddQualificationModal';

export const QualificationsCard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteRejectedModalOpen, setIsDeleteRejectedModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<QualificationStatus | null>(null);
  const { data: qualifications, isLoading, isError } = useMyQualificationsQuery();
  const deleteRejectedMutation = useDeleteQualificationsMutation();

  const filteredQualifications = activeFilter
    ? (qualifications ?? []).filter((q) => q.status === activeFilter)
    : (qualifications ?? []);
  const rejectedQualifications = (qualifications ?? []).filter(
    (qualification) => qualification.status === QualificationStatus.REJECTED,
  );
  const isRejectedFilterActive = activeFilter === QualificationStatus.REJECTED;

  const handleDeleteRejected = (items: QualificationResponse[]) => {
    if (items.length === 0) return;

    deleteRejectedMutation.mutate(items.map((item) => item.id), {
      onSuccess: () => {
        toast.success('Usunięto wszystkie odrzucone kompetencje.');
        setIsDeleteRejectedModalOpen(false);
      },
      onError: () => toast.error('Nie udało się usunąć odrzuconych kompetencji.'),
    });
  };

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
                {isRejectedFilterActive && rejectedQualifications.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteRejectedModalOpen(true)}
                    disabled={deleteRejectedMutation.isPending}
                    className="cursor-pointer text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    {deleteRejectedMutation.isPending ? 'Usuwanie...' : 'Usuń odrzucone'}
                  </Button>
                )}
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
        <Dialog
          open={isDeleteRejectedModalOpen}
          onOpenChange={setIsDeleteRejectedModalOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Usunąć odrzucone kompetencje?</DialogTitle>
              <DialogDescription>
                Ta akcja usunie wszystkie odrzucone kompetencje z Twojej listy.
                {` Aktualnie do usunięcia: ${rejectedQualifications.length}.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteRejectedModalOpen(false)}
                disabled={deleteRejectedMutation.isPending}
              >
                Anuluj
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleDeleteRejected(rejectedQualifications)}
                disabled={deleteRejectedMutation.isPending}
              >
                {deleteRejectedMutation.isPending ? 'Usuwanie...' : 'Usuń wszystko'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </Collapsible>
  );
};
