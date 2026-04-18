import { useForm } from 'react-hook-form';
import type { RegisterRequest } from '../auth.types';
import { RegisterView } from './RegisterForm.view';
import { useAuthActions } from '../auth.hooks';
import { QUERY_PARAMS } from '@/routes/paths';
import { useSearchParams } from 'react-router-dom';

export const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const activationToken = searchParams.get(QUERY_PARAMS.ACTIVATION_TOKEN);
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