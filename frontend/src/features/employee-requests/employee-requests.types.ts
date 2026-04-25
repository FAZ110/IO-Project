export const EmployeeRequestStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
} as const;

export type EmployeeRequestStatus = typeof EmployeeRequestStatus[keyof typeof EmployeeRequestStatus];


export interface EmployeeRequest {
    id: string;
    projectName: string;
    projectId: string;
    projectRoleName: string;
    employeeName: string;
    employeeSurname: string;
    projectTitle: string;
    status: EmployeeRequestStatus;
    createdAt: string;
}

export interface EmployeeRequestDetails {
    currentWorkload: ChartInterval[];
    requestedWorkload: ChartInterval[];
}

export interface ChartInterval {
    startDate: string;
    endDate: string;
    percentage: number;
}