import { useEmployeeAssignments } from "@/features/employee-assignments/employee-assignments.hooks";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "@/features/employee-assignments/employee-assignments.columns";
import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { EmployeeAssignmentDetails } from "@/features/employee-assignments/components/EmployeeAssignmentDetails";
import type { EmployeeAssignment } from "@/features/employee-assignments/employee-assignments.types";

export const EmployeeAssignmentsPage = () => {
  const { employeeAssignments, areAssignmentsLoading } = useEmployeeAssignments();

  const [selectedAssignment, setSelectedAssignment] = useState<EmployeeAssignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerify = useCallback((assignment: EmployeeAssignment) => {
    console.log("Weryfikacja:", assignment.id);
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  }, []);

  const handleReject = useCallback((assignment: EmployeeAssignment) => {
    console.log("Odrzucanie:", assignment.id);
  }, []);

  const columns = useMemo(
    () => getColumns({ onVerify: handleVerify, onReject: handleReject }),
    [handleVerify, handleReject]
  );

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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl overflow-x-hidden">
            <DialogHeader>
              <DialogTitle>Szczegóły weryfikacji</DialogTitle>
            </DialogHeader>

            {selectedAssignment && <EmployeeAssignmentDetails assignment={selectedAssignment} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};