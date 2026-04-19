import { useForm } from 'react-hook-form';
import { useInviteUserMutation } from '../user-management.hooks';
import type { InviteUserRequest } from '../user-management.types';
import { InviteUserModalView } from './InviteUserModal.view';

interface InviteUserModalProps {
  onClose: () => void;
}

export const InviteUserModal = ({ onClose }: InviteUserModalProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InviteUserRequest>();
  const inviteMutation = useInviteUserMutation();

  const onSubmit = handleSubmit((data) => {
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
    />
  );
};
