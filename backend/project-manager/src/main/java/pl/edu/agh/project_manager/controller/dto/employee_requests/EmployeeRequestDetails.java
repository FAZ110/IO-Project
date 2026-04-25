package pl.edu.agh.project_manager.controller.dto.employee_requests;

import java.util.List;

public record EmployeeRequestDetails(
        List<ChartIntervalResponse> currentWorkload,
        List<ChartIntervalResponse> workloadAfterApproval
) {
}
