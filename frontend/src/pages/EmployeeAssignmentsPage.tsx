import { useEmployeeAssignments, useEmployeeAssignmentsActions } from "@/features/employee-assignments/employee-assignments.hooks";
import { getColumns } from "@/features/employee-assignments/employee-assignments.columns";
import { useCallback, useMemo} from "react";
import type { EmployeeAssignment } from "@/features/employee-assignments/employee-assignments.types";
import { EmployeeAssignmentDetails } from "@/features/employee-assignments/components/EmployeeAssignmentDetails";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { TablePageShell } from "@/components/layout/TablePageShell";
import { useSearchParams } from "react-router-dom";

export const EmployeeAssignmentsPage = () => {
  const { employeeAssignments, areAssignmentsLoading } = useEmployeeAssignments();
  const { rejectRequest } = useEmployeeAssignmentsActions();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestIdFromUrl = searchParams.get('requestId');

  const selectedAssignment = useMemo(() => {
    if (!requestIdFromUrl || !employeeAssignments) return null;
    return employeeAssignments.find(a => a.id === requestIdFromUrl) || null;
  }, [requestIdFromUrl, employeeAssignments]);

  const handleReject = useCallback((assignment: EmployeeAssignment) => {
    rejectRequest(assignment.id);
  }, [rejectRequest]);

  const handleOpenModal = useCallback((assignment: EmployeeAssignment) => {
    setSearchParams({ requestId: assignment.id });
  }, [setSearchParams]);

  const handleCloseModal = useCallback(() => {
    searchParams.delete('requestId');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const columns = useMemo(
    () => getColumns({ onVerify: handleOpenModal, onReject: handleReject }),
    [handleOpenModal, handleReject]
  );

  return (
    <TablePageShell 
      title="Wnioski projektowe" 
      description="Zarządzaj wnioskami o udział pracowników w projektach."
      isLoading={areAssignmentsLoading}
    >
      <DataTable columns={columns} data={employeeAssignments ?? []} />

      <Dialog open={!!selectedAssignment} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl overflow-x-hidden">
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