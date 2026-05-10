import { useState } from "react";
import { useQualificationDetailsQuery, useUpdateQualifications } from "../qualifications.hooks";
import { QualificationUpdateAction, type QualificationUpdateRequest } from "../qualifications.types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QualificationRequestDetailsProps {
  userId: string;
  onClose: () => void;
}

export const QualificationRequestDetails = ({ userId, onClose }: QualificationRequestDetailsProps) => {
  const { rowDetails, isLoading } = useQualificationDetailsQuery(userId);
  const { updateQualifications, isUpdating } = useUpdateQualifications();

  const [decisions, setDecisions] = useState<Record<string, QualificationUpdateAction>>({});

  const pendingPayload: QualificationUpdateRequest[] = Object.entries(decisions).map(
    ([qualificationId, action]) => ({
      qualificationId,
      action,
    })
  );

  const hasChanges = pendingPayload.length > 0;

  const handleActionChange = (qualificationId: string, action: QualificationUpdateAction) => {
    setDecisions((prev) => {
      const newState = { ...prev };
      if (prev[qualificationId] === action) {
        delete newState[qualificationId];
      } else {
        newState[qualificationId] = action;
      }
      return newState;
    });
  };

  const handleSave = () => {
    if (!hasChanges) {
      onClose();
      return;
    }

    updateQualifications(pendingPayload, {
      onSuccess: () => onClose(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Pobieranie szczegółów...</p>
      </div>
    );
  }

  if (!rowDetails || rowDetails.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-muted-foreground">Brak aktywnych wniosków dla tego użytkownika.</p>
        <Button variant="outline" onClick={onClose} className="mt-4">Zamknij</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
            <TableRow>
              <TableHead>Nazwa kwalifikacji</TableHead>
              <TableHead className="text-right w-[120px]">Decyzja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowDetails.map((req) => {
              const currentAction = decisions[req.qualificationId];

              return (
                <TableRow key={req.qualificationId}>
                  <TableCell className="font-medium text-sm">
                    {req.qualificationName}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-8 w-8 p-0 border-green-200 transition-all hover:bg-green-50 hover:text-green-600",
                          currentAction === QualificationUpdateAction.ACCEPT &&
                          "bg-green-600 text-white border-transparent hover:bg-green-700 hover:text-white"
                        )}
                        onClick={() => handleActionChange(req.qualificationId, QualificationUpdateAction.ACCEPT)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-8 w-8 p-0 border-red-200 transition-all hover:bg-red-50 hover:text-red-600",
                          currentAction === QualificationUpdateAction.REJECT &&
                          "bg-red-600 text-white border-transparent hover:bg-red-700 hover:text-white"
                        )}
                        onClick={() => handleActionChange(req.qualificationId, QualificationUpdateAction.REJECT)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button variant="ghost" onClick={onClose} disabled={isUpdating}>
          Anuluj
        </Button>
        <Button
          onClick={handleSave}
          disabled={isUpdating || !hasChanges}
          className="min-w-[120px]"
        >
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Zapisz zmiany"}
        </Button>
      </div>
    </div>
  );
};