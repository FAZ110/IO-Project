import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInviteUserMutation } from '../user-management.hooks';
import type { InviteUserRequest } from '../user-management.types';
import { InviteUserModalView } from './InviteUserModal.view';

interface InviteUserModalProps {
  onClose: () => void;
}

export const InviteUserModal = ({ onClose }: InviteUserModalProps) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<InviteUserRequest>();
  const inviteMutation = useInviteUserMutation();
  const [managerError, setManagerError] = useState<string | undefined>();

  const watchedRole = watch('role');

  const onManagerSelect = (id: string) => {
    setValue('supervisorId', id || undefined);
    if (id) setManagerError(undefined);
  };

  const onSubmit = handleSubmit((data) => {
    if (data.role === 'COMMON' && !data.supervisorId) {
      setManagerError('Menedżer liniowy jest wymagany dla roli Employee');
      return;
    }
    setManagerError(undefined);
    inviteMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  });

  return (
    <InviteUserModalView
      register={register}
      onSubmit={onSubmit}
      onClose={onClose}
      isPending={inviteMutation.isPending}
      errors={errors}
      watchedRole={watchedRole}
      onManagerSelect={onManagerSelect}
      managerError={managerError}
    />
  );
};
