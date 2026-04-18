import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { LoginRequest } from "../auth.types";

interface LoginViewProps {
  register: UseFormRegister<LoginRequest>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  errors: FieldErrors<LoginRequest>;
}

export const LoginView = ({ register, onSubmit, isPending, errors }: LoginViewProps) => (
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

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-400"
      >
        {isPending ? 'Logowanie...' : 'Zaloguj się'}
      </button>
    </form>
  </div>
);