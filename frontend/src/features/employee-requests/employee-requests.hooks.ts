import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeeRequestsService } from "./employee-requests.service"
import { employeeRequestsKeys } from "@/api";

export const useEmployeeRequests = (requestId?: string) => {
  const queryClient = useQueryClient();
  
  const requestsQuery = useQuery({
    queryKey: employeeRequestsKeys.list.queryKey,
    queryFn: employeeRequestsService.getEmployeeRequests,
  });

  const detailsQuery = useQuery({
    queryKey: requestId ? employeeRequestsKeys.detail(requestId).queryKey : [],
    queryFn: () => employeeRequestsService.getEmployeeRequestDetails(requestId!),
    enabled: !!requestId
  });

  const refreshRequests = (requestId?: string) => {
    queryClient.invalidateQueries({ queryKey: employeeRequestsKeys.list.queryKey });
    if (requestId) {
      queryClient.invalidateQueries({ queryKey: employeeRequestsKeys.detail(requestId).queryKey });
    }
  };

  const acceptMutation = useMutation({
    mutationFn: employeeRequestsService.acceptEmployeeRequest,
    onSuccess: (_, id) => refreshRequests(id)
  });

  const rejectMutation = useMutation({
    mutationFn: employeeRequestsService.rejectEmployeeRequest,
    onSuccess: (_, id) => refreshRequests(id)
  });

  return {
    employeeRequests: requestsQuery.data,
    requestDetails: detailsQuery.data,
    isRequestsLoading: requestsQuery.isPending,
    isDetailsLoading: detailsQuery.isPending,

    acceptRequest: acceptMutation.mutate,
    rejectRequest: rejectMutation.mutate,
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending
  }
}