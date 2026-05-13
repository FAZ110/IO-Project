import { TablePageShell } from "@/components/layout/TablePageShell";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QualificationRequestDetails } from "@/features/qualifications/components/QualificationRequestDetails";
import { getColumns } from "@/features/qualifications/qualifications.columns";
import { useWaitingQualificationsSummaryQuery } from "@/features/qualifications/qualifications.hooks";
import type { QualificationRequestResponse } from "@/features/qualifications/qualifications.types";
import { useMemo, useState } from "react";

export const QualificationRequestsPage = () => {
  const { waitingQualificationsSummary, isLoading } = useWaitingQualificationsSummaryQuery();
  const [selectedRequest, setselectedRequest] = useState<QualificationRequestResponse | null>(null);

  const columns = useMemo(() => getColumns({
    onVerify: (user) => setselectedRequest(user)
  }), []);

  const handleCloseModal = () => setselectedRequest(null);

  return (
    <TablePageShell
      title="Weryfikacja kwalifikacji"
      description="Przeglądaj i zatwierdzaj nowe umiejętności zgłoszone przez Twoich pracowników."
      isLoading={isLoading}
    >
      <DataTable
        columns={columns}
        data={waitingQualificationsSummary ?? []}
      />
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Weryfikacja: {selectedRequest?.employeeName} {selectedRequest?.employeeSurname}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Zatwierdź lub odrzuć zgłoszone kwalifikacje pracownika.
            </p>
          </DialogHeader>

          {selectedRequest && (
            <QualificationRequestDetails
              key={selectedRequest.userId}
              userId={selectedRequest.userId}
              onClose={handleCloseModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </TablePageShell>
  );
};