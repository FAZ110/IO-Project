import { useAuth } from '@/providers/AuthContext';
import { ProfileHeaderCard } from '@/features/profile';
import { QualificationsCard } from '@/features/qualifications';

export const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Mój profil</h1>
      </div>

      <ProfileHeaderCard user={user} />
      <QualificationsCard />
    </div>
  );
};
