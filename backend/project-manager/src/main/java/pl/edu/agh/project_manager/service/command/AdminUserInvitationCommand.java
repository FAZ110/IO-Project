package pl.edu.agh.project_manager.service.command;

import pl.edu.agh.project_manager.domain.enums.UserRole;

import java.util.UUID;

public record AdminUserInvitationCommand(
        String email,

        UserRole role,

        UUID supervisorId
) {
}
