import { useForm } from 'react-hook-form';
import type { LoginRequest } from '../auth.types';
import { useLogin } from '../auth.hooks';
import { LoginView } from './LoginForm.view';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const { mutate, isPending } = useLogin();

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  return (
    <LoginView
      register={register}
      onSubmit={onSubmit}
      isPending={isPending}
      errors={errors}
    />
  );
};

export { LoginForm };