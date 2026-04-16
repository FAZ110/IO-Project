import { RegisterForm } from "../features/auth";

export const RegisterPage = () => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <RegisterForm />
            </div>
        </main>
    );
};