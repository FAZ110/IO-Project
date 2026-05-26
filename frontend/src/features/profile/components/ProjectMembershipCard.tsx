import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, FolderOpen, Users2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { PATHS } from '@/routes/paths';
import { PROJECT_GROUP_TYPE_LABELS } from '@/features/project_group/project_group.types';
import { useUserProjectMembershipsQuery } from '@/features/user-management/user-management.hooks';
import { SectionHeader } from './SectionHeader';

interface ProjectMembershipCardProps {
  userId: string;
}

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

export const ProjectMembershipCard = ({ userId }: ProjectMembershipCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: memberships, isLoading, isError } = useUserProjectMembershipsQuery(userId);

  const total = memberships?.length ?? 0;
  const activeCount = useMemo(
    () => (memberships ?? []).filter((m) => m.isActive).length,
    [memberships]
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <SectionHeader
          icon={Users2}
          accent="rose"
          title="Projekty"
          description="Projekty, w których użytkownik uczestniczy."
          isOpen={isOpen}
          badge={
            total > 0 ? (
              <Badge variant="outline" className="font-semibold tabular-nums">
                {total}
              </Badge>
            ) : undefined
          }
        />

        <CollapsibleContent>
          <CardContent className="flex flex-col gap-4">
            {isLoading && (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
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
                  Użytkownik nie ma obecnie żadnych zaakceptowanych przydziałów.
                </p>
              </div>
            )}

            {!isLoading && !isError && total > 0 && (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="green" className="font-normal">
                    Aktywne <span className="ml-1 font-semibold tabular-nums">{activeCount}</span>
                  </Badge>
                  <Badge variant="red" className="font-normal">
                    Zakończone <span className="ml-1 font-semibold tabular-nums">{total - activeCount}</span>
                  </Badge>
                </div>

                <ul className="flex flex-col gap-3">
                  {memberships!.map((m) => {
                    const progress = computeProgress(m.startDate, m.endDate);
                    return (
                      <li
                        key={m.id}
                        className={cn(
                          'group flex flex-col gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-sm',
                          m.isActive
                            ? 'border-border hover:border-rose-200 hover:bg-rose-50/30'
                            : 'border-border opacity-70'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              to={PATHS.PROJECT(m.id)}
                              className="block truncate text-sm font-semibold text-foreground transition-colors group-hover:text-rose-700 hover:underline"
                            >
                              {m.title}
                            </Link>
                            {m.description && (
                              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                {m.description}
                              </p>
                            )}
                          </div>
                          <Badge variant={m.isActive ? 'green' : 'red'} className="shrink-0">
                            {m.isActive ? 'Aktywny' : 'Nieaktywny'}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="size-3.5" />
                            {formatDate(m.startDate)} – {formatDate(m.endDate)}
                          </span>
                          {m.group && (
                            <Badge variant="outline" className="font-normal">
                              {PROJECT_GROUP_TYPE_LABELS[m.group.groupType]}: {m.group.name}
                            </Badge>
                          )}
                        </div>

                        {m.roles.length > 0 && (
                          <div className="flex flex-col gap-1.5 border-t border-border/60 pt-2">
                            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                              {m.roles.length === 1 ? 'Rola' : 'Role'}
                            </div>
                            <ul className="flex flex-wrap gap-1.5">
                              {m.roles.map((r, idx) => (
                                <li
                                  key={idx}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs"
                                >
                                  <span className="font-medium text-foreground">{r.roleName}</span>
                                  <span className="text-muted-foreground">·</span>
                                  <span className="font-semibold tabular-nums text-foreground">
                                    {r.utilizationPercentage}%
                                  </span>
                                  <span className="text-muted-foreground">·</span>
                                  <span className="text-muted-foreground">
                                    {formatDate(r.startDate)} – {formatDate(r.endDate)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                m.isActive
                                  ? 'bg-gradient-to-r from-rose-500 to-pink-500'
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
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
