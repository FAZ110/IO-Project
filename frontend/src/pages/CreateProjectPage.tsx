import { CreateProjectForm } from "@/features/project/components/create_project/CreateProjectForm.tsx";

export const CreateProjectPage = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <CreateProjectForm />
      </div>
    </div>
  );
};