import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { EmployeeAssignment, EmployeeAssignmentDetails } from "./employee-assignments.types";


export const employeeRequestsService = {
    getEmployeeAssignments: async () => {
        const response = await api.get<EmployeeAssignment[]>(ENDPOINTS.EMPLOYEE.ASSIGNMENTS);
        return response.data;
    },

    getEmployeeAssignmentDetails: async (id: string) => {
        const response = await api.get<EmployeeAssignmentDetails>(ENDPOINTS.EMPLOYEE.ASSIGNMENT_DETAIL(id));
        return response.data;
    },

    acceptEmployeeAssignment: async (id: string) => {
        await api.post(ENDPOINTS.EMPLOYEE.ACCEPT_ASSIGNMENT(id));
    },

    rejectEmployeeAssignment: async (id: string) => {
        await api.post(ENDPOINTS.EMPLOYEE.REJECT_ASSIGNMENT(id));
    }
}