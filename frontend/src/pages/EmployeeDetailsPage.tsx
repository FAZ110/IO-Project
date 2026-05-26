import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ROUTE_PARAMS } from '@/routes/paths';
import type { UserResponse } from '@/features/user-management/user-management.types';
import { useUserQuery } from '@/features/user-management/user-management.hooks';
import { ProfileHeaderCard, ProfileSections, hasProfileSections } from '@/features/profile';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const EmployeeDetailsPage = () => {
  const { [ROUTE_PARAMS.USER_ID]: userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialUser = location.state?.user as UserResponse | undefined;

  const { data: fetchedUser, isLoading, isError } = useUserQuery(userId);
  const user = fetchedUser ?? initialUser;

  if (!userId) return null;

  if (isLoading && !initialUser) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
        <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          Nie udało się pobrać profilu użytkownika.
        </p>
      </div>
    );
  }

  const headerUser = {
    email: user.email,
    role: user.role,
    firstName: user.name ?? '',
    lastName: user.surname ?? '',
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Wróć
        </Button>
        <div className="h-5 w-px bg-border" />
        <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
          Profil użytkownika
        </h1>
      </div>

      <ProfileHeaderCard user={headerUser} readOnly supervisor={user.supervisor} />

      {hasProfileSections(user.role) ? (
        <ProfileSections userId={userId} role={user.role} />
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center text-sm text-muted-foreground">
          Konto administratora — brak dedykowanych sekcji biznesowych.
        </div>
      )}
    </div>
  );
};
