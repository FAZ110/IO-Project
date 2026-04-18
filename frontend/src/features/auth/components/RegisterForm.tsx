import { useForm } from 'react-hook-form';
import type { RegisterRequest } from '../auth.types';
import { RegisterView } from './RegisterForm.view';
import { useAuthActions } from '../auth.hooks';
import { useParams } from 'react-router-dom';
import { ROUTE_PARAMS } from '@/routes/paths';

export const RegisterForm = () => {
  const { [ROUTE_PARAMS.ACTIVATION_TOKEN]: activationToken } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();
  const { registerUser, isRegistering } = useAuthActions();

  const onSubmit = handleSubmit((data) => {
    if (activationToken) {
      registerUser({ ...data, activationToken });
    } else {
      alert("Brak tokena aktywacyjnego w linku!");
    }
  });

  return (
    <RegisterView
      register={register}
      onSubmit={onSubmit}
      isPending={isRegistering}
      errors={errors}
    />
  );
};