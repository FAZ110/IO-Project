import { useForm } from "react-hook-form";
import { useAuthActions } from "../auth.hooks";
import type { LoginRequest } from "../auth.types";
import {LoginView} from "./LoginForm.view";

const LoginForm = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginRequest>();
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
      setValue={setValue}
    />
  );
};

export { LoginForm };