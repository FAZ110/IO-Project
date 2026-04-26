package pl.edu.agh.project_manager.controller.dto.employee_requests;

import java.time.LocalDateTime;

public record EmployeeAssignmentResponse(
        String projectName,
        String projectId,
        String projectRoleName,
        String employeeName,
        String employeeSurname,
        EmployeeAssignmentRequestStatus status,
        LocalDateTime createdAt
) {
}
