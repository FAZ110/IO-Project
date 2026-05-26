import { useMemo, useState } from 'react';
import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserWorkload } from '@/features/user-management/user-management.hooks';
import { EmployeeWorkloadChart } from '@/features/employee-assignments/components/EmployeeWorkloadChart';
import { SectionHeader } from './SectionHeader';

interface WorkloadCardProps {
  userId: string;
}

export const WorkloadCard = ({ userId }: WorkloadCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { userWorkload, isLoadingWorkload, isErrorWorkload } = useUserWorkload(userId);

  const intervals = useMemo(() => userWorkload ?? [], [userWorkload]);
  const hasData = intervals.length > 0;

  const peak = useMemo(
    () => intervals.reduce((max, i) => Math.max(max, i.percentage), 0),
    [intervals]
  );
  const isOverloaded = peak > 100;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <SectionHeader
          icon={Activity}
          accent="amber"
          title="Obciążenie"
          description="Aktualne zaakceptowane przydziały projektowe."
          isOpen={isOpen}
          badge={
            hasData ? (
              <Badge
                variant={isOverloaded ? 'red' : 'outline'}
                className="font-normal"
              >
                Szczyt <span className="ml-1 font-semibold tabular-nums">{peak}%</span>
              </Badge>
            ) : undefined
          }
        />

        <CollapsibleContent>
          <CardContent>
            {isLoadingWorkload && <Skeleton className="h-[250px] w-full rounded-lg" />}

            {isErrorWorkload && (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                Nie udało się pobrać danych o obciążeniu.
              </p>
            )}

            {!isLoadingWorkload && !isErrorWorkload && !hasData && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
                <Activity className="size-7 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Brak aktywnych przydziałów</p>
                <p className="text-xs text-muted-foreground">
                  Użytkownik nie jest obecnie przypisany do żadnego projektu.
                </p>
              </div>
            )}

            {!isLoadingWorkload && !isErrorWorkload && hasData && (
              <div className="rounded-lg border border-border bg-muted/20 p-2">
                <EmployeeWorkloadChart currentWorkload={intervals} requestedWorkload={[]} />
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
