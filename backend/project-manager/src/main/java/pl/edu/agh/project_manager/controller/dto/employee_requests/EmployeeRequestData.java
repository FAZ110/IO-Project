package pl.edu.agh.project_manager.controller.dto.employee_requests;

import jakarta.validation.constraints.NotNull;
import pl.edu.agh.project_manager.service.command.employee_request.EmployeeRequestCommand;

import java.util.UUID;

public record EmployeeRequestData(
    @NotNull(message = "ID użytkownika nie może być puste")
    UUID userId,

    @NotNull(message = "ID projektu nie może być puste")
    UUID projectId,

    @NotNull(message = "ID roli nie może być puste")
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
