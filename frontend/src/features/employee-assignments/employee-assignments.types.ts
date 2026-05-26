export const EmployeeAssignmentStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
} as const;

export type EmployeeAssignmentStatus = typeof EmployeeAssignmentStatus[keyof typeof EmployeeAssignmentStatus];


export interface EmployeeAssignment {
    id: string;
    projectName: string;
    projectId: string;
    roleName: string;
    employeeName: string;
    employeeSurname: string;
    status: EmployeeAssignmentStatus;
    createdAt: string;
}

export interface EmployeeAssignmentDetails {
    currentWorkload: ChartInterval[];
    requestedWorkload: ChartInterval[];
}

export interface ChartInterval {
    startDate: string;
    endDate: string;
    percentage: number;
}