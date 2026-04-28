import type { FieldErrors, UseFormRegister, UseFormRegisterReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ChangePasswordRequest } from '../profile.types';

type FormValues = ChangePasswordRequest & { confirmPassword: string };

interface ChangePasswordModalViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  register: UseFormRegister<FormValues>;
  confirmPasswordRegister: UseFormRegisterReturn<'confirmPassword'>;
  onSubmit: (event: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  errors: FieldErrors<FormValues>;
  serverError: string | null;
}

export const ChangePasswordModalView = ({
  open,
  onOpenChange,
  register,
  confirmPasswordRegister,
  onSubmit,
  isPending,
  errors,
  serverError,
}: ChangePasswordModalViewProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Zmiana hasła</DialogTitle>
        <DialogDescription>
          Nowe hasło musi zawierać min. 8 znaków, wielką literę, cyfrę i znak specjalny.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} className="flex flex-col gap-5 pt-2">
        <div className="flex flex-col gap-3">
          <Label htmlFor="currentPassword">Obecne hasło</Label>
          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            {...register('currentPassword', { required: 'Obecne hasło jest wymagane' })}
            aria-invalid={!!errors.currentPassword}
          />
          {errors.currentPassword && (
            <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="newPassword">Nowe hasło</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            {...register('newPassword', {
              required: 'Nowe hasło jest wymagane',
              minLength: { value: 8, message: 'Hasło musi mieć co najmniej 8 znaków' },
              pattern: {
                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*()_]).{8,}$/,
                message: 'Hasło musi zawierać wielką literę, małą literę, cyfrę i znak specjalny',
              },
            })}
            aria-invalid={!!errors.newPassword}
          />
          {errors.newPassword && (
            <p className="text-xs text-destructive">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...confirmPasswordRegister}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && (
          <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Anuluj
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Zapisywanie...' : 'Zmień hasło'}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);
