import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeeAssignmentsService } from "./employee-assignments.service"
import { employeeAssignmentsKeys } from "@/api";

export const useEmployeeAssignments = () => {
  const assignmentsQuery = useQuery({
    queryKey: employeeAssignmentsKeys.list.queryKey,
    queryFn: employeeAssignmentsService.getEmployeeAssignments,
  });

  return {
    employeeAssignments: assignmentsQuery.data,
    areAssignmentsLoading: assignmentsQuery.isPending,
  };
};

export const useEmployeeAssignmentDetails = (requestId: string) => {
  const detailsQuery = useQuery({
    queryKey: employeeAssignmentsKeys.detail(requestId).queryKey,
    queryFn: () => employeeAssignmentsService.getEmployeeAssignmentDetails(requestId)
  });

  return {
    details: detailsQuery.data,
    areDetailsLoading: detailsQuery.isPending,
  };
};

export const useEmployeeAssignmentsActions = () => {
  const queryClient = useQueryClient();

  const refreshEmployeeRequests = (requestId: string) => {
    queryClient.invalidateQueries({ queryKey: employeeAssignmentsKeys.list.queryKey });
    queryClient.invalidateQueries({ queryKey: employeeAssignmentsKeys.detail(requestId).queryKey });
  };

  const acceptMutation = useMutation({
    mutationFn: employeeAssignmentsService.acceptEmployeeAssignment,
    onSuccess: (_, requestId) => {
      refreshEmployeeRequests(requestId);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: employeeAssignmentsService.rejectEmployeeAssignment,
    onSuccess: (_, requestId) => {
      refreshEmployeeRequests(requestId);
    },
  });

  return {
    acceptRequest: acceptMutation.mutate,
    rejectRequest: rejectMutation.mutate,
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};