package pl.edu.agh.project_manager.controller.dto.employee_requests;

import java.time.LocalDateTime;
import java.util.UUID;

public record EmployeeAssignmentResponse(
        String projectName,
        UUID projectId,
        String projectRoleName,
        String employeeName,
        String employeeSurname,
        EmployeeAssignmentRequestStatus status,
        LocalDateTime createdAt
) {
}
