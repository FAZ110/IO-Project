package pl.edu.agh.project_manager.service.command.employee_request;

import java.util.UUID;

public record EmployeeRequestDetailsCommand(
        UUID requestId
) {

}
