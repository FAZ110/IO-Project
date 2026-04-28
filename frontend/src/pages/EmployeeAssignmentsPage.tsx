import { useEmployeeAssignments, useEmployeeAssignmentsActions } from "@/features/employee-assignments/employee-assignments.hooks";
import { getColumns } from "@/features/employee-assignments/employee-assignments.columns";
import { useState, useCallback, useMemo } from "react";
import type { EmployeeAssignment } from "@/features/employee-assignments/employee-assignments.types";
import { EmployeeAssignmentDetails } from "@/features/employee-assignments/components/EmployeeAssignmentDetails";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";

export const EmployeeAssignmentsPage = () => {
  const { employeeAssignments, areAssignmentsLoading } = useEmployeeAssignments();
  const { rejectRequest } = useEmployeeAssignmentsActions();

  const [selectedAssignment, setSelectedAssignment] = useState<EmployeeAssignment | null>(null);
  const isModalOpen = !!selectedAssignment;

  const handleReject = useCallback((assignment: EmployeeAssignment) => {
    rejectRequest(assignment.id);
  }, [rejectRequest]);

  const columns = useMemo(
    () => getColumns({ onVerify: setSelectedAssignment, onReject: handleReject }),
    [handleReject]
  );

  const handleCloseModal = () => setSelectedAssignment(null);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Wnioski projektowe</h1>
          <p className="text-muted-foreground">
            Zarządzaj wnioskami o udział pracowników w projektach.
          </p>
        </div>

        {areAssignmentsLoading ? (
          <div className="flex h-24 items-center justify-center">
            <p>Ładowanie wniosków...</p>
          </div>
        ) : (
          <DataTable columns={columns} data={employeeAssignments ?? []} />
        )}

        <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
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
      </div>
    </div>
  );
};