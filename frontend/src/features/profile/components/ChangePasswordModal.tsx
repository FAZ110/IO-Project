import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useChangePasswordMutation } from '../profile.hooks';
import type { ChangePasswordRequest } from '../profile.types';
import { ChangePasswordModalView } from './ChangePasswordModal.view';

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormValues = ChangePasswordRequest & { confirmPassword: string };

export const ChangePasswordModal = ({ open, onOpenChange }: ChangePasswordModalProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>();
  const mutation = useChangePasswordMutation();

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      setServerError(null);
    }
    onOpenChange(isOpen);
  };

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    mutation.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success('Hasło zostało zmienione.');
          handleClose(false);
        },
        onError: (error: unknown) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
          setServerError(message ?? 'Nie udało się zmienić hasła. Spróbuj ponownie.');
        },
      },
    );
  });

  const newPassword = useWatch({ control, name: 'newPassword' });

  const confirmPasswordRegister = register('confirmPassword', {
    required: 'Potwierdzenie hasła jest wymagane',
    validate: (value) => value === newPassword || 'Hasła nie są zgodne',
  });

  return (
    <ChangePasswordModalView
      open={open}
      onOpenChange={handleClose}
      register={register}
      confirmPasswordRegister={confirmPasswordRegister}
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      errors={errors}
      serverError={serverError}
    />
  );
};
