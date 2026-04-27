import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeeRequestsService } from "./employee-assignments.service"
import { employeeRequestsKeys } from "@/api";

export const useEmployeeAssignments = () => {
  const assignmentsQuery = useQuery({
    queryKey: employeeRequestsKeys.list.queryKey,
    queryFn: employeeRequestsService.getEmployeeAssignments,
  });

  return {
    employeeAssignments: assignmentsQuery.data,
    areAssignmentsLoading: assignmentsQuery.isPending,
  };
};

export const useEmployeeAssignmentDetails = (requestId: string) => {
  const detailsQuery = useQuery({
    queryKey: employeeRequestsKeys.detail(requestId).queryKey,
    queryFn: () => employeeRequestsService.getEmployeeAssignmentDetails(requestId)
  });

  return {
    details: detailsQuery.data,
    areDetailsLoading: detailsQuery.isPending,
  };
};

export const useEmployeeAssignmentsActions = () => {
  const queryClient = useQueryClient();

  const refreshEmployeeRequests = (requestId: string) => {
    queryClient.invalidateQueries({ queryKey: employeeRequestsKeys.list.queryKey });
    queryClient.invalidateQueries({ queryKey: employeeRequestsKeys.detail(requestId).queryKey });
  };

  const acceptMutation = useMutation({
    mutationFn: employeeRequestsService.acceptEmployeeAssignment,
    onSuccess: (_, requestId) => {
      refreshEmployeeRequests(requestId);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: employeeRequestsService.rejectEmployeeAssignment,
    onSuccess: (_, requestId) => {
      refreshEmployeeRequests(requestId);
    },
  });

  return {
    acceptRequestAsync: acceptMutation.mutateAsync,
    rejectRequestAsync: rejectMutation.mutateAsync,
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};