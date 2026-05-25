import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FolderTree, Layers, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { PATHS } from '@/routes/paths';
import {
  PROJECT_GROUP_TYPE_LABELS,
  ProjectGroupType,
} from '@/features/project_group/project_group.types';
import { useUserOwnedGroupsQuery } from '@/features/user-management/user-management.hooks';
import { SectionHeader } from './SectionHeader';

interface OwnedGroupsCardProps {
  userId: string;
}

const TYPE_ICON = {
  [ProjectGroupType.WALLET]: Wallet,
  [ProjectGroupType.PROGRAM]: Layers,
};

const TYPE_TINT = {
  [ProjectGroupType.WALLET]: 'bg-amber-50 text-amber-600',
  [ProjectGroupType.PROGRAM]: 'bg-indigo-50 text-indigo-600',
};

export const OwnedGroupsCard = ({ userId }: OwnedGroupsCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: groups, isLoading, isError } = useUserOwnedGroupsQuery(userId);

  const total = groups?.length ?? 0;
  const walletCount = useMemo(
    () => (groups ?? []).filter((g) => g.groupType === ProjectGroupType.WALLET).length,
    [groups]
  );
  const programCount = total - walletCount;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <SectionHeader
          icon={FolderTree}
          accent="amber"
          title="Portfele i programy"
          description="Grupy projektów, w których uczestniczy ten użytkownik."
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
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            )}

            {isError && (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                Nie udało się pobrać listy grup.
              </p>
            )}

            {!isLoading && !isError && total === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
                <FolderTree className="size-7 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Brak grup projektów</p>
                <p className="text-xs text-muted-foreground">
                  Użytkownik nie uczestniczy w żadnym portfelu ani programie.
                </p>
              </div>
            )}

            {!isLoading && !isError && total > 0 && (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-normal">
                    <Wallet className="size-3" />
                    Portfele
                    <span className="ml-1 font-semibold tabular-nums text-foreground">
                      {walletCount}
                    </span>
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    <Layers className="size-3" />
                    Programy
                    <span className="ml-1 font-semibold tabular-nums text-foreground">
                      {programCount}
                    </span>
                  </Badge>
                </div>

                <ul className="grid gap-2 sm:grid-cols-2">
                  {groups!.map((g) => {
                    const Icon = TYPE_ICON[g.groupType];
                    return (
                      <li key={g.id}>
                        <Link
                          to={PATHS.PROJECTS_REGISTRY}
                          className="group flex h-full items-start gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-sm"
                        >
                          <div
                            className={cn(
                              'flex size-10 shrink-0 items-center justify-center rounded-lg',
                              TYPE_TINT[g.groupType]
                            )}
                          >
                            <Icon className="size-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-amber-700">
                                {g.name}
                              </span>
                              {g.isOwner && (
                                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                                  Właściciel
                                </Badge>
                              )}
                            </div>
                            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                              <span>{PROJECT_GROUP_TYPE_LABELS[g.groupType]}</span>
                              <span>·</span>
                              <span className="tabular-nums">
                                {g.projectCount} {g.projectCount === 1 ? 'projekt' : 'projektów'}
                              </span>
                              {g.activeProjectCount > 0 && (
                                <>
                                  <span>·</span>
                                  <span className="font-medium text-emerald-700 tabular-nums">
                                    {g.activeProjectCount} aktywnych
                                  </span>
                                </>
                              )}
                            </div>
                            {g.description && (
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {g.description}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
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
