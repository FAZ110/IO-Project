package pl.edu.agh.project_manager.controller.dto.allocationrequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import pl.edu.agh.project_manager.service.command.allocationrequest.CreateAllocationRequestCommand;

import java.util.UUID;

public record CreateAllocationRequest(
        UUID projectRoleId,
        @NotNull UUID requestedEmployeeId,
        @NotBlank String justification
) {
    public CreateAllocationRequestCommand toCommand(UUID createdById) {
        return new CreateAllocationRequestCommand(projectRoleId, requestedEmployeeId, createdById, justification);
    }
}
