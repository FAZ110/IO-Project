import { useForm } from 'react-hook-form';
import type { LoginRequest } from '../auth.types';
import { useAuthActions } from '../auth.hooks';
import { LoginView } from './LoginForm.view';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const { loginUser, isLoggingIn } = useAuthActions();

  const onSubmit = handleSubmit((data) => {
    loginUser(data);
  });

  return (
    <LoginView
      register={register}
      onSubmit={onSubmit}
      isPending={isLoggingIn}
      errors={errors}
    />
  );
};

export { LoginForm };