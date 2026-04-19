import { CreateProjectForm } from "@/features/auth/components/CreateProjectForm";

export const CreateProjectPage = () => {
  return (
    <main className="min-h-screen flex items-start sm:items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl">
        <CreateProjectForm />
      </div>
    </main>
  );
};