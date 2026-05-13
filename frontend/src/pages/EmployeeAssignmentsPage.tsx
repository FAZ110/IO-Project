import { useEmployeeAssignments, useEmployeeAssignmentsActions } from "@/features/employee-assignments/employee-assignments.hooks";
import { getColumns } from "@/features/employee-assignments/employee-assignments.columns";
import { useState, useCallback, useMemo } from "react";
import type { EmployeeAssignment } from "@/features/employee-assignments/employee-assignments.types";
import { EmployeeAssignmentDetails } from "@/features/employee-assignments/components/EmployeeAssignmentDetails";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { TablePageShell } from "@/components/layout/TablePageShell";

export const EmployeeAssignmentsPage = () => {
  const { employeeAssignments, areAssignmentsLoading } = useEmployeeAssignments();
  const { rejectRequest } = useEmployeeAssignmentsActions();

  const [selectedAssignment, setSelectedAssignment] = useState<EmployeeAssignment | null>(null);

  const handleReject = useCallback((assignment: EmployeeAssignment) => {
    rejectRequest(assignment.id);
  }, [rejectRequest]);

  const columns = useMemo(
    () => getColumns({ onVerify: setSelectedAssignment, onReject: handleReject }),
    [handleReject]
  );

  const handleCloseModal = () => setSelectedAssignment(null);

  return (
    <TablePageShell 
      title="Wnioski projektowe" 
      description="Zarządzaj wnioskami o udział pracowników w projektach."
      isLoading={areAssignmentsLoading}
    >
      <DataTable columns={columns} data={employeeAssignments ?? []} />

        <Dialog open={!!selectedAssignment} onOpenChange={(open) => !open && handleCloseModal()}>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-xl overflow-x-hidden">
            <DialogHeader>
              <DialogTitle>Szczegóły weryfikacji</DialogTitle>
            </DialogHeader>

            {selectedAssignment && <EmployeeAssignmentDetails
              key={selectedAssignment.id}
              assignment={selectedAssignment}
              onClose={handleCloseModal}
            />}
          </DialogContent>
      </Dialog>
    </TablePageShell>
  );
};