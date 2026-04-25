import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { EmployeeRequest, EmployeeRequestDetails } from "./employee-requests.types";


export const employeeRequestsService = {
    getEmployeeRequests: async () => {
        const response = await api.get<EmployeeRequest[]>(ENDPOINTS.EMPLOYEE.REQUESTS);
        return response.data;
    },

    getEmployeeRequestDetails: async (id: string) => {
        const response = await api.get<EmployeeRequestDetails>(ENDPOINTS.EMPLOYEE.REQUEST_DETAIL(id));
        return response.data;
    },

    acceptEmployeeRequest: async (id: string) => {
        await api.post(ENDPOINTS.EMPLOYEE.ACCEPT_REQUEST(id));
    },

    rejectEmployeeRequest: async (id: string) => {
        await api.post(ENDPOINTS.EMPLOYEE.REJECT_REQUEST(id));
    }
}