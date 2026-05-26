import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PATHS } from '@/routes/paths';
import { UserRole } from '@/features/auth/auth.types';
import { ROLE_LABELS, RoleBadge } from '@/features/user-management/components/RoleBadge';
import { useUserSubordinatesQuery } from '@/features/user-management/user-management.hooks';
import { SectionHeader } from './SectionHeader';

interface SubordinatesCardProps {
  userId: string;
}

const getInitials = (name: string | null, surname: string | null) =>
  `${(name ?? '?').charAt(0)}${(surname ?? '?').charAt(0)}`.toUpperCase();

export const SubordinatesCard = ({ userId }: SubordinatesCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState('');
  const { data: subordinates, isLoading, isError } = useUserSubordinatesQuery(userId);
  const navigate = useNavigate();

  const total = subordinates?.length ?? 0;

  const roleCounts = useMemo(() => {
    const acc: Partial<Record<UserRole, number>> = {};
    (subordinates ?? []).forEach((s) => {
      acc[s.role] = (acc[s.role] ?? 0) + 1;
    });
    return acc;
  }, [subordinates]);

  const filtered = useMemo(() => {
    if (!subordinates) return [];
    const q = search.trim().toLowerCase();
    if (!q) return subordinates;
    return subordinates.filter((s) => {
      const name = `${s.name ?? ''} ${s.surname ?? ''}`.toLowerCase();
      return name.includes(q) || s.email.toLowerCase().includes(q);
    });
  }, [subordinates, search]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <SectionHeader
          icon={Users}
          accent="blue"
          title="Podwładni"
          description="Pracownicy raportujący do tego użytkownika."
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
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
              </div>
            )}

            {isError && (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                Nie udało się pobrać listy podwładnych.
              </p>
            )}

            {!isLoading && !isError && total === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
                <Users className="size-7 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Brak podwładnych</p>
                <p className="text-xs text-muted-foreground">
                  Nikt jeszcze nie został przypisany do tego przełożonego.
                </p>
              </div>
            )}

            {!isLoading && !isError && total > 0 && (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  {Object.entries(roleCounts).map(([role, count]) => (
                    <Badge key={role} variant="outline" className="font-normal">
                      {ROLE_LABELS[role as UserRole]}
                      <span className="ml-1 font-semibold tabular-nums text-foreground">{count}</span>
                    </Badge>
                  ))}
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Szukaj po imieniu, nazwisku lub e-mailu..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {filtered.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-4 text-center text-sm text-muted-foreground">
                    Brak wyników dla „{search}".
                  </p>
                ) : (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {filtered.map((sub) => (
                      <li
                        key={sub.id}
                        onClick={() => navigate(PATHS.EMPLOYEE_DETAILS(sub.id))}
                        className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 transition-all hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-sm">
                          {getInitials(sub.name, sub.surname)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-foreground">
                            {sub.name} {sub.surname}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">{sub.email}</div>
                          <div className="mt-1">
                            <RoleBadge role={sub.role} />
                          </div>
                        </div>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </li>
                    ))}
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
