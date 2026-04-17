import { useForm } from 'react-hook-form';
import type { RegisterRequest } from '../auth.types';
import { RegisterView } from './RegisterForm.view';
import { useRegister } from '../auth.hooks';
import { useParams } from 'react-router-dom';
import { ROUTE_PARAMS } from '@/routes/paths.ts';
import {useAuth} from "@/providers/AuthContext.ts";

export const RegisterForm = () => {
  const { [ROUTE_PARAMS.ACTIVATION_TOKEN]: activationToken } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();
  const { login } = useAuth();
  const { mutate, isPending } = useRegister({
    onSuccess: (data) => {
      login(data.accessToken);
    }
  });


  const onSubmit = handleSubmit((data) => {
    if (activationToken) {
      mutate({ ...data, activationToken });
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