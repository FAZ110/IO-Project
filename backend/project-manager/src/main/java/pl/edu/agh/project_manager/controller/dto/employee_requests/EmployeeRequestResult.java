package pl.edu.agh.project_manager.controller.dto.employee_requests;

import java.time.LocalDateTime;

public record EmployeeRequestResult(
        String projectName,
        String projectId,
        String projectRoleName,
        String employeeName,
        String employeeSurname,
        EmployeeRequestStatus status,
        LocalDateTime createdAt
) {
}
