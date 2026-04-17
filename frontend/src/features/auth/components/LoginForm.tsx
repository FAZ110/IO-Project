// import { useState, type FormEvent } from 'react';
// import {setAccessToken} from "@/api/client.ts";
// import {authService} from "@/features/auth/auth.service.ts";
// import { useAuth } from '@/providers/AuthContext';
//
// const LoginForm = () => {
//   const { login } = useAuth();
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//
//   const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);
//
//     try {
//
//       const response = await authService.login({ email, password });
//       login(response.token);
//
//       alert('Zalogowano pomyślnie!');
//
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('Wystąpił nieoczekiwany błąd serwera.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800">Zaloguj się do systemu</h2>
//
//         {error && (
//           <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
//             {error}
//           </div>
//         )}
//
//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="email">
//               Adres Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="adres@email.pl"
//             />
//           </div>
//
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="password">
//               Hasło
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="••••••••"
//             />
//           </div>
//
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-400"
//           >
//             {isLoading ? 'Logowanie...' : 'Zaloguj się'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
//
// export default LoginForm;