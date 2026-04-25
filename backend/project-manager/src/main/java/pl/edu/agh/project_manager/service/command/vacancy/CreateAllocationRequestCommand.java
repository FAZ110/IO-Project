package pl.edu.agh.project_manager.service.command.vacancy;

import java.util.UUID;

public record CreateAllocationRequestCommand(
        UUID vacancyId,
        UUID requestedEmployeeId,
        UUID createdById,
        String justification
) {}
