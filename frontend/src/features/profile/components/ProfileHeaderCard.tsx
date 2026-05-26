import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ShieldCheck, UserCog } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ROLE_LABELS } from '@/features/user-management/components/RoleBadge';
import type { UserInfo } from '@/features/auth/auth.types';
import type { SimpleUserResponse } from '@/features/user-management/user-management.types';
import { PATHS } from '@/routes/paths';
import { cn } from '@/lib/utils';
import { ChangePasswordModal } from './ChangePasswordModal';

interface ProfileHeaderCardProps {
  user: UserInfo;
  readOnly?: boolean;
  supervisor?: SimpleUserResponse | null;
}

const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';

const supervisorFullName = (s: SimpleUserResponse) =>
  [s.name, s.surname].filter(Boolean).join(' ') || s.email;

interface StatItemProps {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  children: React.ReactNode;
}

const StatItem = ({ icon: Icon, iconClassName, label, children }: StatItemProps) => (
  <div className="flex flex-1 items-center justify-center gap-3">
    <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', iconClassName)}>
      <Icon className="size-4" />
    </div>
    <div className="min-w-0">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="truncate text-sm font-medium text-foreground">{children}</div>
    </div>
  </div>
);

const Divider = () => <div className="hidden h-10 w-px shrink-0 bg-border sm:block" />;

export const ProfileHeaderCard = ({ user, readOnly = false, supervisor = null }: ProfileHeaderCardProps) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Użytkownik';

  const showSupervisor = readOnly && !!supervisor;

  return (
    <>
      <Card className="overflow-hidden pt-0">
        <div className="relative h-36 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px),radial-gradient(circle_at_80%_60%,white_1px,transparent_1px)] [background-size:32px_32px,48px_48px]" />
        </div>

        <CardContent className="flex flex-col gap-6 px-8 pb-8">
          <div className="-mt-20 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
            <Avatar className="!size-36 shrink-0 shadow-xl ring-4 ring-white">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-5xl font-bold text-white">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex w-full min-w-0 flex-col items-center pb-2 sm:items-start">
              <h2 className="font-heading text-3xl font-semibold text-foreground">{fullName}</h2>
              {!readOnly && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Zarządzaj swoimi danymi konta i ustawieniami bezpieczeństwa.
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
          <StatItem
            icon={Mail}
            iconClassName="bg-blue-50 text-blue-600"
            label="E-mail"
          >
            {user.email}
          </StatItem>

          <Divider />

          <StatItem
            icon={ShieldCheck}
            iconClassName="bg-slate-100 text-slate-600"
            label="Rola"
          >
            {ROLE_LABELS[user.role]}
          </StatItem>

          {showSupervisor && (
            <>
              <Divider />
              <StatItem
                icon={UserCog}
                iconClassName="bg-purple-50 text-purple-600"
                label="Przełożony"
              >
                <Link
                  to={PATHS.EMPLOYEE_DETAILS(supervisor!.id)}
                  className="block truncate text-blue-600 hover:underline"
                >
                  {supervisorFullName(supervisor!)}
                </Link>
              </StatItem>
            </>
          )}

          {!readOnly && (
            <>
              <Divider />
              <div className="flex flex-1 items-center justify-center">
                <Button
                  variant="outline"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="cursor-pointer"
                >
                  <KeyRound className="size-4" />
                  Zmień hasło
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>

      {!readOnly && (
        <ChangePasswordModal open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen} />
      )}
    </>
  );
};
