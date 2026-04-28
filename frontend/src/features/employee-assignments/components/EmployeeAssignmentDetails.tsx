import { useEmployeeAssignmentDetails, useEmployeeAssignmentsActions } from "../employee-assignments.hooks";
import { EmployeeAssignmentStatus, type EmployeeAssignment } from "../employee-assignments.types";
import { Badge } from "@/components/ui/badge";
import { EmployeeWorkloadChart } from "./EmployeeWorkloadChart";
import { Button } from "@/components/ui/button";

interface EmployeeAssignmentDetailsProps {
  assignment: EmployeeAssignment
  onClose: () => void
}

function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleDateString()
  } catch {
    return d
  }
}

export const EmployeeAssignmentDetails = ({ assignment, onClose }: EmployeeAssignmentDetailsProps) => {
  const { details, areDetailsLoading } = useEmployeeAssignmentDetails(assignment.id);
  const { acceptRequest, isAccepting } = useEmployeeAssignmentsActions();

  if (areDetailsLoading) return <div className="p-8 text-center">Ładowanie szczegółów...</div>;
  if (!details) return <div className="p-8 text-center text-destructive">Nie znaleziono danych.</div>;

  const statusVariant = assignment.status === EmployeeAssignmentStatus.ACCEPTED
    ? "default"
    : assignment.status === EmployeeAssignmentStatus.REJECTED
      ? "destructive"
      : "secondary";

  const { requestedWorkload, currentWorkload } = details;

  const handleAccept = async () => {
    acceptRequest(assignment.id, {
      onSuccess: () => {
        onClose();
      }
    });
  }

  return (
    <div className="space-y-6 min-w-0 max-w-full overflow-x-hidden">
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

      <div className="rounded-lg border p-4 bg-card min-w-0 max-w-full overflow-hidden">
        <h3 className="text-sm font-semibold mb-4">Wnioskowane obciążenie w czasie</h3>

        {requestedWorkload?.length > 0 ? (
          <div className="w-full min-w-0">
            <h3 className="text-sm font-semibold mb-4">Wykres obciążenia</h3>
            <EmployeeWorkloadChart requestedWorkload={requestedWorkload} currentWorkload={currentWorkload} />
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded">
            Brak danych o interwałach
          </div>
        )}

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isAccepting}
          >
            Anuluj
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isAccepting}
          >
            Zatwierdź
          </Button>
        </div>
      </div>
    </div>
  );
};