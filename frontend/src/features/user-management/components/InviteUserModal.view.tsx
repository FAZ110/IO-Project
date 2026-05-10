import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { AdminAssignableRole, InviteUserRequest } from '../user-management.types';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { ManagerSelector } from './ManagerSelector';

const ROLE_OPTIONS = [
  { value: 'COMMON',          label: 'Employee' },
  { value: 'AUTHORITY',       label: 'Authority' },
  { value: 'LINEAR_MANAGER',  label: 'Linear Manager' },
  { value: 'PROJECT_MANAGER', label: 'Project Manager' },
] as const;

interface InviteUserModalViewProps {
  register: UseFormRegister<InviteUserRequest>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  isPending: boolean;
  errors: FieldErrors<InviteUserRequest>;
  watchedRole: AdminAssignableRole | undefined;
  onManagerSelect: (id: string) => void;
  managerError?: string;
}

export const InviteUserModalView = ({
  register,
  onSubmit,
  onClose,
  isPending,
  errors,
  watchedRole,
  onManagerSelect,
  managerError,
}: InviteUserModalViewProps) => (
  <Dialog open={true} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Dodaj użytkownika</DialogTitle>
        <DialogDescription>Wypełnij dane, aby zaprosić użytkownika do systemu.</DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="email">
            E-mail
          </label>
          <input
            {...register('email', {
              required: 'Email jest wymagany',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Nieprawidłowy format e-mail' },
            })}
            id="email"
            type="email"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="role">
            Rola
          </label>
          <select
            {...register('role', { required: 'Rola jest wymagana' })}
            id="role"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">— wybierz rolę —</option>
            {ROLE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.role && <span className="text-red-500 text-xs">{errors.role.message}</span>}
        </div>

        {watchedRole === 'COMMON' && (
          <ManagerSelector onSelect={onManagerSelect} error={managerError} />
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending} className="w-full py-6 cursor-pointer">
            {isPending ? 'Wysyłanie...' : 'Zatwierdź'}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);
