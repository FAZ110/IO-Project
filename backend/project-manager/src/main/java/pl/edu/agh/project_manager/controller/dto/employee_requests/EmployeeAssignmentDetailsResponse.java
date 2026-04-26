package pl.edu.agh.project_manager.controller.dto.employee_requests;

import java.util.List;

public record EmployeeAssignmentDetailsResponse(
        List<ChartIntervalResponse> currentWorkload,
        List<ChartIntervalResponse> workloadAfterApproval
) {
}
