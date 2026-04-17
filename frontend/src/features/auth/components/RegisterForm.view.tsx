import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { RegisterRequest } from "../auth.types";

interface RegisterViewProps {
  register: UseFormRegister<RegisterRequest>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  errors: FieldErrors<RegisterRequest>;
}

export const RegisterView = ({ register, onSubmit, isPending, errors }: RegisterViewProps) => (
  <form onSubmit={onSubmit} className="space-y-5">
    <div>
      <label className="block text-sm font-semibold text-gray-700">Hasło</label>
      <input
        {...register('password')}
        type="password"
        className={`w-full px-4 py-2.5 border rounded-xl ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
      />
      {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
    </div>

    <button disabled={isPending} className="w-full bg-blue-600 text-white py-3 rounded-xl">
      {isPending ? 'Ładowanie...' : 'Utwórz konto'}
    </button>
  </form>
);