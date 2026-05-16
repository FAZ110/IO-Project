import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { LoginRequest } from "../auth.types";
import { UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNTS } from "../auth.constants.ts"

interface LoginViewProps {
  register: UseFormRegister<LoginRequest>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  errors: FieldErrors<LoginRequest>;
  setValue: UseFormSetValue<LoginRequest>;
}

export const LoginView = ({ register, onSubmit, isPending, errors, setValue }: LoginViewProps) => {

  const handleQuickLogin = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <div className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Zaloguj się do systemu</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="email">
            Adres Email
          </label>
          <input
            {...register('email', { required: 'Email jest wymagany' })}
            type="email"
            id="email"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="adres@email.pl"
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="password">
            Hasło
          </label>
          <input
            {...register('password', { required: 'Hasło jest wymagane' })}
            type="password"
            id="password"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="••••••••"
          />
          {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-10 text-base"
        >
          {isPending ? 'Logowanie...' : 'Zaloguj się'}
        </Button>
      </form>

      <div className="pt-6 mt-6 border-t border-gray-100">
        <p className="mb-3 text-xs font-semibold tracking-wider text-center text-gray-400 uppercase">
          Szybkie logowanie (Demo)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <Button
            key={acc.email}
             type="button"
             variant="outline"
             size="sm"
             onClick={() => handleQuickLogin(acc.email, acc.pass)}
             className="flex justify-start py-6 gap-2 text-l font-normal text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              <UserCircle2 className="w-4 h-4 shrink-0" />
              <span className="truncate">{acc.label}</span>
            </Button>
            ))}
          </div>
        </div>
    </div>
  );
};