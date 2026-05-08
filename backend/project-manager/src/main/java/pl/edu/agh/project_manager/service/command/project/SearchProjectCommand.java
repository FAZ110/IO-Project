package pl.edu.agh.project_manager.service.command.project;

import pl.edu.agh.project_manager.domain.enums.UserRole;

import java.util.UUID;

public record SearchProjectCommand(
        UUID userId,
        UserRole userRole,
        String query,
        UUID groupId,
        Boolean unassignedOnly
) {
    public SearchProjectCommand toCommand(UUID userId, UserRole userRole, String query, UUID groupId, Boolean unassignedOnly) {
        return new SearchProjectCommand(userId, userRole, query, groupId, unassignedOnly);
    }
}
