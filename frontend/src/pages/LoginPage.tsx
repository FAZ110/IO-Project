import {LoginForm} from "@/features/auth";

export const LoginPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
};