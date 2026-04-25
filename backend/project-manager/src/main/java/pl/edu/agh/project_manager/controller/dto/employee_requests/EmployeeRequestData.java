package pl.edu.agh.project_manager.controller.dto.employee_requests;

import pl.edu.agh.project_manager.service.command.employee_request.EmployeeRequestCommand;

import java.util.UUID;

public record EmployeeRequestData(
    UUID userId,
    UUID projectId,
    UUID roleId
) {
    public static EmployeeRequestCommand toCommand(EmployeeRequestData request) {
        return new EmployeeRequestCommand(
                request.userId(),
                request.projectId(),
                request.roleId()
        );
    }
}
