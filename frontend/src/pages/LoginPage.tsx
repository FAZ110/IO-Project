import { LoginForm } from "../features/auth";

export const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Zaloguj się do systemu
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Wprowadź swoje dane, aby przejść do panelu
                    </p>
                </div>

                <LoginForm />
            </div>
        </div>
    );
};