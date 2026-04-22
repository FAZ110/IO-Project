import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { RegisterRequest } from "../auth.types";

interface RegisterViewProps {
  register: UseFormRegister<RegisterRequest>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  errors: FieldErrors<RegisterRequest>;
  email: string | null
}

export const RegisterView = ({ register, onSubmit, isPending, errors, email }: RegisterViewProps) => (
  <form onSubmit={onSubmit} className="space-y-4">

    {email && (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-2.5 border border-gray-300 bg-gray-100 text-gray-500 rounded-xl cursor-not-allowed"
        />
      </div>
    )}

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="name">Imię</label>
      <input
        id="name"
        {...register('name', { required: 'Imię jest wymagane' })}
        type="text"
        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
      />
      {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="surname">Nazwisko</label>
      <input
        id="surname"
        {...register('surname', { required: 'Nazwisko jest wymagane' })}
        type="text"
        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${errors.surname ? 'border-red-500' : 'border-gray-300'}`}
      />
      {errors.surname && <span className="text-red-500 text-xs mt-1 block">{errors.surname.message}</span>}
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">Hasło</label>
      <input
        id="password"
        {...register('password', {
          required: 'Hasło jest wymagane',
          minLength: { value: 6, message: 'Hasło musi mieć co najmniej 6 znaków' }
        })}
        type="password"
        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
      />
      {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
    </div>

    <div className="pt-2">
      <button
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Ładowanie...' : 'Utwórz konto'}
      </button>
    </div>

  </form>
);