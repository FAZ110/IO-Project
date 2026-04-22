import { CreateProjectForm } from "@/features/auth/components/CreateProjectForm";

export const CreateProjectPage = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <CreateProjectForm />
      </div>
    </div>
  );
};