import { ProjectRegistry } from "@/features/project/components/ProjectRegistry";

export const ProjectRegistryPage = () => {
  return (
    <div className="p-4 mx-auto space-y-6 sm:p-6 lg:p-8 w-full">
      <h1 className="text-2xl font-bold tracking-tight">Rejestr projektów</h1>
      <ProjectRegistry />
    </div>
  );
}