interface TablePageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export const TablePageShell = ({ title, description, children, isLoading }: TablePageShellProps) => {
  return (
    <div className="flex-1 flex flex-col space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>

      <div className="flex-1 flex flex-col rounded-md border bg-white shadow-sm">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center min-h-[400px]">
            <p className="text-sm animate-pulse text-muted-foreground">Ładowanie...</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};