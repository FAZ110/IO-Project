import { useEmployeeAssignmentDetails } from "../employee-assignments.hooks";
import type { EmployeeAssignment } from "../employee-assignments.types";
import { Badge } from "@/components/ui/badge";

interface EmployeeAssignmentDetailsProps {
  assignment: EmployeeAssignment
}

function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleDateString()
  } catch {
    return d
  }
}

export const EmployeeAssignmentDetails = ({ assignment }: EmployeeAssignmentDetailsProps) => {
  const { details, areDetailsLoading } = useEmployeeAssignmentDetails(assignment.id);

  if (areDetailsLoading) return <div className="p-8 text-center">Ładowanie szczegółów...</div>;
  if (!details) return <div className="p-8 text-center text-destructive">Nie znaleziono danych.</div>;

  const statusVariant = assignment.status === "ACCEPTED" ? "default" : assignment.status === "REJECTED" ? "destructive" : "secondary";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{assignment.employeeName} {assignment.employeeSurname}</h3>
          <p className="text-sm text-muted-foreground">{assignment.projectRoleName} — {assignment.projectName}</p>
          <p className="mt-2 text-sm text-muted-foreground">Zgłoszono: {fmtDate(assignment.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariant}>{assignment.status}</Badge>
        </div>
      </div>

      <div className="rounded-md border p-4">
        <h4 className="text-sm font-medium text-muted-foreground">Szczegóły dodatkowe</h4>
        <p className="mt-2 text-sm text-muted-foreground">
          Dane obciążenia są tymczasowo wyłączone.
        </p>
      </div>
    </div>
  );
};