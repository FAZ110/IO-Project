import { CreateProjectGroupForm } from "@/features/project_group/components/CreateProjectGroupForm";

export const CreateProjectGroupPage = () => {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                <CreateProjectGroupForm />
            </div>
        </div>
    );
}