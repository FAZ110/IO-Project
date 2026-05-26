import { useAuth } from '@/providers/AuthContext';
import { useMyProfileQuery } from '@/features/user-management/user-management.hooks';
import { ProfileHeaderCard, ProfileSections, hasProfileSections } from '@/features/profile';
import { Skeleton } from '@/components/ui/skeleton';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { data: profile, isLoading, isError } = useMyProfileQuery();

  if (!user) return null;

  const needsProfile = hasProfileSections(user.role);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Mój profil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Twoje dane konta, kompetencje i ustawienia bezpieczeństwa.
        </p>
      </div>

      <ProfileHeaderCard user={user} />

      {needsProfile && isLoading && <Skeleton className="h-64 w-full rounded-xl" />}

      {needsProfile && isError && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          Nie udało się pobrać danych profilu.
        </p>
      )}

      {profile && <ProfileSections userId={profile.id} role={profile.role} editable />}
    </div>
  );
};
