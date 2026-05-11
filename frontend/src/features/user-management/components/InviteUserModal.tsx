import { useForm, FormProvider } from 'react-hook-form';
import { useInviteUserMutation } from '../user-management.hooks';
import { AdminAssignableRole, type InviteUserRequest } from '../user-management.types';
import { InviteUserModalView } from './InviteUserModal.view';

interface InviteUserModalProps {
  onClose: () => void;
}

export const InviteUserModal = ({ onClose }: InviteUserModalProps) => {
  const methods = useForm<InviteUserRequest>();
  const { handleSubmit, reset, setError } = methods;
  const inviteMutation = useInviteUserMutation();

  const onSubmit = handleSubmit((data) => {
    if (data.role === AdminAssignableRole.COMMON && !data.supervisorId) {
      setError('supervisorId', { message: 'Menedżer liniowy jest wymagany dla roli Employee' });
      return;
    }
    inviteMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  });

  return (
    <FormProvider {...methods}>
      <InviteUserModalView onSubmit={onSubmit} onClose={onClose} isPending={inviteMutation.isPending} />
    </FormProvider>
  );
};
