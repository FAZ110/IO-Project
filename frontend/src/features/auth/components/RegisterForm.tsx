import { useForm } from 'react-hook-form';
import type { RegisterRequest } from '../auth.types';
import { RegisterView } from './RegisterForm.view';
import { useRegister } from '../auth.hooks';
import { useSearchParams } from 'react-router-dom';

export const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const activationToken = searchParams.get('token');

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();
  const { mutate, isPending } = useRegister();

  const onSubmit = handleSubmit((data) => {
    if (activationToken) {
      mutate({ ...data, activationToken });
    } else {
      alert("Brak tokena aktywacyjnego w linku!");
    }
  });

  return (
    <RegisterView
      register={register}
      onSubmit={onSubmit}
      isPending={isPending}
      errors={errors}
    />
  );
};