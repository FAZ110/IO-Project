package pl.edu.agh.project_manager.controller.dto.employee_requests;

public record EmployeeRequestResult(
        String projectName,
        String projectId,
        String projectRoleName,
        String employeeName,
        String employeeSurname,
        EmployeeRequestStatus status
) {
}
