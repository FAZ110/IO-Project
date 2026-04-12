package pl.edu.agh.project_manager.service.command.user;

public record SendInvitationCommand(
        String email,
        String activationToken
) {
}
