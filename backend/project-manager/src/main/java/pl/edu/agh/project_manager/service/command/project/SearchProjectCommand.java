package pl.edu.agh.project_manager.service.command.project;

import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.security.UserPrincipal;

import java.util.UUID;

public record SearchProjectCommand(
        UserPrincipal user,
        String query,
        UUID groupId,
        Boolean isActive,
        Boolean unassignedOnly
) {
    public SearchProjectCommand toCommand(UserPrincipal user, String query, UUID groupId, Boolean isActive, Boolean unassignedOnly) {
        return new SearchProjectCommand(user, query, groupId, isActive, unassignedOnly);
    }
}
