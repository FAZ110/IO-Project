import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CalendarDays, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { PATHS } from '@/routes/paths';
import { PROJECT_GROUP_TYPE_LABELS } from '@/features/project_group/project_group.types';
import { useUserManagedProjectsQuery } from '@/features/user-management/user-management.hooks';
import { SectionHeader } from './SectionHeader';

interface ManagedProjectsCardProps {
  userId: string;
}

type StatusFilter = 'all' | 'active' | 'inactive';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });

const computeProgress = (startIso: string, endIso: string) => {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
};

export const ManagedProjectsCard = ({ userId }: ManagedProjectsCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const { data: projects, isLoading, isError } = useUserManagedProjectsQuery(userId);

  const total = projects?.length ?? 0;
  const activeCount = useMemo(
    () => (projects ?? []).filter((p) => p.isActive).length,
    [projects]
  );
  const inactiveCount = total - activeCount;

  const filtered = useMemo(() => {
    if (!projects) return [];
    if (statusFilter === 'all') return projects;
    return projects.filter((p) => (statusFilter === 'active' ? p.isActive : !p.isActive));
  }, [projects, statusFilter]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <SectionHeader
          icon={Briefcase}
          accent="emerald"
          title="Projekty"
          description="Projekty, którymi zarządza ten użytkownik."
          isOpen={isOpen}
          badge={
            <Badge variant="outline" className="font-semibold tabular-nums">
              {total}
            </Badge>
          }
        />

        <CollapsibleContent>
          <CardContent className="flex flex-col gap-4">
            {isLoading && (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
              </div>
            )}

            {isError && (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                Nie udało się pobrać listy projektów.
              </p>
            )}

            {!isLoading && !isError && total === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
                <FolderOpen className="size-7 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Brak projektów</p>
                <p className="text-xs text-muted-foreground">
                  Użytkownik nie prowadzi obecnie żadnego projektu.
                </p>
              </div>
            )}

            {!isLoading && !isError && total > 0 && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="green" className="font-normal">
                      Aktywne <span className="ml-1 font-semibold tabular-nums">{activeCount}</span>
                    </Badge>
                    <Badge variant="red" className="font-normal">
                      Nieaktywne <span className="ml-1 font-semibold tabular-nums">{inactiveCount}</span>
                    </Badge>
                  </div>
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie</SelectItem>
                      <SelectItem value="active">Aktywne</SelectItem>
                      <SelectItem value="inactive">Nieaktywne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filtered.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-4 text-center text-sm text-muted-foreground">
                    Brak projektów dla wybranego filtra.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {filtered.map((p) => {
                      const progress = computeProgress(p.startDate, p.endDate);
                      return (
                        <li
                          key={p.id}
                          className={cn(
                            'group flex flex-col gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-sm',
                            p.isActive
                              ? 'border-border hover:border-emerald-200 hover:bg-emerald-50/30'
                              : 'border-border opacity-70'
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                to={PATHS.PROJECT(p.id)}
                                className="block truncate text-sm font-semibold text-foreground transition-colors group-hover:text-emerald-700 hover:underline"
                              >
                                {p.title}
                              </Link>
                              {p.description && (
                                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                  {p.description}
                                </p>
                              )}
                            </div>
                            <Badge variant={p.isActive ? 'green' : 'red'} className="shrink-0">
                              {p.isActive ? 'Aktywny' : 'Nieaktywny'}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="size-3.5" />
                              {formatDate(p.startDate)} – {formatDate(p.endDate)}
                            </span>
                            {p.group && (
                              <Badge variant="outline" className="font-normal">
                                {PROJECT_GROUP_TYPE_LABELS[p.group.groupType]}: {p.group.name}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn(
                                  'h-full rounded-full transition-all',
                                  p.isActive
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                    : 'bg-muted-foreground/40'
                                )}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
                              {progress}%
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
