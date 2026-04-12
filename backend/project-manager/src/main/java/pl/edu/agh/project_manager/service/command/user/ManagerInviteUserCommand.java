package pl.edu.agh.project_manager.service.command.user;

import java.util.UUID;

public record ManagerInviteUserCommand(
        String email,

        UUID supervisorId
) {
}
