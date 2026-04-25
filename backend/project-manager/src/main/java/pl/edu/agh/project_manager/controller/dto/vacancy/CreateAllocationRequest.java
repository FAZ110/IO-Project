package pl.edu.agh.project_manager.controller.dto.vacancy;

import pl.edu.agh.project_manager.service.command.vacancy.CreateAllocationRequestCommand;

import java.util.UUID;

public record CreateAllocationRequest(
        UUID requestedEmployeeId,
        String justification
) {
    public CreateAllocationRequestCommand toCommand(UUID vacancyId, UUID createdById) {
        return new CreateAllocationRequestCommand(vacancyId, requestedEmployeeId, createdById, justification);
    }
}
