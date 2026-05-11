import { useForm } from 'react-hook-form';
import type { RegisterRequest } from '../auth.types';
import { RegisterView } from './RegisterForm.view';
import { useAuthActions } from '../auth.hooks';
import { QUERY_PARAMS } from '@/routes/paths';
import { useSearchParams } from 'react-router-dom';

// W przyszłości można dodać dodatkowe zapytanie do bazy o prawdziwość tokenu aktywacyjnego i pobieranie email, żeby nie trzeba było go trzymać w queryParams, ale na ten moment myślę, że jest okej
export const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const activationToken = searchParams.get(QUERY_PARAMS.ACTIVATION_TOKEN);
  const emailFromUrl = searchParams.get(QUERY_PARAMS.EMAIL);
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
      email={emailFromUrl}
    />
  );
};