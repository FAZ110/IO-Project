import { useState } from 'react';
import { Clock, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { RoleBadge } from '@/features/user-management/components/RoleBadge';
import type { UserInfo } from '@/features/auth/auth.types';
import { ChangePasswordModal } from './ChangePasswordModal';

interface ProfileHeaderCardProps {
  user: UserInfo;
}

const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';

const formatLoginDate = (date: Date) =>
  date.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const ProfileHeaderCard = ({ user }: ProfileHeaderCardProps) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Użytkownik';

  return (
    <>
      <Card className="overflow-hidden pt-0">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700" />

        <CardContent className="flex flex-col gap-6 px-8 pb-8">
          <div className="-mt-20 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
            <Avatar className="!size-40 shrink-0 shadow-lg ring-4 ring-white">
              <AvatarFallback className="bg-blue-600 text-5xl font-bold text-white">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex w-full flex-col items-center gap-2 pb-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-center sm:items-start">
                <h2 className="font-heading text-3xl font-semibold text-foreground">{fullName}</h2>
                  <p className="text-sm text-muted-foreground">
                    TODO: coś tutaj trzeba dać, ale jeszcze nie wiem co
                  </p>
              </div>
              <div className="flex flex-col items-center gap-1 sm:items-end">
                <Button
                  variant="outline"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="cursor-pointer"
                >
                  <KeyRound className="size-4" />
                  Zmień hasło
                </Button>
                <p className="flex items-center gap-1 text-xs text-muted-foreground/60">
                  <Clock className="size-3" />
                  Ostatnie logowanie: {formatLoginDate(user.loginAt)}
                </p>
              </div>
            </div>
          </div>

        </CardContent>

        <CardFooter className="gap-12">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Mail className="size-4" />
            </div>
            <div className="min-w-0">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">E-mail</dt>
              <dd className="truncate text-sm font-medium text-foreground">{user.email}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Rola</dt>
              <dd className="text-sm font-medium text-foreground">
                <RoleBadge role={user.role} />
              </dd>
            </div>
          </div>
        </CardFooter>
      </Card>

      <ChangePasswordModal open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen} />
    </>
  );
};
