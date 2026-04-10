package pl.edu.agh.project_manager.service.command;

import pl.edu.agh.project_manager.domain.enums.UserRole;

public record AdminUserInvitationCommand(
        String email,

        UserRole role
) {
}
