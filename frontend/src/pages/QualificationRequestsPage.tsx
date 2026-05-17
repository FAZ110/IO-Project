import { TablePageShell } from "@/components/layout/TablePageShell";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QualificationRequestDetails } from "@/features/qualifications/components/QualificationRequestDetails";
import { getColumns } from "@/features/qualifications/qualifications.columns";
import { useWaitingQualificationsSummaryQuery } from "@/features/qualifications/qualifications.hooks";
import type { QualificationRequestResponse } from "@/features/qualifications/qualifications.types";
import {useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const QualificationRequestsPage = () => {
  const { waitingQualificationsSummary, isLoading } = useWaitingQualificationsSummaryQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get('userId');

  const selectedRequest = useMemo(() => {
    if (!userIdFromUrl || !waitingQualificationsSummary) return null;
    return waitingQualificationsSummary.find(req => req.userId === userIdFromUrl) || null;
  }, [userIdFromUrl, waitingQualificationsSummary]);

  const handleOpenModal = useCallback((user: QualificationRequestResponse) => {
    setSearchParams({ userId: user.userId });
  }, [setSearchParams]);

  const handleCloseModal = useCallback(() => {
    searchParams.delete('userId');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const columns = useMemo(() => getColumns({
    onVerify: handleOpenModal
  }), [handleOpenModal]);

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