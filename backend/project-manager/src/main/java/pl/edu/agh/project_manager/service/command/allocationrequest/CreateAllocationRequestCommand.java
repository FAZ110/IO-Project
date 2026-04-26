package pl.edu.agh.project_manager.service.command.allocationrequest;

import java.util.UUID;

public record CreateAllocationRequestCommand(
        UUID projectRoleId,
        UUID requestedEmployeeId,
        UUID createdById,
        String justification
) {
}
